import React from "react";
import Motion from "../components/Motion";

function HomeComponent() {
    return (
        <div className="w-full h-full absolute flex flex-row justify-center items-center gap-4">
            <h1 className="text-5xl">Home Page!</h1>
        </div>
    )
}

const Home = Motion(HomeComponent)

export default Home