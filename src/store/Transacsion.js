import { observable, action } from "mobx";
import _ from 'lodash'
import SimpleToast from "react-native-simple-toast";
import { PostWithToken } from "../config/request";
import { api } from "../config";
class Transaction {
    // @observable transaction = [
    //     {
    //         from: 'Nhà C Khu công nghiệp Cao Hòa Lạc',
    //         to: 'CGV IPH, Xuân Thủy',
    //         comment: 'Đồ dễ vỡ.',
    //         carType: 'Xe thương binh',
    //         bx: '29c0635',
    //         id: 'BG10111',
    //         serviceExtra: true,
    //         date: 1536334134000
    //     }
    // ];
    @observable transaction = [];
    @action
    clearDataHistory() {
        this.transaction = []
    }
    @action getHistory(token, page, dataOld, callback = null) {
        // console.log("pageeeeeeeeeeeeeeeeeeeee", page)
        // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmY21JZCI6IjEyMzEiLCJpZCI6MTYsInR5cGUiOjAsInVzZXJUeXBlIjoyLCJzdGF0dXMiOjAsImlhdCI6MTU0MDIyMjgzNn0.Be4q2bpxNeo_SefFksdFxnZvEwCu25AwOpOQl9dIPV0'
        PostWithToken(api.HISTORY.history, { page: page }, token, (data, status) => {

            console.log('data' + JSON.stringify(data))
            if (status) {
                if (data.ResponseCode) {
                    if (_.size(data.data) > 0) {
                        this.transaction = [...dataOld, ...data.data]
                        callback &&
                            callback(true)
                    } else {
                        callback &&
                            callback(false)
                    }
                } else {
                    SimpleToast.show(data.ResponseText)
                    callback &&
                        callback(false)
                }
            } else {
                SimpleToast.show('Có lỗi xảy ra. Vui lòng kiểm tra lại')
                callback && callback(false)
            }
        })

    }
}

export default new Transaction();