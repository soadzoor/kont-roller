import {IApi, IExtension} from "./types";

export class Transport implements IExtension
{
    public init(api: IApi)
    {
        api.exports.transport = false;
        api.exports.transportOn = async () =>
        {
            await api.writeWithToken([4, 1, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.setState({
                transport: true
            });
        };
        api.exports.transportOff = async () =>
        {
            await api.writeWithToken([4, 1, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.setState({
                transport: false
            });
        };
    }

    public handleMessage(api: IApi, data: Uint8Array)
    {
        // [4, 10, 7, 0, 1, 30, 5, 20, 18, 0, 82, 67, 193, 184, 0, 0]
        // vs
        // [4, 10, 7, 1, 1, 30, 5, 20, 18, 0, 242, 200, 46, 229, 0, 0]
        if (data[0] === 4 && data[1] === 10 && data[2] === 7)
        {
            api.setState({
                transport: data[3] === 1
            });
        }
    }
}