import "./bootstrap";
import "../css/app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ZiggyVue } from "ziggy-js";

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary')?.trim() || '#ef4444';

createInertiaApp({
    progress: {
        delay: 0,
        color: primaryColor,
        includeCSS: true,
        showSpinner: false,
    },
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props, plugin }) {
         createRoot(el).render(<App {...props} />);
    },
});
