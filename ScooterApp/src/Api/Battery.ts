import {IApi, IExtension} from "./types";

export class Battery implements IExtension
{
    public state = {};

    public init(api: IApi)
    {
        api.exports.battery = 0;
        api.exports.charging = false;
    }

    public handleMessage(api: IApi, data: Uint8Array)
    {
        if (data[0] == 1)
        {
            api.setState({battery: data[10]});
        }

        if (data[0] == 7 && data[1] == 1)
        {
            api.setState({
                battery: data[7],
                charging: 5 == ((data[10] & 0x70) >> 4)
            });
        }
    }
}