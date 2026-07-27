import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import AppErrorCenter from "./shared/components/AppErrorCenter";
import { useEffect, useState } from "react";
import { emitAppError } from "./shared/utils/appError";

const DESKTOP_MIN_WIDTH = 1024;

const isDesktopViewport = () => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= DESKTOP_MIN_WIDTH;
};

function App() {
    const [isDesktopOnlyView, setIsDesktopOnlyView] = useState(isDesktopViewport);

    useEffect(() => {
        const onUnhandledRejection = (event) => {
            if (!event?.reason) return;
            emitAppError(event.reason, "Unexpected error occurred.");
        };

        window.addEventListener("unhandledrejection", onUnhandledRejection);
        return () => window.removeEventListener("unhandledrejection", onUnhandledRejection);
    }, []);

    useEffect(() => {
        const onResize = () => {
            setIsDesktopOnlyView(isDesktopViewport());
        };

        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    if (!isDesktopOnlyView) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-app px-6">
                <div className="card w-full max-w-md p-6 text-center">
                    <h1 className="text-xl font-bold text-app-heading">Desktop View Required</h1>
                    <p className="mt-3 text-sm text-app-sub">
                        CoreFlow web is available on desktop screens only. Please open this app on a desktop or laptop.
                    </p>
                </div>
                <AppErrorCenter />
            </div>
        );
    }

    return (
        <>
            <RouterProvider router={router} />
            <AppErrorCenter />
        </>
    );
}

export default App;
