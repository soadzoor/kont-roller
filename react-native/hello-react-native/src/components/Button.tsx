import React from "react";
import {TouchableOpacity, Text, StyleSheet, GestureResponderEvent, StyleProp} from "react-native";

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#212121",
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 16
	},
	title: {
		color: "#eee",
		fontSize: 20,
		textTransform: "capitalize"
	}
});

interface IProps
{
	onClick?: (event: GestureResponderEvent) => void;
	children: React.ReactNode;
	style?: StyleProp<any>
}

const Button = ({onClick, children, style}: IProps) => (
	<TouchableOpacity
		style={StyleSheet.compose(style, styles.container)}
		onPress={onClick}
	>
		<Text style={styles.title}>
			{children}
		</Text>
	</TouchableOpacity>
)

export default Button;
