import React from "react";
import { Text, Switch, StyleSheet, View, TouchableWithoutFeedback } from "react-native";

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 5,
        backgroundColor: "#bdbdbd",
        flexDirection: "row",
        alignItems: "center"
    },
    label: {
        fontSize: 22,
        flexGrow: 1
    },
    value: {
        fontSize: 20,
        color: "#424242"
    }
})

const ValueSetting = ({onChange, value, children, style}) => (
    <TouchableWithoutFeedback onPress={onChange}>
        <View style={StyleSheet.compose(styles.container, style)}>
            <Text style={styles.label}>
                {children}
            </Text>
            <Text style={styles.value}>
                {value}
            </Text>
        </View>
    </TouchableWithoutFeedback>
)

export default ValueSetting;