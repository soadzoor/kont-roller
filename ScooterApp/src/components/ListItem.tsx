import React from "react";
import { Text, StyleSheet, TouchableHighlight, GestureResponderEvent, StyleProp } from "react-native";

const styles = StyleSheet.create({
	item: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderRadius: 5,
		backgroundColor: "#bdbdbd",
		fontSize: 22
	}
});

interface IProps
{
	onPress: (event: GestureResponderEvent) => void;
	children: React.ReactNode;
	style?: StyleProp<any>;
}

const ListItem = ({onPress, children, style}: IProps) => (
	<TouchableHighlight onPress={onPress} style={style}>
		<Text style={styles.item} >
			{children}
		</Text>
	</TouchableHighlight>
)

export default ListItem;