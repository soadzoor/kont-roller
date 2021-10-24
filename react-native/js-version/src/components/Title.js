import React from "react";
import { Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    title: {
        textAlign: "center",
        flexGrow: 1,
        fontSize: 24
    }
});

const Title = ({ onClick, children, style }) => (
    <Text
        style={StyleSheet.compose(styles.title, style)}
        onPress={onClick}
    >
        {children}
    </Text>
)

export default Title;
