import React, {Component} from "react";
import {Text, StyleSheet, View, StyleProp, TouchableOpacity, TextInput} from "react-native";

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		borderRadius: 5,
		backgroundColor: "#bdbdbd",
		flexDirection: "row",
		alignItems: "center"
	},
	label: {
		paddingVertical: 16,
		fontSize: 22,
		color: "#363636",
	},
	textInput: {
		flex: 1,
		color: "#00A000",
		height: "100%",
		textAlign: "right",
		marginLeft: 10,
		paddingRight: 25,
		fontSize: 22,
	},
});

interface IProps
{
	onChange: (newValue: number | string) => Promise<number | string> | (number | string);
	value: string | number;
	children: string;
	style?: StyleProp<any>;
}

interface IState
{
	value: string;
}

class ValueSetting extends Component<IProps, IState>
{
	private _keyboardType: "default" | "numeric" = "default";

	constructor(props: IProps)
	{
		super(props);
		this.state = {
			value: `${this.props.value}`
		};
	}

	private onTextChange = (newValue: string) =>
	{
		this.setState({
			value: newValue
		});
	};

	private onSubmit = async () =>
	{
		const textInputValue = this.state.value;
		const textInputAsNumber = parseFloat(textInputValue);
		const newValueToPropagate = isNaN(textInputAsNumber) ? textInputValue : textInputAsNumber;
		const newValidatedValue = await this.props.onChange(newValueToPropagate);

		this.setState({
			value: `${newValidatedValue}`
		});
	};

	public override async componentWillUnmount()
	{
		await this.onSubmit();
	}

	public override render()
	{
		const {value, children, style} = this.props;
		this._keyboardType = typeof value === "number" ? "numeric" : "default";

		return (
			<TouchableOpacity>
				<View style={StyleSheet.compose(styles.container, style)}>
					<Text style={styles.label}>
						{children}
					</Text>
					<TextInput
						value={this.state.value}
						onChangeText={this.onTextChange}
						onEndEditing={this.onSubmit}
						style={styles.textInput}
						keyboardType={this._keyboardType}
					/>
				</View>
			</TouchableOpacity>
		);
	}
}

export default ValueSetting;