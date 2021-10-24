import React from "react";
import { Text, StyleSheet, TouchableHighlight } from "react-native";

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 5,
        backgroundColor: "#bdbdbd",
        fontSize: 22
    }
})

const ListItem = ({onPress, children, style}) => (
    <TouchableHighlight onPress={onPress} style={style}>
        <Text style={styles.item} >
            {children}
        </Text>
    </TouchableHighlight>
)

export default ListItem;