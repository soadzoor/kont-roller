import {IApi, IExports, IExtension} from "./types";

export class Lock implements IExtension
{
    public init(api: IApi)
    {
        api.exports.locked = true;
        api.exports.lock = async () =>
        {
            await api.writeWithToken([2, 3, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
        };
        api.exports.unlock = async () =>
        {
            await api.writeWithToken([2, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
        };

        api.exports.batteryLocked = false;
        api.exports.batteryLock = async () =>
        {
            await api.writeWithToken([2, 12, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.exports.batteryLocked = true;
        };
        api.exports.batteryUnlock = async () =>
        {
            await api.writeWithToken([2, 12, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.exports.batteryLocked = false;
        };

        api.exports.wheelLocked = false;

        api.exports.wheelLock = async () =>
        {
            await api.writeWithToken([2, 11, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.exports.wheelLocked = true;
        };
        api.exports.wheelUnlock = async () =>
        {
            await api.writeWithToken([2, 11, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.exports.wheelLocked = false;
        };
    }

    public handleMessage(api: IApi, data: Uint8Array)
    {
        console.log(data)

        if (data[0] == 1 && data[1] == 1)
        {
            api.setState({locked: data[9] != 0});
        }

        if (data[0] == 7 && data[1] == 1 && data[3] == 1)
        {
            api.setState({locked: !!(1 & data[6])});
        }

        if (data[0] == 2 && data[1] == 11)
        {
            api.setState({wheelLocked: api.exports.wheelLocked});
        }

        if (data[0] == 2 && data[1] == 12)
        {
            api.setState({batteryLocked: api.exports.batteryLocked});
        }
    }
}