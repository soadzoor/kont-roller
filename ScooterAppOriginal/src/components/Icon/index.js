import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

const icons = {
    "pen": require("./pen.png"),
    "left-arrow": require("./left-arrow.png"),
    "bulb-on": require("./bulb-on.png"),
    "bulb-off": require("./bulb-off.png"),
    "lock": require("./lock.png"),
    "unlock": require("./unlock.png"),
    "battery": require("./battery.png"),
    "charging": require("./charging.png"),
    "settings": require("./settings.png"),
}

const Icon = ({ onClick, icon, style, size, containerStyle }) => {
    const imageComponent = (
        <Image 
            source={icons[icon]}
            style={StyleSheet.compose({
                width: style?.width || size || 24,
                height: style?.height || size || 24
            }, style)}
            resizeMode="contain"
        />
    );

    if(onClick)
        return (
            <TouchableOpacity onPress={onClick} style={containerStyle}>
                {imageComponent}
            </TouchableOpacity>
        )
    return imageComponent;
}

export default Icon;
