module.exports = {
    handleMessage(data, state) {
        if(data[0] == 4 && data[1] == 10) {
            this.setState({ transport: data[3] == 1 });
        }
        if(data[0] == 4 && data[1] == 1) {
            this.setState({ transport: state.current });
        }
    },
    init(state) {
        this.exports.transport = false;
        state.current = false;
        this.exports.transportOn = async () => {
            await this.writeWithToken([ 4, 1, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ]);
            state.current = true;
        };
        this.exports.transportOff = async () => {
            await this.writeWithToken([ 4, 1, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ]);
            state.current = false;
        };
    },
}