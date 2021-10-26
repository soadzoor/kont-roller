import {IApi, IExtension} from "./types";

export class FetchState implements IExtension
{
    public init(api: IApi)
    {
        api.fetch_ctr_state = async () =>
        {
            await api.writeWithToken([2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
        api.fetch_cfg_state = async () =>
        {
            await api.writeWithToken([4, 10, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
        }
    }

    public handleMessage(api: IApi, data: Uint8Array)
    {
        if (data[0] == 2 && data[1] == 2)
        {
            api.fetch_cfg_state();
        }
    }

    public postInit(api: IApi)
    {
        api.fetch_ctr_state();
    }
}