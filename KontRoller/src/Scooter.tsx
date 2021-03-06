import React, {Component} from "react";
import {View, Text, ActivityIndicator, StyleSheet, GestureResponderEvent} from "react-native";

import MainView from "./components/MainView"
import Button from "./components/Button"
import ScooterMain from "./ScooterMain";
import ScooterSettings from "./ScooterSettings";
import {IExports} from "./Api/types";
import {Labels} from "./Labels";
import {LanguageSettings} from "./utils/LanguageSettings";

const style = StyleSheet.create({
	topSpace: {
		marginTop: 12
	},
	center: {
		flexDirection: "column",
		flexGrow: 1,
		justifyContent: "center"
	},
	error: {
		color: "#B71C1C",
		fontSize: 20,
		textAlign: "center"
	}
});

interface IProps
{
	api: IExports;
	mac: string;
	connected: boolean;
	onBack: () => void;
	onLoad?: (event: GestureResponderEvent) => void;
	error?: unknown;
}

interface IState
{
	page: "main" | "settings";
}

class Scooter extends Component<IProps, IState>
{
	constructor(props: IProps)
	{
		super(props);
		this.state = {
			page: "main"
		};
	}

	private changePageToSettings = () =>
	{
		this.setState({page: "settings"});
	};

	private changePageToMain = () =>
	{
		this.setState({page: "main"});
	};

	private renderError = () => (
		<View style={style.center}>
			<Text style={style.error}>{Labels.somethingWentWrong[LanguageSettings.lang]}</Text>
			<Text style={style.error}>{(this.props.error as string)?.toString?.()}</Text>
			<Button style={style.topSpace} onClick={this.props.onLoad}>{Labels.tryAgain[LanguageSettings.lang]}</Button>
		</View>
	)

	private renderPage = () => (
		this.state.page === "main" ? (
			<ScooterMain {...this.props} onSettings={this.changePageToSettings} />
		) : this.state.page === "settings" ? (
			<ScooterSettings {...this.props} onBack={this.changePageToMain} />
		) : null
	)

	private renderLoading = () => (
		<View style={style.center}>
			<ActivityIndicator size="large" color="#202020" style={style.topSpace} />
		</View>
	)

	public override render()
	{
		return (
			<MainView>
				{this.props.error ? (
					this.renderError()
				) : (this.props.api && this.props.connected) ? (
					this.renderPage()
				) : (
					this.renderLoading()
				)}
			</MainView>
		)
	}
}

export default Scooter