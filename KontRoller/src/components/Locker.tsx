import React, {Component} from "react";
import {View, TouchableOpacity, StyleSheet, GestureResponderEvent, StyleProp} from "react-native";
import Icon from "./Icon";

const styles = StyleSheet.create({
	container: {
		borderRadius: 150,
		borderColor: "#727272",
		borderWidth: 2,
		padding: 64
	}
});

interface IProps
{
	onClick: (event: GestureResponderEvent) => void;
	locked: boolean;
	style?: StyleProp<any>;
}

const Locker = ({onClick, locked, style}: IProps) =>
{
	return (
		<TouchableOpacity
			style={style}
			onPress={onClick}
			activeOpacity={0.6}
		>
			<View style={styles.container}>
				<Icon
					icon={locked ? "lock" : "unlock"}
					size={64}
				/>
			</View>
		</TouchableOpacity>
	)
}

export default Locker;
