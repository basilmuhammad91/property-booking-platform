import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import useAuth from "@/hooks/useAuth";

export default function AirbnbSidebar() {
    const { props } = usePage();
    const user = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
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
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const navLinks = [
        {
            href: "/stays",
            label: "Stays",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9 9 9s9-3.45 9-9V7l-8-5z"/>
                </svg>
            )
        },
        {
            href: "/experiences",
            label: "Experiences",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            )
        },
        {
            href: "/host",
            label: "Become a Host",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
            )
        },
        {
            href: "/help",
            label: "Help Center",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
            )
        }
    ];

    const renderLinks = (onClick = () => {}) =>
        navLinks.map(({ href, label, icon }) => (
            <Link
                key={href}
                href={href}
                onClick={onClick}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    props.url === href
                        ? "bg-gradient-to-r from-[#FF385C] to-[#E31C5F] text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#FF385C]"
                }`}
                title={isCollapsed ? label : ''}
            >
                <span className={`${props.url === href ? 'text-white' : 'text-gray-500 group-hover:text-[#FF385C]'} transition-colors duration-200`}>
                    {icon}
                </span>
                {!isCollapsed && (
                    <span className="ml-3">{label}</span>
                )}
            </Link>
        ));

    return (
        <>
            <div className="md:hidden p-4 flex justify-between items-center border-b bg-white shadow-sm">
                <button
                    onClick={toggle(setSidebarOpen)}
                    className="text-gray-700 hover:text-[#FF385C] transition-colors duration-200"
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
                                sidebarOpen
                                    ? "M6 18L18 6M6 6l12 12"
                                    : "M4 6h16M4 12h16M4 18h16"
                            }
                        />
                    </svg>
                </button>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#FF385C] to-[#E31C5F] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-[#FF385C] to-[#E31C5F] bg-clip-text text-transparent">
                        PBP
                    </span>
                </div>
            </div>

            <aside
                className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-xl z-50 transform transition-all duration-300 md:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } ${
                    isCollapsed ? "w-20" : "w-72"
                }`}
            >
                <div className={`flex items-center h-16 border-b border-gray-200 bg-gradient-to-r from-[#FF385C] to-[#E31C5F] ${isCollapsed ? 'justify-center px-4' : 'justify-between px-6'}`}>
                    {!isCollapsed && (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-[#FF385C] font-bold text-lg">P</span>
                            </div>
                            <span className="font-bold text-2xl text-white">PBP</span>
                        </div>
                    )}

                    <button
                        onClick={toggle(setIsCollapsed)}
                        className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                    >
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                                isCollapsed ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    {isCollapsed && (
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-[#FF385C] font-bold text-lg">A</span>
                        </div>
                    )}
                </div>

                <nav className="p-4 space-y-2 flex-1">{renderLinks(close(setSidebarOpen))}</nav>

                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    {!user ? (
                        <div className="space-y-3">
                            <Link
                                href="/login"
                                onClick={close(setSidebarOpen)}
                                className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3 text-sm rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 border border-gray-200`}
                                title={isCollapsed ? "Log in" : ''}
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                                {!isCollapsed && <span className="ml-3">Log in</span>}
                            </Link>
                            <Link
                                href="/register"
                                onClick={close(setSidebarOpen)}
                                className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-[#FF385C] to-[#E31C5F] hover:from-[#E31C5F] hover:to-[#C13584] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                                title={isCollapsed ? "Sign up" : ''}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                                </svg>
                                {!isCollapsed && <span className="ml-3">Sign up</span>}
                            </Link>
                        </div>
                    ) : (
                        <div ref={dropdownRef}>
                            <button
                                onClick={toggle(setUserDropdownOpen)}
                                className={`flex items-center w-full ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 space-x-3 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 border border-gray-200`}
                                title={isCollapsed ? user.name : ''}
                            >
                                <div className="flex items-center justify-center w-9 h-9 text-sm font-medium text-white rounded-full bg-gradient-to-r from-[#FF385C] to-[#E31C5F] shadow-md">
                                    {getUserInitials(user.name)}
                                </div>
                                {!isCollapsed && (
                                    <>
                                        <span className="font-medium flex-1 text-left">{user.name}</span>
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
                                    </>
                                )}
                            </button>
                            {userDropdownOpen && !isCollapsed && (
                                <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                    {[
                                        { href: "/trips", label: "Your trips", icon: "🧳" },
                                        { href: "/wishlists", label: "Wishlists", icon: "❤️" },
                                        { href: "/account", label: "Account", icon: "👤" }
                                    ].map(({ href, label, icon }) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            onClick={close(setUserDropdownOpen)}
                                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <span className="mr-3">{icon}</span>
                                            {label}
                                        </Link>
                                    ))}
                                    <hr className="border-gray-200" />
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex items-center w-full px-4 py-3 text-sm text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                                    >
                                        <span className="mr-3">🚪</span>
                                        Log out
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </aside>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden backdrop-blur-sm"
                    onClick={close(setSidebarOpen)}
                ></div>
            )}
        </>
    );
}
