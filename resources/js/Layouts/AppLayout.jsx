import React, { useState, useEffect } from "react";
import GuestHeader from "@/Components/layout/GuestHeader";
import AdminHeader from "@/Components/layout/AdminHeader";
import useAuth from "@/hooks/useAuth";

export default function AppLayout({ children }) {
    const user = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleSidebarToggle = (event) => {
            if (event.detail && event.detail.collapsed !== undefined) {
                setIsCollapsed(event.detail.collapsed);
            }
        };

        window.addEventListener('sidebarToggle', handleSidebarToggle);
        return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
    }, []);

    const sidebarWidth = user?.is_admin ? (isCollapsed ? '5rem' : '18rem') : '0';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {user?.is_admin ? (
                <AdminHeader onToggle={setIsCollapsed} />
            ) : (
                <GuestHeader />
            )}
            <main
                className="relative transition-all duration-300"
                style={{
                    marginLeft: window.innerWidth >= 768 ? sidebarWidth : '0',
                    minHeight: 'calc(100vh - 4rem)'
                }}
            >
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
                <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
