module.exports = {
    init() {
        this.exports.battery = 0;
        this.exports.charging = false;
    },
    handleMessage(data) {
        if(data[0] == 1) {
            this.setState({ battery: data[10] })
        }
        if(data[0] == 7 && data[1] == 1) {
            this.setState({
                battery: data[7],
                charging: 5 == ((data[10] & 0x70) >> 4)
            })
        }
    },
}