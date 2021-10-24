import React from "react";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: "#eee",
        flexDirection: "column",
        flexGrow: 1
    }
})

const MainView = ({ style, children }) => (
    <View style={StyleSheet.compose(styles.container, style)}>
        {children}
    </View>
)

export default MainView;
