import React from "react";
import { StyleSheet } from "react-native";

import Title from "./components/Title";
import TitleBar from "./components/TitleBar";
import Icon from "./components/Icon";
import Locker from "./components/Locker";
import BatteryBar from "./components/BatteryBar";
import WidgetsContainer from "./components/WidgetsContainer";
import Widget from "./components/Widget";
import {IExports} from "./Api/types";
import {ScooterName} from "./ScooterName";

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
});

interface IProps
{
	onBack?: () => void;
	onSettings: () => void;
	mac: string;
	api: IExports;
}

const ScooterMain = ({onBack, onSettings, mac, api}: IProps) => (
	<>
		<TitleBar>
			<Icon icon="left-arrow" onClick={onBack}/>
			<Title>
				<ScooterName mac={mac} />
			</Title>
			{
				!api.locked &&
				<Icon icon="settings" onClick={onSettings} />
			}
		</TitleBar>
		{/* <Text style={[style.speed, style.topSpace, style.centerItem]}>
			{api.currentSpeed} km/h
		</Text> */}
		<Locker 
			onClick={api.locked ? api.unlock : api.lock }
			locked={api.locked}
			style={StyleSheet.compose<any>(style.topSpace, style.centerItem)}
		/>
		<BatteryBar 
			charging={api.charging}
			large={true}
			style={StyleSheet.compose<any>(style.topSpace, style.centerItem)}
			percent={api.battery}
		/>
		{
			!api.locked &&
			<WidgetsContainer>
				<Widget
					icon={api.led ? "bulb-on" : "bulb-off"}
					active={api.led}
					label="Lámpa"
					onClick={api.led ? api.ledOff : api.ledOn}
				/>
			</WidgetsContainer>
		}
	</>
)

export default ScooterMain