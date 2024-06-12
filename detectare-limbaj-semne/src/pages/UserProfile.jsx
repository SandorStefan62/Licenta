import React from "react";
import Motion from "../components/Motion";

function UserProfileComponent() {
    return (
        <div className="UserProfile">
            <h1>UserProfile Page!</h1>
        </div>
    )
}

const UserProfile = Motion(UserProfileComponent)

export default UserProfile