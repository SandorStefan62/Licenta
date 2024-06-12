import React from "react";
import Motion from "../components/Motion";

function DictionaryComponent() {
    return (
        <div className="Dictionary">
            <h1>Dictionary Page!</h1>
        </div>
    )
}

const Dictionary = Motion(DictionaryComponent)

export default Dictionary