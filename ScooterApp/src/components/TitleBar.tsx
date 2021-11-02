import React from "react";
import {View, StyleSheet, StyleProp} from "react-native";

const styles = StyleSheet.create({
	container: {
		marginTop: 24,
		marginBottom: 24,
		paddingHorizontal: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	}
});

interface IProps
{
	style?: StyleProp<any>;
	children: React.ReactNode;
}

const TitleBar = ({children, style}: IProps) => (
	<View style={StyleSheet.compose(styles.container, style)}>
		{children}
	</View>
)

export default TitleBar;
