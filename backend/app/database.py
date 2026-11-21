from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import settings


def _make_engine():
    url = settings.database_url
    # Render and many hosted Postgres providers supply a plain postgresql:// URL.
    # This project installs psycopg 3, so tell SQLAlchemy to use that driver.
    if url.startswith("postgres://"):
        url = "postgresql+psycopg://" + url[len("postgres://"):]
    elif url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://"):]
    if url.startswith("sqlite"):
        eng = create_engine(url, connect_args={"check_same_thread": False})

        @event.listens_for(eng, "connect")
        def _set_sqlite_pragma(dbapi_conn, _):
            cursor = dbapi_conn.cursor()
            cursor.execute("PRAGMA foreign_keys=ON;")
            cursor.close()

        return eng
    try:
        eng = create_engine(url, pool_pre_ping=True)
        with eng.connect() as conn:
            conn.exec_driver_sql("SELECT 1")
        return eng
    except Exception:
        # Automatic SQLite fallback for local demo if Postgres is unavailable
        fallback_url = "sqlite:///./campus_nexus.db"
        return create_engine(fallback_url, connect_args={"check_same_thread": False})


engine = _make_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
