import { AsyncStorage } from "react-native";

const extensions = [
    require("./connection"),
    require("./led"),
    require("./lock"),
    require("./battery"),
    require("./currentSpeed"),
    require("./fetchState"),
    require("./transport"),
    require("./nonZeroStart"),
    require("./cruise"),
    require("./token"),
];

const createApi = async (ble, onChange) => {
    const mac = await ble.getMac();
    console.log(mac)
    if(!mac)
        return null;

    const _extensions = extensions.map(x => ({
        state: {},
        extension: x
    }));
    const api = {
        mac, ble,
        onChange,
        handleMessage: (data) => {
            for(const extension of _extensions)
                extension.extension?.handleMessage?.call?.(api, data, extension.state);
        },
        setState: (value) => {
            Object.assign(api.exports, value);
            onChange?.();
        },
        exports: {}
    };

    for(const extension of _extensions)
        await extension.extension?.init?.call?.(api, extension.state);

    for(const extension of _extensions)
        await extension.extension?.postInit?.call?.(api, extension.state);

    return api.exports;
}

module.exports = createApi;