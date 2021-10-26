import {IApi, IExports, IExtension} from "./types";

export class Token implements IExtension
{
    public state: {onToken: ((value: Uint8Array | PromiseLike<Uint8Array>) => void)[]} = {onToken: []};

    public init(api: IApi)
    {
        this.state.onToken = [];
        api.exports.token = null;
        api.exports.getToken = () => new Promise<Uint8Array>((resolve, reject) =>
        {
            if (api.exports.token)
            {
                resolve(api.exports.token as Uint8Array);
            }
            else
            {
                this.state.onToken = [...this.state.onToken, resolve];
            }
        })
        api.writeWithToken = async (data: Uint8Array | number[], startByte?: number) =>
        {
            const token = await ((api.exports as IExports).getToken());
            if (!startByte && startByte !== 0)
            {
                startByte = 4;
            }

            data[startByte + 0] = token[0];
            data[startByte + 1] = token[1];
            data[startByte + 2] = token[2];
            data[startByte + 3] = token[3];

            return api.write(data);
        }
    }

    public handleMessage(api: IApi, data: Uint8Array)
    {
        if (data[0] != 1)
        {
            return;
        }
        api.exports.token = data.slice(3, 7);

        const resolvers = [...this.state.onToken];
        this.state.onToken = [];
        for (const resolve of resolvers)
        {
            resolve(api.exports.token);
        }
    }

    public postInit(api: IApi)
    {
        api.write([1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
}