import React from "react";
import {Text, StyleSheet, StyleProp, GestureResponderEvent} from "react-native";

const styles = StyleSheet.create({
	title: {
		textAlign: "center",
		flexGrow: 1,
		fontSize: 24
	}
});

interface IProps
{
	style?: StyleProp<any>;
	children: React.ReactNode;
	onClick?: (event: GestureResponderEvent) => void;
}

const Title = ({onClick, children, style}: IProps) => (
	<Text
		style={StyleSheet.compose(styles.title, style)}
		onPress={onClick}
	>
		{children}
	</Text>
)

export default Title;
