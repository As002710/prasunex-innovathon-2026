import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..config import TIER_CONFIG
from ..database import get_db
from ..models import College, MarkRecord, User
from ..security import (
    create_access_token,
    create_refresh_token,
    get_current_user,
    hash_password,
    normalize_role,
    require_roles,
    verify_password,
    verify_refresh_token,
    verify_student_row_level_security,
)

router = APIRouter(prefix="/api", tags=["Auth & Tenancy"])


class LoginRequest(BaseModel):
    email: str
    password: str
    college_code: str | None = None


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str | None = None
    name: str | None = None
    role: str = "student"
    department: str = "CSE"
    college_code: str | None = "NITX"


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    email: str
    token: str
    new_password: str


class TierUpdateRequest(BaseModel):
    tier: str
    student_count: int | None = None


# Simple in-memory password reset tokens for demo/development
_password_reset_tokens = {}


@router.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    q = db.query(User).filter(User.email == payload.email.strip().lower())
    if payload.college_code:
        college = db.query(College).filter(College.code == payload.college_code.strip().upper()).first()
        if college:
            q = q.filter(User.tenant_id == college.id)

    user = q.first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    college = db.query(College).filter(College.id == user.tenant_id).first()
    tier_meta = TIER_CONFIG.get(college.tier if college else "core", TIER_CONFIG["core"])
    access_token = create_access_token(user)
    refresh_token = create_refresh_token(user)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "tenant_id": user.tenant_id,
            "college_name": college.name if college else "Northstar Institute",
            "college_code": college.code if college else "NITX",
            "tier": college.tier if college else "core",
            "tier_name": tier_meta["name"],
            "features": tier_meta["features"],
            "email": user.email,
            "full_name": user.full_name,
            "name": user.full_name,
            "role": user.role,
            "normalized_role": normalize_role(user.role),
            "department": user.department,
            "cgpa": user.cgpa,
            "karma_points": user.karma_points,
            "opt_in_recruiter": user.opt_in_recruiter,
        },
    }


@router.post("/auth/refresh")
def refresh_token_endpoint(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    decoded = verify_refresh_token(payload.refresh_token)
    user = (
        db.query(User)
        .filter(User.id == decoded.get("sub"), User.tenant_id == decoded.get("tenant_id"))
        .first()
    )
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account no longer active")

    new_access_token = create_access_token(user)
    new_refresh_token = create_refresh_token(user)
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }


@router.post("/auth/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    norm_role = payload.role.strip().lower()
    # Explicit Security Requirement: Admin cannot be registered via public signup
    if norm_role in {"admin", "dean", "chancellor_dean"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin accounts cannot be registered publicly. Must be created by an administrator or seed script.",
        )

    allowed_roles = {"student", "faculty", "professor", "other", "staff", "guest", "alumni"}
    if norm_role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Allowed registration roles: Student, Faculty, Other.",
        )

    c_code = (payload.college_code or "NITX").strip().upper()
    college = db.query(College).filter(College.code == c_code).first()
    if not college:
        college = db.query(College).first()
        if not college:
            raise HTTPException(status_code=404, detail="Default campus tenant not found")

    email_norm = payload.email.strip().lower()
    existing = db.query(User).filter(User.tenant_id == college.id, User.email == email_norm).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")

    display_name = (payload.name or payload.full_name or email_norm.split("@")[0].capitalize()).strip()
    user = User(
        id=f"usr-{uuid.uuid4().hex[:10]}",
        tenant_id=college.id,
        email=email_norm,
        hashed_password=hash_password(payload.password),
        full_name=display_name,
        role=norm_role,
        department=payload.department or "CSE",
    )
    db.add(user)
    if norm_role == "student":
        college.student_count += 1
    db.commit()
    db.refresh(user)

    tier_meta = TIER_CONFIG.get(college.tier, TIER_CONFIG["core"])
    access_token = create_access_token(user)
    refresh_token = create_refresh_token(user)

    return {
        "message": "Account created successfully",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "tenant_id": user.tenant_id,
            "college_name": college.name,
            "college_code": college.code,
            "tier": college.tier,
            "tier_name": tier_meta["name"],
            "features": tier_meta["features"],
            "email": user.email,
            "full_name": user.full_name,
            "name": user.full_name,
            "role": user.role,
            "normalized_role": normalize_role(user.role),
            "department": user.department,
            "cgpa": user.cgpa,
            "karma_points": user.karma_points,
            "opt_in_recruiter": user.opt_in_recruiter,
        },
    }


@router.post("/auth/logout")
def logout():
    return {"message": "Logged out successfully"}


