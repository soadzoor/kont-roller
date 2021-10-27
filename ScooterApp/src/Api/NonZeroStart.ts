import {IApi, IExtension} from "./types";

export class NonZeroStart implements IExtension
{
    public init(api: IApi)
    {
        api.exports.nonZeroStart = false;
        api.exports.nonZeroStartOn = async () =>
        {
            await api.writeWithToken([2, 5, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.exports.nonZeroStart = true;
        };
        api.exports.nonZeroStartOff = async () =>
        {
            await api.writeWithToken([2, 5, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
            api.exports.nonZeroStart = false;
        };
    }

    public handleMessage(api: IApi, data: Uint8Array)
    {
        if (data[0] == 2 && data[1] == 2 && data[3])
        {
            api.setState({
                nonZeroStart: !(data[4] & (1 << 2))
            });
        }

        if (data[0] == 2 && data[1] == 5)
        {
            api.setState({
                nonZeroStart: api.exports.nonZeroStart
            });
        }
    }
}