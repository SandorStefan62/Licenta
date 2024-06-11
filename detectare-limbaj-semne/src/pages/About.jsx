import React from "react";
import Motion from "../components/Motion";

function AboutComponent() {
    return (
        <div className="About">
            <h1>About Page!</h1>
        </div>
    )
}

const About = Motion(AboutComponent)

export default About