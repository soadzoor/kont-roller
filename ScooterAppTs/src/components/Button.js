import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#212121",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    title: {
        color: "#eee",
        fontSize: 20,
        textTransform: "capitalize"
    }
});

const Button = ({ onClick, children, style }) => (
    <TouchableOpacity
        style={StyleSheet.compose(style, styles.container)}
        onPress={onClick}
    >
        <Text style={StyleSheet.compose(styles.title)}>
            {children}
        </Text>
    </TouchableOpacity>
)

export default Button;
