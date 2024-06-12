import React from "react";
import Motion from "../components/Motion";

function SettingsComponent() {
    return (
        <div className="Settings">
            <h1>Settings Page!</h1>
        </div>
    )
}

const Settings = Motion(SettingsComponent)

export default Settings