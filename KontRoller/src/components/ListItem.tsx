import React from "react";
import { Text, StyleSheet, TouchableHighlight, GestureResponderEvent, StyleProp } from "react-native";

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		paddingHorizontal: 16,
		minHeight: 48,
		alignItems: "center",
		borderRadius: 5,
		backgroundColor: "#bdbdbd",
	},
	item: {
		fontSize: 22
	}
});

interface IProps
{
	onPress: (event: GestureResponderEvent) => void;
	children: React.ReactNode;
	disabled?: boolean;
}

const ListItem = ({onPress, children, disabled}: IProps) => (
	<TouchableHighlight onPress={onPress} disabled={disabled} style={styles.container}>
		<Text style={styles.item} >
			{children}
		</Text>
	</TouchableHighlight>
)

export default ListItem;