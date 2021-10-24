module.exports = {
    handleMessage(data, state) {
        if(data[0] == 2 && data[1] == 2 && data[3]) {
            this.setState({ nonZeroStart: !(data[4] & (1 << 2)) });
        }
        if(data[0] == 2 && data[1] == 5) {
            this.setState({ nonZeroStart: state.current });
        }
    },
    init(state) {
        this.exports.nonZeroStart = false;
        state.current = false;
        this.exports.nonZeroStartOn = async () => {
            await this.writeWithToken([ 2, 5, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ]);
            state.current = true;
        };
        this.exports.nonZeroStartOff = async () => {
            await this.writeWithToken([ 2, 5, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ]);
            state.current = false;
        };
    },
}