import aesJs from "aes-js";

export class ConnectionManager
{
    private _mac: string;
    private _key: string; // BLE key
    private _aes: aesJs.ModeOfOperation.ModeOfOperationECB;
    private _ble: BluetoothRemoteGATTCharacteristic;

    constructor(mac: string, ble: BluetoothRemoteGATTCharacteristic)
    {
        this._mac = mac;
        this._ble = ble;
    }

    public async init()
    {
        await this.getKey();
        this._aes = new aesJs.ModeOfOperation.ecb(aesJs.utils.hex.toBytes(this._key));
    }

    private async getKey()
    {
        if (!this._key)
        {
            /*const urlMac = this._mac.split(":").reverse().join(":");
            const response = await fetch(`https://dev.picasau.com/VehicleSystem/vehicle/checkDataForMac?mac=${urlMac}`)
            const jsonData = await response.json();
    
            this._key = jsonData.bleKey;*/
            this._key = "20572F52364B3F473050415811632D2B";
        }

        return this._key;
    }

    public async write(data: number[])
    {
        await this._ble.writeValue(new Uint8Array(this._aes.encrypt(data)));
    }
}