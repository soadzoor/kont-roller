import React from "react";
import {Text, ActivityIndicator, StyleSheet, StyleProp} from "react-native";
import {withBle} from "./Ble";
import MainView from "./components/MainView"
import Button from "./components/Button"
import Title from "./components/Title"
import List from "./components/List"
import ListItem from "./components/ListItem"
import TitleBar from "./components/TitleBar";
import {IBle, IDevice, Language} from "./Api/types";
import {StringUtils} from "./utils/StringUtils";
import {Picker} from "@react-native-picker/picker";
import {LanguageSettings} from "./utils/LanguageSettings";
import {Labels} from "./Labels";
import {ScooterName} from "./ScooterName";
import {ScooterNameSettings} from "./utils/ScooterNameSettings";

const style = StyleSheet.create({
	topSpace: {
		marginTop: 12,
		marginBottom: 12,
		color: "#363636",
		flex: 1,
	},
	languageSelector: {
		marginLeft: "auto",
		marginRight: "auto",
		width: 140,
		color: "#363636",
	},
	error: {
		color: "#B71C1C",
	},
});

interface IProps
{
	ble: IBle;
	onBlueToothConnect: () => void;
	isBlueToothOn: boolean;
}

interface IState
{
	connectingToMac: string;
	error: unknown;
}

class ScanPage extends React.Component<IProps, IState>
{
	private _isMounted: boolean = false;

	constructor(props: IProps)
	{
		super(props);
		this.state = {
			connectingToMac: "",
			error: null
		};
	}

	private selectItem = async (item: IDevice) =>
	{
		if (!this.state.connectingToMac)
		{
			this.setState({
				connectingToMac: item.id
			});

			try
			{
				await this.props.ble.connect(item);
				this.props.onBlueToothConnect();
			}
			catch (e)
			{
				this.setState({
					error: e
				});
			}

			if (this._isMounted)
			{
				this.setState({
					connectingToMac: ""
				});
			}
		}
	}

	private onLanguageChange = async (lang: Language) =>
	{
		await LanguageSettings.setLanguage(lang);
		this.forceUpdate();
	};

	private getLoader(size: "small" | "large", style?: StyleProp<any>, animating?: boolean)
	{
		return <ActivityIndicator size={size} animating={animating} color="#202020" style={style} />;
	}

	private onScanClick = async () =>
	{
		this.props.ble.disconnect();
		this.props.ble.scanning = false;
		this.props.ble.devices.length = 0;
		await this.props.ble.scan();
		this.forceUpdate();
	}

	public override async componentDidMount()
	{
		await LanguageSettings.loadSavedLanguage();
		await ScooterNameSettings.loadSavedEntries();
		this.onScanClick();
		this._isMounted = true;

		this.forceUpdate();
	}

	public override UNSAFE_componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void
	{
		if (this.props.isBlueToothOn !== nextProps.isBlueToothOn)
		{
			this.props.ble.devices.length = 0;
			this.props.ble.scanning = false;

			if (nextProps.isBlueToothOn)
			{
				this.onScanClick();
			}

			this.forceUpdate();
		}
	}

	public override componentWillUnmount()
	{
		this._isMounted = false;
	}

	public override render()
	{
		const {lang} = LanguageSettings;

		return (
			<MainView>
				<Picker
					style={style.languageSelector}
					selectedValue={LanguageSettings.lang}
					onValueChange={this.onLanguageChange}
					dropdownIconColor="#363636"
				>
					<Picker.Item label={Labels.english[lang]} value="en" />
					<Picker.Item label={Labels.hungarian[lang]} value="hu" />
				</Picker>
				<TitleBar>
					{
						this.props.isBlueToothOn
							?
							<Title>{Labels.chooseADevice[lang]}</Title>
							:
							<Title style={style.error}>{Labels.turnOnBlueTooth[lang]}</Title>
					}
				</TitleBar>
				<List style={style.topSpace} onRefresh={this.props.ble.scan}>
					{
						this.props.isBlueToothOn &&
						this.props.ble.devices
							.sort((a, b) => StringUtils.sortIgnoreCase(StringUtils.reverseMac(a.id), StringUtils.reverseMac(b.id)))
							.map((device: IDevice) => (
								<ListItem
									key={device.id}
									disabled={!!this.state.connectingToMac}
									onPress={() => this.selectItem(device)}
								>
									<ScooterName mac={device.id} />
									&nbsp;&nbsp;&nbsp;
									{
										this.getLoader("small", undefined, this.state.connectingToMac === device.id)
									}
								</ListItem>
							))
					}
					{
						this.props.ble.scanning && this.props.isBlueToothOn &&
						this.getLoader("large", style.topSpace)
					}
				</List>
				{
					!this.props.ble.scanning && this.props.isBlueToothOn &&
					<Button onClick={this.onScanClick}>{Labels.search[lang]}</Button>
				}
				<Text style={style.error}>{(this.state.error as string)?.toString?.()}</Text>
			</MainView>
		)
	}
}

export default withBle(ScanPage);
