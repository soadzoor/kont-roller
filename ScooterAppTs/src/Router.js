import React from "react";

import ScooterPage from "./ScooterPage"
import ScanPage from "./ScanPage"

import { withBle } from "./Ble";

const Router = ({ ble }) => {
    if(ble.connected) {
        return <ScooterPage/>;
    }
    else {
        return <ScanPage/>;
    }
}

export default withBle(Router)