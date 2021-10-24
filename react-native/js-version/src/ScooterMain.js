import React, { Fragment } from "react";
import { Text, StyleSheet } from "react-native";

import Title from "./components/Title";
import TitleBar from "./components/TitleBar";
import Icon from "./components/Icon";
import Locker from "./components/Locker";
import BatteryBar from "./components/BatteryBar";
import WidgetsContainer from "./components/WidgetsContainer";
import Widget from "./components/Widget";

const style = StyleSheet.create({
    topSpace: {
        marginTop: 12
    },
    centerItem: {
        alignSelf: "center"
    },
    speed: {
        fontSize: 64,
        paddingVertical: 48
    }
})

const ScooterMain = ({ onBack, onSettings, mac, api }) => (
    <Fragment>
        <TitleBar>
            <Icon icon="left-arrow" onClick={onBack}/>
            <Title>{mac}</Title>
            <Icon icon="settings" onClick={onSettings}/>
        </TitleBar>
        {(api.currentSpeed > 0 && !api.locked) ? (
            <Text style={[style.speed, style.topSpace, style.centerItem]}>
                {api.currentSpeed} km/h
            </Text>
        ) : (
            <Locker 
                onClick={api.locked ? api.unlock : api.lock }
                locked={api.locked}
                style={StyleSheet.compose(style.topSpace, style.centerItem)}
            />
        )}
        <BatteryBar 
            large={api.currentSpeed > 0 && !api.locked}
            style={StyleSheet.compose(style.topSpace, style.centerItem)}
            percent={api.battery}
        />
        <WidgetsContainer>
            <Widget
                icon={api.led ? "bulb-on" : "bulb-off"}
                active={api.led}
                label="Lámpa"
                onClick={api.led ? api.ledOff : api.ledOn}
            />
        </WidgetsContainer>
    </Fragment>
)

export default ScooterMain