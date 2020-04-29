import Vue from 'vue'
const Toast  = {
    error: (message) => {

        return Vue.$bvToast.toast(
            message,
            {
                title: 'ERROR',
                variant: 'danger'
            }
        )
    },
    success: (message) => {
        return Vue.$bvToast.toast(
            message,
            {
                autoHideDelay: 2000
            }
        )
    },
}

export default Toast