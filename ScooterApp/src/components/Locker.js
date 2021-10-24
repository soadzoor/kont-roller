import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "./Icon";

const styles = StyleSheet.create({
    container: {
        borderRadius: 150,
        borderColor: "#727272",
        borderWidth: 2,
        padding: 64
    }
});

const Locker = ({ onClick, locked, style }) => {
    return (
        <TouchableOpacity
            style={StyleSheet.compose(style)}
            onPress={onClick}
            activeOpacity={0.6}
        >
            <View style={StyleSheet.compose(styles.container)}>
                <Icon
                    icon={locked ? "lock" : "unlock"}
                    size={64}
                />
            </View>
        </TouchableOpacity>
    )
}

export default Locker;
