import React from "react";
import { StyleSheet, ScrollView, View, StyleProp } from "react-native";

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		paddingRight: 12,
		paddingBottom: 12
	}
});

interface IProps
{
	children: React.ReactNode;
	style?: StyleProp<any>;
}

const WidgetsContainer = ({style, children}: IProps) => (
	<ScrollView style={style}>
		<View style={styles.container}>
			{children}
		</View>
	</ScrollView>
)

export default WidgetsContainer;