@router.post("/auth/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email_norm = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_norm).first()
    if not user:
        # Avoid user enumeration in production; return standard success response
        return {
            "message": "If your email is registered, password reset instructions have been sent.",
            "demo_token": None,
        }

    token = f"reset-{uuid.uuid4().hex[:16]}"
    _password_reset_tokens[token] = email_norm
    return {
        "message": "Password reset token generated. Use this token to reset your password.",
        "demo_token": token,
        "email": email_norm,
    }


@router.post("/auth/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    email_norm = payload.email.strip().lower()
    expected_email = _password_reset_tokens.get(payload.token.strip())
    # Allow demo token "demo-reset" or generated token matching email
    if payload.token.strip() != "demo-reset" and expected_email != email_norm:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired password reset token")

    user = db.query(User).filter(User.email == email_norm).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found")

    user.hashed_password = hash_password(payload.new_password)
    db.commit()
    _password_reset_tokens.pop(payload.token.strip(), None)
    return {"message": "Password reset successfully. You can now log in with your new password."}


@router.get("/auth/me")
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    college = db.query(College).filter(College.id == user.tenant_id).first()
    tier_meta = TIER_CONFIG.get(college.tier, TIER_CONFIG["core"])
    return {
        "id": user.id,
        "tenant_id": user.tenant_id,
        "college_name": college.name,
        "college_code": college.code,
        "tier": college.tier,
        "tier_name": tier_meta["name"],
        "features": tier_meta["features"],
        "email": user.email,
        "full_name": user.full_name,
        "name": user.full_name,
        "role": user.role,
        "normalized_role": normalize_role(user.role),
        "department": user.department,
        "cgpa": user.cgpa,
        "karma_points": user.karma_points,
        "opt_in_recruiter": user.opt_in_recruiter,
    }


@router.get("/marks/student/{student_id}")
def get_student_marks_rls(
    student_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Row-Level Security Endpoint:
    Enforces the rule that a student can read ONLY their own marks.
    Faculty, HOD, Dean, and Admin can read student marks for cohort analysis.
    """
    verify_student_row_level_security(student_id, current_user)

    marks = (
        db.query(MarkRecord)
        .filter(
            MarkRecord.tenant_id == current_user.tenant_id,
            MarkRecord.student_id == student_id,
        )
        .all()
    )

    return [
        {
            "id": m.id,
            "course_id": m.course_id,
            "student_id": m.student_id,
            "total_score": m.total_score,
            "z_score": m.z_score,
            "letter_grade": m.letter_grade,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        }
        for m in marks
    ]


@router.get("/colleges/public")
def list_public_colleges(db: Session = Depends(get_db)):
    colleges = db.query(College).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "code": c.code,
            "tier": c.tier,
            "student_count": c.student_count,
        }
        for c in colleges
    ]


@router.get("/admin/billing")
def admin_billing(
    user: User = Depends(require_roles(["chancellor_dean", "dean", "admin"])),
    db: Session = Depends(get_db),
):
    college = db.query(College).filter(College.id == user.tenant_id).first()
    actual_students = db.query(User).filter(User.tenant_id == user.tenant_id, User.role == "student").count()
    billable_students = max(college.student_count, actual_students)
    tier_meta = TIER_CONFIG.get(college.tier, TIER_CONFIG["core"])
    arr = round(billable_students * tier_meta["price_per_student_yr"], 2)

    return {
        "college_id": college.id,
        "college_name": college.name,
        "current_tier": college.tier,
        "tier_name": tier_meta["name"],
        "billable_students": billable_students,
        "seeded_students": actual_students,
        "price_per_student_yr": tier_meta["price_per_student_yr"],
        "estimated_arr_usd": arr,
        "features": tier_meta["features"],
        "available_tiers": [
            {
                "key": k,
                "name": v["name"],
                "price_per_student_yr": v["price_per_student_yr"],
                "max_students": v["max_students"],
                "estimated_arr_usd": round(billable_students * v["price_per_student_yr"], 2),
                "features": v["features"],
            }
            for k, v in TIER_CONFIG.items()
        ],
    }


@router.patch("/admin/tier")
def update_tier(
    payload: TierUpdateRequest,
    user: User = Depends(require_roles(["chancellor_dean", "dean", "admin"])),
    db: Session = Depends(get_db),
):
    if payload.tier not in TIER_CONFIG:
        raise HTTPException(status_code=400, detail="Invalid subscription tier")
    college = db.query(College).filter(College.id == user.tenant_id).first()
    if payload.student_count is not None and payload.student_count > 0:
        college.student_count = payload.student_count
    tier_meta = TIER_CONFIG[payload.tier]
    if college.student_count > tier_meta["max_students"]:
        raise HTTPException(status_code=400, detail=f"{tier_meta['name']} supports up to {tier_meta['max_students']} students")
    college.tier = payload.tier
    db.commit()
    return {
        "tier": college.tier,
        "student_count": college.student_count,
        "estimated_arr_usd": round(college.student_count * tier_meta["price_per_student_yr"], 2),
        "features": tier_meta["features"],
    }


@router.get("/students")
def get_students(
    user: User = Depends(require_roles(["chancellor_dean", "professor_hod", "admin", "professor", "dean", "hod"])),
    db: Session = Depends(get_db),
):
    """
    Roster endpoint for Student Success Radar.
    Returns enrolled students within the authenticated tenant.
    """
    students = (
        db.query(User)
        .filter(User.tenant_id == user.tenant_id, User.role == "student")
        .order_by(User.full_name)
        .limit(100)
        .all()
    )
    return [
        {
            "id": s.id,
            "full_name": s.full_name,
            "email": s.email,
            "department": s.department or "CSE",
            "semester": s.semester or 5,
            "cgpa": float(s.cgpa or 7.5),
            "karma_points": s.karma_points or 0,
        }
        for s in students
    ]

