import React, { Component } from "react";
// import {
//   AsyncStorage,
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
import { PostNoToken, PostWithToken, GetWithToken } from "../config/request";
const status = { success: 'success', fail: 'fail' }
class User {
  @observable token = '';
  @observable fcmId = '';
  @observable userInfo = {};
  @observable isTheFirst = false;
  @observable isLogin = false;
  @observable rootNavigator = null;


  @action setUserInfo(data) {
    this.userInfo = data
  }
  @action setToken(token) {
    this.token = token
  }
  @action setAvatar(value) {
    this.userInfo.avatar = value
  }
  @action setPhone(value) {
    this.userInfo.phone = value
  }
  @action setFullname(value) {
    this.userInfo.fullname = value
  }

  @action
  login(json, callback = null) {
    // console.log('json: login ' + JSON.stringify(json))
    PostNoToken(api.login, json, (data, status) => {
      if (status) {
        if (data.ResponseCode) {
          // console.log('data: ' + JSON.stringify(data))
          this.token = data.data.token;
          AsyncStorage.setItem('token', data.data.token);
          this.getUserInfo()
          callback && callback(data.data, true)
        } else {
          callback && callback([], false)
        }
      } else {
        callback && callback([], false)
        SimpleToast.show('Có lỗi xảy ra. Vui lòng thử lại.')
      }
    })
  }

  @action
  getUserInfo(callback = null) {

    // GetWithToken(api.getInfo, this.token, (data, status) => {
    //   console.log('getInfo ' + JSON.stringify(data))
    // })
    // console.log("GetUserrrrrrrr")

    GetWithToken(api.getInfo, this.token, (data, status) => {
      // console.log('getInfo ' + JSON.stringify(data))
      if (status) 
      {
        if (data.ResponseCode) {
          this.userInfo = data.data
          callback && callback(true)
        } else {
          callback && callback(false)
        }
      } else {
        callback && callback(false)
        SimpleToast.show('Có lỗi xảy ra. Vui lòng thử lại.')
      }
    })


  }


  @action
  updateInfo(json, callback = null) {
    PostWithToken(api.UPDATE_INFO.updateinfo, json, this.token, (data, status) => {
      console.log('dâtL: ' + JSON.stringify(data))
      if (status) {
        if (data) {
          if (data.ResponseCode) {
            this.getUserInfo((status) => { })
            callback && callback(true);
          } else {
            callback && callback(true);
            SimpleToast.show(data.ResponseText)
          }
        }

      } else {
        SimpleToast.show('Có lỗi xảy ra.')
      }
    })
  }

  @action
  logout() {
    PostWithToken(api.logout, {}, this.token, (data, status) => {
      console.log('data: ' + JSON.stringify(data))
      if (status) {
      }
    })
    this.token = '';
    this.fcmId = '';
    this.userInfo = {};
    this.isTheFirst = false;
    // FCM.setBadgeNumber(0);
    this.isLogin = false;
    this.rootNavigator = null;
    let key = ['token', 'isTheFirst', 'fcmId']
    AsyncStorage.multiRemove(key)

  }

  //   @action 
  //   updateInfo(){

  //   }

  // }
  // @action 
  // updateInfo() {

  // }

  // @action
  // updateInfo() {

  // }

}

export default new User();
