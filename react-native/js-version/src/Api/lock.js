module.exports = {
    handleMessage(data, state) {
        console.log(data)
        if(data[0] == 1 && data[1] == 1)
            this.setState({ locked: data[9] != 0 });

        if(data[0] == 7 && data[1] == 1 && data[3] == 1)
            this.setState({ locked: !!(1 & data[6]) });

        if(data[0] == 2 && data[1] == 11)
            this.setState({ wheelLocked: state.wheelLocked });

        if(data[0] == 2 && data[1] == 12)
            this.setState({ batteryLocked: state.batteryLocked });
    },
    init(state) {
        this.exports.locked = true;
        this.exports.lock = async () => {
            await this.writeWithToken([2, 3, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
        };
        this.exports.unlock = async () => {
            await this.writeWithToken([2, 3, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
        };

        this.exports.batteryLocked = false;
        state.batteryLocked = false;
        this.exports.batteryLock = async () => {
            await this.writeWithToken([ 2, 12, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ]);
            state.batteryLocked = true;
        };
        this.exports.batteryUnlock = async () => {
            await this.writeWithToken([ 2, 12, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ]);
            state.batteryLocked = false;
        };

        this.exports.wheelLocked = false;
        state.wheelLocked = false;
        this.exports.wheelLock = async () => {
            await this.writeWithToken([ 2, 11, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ]);
            state.wheelLocked = true;
        };
        this.exports.wheelUnlock = async () => {
            await this.writeWithToken([ 2, 11, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ]);
            state.wheelLocked = false;
        };
    },
}