module.exports = {
    init() {
        this.exports.currentSpeed = 0;
    },
    handleMessage(data) {
        if(data[0] == 7 && data[1] == 1) {
            this.setState({
                currentSpeed: data[4]
            })
        }
    },
}