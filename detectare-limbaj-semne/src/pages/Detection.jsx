import React from "react";
import DetectareHolistica from "../components/detectareHolistica"
import Motion from "../components/Motion";

function DetectionComponent() {
    return (
        <div className="About">
            <DetectareHolistica />
        </div>
    )
}

const Detection = Motion(DetectionComponent)

export default Detection