import React, { Component } from "react";
// import {
//     AsyncStorage,
// } from "react-native";
import AsyncStorage from "@react-native-community/async-storage"
import { observable, action } from "mobx";
import {
    config,
    values,
    api,
} from "../config";
import _ from 'lodash'
import async from 'async';
import SimpleToast from "react-native-simple-toast";
import moment from 'moment'
import { PostNoToken, PostWithToken } from "../config/request";

const status = { success: 'success', fail: 'fail' }
class OnApp {
    @observable isConnect = false;
    //Trạng thái luồng ứng dụng; đang ở màn nào
    @observable screenCurrent = null;
    @observable numberOfNotification = 0;
    @observable dataNotif = [];
    @action setDataNoti(dataNoti) {
        this.dataNoti = dataNoti
        console.log("setDataNoti", dataNoti)
    }

    @action seenNotif(index) {
        this.dataNotif[index].status = 1
    }

    @action
    clearDataNotif() {
        this.dataNotif = [];
    }

    @action
    subscribeToTopic(fcmId) {
        PostNoToken(api.subscribeToTopic, {
            "type": "user",
            "fcmId": fcmId
        }, (data, status) => {
            console.log('subscribeToTopic: ' + JSON.stringify(data))
        })
    };

    @action
    getAllNotifi(token, dataOld, page, callback) {
        let json = { "page": page }
        if (token) {
            PostWithToken(api.NOTIFICATION.getall, json, token, (data, status) => {
                // console.log('2json: ' + JSON.stringify(json) + ' data: ' + JSON.stringify(data))
                if (status) {
                    if (data.ResponseCode) {
                        if (_.size(data.data) > 0) {
                            this.dataNotif = [...dataOld, ...data.data]
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
                    callback &&
                        callback(false)
                }
            })
        } else {
            PostNoToken(api.NOTIFICATION.getall, json, (data, status) => {
                console.log('1json: ' + JSON.stringify(json) + ' data: ' + JSON.stringify(data))
                if (status) {
                    if (data.ResponseCode) {
                        if (_.size(data.data) > 0) {
                            this.dataNotif = [...dataOld, ...data.data]
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
                    callback &&
                        callback(false)
                }
            })
        }
    }

    @action
    readNotif(notiId, token, callback = null) {
        PostWithToken(api.NOTIFICATION.read, { "notiId": notiId }, token, (data, status) => {
            console.log('read: ' + JSON.stringify(data))
        })
    }

    @action
    countNotif(token) {
        if (token) {
            PostWithToken(api.NOTIFICATION.count, {}, token, (data, status) => {
                console.log('count: ' + JSON.stringify(data))
                if (status) {
                    if (data.ResponseCode) {
                        this.numberOfNotification = data.data.total;
                        // FCM.setBadgeNumber(parseInt(data.data.total + ''));
                    } else {
                        SimpleToast.show(data.ResponseText)
                    }
                } else {
                    SimpleToast.show('Lỗi kết nối.Vui lòng kiểm tra lại')
                }
            })
        }
    }


}

export default new OnApp();
