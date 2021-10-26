import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingRight: 12,
        paddingBottom: 12
    }
})

const WidgetsContainer = ({ style, children }) => (
    <ScrollView style={StyleSheet.compose(style)}>
        <View style={StyleSheet.compose(styles.container)}>
            {children}
        </View>
    </ScrollView>
)

export default WidgetsContainer;
