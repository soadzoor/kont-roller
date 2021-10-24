module.exports = {
    handleMessage(data) {
        if(data[0] == 7 && data[1] == 1)
            this.setState({ led: !!(data[6] & 128) })
    },
    init() {
        this.exports.led = false;
        this.exports.ledOn = async () => {
            await this.writeWithToken([2, 9, 1, 1, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
        };
        this.exports.ledOff = async () => {
            await this.writeWithToken([2, 9, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0]);
        };
    },
}