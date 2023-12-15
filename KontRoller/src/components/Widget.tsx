import React from "react";
import { Text, StyleSheet, View, TouchableOpacity, StyleProp } from "react-native";

import Icon, {IconType} from "./Icon";

const styles = StyleSheet.create({
	container: {
		width: 128,
		height: 92,
		padding: 12,
		marginTop: 12,
		marginLeft: "auto",
		marginRight: "auto",
		backgroundColor: "#bdbdbd",
		borderRadius: 12,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},
	activeContainer: {
		backgroundColor: "#929292"
	},
	label: {
		marginTop: 12,
		fontSize: 18
	},
	content: {
		fontSize: 24
	}
});

interface IProps
{
	style?: StyleProp<any>
	icon: IconType;
	label: string;
	onClick: () => void;
	active: boolean;
	children?: React.ReactNode;
}

const Widget = ({style, icon, label, onClick, active, children}: IProps) => (
	<TouchableOpacity onPress={onClick} activeOpacity={0.8}>
		<View style={StyleSheet.compose(StyleSheet.compose(styles.container, active ? styles.activeContainer : {}), style)}>
			{icon && (
				<Icon
					icon={icon}
					size={32}
				/>
			)}
			{children && (typeof children == "string" ? (
				<Text style={styles.content}>{children}</Text>
			) : (
				children
			))}
			<Text style={styles.label}>{label}</Text>
		</View>
	</TouchableOpacity>
)

export default Widget;
