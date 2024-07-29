import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import MainNavigation from "../components/navigation/MainNavigation";
import DiagramLayout from "./Diagram";
import { useEffect } from "react";
import { getTokenDuration } from "../util/auth";

const RootLayout = () => {
    const {token} = useLoaderData();

    console.log("rootLayout")

    const submit = useSubmit();


    useEffect(() => {
       
        if(!token) {
            return;
        }

        if(token === "EXPIRED") {
            submit(null, {action: "/logout", method: "post"});
            return;
        }

        const tokenDuration = getTokenDuration();

        setTimeout(() => {
            submit(null, {action: "/logout", method: "post"})
        }, tokenDuration);
    }, [token]);
    return(
        <>
            <MainNavigation />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default RootLayout;