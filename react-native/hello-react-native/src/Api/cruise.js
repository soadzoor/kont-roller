module.exports = {
    handleMessage(data, state) {
        if(data[0] == 2 && data[1] == 2 && data[3]) {
            this.setState({ cruise: !!(data[4] & (1 << 3)) });
        }
        if(data[0] == 2 && data[1] == 6) {
            this.setState({ cruise: state.current });
        }
    },
    init(state) {
        this.exports.cruise = false;
        state.current = false;
        this.exports.cruiseOn = async () => {
            await this.writeWithToken([ 2, 6, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ]);
            state.current = true;
        };
        this.exports.cruiseOff = async () => {
            await this.writeWithToken([ 2, 6, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ]);
            state.current = false;
        };
    },
}