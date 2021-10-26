import {IApi, IExtension} from "./types";

export class Transport implements IExtension
{
    public init(api: IApi)
    {
        api.exports.transport = false;
        api.exports.transportOn = async () =>
        {
            await api.writeWithToken([4, 1, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.exports.transport = true;
        };
        api.exports.transportOff = async () =>
        {
            await api.writeWithToken([4, 1, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.exports.transport = false;
        };
    }

    public handleMessage(api: IApi, data: Uint8Array)
    {
        if (data[0] == 4 && data[1] == 10)
        {
            api.setState({
                transport: data[3] == 1
            });
        }
        if (data[0] == 4 && data[1] == 1)
        {
            api.setState({
                transport: api.exports.transport
            });
        }
    }
}