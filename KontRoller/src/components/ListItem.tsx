import {useState} from "react";
import {Text, StyleSheet, TouchableHighlight, GestureResponderEvent} from "react-native";

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		paddingHorizontal: 16,
		minHeight: 48,
		alignItems: "center",
		borderRadius: 6,
		backgroundColor: "#bdbdbd",
		marginBottom: 2,
		marginTop: 2,
		marginRight: 4,
	},
	item: {
		fontSize: 22,
		color: "#363636",
	},
	item_pressed: {
		color: "#FFFFFF",
	},
});

interface IProps
{
	onPress: (event: GestureResponderEvent) => void;
	children: React.ReactNode;
	disabled?: boolean;
}

const ListItem = ({onPress, children, disabled}: IProps) => 
{
	const [isPressed, setIsPressed] = useState<boolean>(false);

	const handlePressIn = () =>
	{
		setIsPressed(true);
	};

	const handlePressOut = () =>
	{
		setIsPressed(false);
	};

	return (
		<TouchableHighlight
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={disabled}
			style={styles.container}
			underlayColor="#363636"
		>
			<Text style={isPressed ? StyleSheet.compose(styles.item, styles.item_pressed) : styles.item} >
				{children}
			</Text>
		</TouchableHighlight>
	);
};

export default ListItem;