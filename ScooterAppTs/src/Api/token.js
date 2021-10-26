module.exports = {
    init(state) {
        state.onToken = [];
        this.exports.token = null;
        this.exports.getToken = () => new Promise(resolve => {
            if(this.exports.token)
                resolve(this.exports.token);
            else
                state.onToken = [...state.onToken, resolve];
        })
        this.writeWithToken = async (data, startByte) => {
            const token = await this.exports.getToken();
            if(!startByte && startByte !== 0)
                startByte = 4;

            data[startByte + 0] = token[0];
            data[startByte + 1] = token[1];
            data[startByte + 2] = token[2];
            data[startByte + 3] = token[3];

            return await this.write(data);
        }
    },
    handleMessage(data, state) {
        if(data[0] != 1)
            return;
        this.exports.token = data.slice(3, 7);

        const resolvers = [...state.onToken];
        state.onToken = [];
        for(const resolve of resolvers)
            resolve(this.exports.token);
    },
    postInit() {
        this.write([1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
}