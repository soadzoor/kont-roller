import React from "react";
import { View, StyleSheet } from "react-native";

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

const TitleBar = ({ children, style }) => (
    <View style={StyleSheet.compose(styles.container, style)}>
        {children}
    </View>
)

export default TitleBar;
