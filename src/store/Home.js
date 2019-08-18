
import React, { Component } from 'react';
// import { AsyncStorage } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage"
import { observable, action,toJS } from "mobx";
import SimpleToast from "react-native-simple-toast";
import { values, config, api } from '../config';
import _ from 'lodash'
import async from 'async';
import moment from 'moment'
import screenId from '../config/screenId';
import { GetNoToken, PostWithToken, PostNoToken, GetWithToken } from '../config/request';
import { getPositionListDirection, getPositionListDirectionLegs } from '../utils/Func';
const status = { success: 'success', fail: 'fail' }
var arrInfoPrice=[];
class Home {


    //toa do
    @observable myPosition = (values.POSITION_DEFAULT);
    @observable markerMe = values.MARKER_ME_DEFAULT;

    @observable listCoords = [];
    @observable listTypeCar = [];
    @observable listTypeCarChooseCar = [];
    @observable hotline = '';
    @observable linkGuide = '';
    @observable listCarAvailable = [
        // {
        //     id: 0, type: 'bagac', listCoords: [
        //         { "latitude": 21.036572, "longitude": 105.805550 },
        //         { "latitude": 21.026573, "longitude": 105.762119 },
        //     ]
        // },
        // {
        //     id: 1, type: 'bantai', listCoords: [
        //         { "latitude": 21.040032, "longitude": 105.815849 }
        //     ]
        // },
        // {
        //     id: 2, type: 'xetai', listCoords: [
        //         { "latitude": 21.004459, "longitude": 105.793018 }
        //     ]
        // }
    ]
    @observable listCarAvailableWithXType = [];
    @observable arrInfoPrice = [];
    @observable step = 1;
    @observable indexArray = 0;
    @observable rotateMarkerDirect = 0;
    @observable coordDirection = values.MARKER_ME_DEFAULT;//vị trí hiện tại

    @observable serviceAttach = [];

    //Trạng thái màn hình Home
    @observable screenType = screenId.HOME.screenType.start;
    @observable isShowChooseCar = false;
    @observable isShowVote = false;
    @observable isShowCancel=false;
    @observable showExtraService = { isShow: false, selected: null };
    @observable isShowEnterPhone = false;
    @observable itemTypeCarSelected = [];

    //đơn hàng hiện tại
    @observable currentOrder = null;//thông tin đơn hàng khi tạo xong=> có orderId
    @observable cancelOrder = null;
    @observable tripDistance = null;
    @observable tripDuration = null;
    @observable isStartCheck = false;
    @observable isEndCheck = false;
    @observable isStartDefault = true;
    
    @observable infoDriver = {
        duration: '2800',
        id_cad: '29M1 - 20120',
        avatar: 'http://sohanews.sohacdn.com/thumb_w/660/2016/img-5806-1467775479971.JPG',
        fullname: 'Trần Minh Tuấn',
        vote: 4,
        phone: '01296100196',
        coodinate: {
            "latitude": 21.019830,
            "longitude": 105.796282
        },
    }

    @action
    setInFoTrip(duration, distance) {
        this.tripDistance = distance;
        this.tripDuration = duration;
    }

