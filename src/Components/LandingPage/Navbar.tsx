"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-secondary text-white shadow-md">
      {/* Logo */}
      <h1 className="text-xl font-bold text-main">GeoAlert</h1>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <Link
          href="/"
          className={`hover:opacity-80 transition ${
            pathname === "/" ? "border-b-2 border-main" : ""
          }`}
        >
          Home
        </Link>
        <Link
          href="/login"
          className={`hover:opacity-80 transition ${
            pathname === "/login" ? "border-b-2 border-main" : ""
          }`}
        >
          Access Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
