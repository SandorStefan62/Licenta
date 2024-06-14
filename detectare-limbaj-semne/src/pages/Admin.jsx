import React from "react";
import Motion from "../components/Motion";

function DictionaryComponent() {
    return (
        <div className="Admin">
            <h1>Admin Page!</h1>
        </div>
    )
}

const Admin = Motion(DictionaryComponent)

export default Admin