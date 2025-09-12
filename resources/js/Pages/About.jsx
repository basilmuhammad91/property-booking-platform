import React from "react";
import AppLayout from "@/Layouts/AppLayout";

export default function AboutUs() {
    return (
        <h1>
            Welcome to About Us
        </h1>
    );
}

// Apply layout like in Vue
AboutUs.layout = (page) => <AppLayout children={page} />;
