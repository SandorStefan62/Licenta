import React from "react";
import Motion from "../components/Motion";

function PracticeComponent() {
    return (
        <div className="Practice">
            <h1>Practice Page!</h1>
        </div>
    )
}

const Practice = Motion(PracticeComponent)

export default Practice