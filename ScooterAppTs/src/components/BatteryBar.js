import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Icon from "./Icon";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center"
    }
});

const Locker = ({ charging, large, percent, style }) => {
    const scale = large ? 3 : 1;
    return (
        <View style={StyleSheet.compose(styles.container, style)}>
            <Icon 
                icon={charging ? "charging" : "battery"}
                size={Math.round(24 * scale)}
            />
            <Text
                style={{
                    marginLeft: 12,
                    fontSize: Math.round(18 * scale)
                }}
            >
                {Math.round(percent)} %
            </Text>
        </View>
    )
}
export default Locker;
