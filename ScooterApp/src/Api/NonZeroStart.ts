import {IApi, IExtension} from "./types";

export class NonZeroStart implements IExtension
{
    public init(api: IApi)
    {
        api.exports.nonZeroStart = false;
        api.exports.nonZeroStartOn = async () =>
        {
            await api.writeWithToken([2, 5, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.setState({
                nonZeroStart: true
            });
        };
        api.exports.nonZeroStartOff = async () =>
        {
            await api.writeWithToken([2, 5, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.setState({
                nonZeroStart: false
            });
        };
    }

    public handleMessage(api: IApi, data: Uint8Array)
    {
        if (data[0] == 2 && data[1] == 2 && data[3])
        {
            const newValue: boolean = data[4] === 68; // Based on my tests, this value is either 64 or 68
            api.setState({
                nonZeroStart: newValue
            });
        }
    }
}