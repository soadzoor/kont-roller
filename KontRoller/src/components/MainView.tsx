import React from "react";
import { View, StyleSheet, StyleProp } from "react-native";

const styles = StyleSheet.create({
	container: {
		padding: 12,
		backgroundColor: "#eee",
		flexDirection: "column",
		flex: 1,
		minWidth: 0,
		minHeight: 0,
		color: "#363636",
	}
})

interface IProps
{
	style?: StyleProp<any>;
	children: React.ReactNode;
}

const MainView = ({ style, children }: IProps) => (
	<View style={StyleSheet.compose(styles.container, style)}>
		{children}
	</View>
)

export default MainView;
