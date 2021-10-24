import React from "react";
import {Text, StyleSheet, StyleProp} from "react-native";

const styles = StyleSheet.create({
	title: {
		textAlign: "center",
		flexGrow: 1,
		fontSize: 24
	}
});

interface IProps
{
	onClick?: () => void;
	children: React.ReactNode;
	style?: StyleProp<any>
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
