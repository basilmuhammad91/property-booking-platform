import React from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen text-gray-900 bg-gray-100 dark:bg-gray-900 dark:text-white">
            <div className="space-y-6 text-center">
                <h1 className="text-4xl font-bold">Welcome to Laravel</h1>

                <Link
                    href={route("login")}
                    className="inline-block rounded-md bg-white px-5 py-2 text-gray-800 ring-1 ring-gray-300 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D20] dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-700"
                >
                    Log in
                </Link>
            </div>
        </div>
    );
}

// 👇 Attach layout (similar to Vue `layout: AppLayout`)
Home.layout = (page) => <AppLayout>{page}</AppLayout>;
