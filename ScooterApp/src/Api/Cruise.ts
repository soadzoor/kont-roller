import {IApi, IExtension} from "./types";

export class Cruise implements IExtension
{
    public handleMessage(api: IApi, data: Uint8Array)
    {
        if (data[0] == 2 && data[1] == 2 && data[3])
        {
            api.setState({
                cruise: !!(data[4] & (1 << 3))
            });
        }
        if (data[0] == 2 && data[1] == 6)
        {
            api.setState({
                cruise: api.exports.cruise
            });
        }
    }

    public init(api: IApi)
    {
        api.exports.cruise = false;
        api.exports.cruiseOn = async () =>
        {
            await api.writeWithToken([2, 6, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.exports.cruise = true;
        };
        api.exports.cruiseOff = async () =>
        {
            await api.writeWithToken([2, 6, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.exports.cruise = false;
        };
    }
}