import {ConnectionManager} from "ConnectionManager";

export class TokenManager
{
	private _connectionManager: ConnectionManager;

	constructor(connectionManager: ConnectionManager)
	{
		this._connectionManager = connectionManager;
	}

	private _token: number[];
	private _onTokenResolveArray: ((token: number[]) => void)[] = [];

	private getToken = () => new Promise(resolve => {
		if (this._token)
		{
			resolve(this._token);
		}
		else
		{
			this._onTokenResolveArray.push(resolve);
		}
	})

	public async writeWithToken(data: number[], startByte?: number)
	{
		const token = await this.getToken();
		if (!startByte && startByte !== 0)
		{
			startByte = 4;
		}

		data[startByte + 0] = this._token[0];
		data[startByte + 1] = this._token[1];
		data[startByte + 2] = this._token[2];
		data[startByte + 3] = this._token[3];

		return await this._connectionManager.write(data);
	}

	public handleMessage(data: number[])
	{
		if(data[0] != 1)
		{
            return;
		}
        this._token = data.slice(3, 7);

        const resolvers = [...this._onTokenResolveArray];
        this._onTokenResolveArray = [];
        for (const resolve of resolvers)
		{
            resolve(this._token);
		}
	}

	public async postInit()
	{
		await this._connectionManager.write([1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	}
}