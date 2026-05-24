import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import AppErrorCenter from "./shared/components/AppErrorCenter";
import { useEffect } from "react";
import { emitAppError } from "./shared/utils/appError";
function App() {
    useEffect(() => {
        const onUnhandledRejection = (event) => {
            if (!event?.reason) return;
            emitAppError(event.reason, "Unexpected error occurred.");
        };

        window.addEventListener("unhandledrejection", onUnhandledRejection);
        return () => window.removeEventListener("unhandledrejection", onUnhandledRejection);
    }, []);

    return (
        <>
            <RouterProvider router={router} />
            <AppErrorCenter />
        </>
    );
}

export default App;
