import Image from "next/image";
import Link from "next/link";

export function Logo({
  showTagline: _showTagline = true,
  size = "md",
}: {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  light?: boolean;
}) {
  const dimensions = {
    sm: { width: 188, height: 48, className: "h-8 sm:h-9" },
    md: { width: 235, height: 60, className: "h-9 sm:h-10" },
    lg: { width: 282, height: 72, className: "h-8 sm:h-10" },
  }[size];

  return (
    <Link
      href="/"
      aria-label="CAMPUS-NEXUS home"
      className="flex shrink-0 items-center gap-2"
    >
      <Image
        src="/images/campus-nexus-3d-logo.svg"
        alt="CAMPUS-NEXUS — Learn, Connect, Thrive"
        width={dimensions.width}
        height={dimensions.height}
        priority
        className={`${dimensions.className} w-auto object-contain [image-rendering:auto]`}
      />
    </Link>
  );
}
