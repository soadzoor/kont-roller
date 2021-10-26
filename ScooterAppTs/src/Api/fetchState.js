module.exports = {
    init() {
        this.fetch_ctr_state = async () => {
            await this.writeWithToken([ 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
        }
        this.fetch_cfg_state = async () => {
            await this.writeWithToken([ 4, 10, 1, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0 ]);
        }
    },
    handleMessage(data) {
        if(data[0] == 2 && data[1] == 2)
            this.fetch_cfg_state();
    },
    postInit() {
        this.fetch_ctr_state();
    }
}