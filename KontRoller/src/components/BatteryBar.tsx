import React from "react";
import { View, Text, StyleSheet, StyleProp } from "react-native";

import Icon from "./Icon";

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center"
	}
});

interface IProps
{
	charging: boolean;
	large: boolean;
	percent: number;
	style?: StyleProp<any>;
}

const Locker = ({charging, large, percent, style}: IProps) => 
{
	const scale = large ? 3 : 1;
	return (
		<View style={StyleSheet.compose(styles.container, style)}>
			<Icon 
				icon={charging ? "charging" : "battery"}
				size={Math.round(24 * scale)}
			/>
			<Text
				style={{
					marginLeft: 12,
					fontSize: Math.round(18 * scale),
					color: "#363636",
				}}
			>
				{Math.round(percent)} %
			</Text>
		</View>
	)
}
export default Locker;