    @action
    updateItemTypeCarSelected(value) {
        this.itemTypeCarSelected = value;
    }
    @action
    updatePosition(latitude, longitude) {

        //update Position
        let newPos = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: this.myPosition.latitudeDelta,
            longitudeDelta: this.myPosition.longitudeDelta
        }
        this.myPosition = newPos;
    }

    @action
    resetToHome() {
        this.screenType = screenId.HOME.screenType.start;
        this.itemTypeCarSelected = [];
        this.showExtraService = { isShow: false, selected: null }
        this.listCoords = [];
        this.listTypeCarChooseCar = this.listTypeCar;
        this.currentOrder = null;
        this.infoDriver = {};
        this.tripDistance = null;
        this.tripDuration = null;
        let key = ['screenType', 'screenType', 'currentOrder']
        AsyncStorage.multiRemove(key)


        let newPos = {
            latitude: this.markerMe.latitude,
            longitude: this.markerMe.longitude,
            latitudeDelta: this.myPosition.latitudeDelta,
            longitudeDelta: this.myPosition.longitudeDelta
        }
        this.myPosition = newPos;
    };

    @action
    setListCoords(coords) {
        this.listCoords = coords;
        listCoordsBK = coords;
        if (_.size(this.listCoords) > 40) {
            this.step = Math.floor(_.size(this.listCoords) / 40);
        }
    }

    @action
    updateCoordMarkerDirect(coord) {
        this.coordDirection = coord
    }

    @action
    updateRotateCoordMarkerDirect(newRotate) {
        this.rotateMarkerDirect = newRotate - 90;
    }

    @action
    resetPlayBack() {
        this.indexArray = 0;
        this.rotateMarkerDirect = 0;
    }

    @action
    saveInfoTrip(values) {
        //lưu lại màn hình : đang tìm xe; xe đang đến
        AsyncStorage.setItem('screenType', this.screenType)
        this.currentOrder = values
        //lưu lại thông tin đơn hàng
        console.log('--this.currentOrder: ' + JSON.stringify(this.currentOrder))
        AsyncStorage.setItem('currentOrder', JSON.stringify(values))
        AsyncStorage.setItem('screenType', (this.screenType + ''))
        //lưu lại thông tin của tài xế nếu đang là xe đang đến

        //Lưu lại thông tin 
    }

    @action
    getNearDriver(token, callback = null) {
        let json = { lat: this.markerMe.latitude, log: this.markerMe.longitude }
        console.log(json,token,"json token");
        if (token) {
            PostWithToken(api.near, json, token, (data, status) => {
                console.log('data near: ' + JSON.stringify(data))
                if (status) {
                    if (data && _.size(data) > 0) {
                        if (data.ResponseCode == 1) {
                            if (_.size(data.data) > 0) {
                                this.listCarAvailable = data.data;

                                callback && callback(true)
                            } else {
                                callback && callback(true)
                            }

                        } else {
                            callback && callback(false)
                            SimpleToast.show(data.ResponseText)
                        }
                    } else {
                        callback && callback(false)
                        SimpleToast.show(data.ResponseText)
                    }
                } else {
                    callback && callback(false)
                    SimpleToast.show("Lỗi kết nối. Vui lòng kiểm tra lại!")
                }
            })
        } else {
            PostNoToken(api.near, json, (data, status) => {
                console.log('data near: ' + JSON.stringify(data))
                if (status) {
                    if (data && _.size(data) > 0) {
                        if (data.ResponseCode == 1) {
                            if (_.size(data.data) > 0) {
                                this.listCarAvailable = data.data;
                                callback && callback(true)
                            } else {
                                callback && callback(true)
                            }
                        } else {
                            callback && callback(false)
                            SimpleToast.show(data.ResponseText)
                        }
                    } else {
                        callback && callback(false)
                        SimpleToast.show(data.ResponseText)
                    }
                } else {
                    callback && callback(false)
                    SimpleToast.show("Lỗi kết nối. Vui lòng kiểm tra lại!")
                }
            })
        }
    }

    @action
    getServiceAttach(token, callback = null) {
        let json = {
            "typeCarId": this.itemTypeCarSelected.id
        };
        PostWithToken(api.SERVICE_ATTACH.getall, json, token, (data, status) => {
            console.log('data SERVICE_ATTACH: ' + JSON.stringify(data))
            if (status) {
                if (data && data.ResponseCode) {
                    if (data.data) {
                        this.serviceAttach = data.data;
                    }
                    callback && callback(true)
                }
            } else {
                callback && callback(false)
                console.log('co loi xay ra getServiceAttach')
            }
        })
    };

    @action
    getPriceTimeSlot(typeCarId,distanceKm, callback = null) {
        let json = {
            typeCarId: typeCarId,
            // time: moment(1538995530000).format('HH:mm')
            time: moment(new Date).format('HH:mm'),
            distance:distanceKm
        }
        console.log('json getPriceTimeSlot: ' + JSON.stringify(json))
        PostNoToken(api.PRICE_TIME_SLOT.getall, json, (data, status) => {
            console.log('data PRICE_TIME_SLOT:' + JSON.stringify(data))
            if (status) {
                if (data && _.size(data) > 0) {
                    if (data.ResponseCode == 1) {
                        if (_.size(data.data) > 0) {
                            callback && callback(data.data.price, true)
                        } else {
                            callback && callback(0, true)
                        }

                    } else {
                        callback && callback(0, false)
                        SimpleToast.show(data.ResponseText)
                    }
                } else {
                    callback && callback(0, false)
                    SimpleToast.show(data.ResponseText)
                }
            } else {
                callback && callback(0, false)
                SimpleToast.show("Lỗi kết nối. Vui lòng kiểm tra lại!")
            }
        })
    }

    @action
    setListCarChooseCar(data) {
        this.listTypeCarChooseCar = data
        console.log('listTypeCarChooseCar: ' + JSON.stringify(this.listTypeCarChooseCar))
    }

    @action
    getTimeFromDataNear(startAddress, endAddress, id, callback = null) {
        let obj = _.find(this.listCarAvailable, function (o) { return o.typeCarId == id && o.latitude && o.longitude })
        console.log('obj: ' + JSON.stringify(obj))
        if (obj) {
            let address = { "latitude": obj.latitude, "longitude": obj.longitude, "title": "" };
            getPositionListDirectionLegs(startAddress, address, (data, status) => {
                if (status) {
                    console.log("data.legs: " + JSON.stringify(data))
                    // let timeResult = 0;
                    // if (data) {
                    //     timeResult = Math.round((parseFloat(data.duration + '') / 60))
                    // }
                    callback(data, true)
                } else {
                    callback([], false)
                }
            })
        }
    }

    @action
    updatePriceListCarChooseCar(startAddress, endAddress,distanceKm, callback = null) {
        // console.log(this.,"siskm")
        var arr = [];
        let self = this;
        arr = this.listTypeCarChooseCar;
        this.arrInfoPrice=[];
        // console.log(toJS(arr),"arrhihi")
        async.waterfall([
            function (callbackWaterfall) {
                let index = 0;
                async.everySeries(self.listTypeCarChooseCar, function (item, callbackService) {

                    //get giá
                    self.getPriceTimeSlot(item.id,distanceKm, (data, status) => {
                        if (status) {
                            
                            if (data) {
                                var infoPrice = {
                                    typeCarId:item.id,
                                    price:data
                                }
                                self.arrInfoPrice.push(infoPrice)
                                // console.log(item,"item hehe")
                                item.price = parseFloat(data + '');
                                // console.log(`arr[${index}].price: ` + arr[index].price)
                                //  * (parseFloat(self.tripDistance + '') / 1000);
                            }

                            //  else {
                            //     arr[index].price = data;
                            // }
                            //get time từ vị trí nhận hàng- makerMe => vị trí của xe đó
                            self.getTimeFromDataNear(startAddress, endAddress, item.id, (data1, status) => {
                                if (status) {
                                    // console.log('-------getTimeFromDataNear: ' + data1 + ' index: ' + index)
                                    if (data1) {
                                        arr[index].time = Math.round((parseFloat(data1.duration + '') / 60));
                                        // if (data) {
                                        //     arr[index].price = parseFloat(data + '') * (parseFloat(data1.distance + '') / 1000);
                                        // }
                                        // console.log('arr[index].time: ' + arr[index].time + ' arr : ' + JSON.stringify(arr))
                                        if (index < _.size(self.listTypeCarChooseCar) - 1) {
                                            index++;
                                        }

                                    } else {
                                        arr[index].time = '';
                                        if (index < _.size(self.listTypeCarChooseCar) - 1) {
                                            index++;
                                        }
                                    }
                                }
                            })

                            setTimeout(() => {
                                console.log(`arr[${index}]. now: ` + JSON.stringify(arr[index]))
                                callbackService(null, true)
                            }, 500);
                        } else {
                            // if (index < _.size(self.listTypeCarChooseCar) - 1) {
                            //     index++;
                            // }
                            setTimeout(() => {
                                callbackService(null, true)
                            }, 500);
                        }
                    })
                }, function (err) {
                    if (err) {
                        callbackWaterfall(true, arr)
                    } else {
                        callbackWaterfall(null, arr)
                    }
                })
            }
        ], function (err, arr) {
            if (err) {
                console.log(err)
            } else {
                console.log('arr: ' + JSON.stringify(arr))
                self.listTypeCarChooseCar = arr;
                setTimeout(() => {
                    callback(true)
                }, 500);

            }
        });
       
    }
   
    @action
    updateTimeListCarChooseCar() {
        //cap nhat thoi gian
        //tìm thằng gần mình nhất
        //api trả về danh sách các thằng gần nhất của mỗi lỗi 
        //goi api lấy ra khoảng cách và thời gian
    }

    @action
    setCurrentOrder(value) {
        this.currentOrder = value;
        console.log('  this.setCurrentOrder: ' + JSON.stringify(this.currentOrder))
        AsyncStorage.setItem('currentOrder', JSON.stringify(value))
        AsyncStorage.setItem('screenType', (this.screenType + ''))

    };

    @action
    deleteOrder(token, orderId, callback = null) {

        PostWithToken(api.ORDER.delete, { orderId: orderId }, token, (data, status) => {
            if (status) {
                console.log('delete: ' + JSON.stringify(data))
                if (data && data.ResponseCode) {
                    callback && callback(true)
                } else {
                    callback && callback(false)
                }
            } else {
                callback && callback(false)
                SimpleToast.show('Có lỗi xảy ra')
            }
        })


    }

    @action
    createOrder(startAddress, endAddress, description, token,infoPrice, callback = null) {
        json = {
            "typeCarId": this.itemTypeCarSelected.id,
            "description": description,
            duration: (parseFloat(this.tripDuration) / 60),
            "long": (parseFloat(this.tripDistance) / 1000),
            "fromLocation": startAddress.title,
            "fromLat": startAddress.latitude,
            "fromLog": startAddress.longitude,
            "toLocation": endAddress.title,
            "toLat": endAddress.latitude,
            "toLog": endAddress.longitude,
            "timeStart": new Date(),
            "serviceAttach": this.showExtraService.selected == true ? this.serviceAttach : [],
            "infoPrice":infoPrice
        }

        console.log(' json createOrder: ', JSON.stringify(json))

        PostWithToken(api.ORDER.create, json, token, (data, status) => {
            console.log('data createOrder: ' + JSON.stringify(json))
            console.log(token,"tokenhihi");
            if (status) {
                if (data && data.ResponseCode) {
                    this.setCurrentOrder(data.data)
                    callback(true)
                }
            } else {
                callback(false)
                SimpleToast.show('Có lỗi xảy ra')
            }
        })
    }

    @action
    rate(token, rate) {
        if (this.currentOrder && this.currentOrder.id) {
            let json = {
                "orderId": this.currentOrder.id,
                "rate": rate
            }
            PostWithToken(api.ORDER.rate, json, token, (data, status) => {
                console.log('data: ' + JSON.stringify(data))
                if (status) {
                } else {

                }
            })
        }

    }

    @action
    getTypeCar(callback = null) {
        GetNoToken(api.TYPE_CAR.getall, (data, status) => {
            console.log('api.TYPE_CAR.getall: ' + JSON.stringify(data))
            if (status) {
                if (data && _.size(data) > 0) {
                    if (data.ResponseCode == 1 && _.size(data.data) > 0) {
                        this.listTypeCar = data.data;
                        this.listTypeCarChooseCar = data.data;
                        callback && callback(true)
                    } else {
                        callback && callback(false)
                        SimpleToast.show(data.ResponseText)
                    }
                } else {
                    callback && callback(false)
                    SimpleToast.show(data.ResponseText)
                }
            } else {
                callback && callback(false)
                SimpleToast.show("Lỗi kết nối. Vui lòng kiểm tra lại!")
            }
        })
    }

    @action
    getCurrentPosition(callback = null) {
        console.log("da vao get curent");
        if(navigator.geolocation){
            navigator.geolocation.watchPosition((position) => {
                console.log(position,"position hihi2");
                this.myPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: values.LATITUDE_DELTA,
                    longitudeDelta: values.LONGITUDE_DELTA,
                }
                this.markerMe = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                callback && callback(true,{
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
                
            }, error => {
                console.log('Không thể lấy được vị trí của bạn.')
            }, {
                enableHighAccuracy: false,
                timeout: 20000, 
                maximumAge: 10000
                })
        }
        
    };

    @action
    getAppInfo() {
        GetNoToken(api.getInfoApp, (data, status) => {
            console.log('getInfoApp: ' + JSON.stringify(data))
            if (status) {
                if (data.ResponseCode) {
                    this.hotline = data.data.hotline
                    this.linkGuide = data.data.linkGuide
                } else {
                    console.log("Errrrr", data)
                }
            } else {
                console.log("Errrrr", data)
            }
        })
    };

    @action
    getOrdeRunFinshed(token, callback = null) {
        GetWithToken(api.ORDER.orderunfinished, token, (data, status) => {
            console.log('orderunfinished: ' + JSON.stringify(data))

            if (status) {
                if (data && _.size(data) > 0) {
                    if (data.ResponseCode == 1) {
                        callback && callback(true, data.data || [])
                    } else {
                        callback && callback(false, [])
                        SimpleToast.show(data.ResponseText)
                    }
                } else {
                    callback && callback(false, [])
                    SimpleToast.show(data.ResponseText)
                }
            } else {
                callback && callback(false, [])
                SimpleToast.show("Lỗi kết nối. Vui lòng kiểm tra lại!")
            }
        })
    }


    @action
    getInfoOrder(token, orderId, callback = null) {
        console.log('token: ' + token + ' - orderId: ' + orderId)

        PostWithToken(api.ORDER.info, { orderId: orderId || '' }, token, (data, status) => {
            console.log('getInfoOrder: ' + JSON.stringify(data))

            if (status) {
                if (data && _.size(data) > 0) {
                    if (data.ResponseCode == 1) {
                        callback && callback(true, data.data || [])
                    } else {
                        callback && callback(false, [])
                    }
                } else {
                    callback && callback(false, [])

                }
            } else {
                callback && callback(false, [])
                SimpleToast.show("Lỗi kết nối. Vui lòng kiểm tra lại!")
            }
        })
    }



}
export default new Home();