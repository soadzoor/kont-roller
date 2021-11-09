import React from "react";
import {BackHandler, StyleSheet} from "react-native";

import Title from "./components/Title";
import TitleBar from "./components/TitleBar";
import Icon from "./components/Icon";
import List from "./components/List";
import SwitchSetting from "./components/SwitchSetting";
import ValueSetting from "./components/ValueSetting";
import {IExports, MAX_SPEED} from "./Api/types";
import {Labels} from "./Labels";
import {LanguageSettings} from "./utils/LanguageSettings";
import {ScooterNameSettings} from "./utils/ScooterNameSettings";
import {ScooterName} from "./ScooterName";

const style = StyleSheet.create({
	topSpace: {
		marginTop: 12
	},
});

interface IProps
{
	onBack: () => void;
	mac: string;
	api: IExports;
}

class ScooterSettings extends React.Component<IProps>
{
	private setName = async (newName: string | number) =>
	{
		await ScooterNameSettings.setNameForMac(this.props.mac, newName as string);
		this.forceUpdate();

		return newName;
	};

	private setSpeedLimit = (value: number | string) =>
	{
		return this.props.api.setSpeedLimit(value as number);
	};

	private setNonZeroStart = (value: boolean) =>
	{
		return value ? this.props.api.nonZeroStartOn() : this.props.api.nonZeroStartOff();
	};

	private setAlarm = (value: boolean) =>
	{
		return value ? this.props.api.alarmOn() : this.props.api.alarmOff();
	};

	private setTransport = (value: boolean) =>
	{
		return value ? this.props.api.transportOn() : this.props.api.transportOff();
	};

	private onBackPress = () =>
	{
		this.props.onBack?.();

		return true;
	};

	public override componentDidMount()
	{
		BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
	}

	public override componentWillUnmount()
	{
		BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
	}

	public override render()
	{
		const {api, mac, onBack} = this.props;
		const {lang} = LanguageSettings;

		return (
			<>
				<TitleBar>
					<Icon icon="left-arrow" onClick={onBack} />
					<Title><ScooterName mac={mac} /></Title>
				</TitleBar>
				<List>
					<ValueSetting
						style={style.topSpace}
						value={ScooterNameSettings.getScooterNameByMac(mac)}
						onChange={this.setName}
					>
						{Labels.name[lang]}
					</ValueSetting>
					<ValueSetting
						style={style.topSpace}
						value={api.speedLimit ?? MAX_SPEED}
						onChange={this.setSpeedLimit}
					>
						{Labels.speedLimit[lang]}
					</ValueSetting>
					<SwitchSetting
						style={style.topSpace}
						value={api.nonZeroStart}
						onChange={this.setNonZeroStart}
					>
						{Labels.kickToStart[lang]}
					</SwitchSetting>
					<SwitchSetting
						style={style.topSpace}
						value={api.alarm}
						onChange={this.setAlarm}
					>
						{Labels.alarm[lang]}
					</SwitchSetting>
					<SwitchSetting
						style={style.topSpace}
						value={api.transport}
						onChange={this.setTransport}
					>
						{Labels.transport[lang]}
					</SwitchSetting>
					{/* <SwitchSetting
						style={style.topSpace}
						value={api.wheelLocked}
						onChange={value => value ? api.wheelLock() : api.wheelUnlock()}
					>
						Kerékzár
					</SwitchSetting>
					<SwitchSetting
						style={style.topSpace}
						value={api.batteryLocked}
						onChange={value => value ? api.batteryLock() : api.batteryUnlock()}
					>
						Akkumulátor zár
					</SwitchSetting>
					<SwitchSetting
						style={style.topSpace}
						value={api.cruise}
						onChange={value => value ? api.cruiseOn() : api.cruiseOff()}
					>
						Cruise
					</SwitchSetting> */}
				</List>
			</>
		);
	}
}

export default ScooterSettings