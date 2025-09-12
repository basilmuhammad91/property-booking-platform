import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import useAuth from "@/hooks/useAuth";

export default function GuestHeader() {
    const { props } = usePage();
     const user = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggle = (setter) => () => setter((prev) => !prev);
    const close = (setter) => () => setter(false);

    const getUserInitials = (name) =>
        name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const navLinks = [
        { href: "/properties", label: "Properties" },
        { href: "/about", label: "About Us" },
        { href: "/faq", label: "FAQ" },
    ];

    const renderLinks = (isMobile = false, onClick = () => {}) =>
        navLinks.map(({ href, label }) => (
            <Link
                key={href}
                href={href}
                onClick={onClick}
                className={`${isMobile ? "block px-3 py-2" : "font-medium"} ${
                    props.url === href ? "text-primary" : "text-text"
                } hover:text-primary transition-colors duration-200`}
            >
                {label}
            </Link>
        ));

    const authLinks = !user ? (
        <>
            <Link
                href="/login"
                onClick={close(setMobileMenuOpen)}
                className="font-medium text-text hover:text-primary transition-colors duration-200"
            >
                Login
            </Link>
            <Link
                href="/register"
                onClick={close(setMobileMenuOpen)}
                className="flex items-center px-4 py-2 font-medium text-white rounded-md bg-primary hover:bg-primary transition-colors duration-200"
            >
                <span>Start</span>
                <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </Link>
        </>
    ) : (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggle(setUserDropdownOpen)}
                className="flex items-center px-3 py-2 space-x-2 font-medium rounded-md text-text hover:text-primary hover:bg-gray-50 transition-colors duration-200"
            >
                <div className="flex items-center justify-center w-8 h-8 text-sm font-medium text-white rounded-full bg-primary">
                    {getUserInitials(user.name)}
                </div>
                <span className="hidden sm:block">{user.name}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                        userDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
            {userDropdownOpen && (
                <div className="absolute right-0 z-50 w-48 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500">{user.email}</div>
                    </div>
                    {["/My Bookings", "/dashboard", "/settings"].map((href) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={close(setUserDropdownOpen)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                            {href.replace("/", "").charAt(0).toUpperCase() +
                                href.slice(2)}
                        </Link>
                    ))}
                    <hr className="border-gray-200" />
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        onClick={close(setUserDropdownOpen)}
                        className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                        Logout
                    </Link>
                </div>
            )}
        </div>
    );

    return (
        <header className="border-b border-gray-200 shadow-sm bg-background">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-text">PBP</span>
                    </Link>

                    <nav className="hidden md:flex space-x-8 items-center">
                        {renderLinks()}
                    </nav>

                    <div className="flex items-center space-x-4">
                        {authLinks}
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={toggle(setMobileMenuOpen)}
                            className="text-text hover:text-primary transition-colors duration-200"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={
                                        mobileMenuOpen
                                            ? "M6 18L18 6M6 6l12 12"
                                            : "M4 6h16M4 12h16M4 18h16"
                                    }
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {renderLinks(true, close(setMobileMenuOpen))}
                            <div className="pt-4 pb-2 border-t border-gray-200">
                                {!user ? (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={close(setMobileMenuOpen)}
                                            className="block px-3 py-2 font-medium text-text hover:text-primary"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={close(setMobileMenuOpen)}
                                            className="block px-3 py-2 mt-2 text-center font-medium text-white rounded-md bg-primary hover:bg-primary"
                                        >
                                            Start
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <div className="px-3 py-2 text-sm text-gray-700 border-b">
                                            <div className="font-medium">
                                                {user.name}
                                            </div>
                                            <div className="text-gray-500">
                                                {user.email}
                                            </div>
                                        </div>
                                        {[
                                            "/profile",
                                            "/dashboard",
                                            "/settings",
                                        ].map((href) => (
                                            <Link
                                                key={href}
                                                href={href}
                                                onClick={close(
                                                    setMobileMenuOpen
                                                )}
                                                className="block px-3 py-2 font-medium text-text hover:text-primary"
                                            >
                                                {href
                                                    .replace("/", "")
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    href.slice(2)}
                                            </Link>
                                        ))}
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            onClick={close(setMobileMenuOpen)}
                                            className="block w-full px-3 py-2 font-medium text-left text-red-600 hover:text-red-800"
                                        >
                                            Logout
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
