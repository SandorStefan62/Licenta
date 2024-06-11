import React from "react";
import Motion from "../components/Motion";

function HomeComponent() {
    return (
        <div className="About">
            <h1>Home Page!</h1>
        </div>
    )
}

const Home = Motion(HomeComponent)

export default Home