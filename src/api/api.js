
const api = {
    login: "/mobile/user/login",
    logout: "/mobile/logout",
    signin: '/mobile/user/signin',
    getInfo: '/mobile/info',
    infodriver: '/mobile/user/infodriver',
    subscribeToTopic: 'mobile/subscribeToTopic',
    getInfoApp: "/mobile/AppInfo",
    TYPE_CAR: {
        getall: '/mobile/typecar/getall',
    },
    PRICE_TIME_SLOT: {
        getall: '/mobile/pricetimeslot/getall',
    },
    NOTIFICATION: {
        getall: '/mobile/notify/getall',
        read: '/mobile/notify/read',
        count: '/mobile/notify/count',
    },
    SERVICE_ATTACH: {
        getall: '/mobile/serviceattach/getall',
    },
    HISTORY: {
        history: "/mobile/order/history"
    },
    ORDER: {
        getall: "/mobile/order/getall",
        create: '/mobile/order/create',//Tạo chuyến
        rate: '/mobile/order/rate',
        delete: '/mobile/order/delete',//huy chuyen
        orderunfinished: '/mobile/user/orderunfinished',
        info: '/mobile/order/info',
    },
    UPLOAD: {
        fileupload: "/admin/fileupload"
    },
    UPDATE_INFO: {
        updateinfo: '/mobile/updateinfo'
    },
    near: '/mobile/driver/near',
}

export default api