import React from "react";
import { Text, Switch, StyleSheet, View } from "react-native";

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
    }
})

const SwitchSetting = ({onChange, value, children, style}) => (
    <View style={StyleSheet.compose(styles.container, style)}>
        <Text style={styles.label} >
            {children}
        </Text>
        <Switch 
            onValueChange={onChange} 
            value={value} 
            thumbColor="#212121" 
            trackColor={{false: "#929292", true: "#929292"}}
        />
    </View>
)

export default SwitchSetting;