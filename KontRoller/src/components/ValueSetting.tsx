import React, {Component} from "react";
import {Text, StyleSheet, View, StyleProp, TouchableOpacity} from "react-native";
import prompt from "react-native-prompt-android";

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderRadius: 5,
		backgroundColor: "#bdbdbd",
		flexDirection: "row",
		alignItems: "center"
	},
	label: {
		fontSize: 22,
		flexGrow: 1
	},
	value: {
		fontSize: 20,
		color: "#424242"
	},
	textInput: {
		fontSize: 20
	},
});

interface IProps
{
	onChange?: (newValue: number | string) => Promise<any> | any;
	value: string | number;
	children: string;
	style?: StyleProp<any>;
}

class ValueSetting extends Component<IProps>
{
	private _keyboardType: "default" | "numeric" = "default";

	private onEndEdit = () =>
	{

	};

	private onStartEdit = () =>
	{
		prompt(
			this.props.children,
			undefined,
			[
				{text: "Cancel", onPress: this.onEndEdit},
				{text: "Submit", onPress: this.onSubmit}
			],
			{
				type: this._keyboardType,
				defaultValue: `${this.props.value}`
			}
		);
	};

	private onSubmit = (textInputValue: string) =>
	{
		const textInputAsNumber = parseFloat(textInputValue);
		const newValueToPropagate = isNaN(textInputAsNumber) ? textInputValue : textInputAsNumber;
		this.props.onChange?.(newValueToPropagate);
		this.onEndEdit();
	};

	public override render()
	{
		const {value, children, style} = this.props;
		this._keyboardType = typeof value === "number" ? "numeric" : "default";

		return (
			<TouchableOpacity onPress={this.onStartEdit}>
				<View style={StyleSheet.compose(styles.container, style)}>
					<Text style={styles.label}>
						{children}
					</Text>
					<Text style={styles.value}>
						{value}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

export default ValueSetting;