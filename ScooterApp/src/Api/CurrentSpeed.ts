import {IApi, IExtension} from "./types";

export class CurrentSpeed implements IExtension
{
    public init(api: IApi)
    {
        api.exports.currentSpeed = 0;
    }

    public handleMessage(api: IApi, data: Uint8Array)
    {
        if (data[0] == 7 && data[1] == 1)
        {
            api.setState({
                currentSpeed: data[4]
            })
        }
    }
}