import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Keyboard,
    StatusBar,
    // AsyncStorage,
    BackAndroid,
    BackHandler,
    ActivityIndicator,
    Platform,
    Alert,
} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage"
import _ from 'lodash'
import { inject, observer } from 'mobx-react/native'
import { toJS } from 'mobx'
import { values, color, mapStyle } from '../../../config';
import { getPositionListDirection, checkPhone, getNameAddressCallback } from '../../../utils/Func'
import EnterAddressView from './EnterAddressView';
import TopBar from './TopBar';
import ChooceTypeCarView from './chooseCar/ChooceTypeCarView';
import CarIsCommingView from './CarIsCommingView';
import CompleteView from './CompleteView';
import EnterRegisterPhoneView from '../enterAddress/EnterRegisterPhoneView';
import SimpleToast from 'react-native-simple-toast';
import FindCarScreen from './FindCarScreen';
import screenId from '../../../config/screenId';
import SuggestAddressView from '../enterAddress/SuggestAddressView';

import firebase from 'react-native-firebase'
import type { Notification, NotificationOpen } from 'react-native-firebase';
import MapView, { Marker, Callout, Polyline, PROVIDER_GOOGLE, AnimatedRegion, Animated } from 'react-native-maps';

import MarkerMeView from '../map/MarkerMeView';
import PolylineView from '../map/PolylineView';
import MarkerDirectView from '../map/MarkerDirectView';
import MarkerStartAdressView from '../map/MarkerStartAdressView';
import MarkerEndAdressView from '../map/MarkerEndAdressView';
import MarkerCarView from '../map/MarkerCarView';
import EnterExtraServiceView from '../enterAddress/EnterExtraServiceView';
import { config, api } from '../../../config';
import io from 'socket.io-client'
import { connectSocketIO } from '../../../config/request';
import {
    Navigation
  } from "react-native-navigation";
let socket = null
let startSuggest = null

@inject('User', 'Home', 'EnterAddress', 'OnApp')
@observer
class HomeScreen extends Component {
    static navigatorStyle = {
        // navBarButtonColor: color.primaryColor,
        // navBarTranslucent: true, // make the nav bar semi-translucent, works best with drawUnderNavBar:true
        // navBarTransparent: true,
        // drawUnderNavBar: true,
        // topBarElevationShadowEnabled: false,
        navBarHidden: true
    };

    static navigatorButtons = {
        leftButtons: [
            {
                id: 'drawer',
                icon: require('../../../assets/images/ic_menu.png'),
            }
        ]
    }
    constructor(props) {
        super(props)
        this.showKeyboard = false;
        if (this.props.User.fcmId) {
            connectSocketIO(this.props.User.fcmId, this.props.User.token)
        } else {
            connectSocketIO(this.props.User.fcmId, this.props.User.token)
            console.log('khong co fcmId')
        }
        var {Home,EnterAddress} = this.props;
        this.mapRef = null;
        this.state = {
            isLoading: false,
            timer: 60,
            isStart: false,
            isEnd: false,
            region:null
        };
        this.props.User.rootNavigator = this.props.navigator;
        this.onLayout = this.onLayout.bind(this);
        this.setFalse = this.setFalse.bind(this);
        Navigation.events().bindComponent(this); 
        // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    };

    onToggleDrawer = () => {
        // alert("click");
        Navigation.mergeOptions(this.props.componentId, {
            sideMenu: {
              left: {
                visible: true
              }
            }
          });
    }

    onNavigatorEvent(event) {

        if (event.type == 'NavBarButtonPress') {
            if (event.id == 'drawer') {
                this.onToggleDrawer()
            }
        }
    };
    componentWillMount() {
        //test
        console.log("test thoi kaka", "componentWillMount");
        let { OnApp, User, Home } = this.props;
        Home.getAppInfo()
        if (_.size(User.userInfo) == 0 || _.size(User.userInfo.phone) == 0) {
            Home.isShowEnterPhone = true
        } else {
            Home.isShowEnterPhone = false;
        }
        //lấy danh sách các loại xe
        Home.getTypeCar((status) => {
            if (status) {
                //lấy xe gần đây
                // if(User && User.token){

                // }
                Home.getNearDriver(User.token)
            }
        })
        console.log('!!!!!!!!!!!!!!!!!!OnApp.screenCurrent!!!!!!!!!!!!!!!!!')
        OnApp.screenCurrent = screenId.MENU.screenType.home;
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    };
componentDidUpdate(prevProps, prevState) {
    const {Home,EnterAddress}=this.props;
    if(prevProps.Home.screenType !== Home.screenType && Home.screenType == screenId.HOME.screenType.findCar){
         this.setState({
             region:{
                latitude: EnterAddress.startAddress.latitude,
                longitude: EnterAddress.startAddress.longitude,
                latitudeDelta: values.LATITUDE_DELTA,
                longitudeDelta: values.LONGITUDE_DELTA,
            }
         })
    }
}
    onClickNotifi = (notif) => {
        let { Home, User, EnterAddress, OnApp } = this.props;
        let self = this;
        console.log("DataNotiiii: " + JSON.stringify(notif))

        if (notif) {
            if (notif.typeNoti) {
                switch (notif.typeNoti) {
                    case config.type_socket_notif.gocar://vote
                        console.log('````notif_gocar```` ' + JSON.stringify(notif))
                        if (Home.currentOrder && Home.currentOrder.id) {
                            if (notif.id == Home.currentOrder.id) {
                                console.log("da len xe roi nhe");
                                // Home.isShowCancel = true;
                                Home.currentOrder.status =5;
                                // self.deleteTripInfo()

                            } else {
                                console.log('````don hang khac```` ')
                            }
                        } else {
                        }

                        break;

                    case config.type_socket_notif.finishorder://vote
                        console.log('````notif_finishorder```` ' + JSON.stringify(notif))
                        if (Home.currentOrder && Home.currentOrder.id) {
                            if (notif.id == Home.currentOrder.id) {
                                Home.isShowVote = true;
                                self.deleteTripInfo()

                            } else {
                                console.log('````don hang khac```` ')
                            }
                        } else {
                        }

                        break;

                    case config.type_socket_notif.driverchangelocation:
                        if (_.size(Home.listCarAvailable) > 0) {
                            for (i = 0; i < _.size(Home.listCarAvailable); i++) {
                                if (Home.listCarAvailable[i].id == notif.id) {
                                    Home.listCarAvailable[i].latitude = notif.latitude;
                                    Home.listCarAvailable[i].longitude = notif.longitude;
                                    break;
                                }
                            }
                        }
                        break;


                    case config.type_socket_notif.acceptedorder://nhan chuyen
                        console.log('````notif_acceptedorder```` ' + JSON.stringify(notif))

                        if (Home.currentOrder && Home.currentOrder.id == notif.id) {

                            if (EnterAddress.endAddress == values.addressDefault || EnterAddress.startAddress == values.addressDefault || _.size(Home.listCoords) == 0) {
                                let startAddress = { latitude: notif.fromLat, longitude: notif.fromLog, title: notif.fromLocation }
                                let endAddress = { latitude: notif.toLat, longitude: notif.toLog, title: notif.toLocation }
                                EnterAddress.startAddress = startAddress;
                                EnterAddress.endAddress = endAddress;
                                getPositionListDirection(startAddress, endAddress, (data, status) => {
                                    if (status) {
                                        Home.setListCoords(data.coords);
                                        Home.setInFoTrip(data.duration, data.distance)
                                    } else {
                                    }
                                })
                            }
                            Home.saveInfoTrip(notif)
                            self.carIsComming()
                        } else {
                            console.log('don hang k phari minh dat')
                        }
                        break;

                    case config.type_socket_notif.cancelorder://huy chuyen
                        if (Home.screenType == screenId.HOME.screenType.carIsComming) {
                            if (Home.currentOrder && Home.currentOrder.id) {

                                Alert.alert('Lái xe hiện tại hủy chuyến', 'Bạn muốn huỷ chuyến hay tiếp tục tìm xe ?',
                                    [
                                        {
                                            // text: 'No way',
                                            text: 'Huỷ chuyến',
                                            onPress: () => {
                                                // isShowAlert = true;
                                                self.goBackHomeFromFindCar()
                                            },
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Tiếp tục tìm xe',
                                            //  text: 'Open Settings',
                                            onPress: () => {
                                                // isShowAlert = true;
                                                self.goToFindCar()
                                            },
                                            style: 'cancel',
                                        }//vao setting xin quyen
                                    ]
                                )
                            } else {
                                console.log('````don hang khac```` ')
                            }
                        }
                        break;

                    case screenId.MENU.screenType.notification:
                        break;

                    default:
                        break;
                }
            }
        }
        // OnApp.setDataNoti(null)
    }

    carIsComming = () => {
        let self = this;
        self.props.Home.screenType = screenId.HOME.screenType.carIsComming;
        console.log('-carIsComming--')
    };

    configNotification = () => {
        let self = this
        let { User, OnApp } = this.props

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            OnApp.countNotif(User.token)
            // console.log("notificationOpenedListener", notificationOpen)
            // console.log("asdjajsdjasjdajsd",notificationOpen)

            if (notificationOpen) {
                if (notificationOpen && notificationOpen.notification &&
                    notificationOpen.notification._data &&
                    notificationOpen.notification._data.custom_notification) {
                    if (JSON.parse(notificationOpen.notification._data.custom_notification).data.typeNoti === 'notification') {
                        // alert("vao day notificationOpenedListener")
                        User.rootNavigator.push({
                            screen: 'NotificationScreen',
                            title: "Thông báo"
                        });
                        OnApp.screenCurrent = screenId.MENU.screenType.notification
                    } else {
                        this.onClickNotifi(JSON.parse(notificationOpen.notification._data.custom_notification).data)
                    }
                }
            }


            if (JSON.parse(notificationOpen.notification._data.custom_notification).data.typeNoti === 'notification') {
                // alert("vao day notificationOpenedListener")
                User.rootNavigator.push({
                    screen: 'NotificationScreen',
                    title: "Thông báo"
                });
                OnApp.screenCurrent = screenId.MENU.screenType.notification
            } else {
                this.onClickNotifi(JSON.parse(notificationOpen.notification._data.custom_notification).data)
            }


        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            // console.log("notificationListener", notification)
            if (notification) {
                console.log("notificationListener 164: ", notification)
                if (notification && notification._data && notification._data.custom_notification) {
                    this.onClickNotifi(JSON.parse(notification._data.custom_notification).data)
                    if (JSON.parse(notification._data.custom_notification).data.typeNoti == 'notification') {
                        const notificationss = new firebase.notifications.Notification()
                            .setTitle(JSON.parse(notification._data.custom_notification).data.title)
                            .setBody(JSON.parse(notification._data.custom_notification).data.content)
                            .setData(notification._data)
                        // notificationss.android.setCh
                        notificationss.android.setSmallIcon('ic_launcher');
                        // firebase.notifications().displayNotification(notificationss)
                        // console.log("asdasdasdasdasdasd")
                        if (values.platform === 'android') {
                            const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
                                .setDescription('My apps test channel');

                            // Create the channel
                            firebase.notifications().android.createChannel(channel);
                            notificationss.android.setChannelId(channel.channelId)
                            notificationss.android.setAutoCancel(true)
                            notificationss.android.setClickAction('OPEN_ACTIVITY')
                        }
                        firebase.notifications().displayNotification(notificationss)
                    }
                }
            }

        });
    }

    deleteTripInfo = () => {
        let { Home } = this.props;
        let key = ['currentOrder', 'screenType']
        Home.resetToHome()
        AsyncStorage.multiRemove(key)
    }

    listeningConnectSocket = () => {
        let { User, Home } = this.props;
        console.log('token: ' + this.props.User.token)
        let self = this;
        if (config.socket) {
            config.socket.on(config.type_socket_notif.gocar, data => {
                if (Home.currentOrder && Home.currentOrder.id) {
                    if (data.id == Home.currentOrder.id) {
                        console.log("da len xe roi nhe");
                        // Home.isShowCancel = true;
                        Home.currentOrder.status =5;
                        // self.deleteTripInfo()

                    } else {
                        console.log('````don hang khac```` ')
                    }
                } else {
                }
            })
            //vote



            //khi có lái xe nhận chuyến=> xe dang den
            config.socket.on(config.type_socket_notif.acceptedorder, (data) => {
                console.log(Home.currentOrder,data,"full data id socket")
                if (Home.currentOrder && Home.currentOrder.id == data.id) {
                    console.log('````1socket_acceptedorder```` ' + JSON.stringify(data))
                    Home.saveInfoTrip(data)
                    self.carIsComming()
                }
            })

            config.socket.on(config.type_socket_notif.updatePosition, (data) => {
                console.log('```update position ok```` ' + JSON.stringify(data))
                if (Home.currentOrder && Home.currentOrder.id == data.orderId) {
                    Home.currentOrder.inforDriver.latitude =data.latitude
                    Home.currentOrder.inforDriver.longitude =data.longitude
                    
                    console.log('```update position ok```` ' + JSON.stringify(data))
                    // Home.saveInfoTrip(data)
                    // self.carIsComming()
                }
            })

            config.socket.emit('test', 'Xin chào ')

            //ket thuc don hang=> vote
            config.socket.on(config.type_socket_notif.finishorder, (data) => {
                console.log('````socket_finishorder```` ' + JSON.stringify(data))
                if (Home.currentOrder && Home.currentOrder.id) {
                    if (data.id == Home.currentOrder.id) {
                        Home.isShowVote = true;
                        self.deleteTripInfo()

                    } else {
                        console.log('````don hang khac```` ')
                    }
                } else {
                }
            })

            var isShowAlert = false;
            //huy chuyen
            config.socket.on(config.type_socket_notif.cancelorder, (data) => {
                console.log('````socket_cancelorder```` ' + JSON.stringify(data))
                if (Home.screenType == screenId.HOME.screenType.carIsComming) {
                    console.log('Home.currentOrder: ' + JSON.stringify(Home.currentOrder))
                    if (Home.currentOrder && Home.currentOrder.id) {
                        if (Home.currentOrder.id == data.id) {
                            if (Home.cancelOrder) {
                                console.log('Home.cancelOrder: ' + JSON.stringify(Home.cancelOrder) + ' - don hang da dc huy')
                            } else {
                                console.log(' - don hang lan dau huy')
                                Home.cancelOrder = data;
                                self.showAlertQA()
                            }
                        }

                    } else {
                        console.log('````don hang khac```` ')
                    }
                }
            })


            config.socket.on(config.type_socket_notif.driverchangelocation, (data) => {
                console.log('````socket_driverchangelocation2```` ' + JSON.stringify(data));
                // console.log(Home.currentOrder.inforDriver,"============current Order ID1");
                if (Home.currentOrder && Home.currentOrder.inforDriver && Home.currentOrder.inforDriver.id == data.id) {
                    Home.currentOrder.inforDriver.latitude =data.latitude
                    Home.currentOrder.inforDriver.longitude =data.longitude
                    console.log(Home.currentOrder.inforDriver,"============current Order ID");
                }
                if (_.size(Home.listCarAvailable) > 0) {
                    for (i = 0; i < _.size(Home.listCarAvailable); i++) {
                        if (Home.listCarAvailable[i].id == data.id) {
                            Home.listCarAvailable[i].latitude = data.latitude;
                            Home.listCarAvailable[i].longitude = data.longitude;
                            break;
                        }
                    }
                }
            })
        }
    };

    showAlertQA = () => {
        let self = this;
        let { Home } = this.props;
        Alert.alert('Lái xe hiện tại hủy chuyến', 'Bạn muốn huỷ chuyến hay tiếp tục tìm xe ?',
            [
                {
                    // text: 'No way',
                    text: 'Huỷ chuyến',
                    onPress: () => {
                        // isShowAlert = true;
                        self.goBackHomeFromFindCar()
                        Home.cancelOrder = null;
                    },
                    style: 'cancel',
                },
                {
                    text: 'Tiếp tục tìm xe',
                    //  text: 'Open Settings',
                    onPress: () => {
                        // isShowAlert = true;
                        self.goToFindCar()
                        Home.cancelOrder = null;
                    },
                    // style: 'cancel',
                }//vao setting xin quyen
            ]
        )
    }

    goToFindCar = () => {
        this.props.Home.screenType = screenId.HOME.screenType.findCar
    }

    checkConnectSocket = () => {
        var self = this;
        self.listeningConnectSocket();
    };

    componentDidMount() {
        console.log('componentDidMount')

        let { User, Home, OnApp,EnterAddress } = this.props;
        console.log('token: ' + this.props.User.token)
        let self = this;
        Home.getCurrentPosition((status,region)=>{
            if(status){
                this.setState({
                    region:Home.myPosition
                })
                getNameAddressCallback(region.latitude, region.longitude, (data, status) => {
                    if (status) {
                        if (data && data.results.length > 0) {
                            EnterAddress.setStartAddress(region.latitude, region.longitude, data.results[0].formatted_address);
                        }
                        // console.log(data.results[0].formatted_address,"data kaka");
                    }
                })
            }
        });
        self.checkConnectSocket()

        BackHandler.addEventListener('hardwareBackPress', function () {
            switch (OnApp.screenCurrent) {
                case screenId.MENU.screenType.home:
                case screenId.MENU.screenType.history:
                case screenId.MENU.screenType.notification:
                case screenId.MENU.screenType.guide:
                case screenId.MENU.screenType.hotline:
                case screenId.MENU.screenType.profile:
                    //trang chu
                    return true
                    break;
                default:
                    return false
                    break;
            }
        });
        //config notif
        this.configNotification()
        if (OnApp.dataNoti) {
            if (OnApp.dataNoti.typeNoti === 'notification') {
                alert('vao day')
                User.rootNavigator.push({
                    screen: 'NotificationScreen',
                    title: "Thông báo"
                });
            } else {
                this.onClickNotifi(OnApp.dataNoti)

            }
        }


        //check toa do
        //chua co location
        if (Home.screenType == screenId.HOME.screenType.findCar) {
            if (Home.markerMe == values.MARKER_ME_DEFAULT) {
                Home.getCurrentPosition()
            }
        }
    };


    hiddenView = () => {
        this.props.Home.isShowVote = false;
    }
    _keyboardDidShow() {
        this.showKeyboard = true;
    }

    _keyboardDidHide() {
        this.showKeyboard = false;
    }
    componentWillUnmount() {
        // config.socket.disconnect();
        this.notificationOpenedListener();
        this.notificationListener();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    findCarDone = () => {
        console.log("finCarDone");
        let { EnterAddress, Home, User } = this.props;
        let { timer } = this.state;
        let self = this;
        Keyboard.dismiss()
        console.log(Home.itemTypeCarSelected)
        if (_.size(Home.itemTypeCarSelected) > 0) {
            if (User.token) {
                this.setState({
                    isLoading: true
                })
                console.log("kakaka");

                var arrayInfoPrice = toJS(Home.arrInfoPrice);
                var non_duplidated_InfoPrice = arrayInfoPrice.length > 0 ? _.uniqBy(arrayInfoPrice, 'typeCarId') : [];
                console.log(non_duplidated_InfoPrice, arrayInfoPrice, "non duplicate");
                Home.createOrder(EnterAddress.startAddress, EnterAddress.endAddress, EnterAddress.description, User.token, non_duplidated_InfoPrice, (status) => {
                    this.setState({
                        isLoading: false
                    })
                    console.log(status, "status when click search");
                    if (status) {
                        Home.screenType = screenId.HOME.screenType.findCar;

                        AsyncStorage.setItem('currentOrder', JSON.stringify(Home.currentOrder))
                        AsyncStorage.setItem('screenType', Home.screenType)

                    } else {

                    }
                }
                )


            } else {
                Home.isShowEnterPhone = true;
            }
        } else {

        }
    }

    findCarContinue = () => {
        let { Home } = this.props;
        this.findCarDone()
    }

    goBackHomeFromFindCar = () => {
        let { Home, User, EnterAddress } = this.props;
        if (Home.currentOrder && Home.currentOrder.id) {
            Home.deleteOrder(User.token, Home.currentOrder.id)
        }
        Home.resetToHome()
        EnterAddress.resetToHomeEnterAdress()

    }


    findCar = () => {
        let { Home, User } = this.props;
        if (_.size(Home.itemTypeCarSelected) < 1) {
            SimpleToast.show('Bạn vui lòng chọn loại xe để tiếp tục!')
        } else {
            Home.getServiceAttach(User.token, (status) => {
                if (status) {
                    if (Home.showExtraService.selected == null) {
                        if (Home.showExtraService.isShow == false) {
                            Home.showExtraService.isShow = true;
                        }
                    } else {
                        this.findCarContinue()
                    }
                } else {
                    this.findCarContinue()
                }
            })

        }

    }

    confirmExtraService = () => {//xác nhận chọn dịch vụ đính kèm
        let { Home } = this.props;
        Home.showExtraService.selected = true;
        this.findCarContinue()
    }

    dismissEnterRegisterPhone = () => {
        let { Home, User } = this.props;
        Home.isShowEnterPhone = false;
    };

    dismissExtraService = () => {//khong chon dich vu dinh kem
        let { Home } = this.props;
        Home.showExtraService.selected = false;
        this.findCarContinue()
    }

    confirmPhone = (phone) => {
        //validate so dien thoai
        let { User, OnApp, Home } = this.props;
        console.log('====================================');
        console.log(User.fcmId);
        console.log('====================================');
        let self = this;
        if (phone && phone.trim() != '') {
            if (checkPhone(phone)) {
                //login
                let json = {
                    phone: phone,
                    fullname: null,
                    avatar: null,
                    tokenfb: null,
                    fcmId: User.fcmId
                }
                User.login(json, (data, status) => {
                    if (status) {
                        self.dismissEnterRegisterPhone()
                        OnApp.countNotif(User.token)
                        self.findCarDone()
                    } else {
                        console.log('Dang nhap that bai')
                        // self.findCarDone()
                    }
                })
            } else {
                SimpleToast.show('Bạn cần nhập đúng định dạng số điện thoại')
            }
        } else {
            SimpleToast.show('Bạn cần nhập số điện thoại để tiếp tục')
        }
    }

    clickContinue = () => {
        let { Home, EnterAddress } = this.props
        let self = this;
        Keyboard.dismiss()
        if (EnterAddress.startAddress == values.addressDefault || EnterAddress.endAddress == values.addressDefault) {
            SimpleToast.show('Bạn cần điền đủ vị trí nhận và trả hàng để tiếp tục.')
        } else {
            console.log('EnterAddress.startAddress: ' + JSON.stringify(EnterAddress.startAddress))
            console.log('EnterAddress.endAddress: ' + JSON.stringify(EnterAddress.endAddress))
            console.log('_.isEqual(EnterAddress.startAddress, EnterAddress.endAddress): ' + _.isEqual(EnterAddress.startAddress, EnterAddress.endAddress))
            if (_.isEqual(EnterAddress.startAddress, EnterAddress.endAddress)) {
                SimpleToast.show('Địa điểm nhận và trả hàng không được trùng nhau.')
            } else {
                Home.coordDirection = { latitude: EnterAddress.startAddress.latitude, longitude: EnterAddress.startAddress.longitude };

                console.log('EnterAddress.startAddress: ' + JSON.stringify(EnterAddress.startAddress) + '+JSON.stringify(EnterAddress.endAddress)' + JSON.stringify(EnterAddress.endAddress))
                getPositionListDirection(EnterAddress.startAddress, EnterAddress.endAddress, (data, status) => {
                    console.log(data, "data position")
                    if (status) {
                        Home.setListCoords(data.coords);
                        Home.setInFoTrip(data.duration, data.distance)

                        this.setState({ isLoading: true })
                        Home.updatePriceListCarChooseCar(EnterAddress.startAddress, EnterAddress.endAddress, data.distance, (status) => {
                            this.setState({ isLoading: false })
                            if (status) {
                                Home.screenType = screenId.HOME.screenType.chooseCar
                            }
                        })
                    } else {
                        this.setState({ isLoading: true })
                        Home.updatePriceListCarChooseCar(EnterAddress.startAddress, EnterAddress.endAddress, (status) => {
                            this.setState({ isLoading: false })
                            if (status) {
                                Home.screenType = screenId.HOME.screenType.chooseCar
                            }
                        })
                    }
                })
            }
        }
    }

componentWillUpdate = (nextProps, nextState) => {
  console.log(nextProps,"next Props");
};

    componentWillReceiveProps(nextProps) {
      
        console.log('componentWillReceiveProps')
    }

    focusMaker = () => {
        let { Home, EnterAddress } = this.props
        let self = this;
        console.log('Home.screenType: ' + Home.screenType)
        if (EnterAddress.startAddress == values.addressDefault || EnterAddress.endAddress == values.addressDefault) {
        } else {
            let arrayFocus = []
            arrayFocus = [
                { latitude: EnterAddress.startAddress.latitude, longitude: EnterAddress.startAddress.longitude },
                { latitude: EnterAddress.endAddress.latitude, longitude: EnterAddress.endAddress.longitude }
            ]
            // }


            let edgePadding = {}
            edgePadding = { top: 70, right: 70, bottom: 70, left: 70 }
            if (self.mapRef) {
                console.log('fitToCoordinates')
                console.log('arrayFocus: ' + JSON.stringify(arrayFocus))
                console.log('edgePadding: ' + JSON.stringify(edgePadding))
                setTimeout(() => {
                    self.mapRef.fitToCoordinates(arrayFocus,
                        { edgePadding: edgePadding, animated: true })
                }, 500);
            }
        }
    };
    onRegionChange = _.debounce((region) => {
        const {Home,EnterAddress} = this.props;
        const {isStart,isEnd} =this.state;
        console.log(region)
        if(Home.screenType === screenId.HOME.screenType.start){
            if (Home.isStartCheck === true) {
                getNameAddressCallback(region.latitude, region.longitude, (data, status) => {
                    if (status) {
                        if (data && data.results.length > 0) {
                            EnterAddress.setStartAddress(region.latitude, region.longitude, data.results[0].formatted_address);
                        }
                        // console.log(data.results[0].formatted_address,"data kaka");
                    }
                })
    
            } else if (Home.isEndCheck === true) {
                getNameAddressCallback(region.latitude, region.longitude, (data, status) => {
                    if (status) {
                        if (data && data.results.length > 0) {
                            EnterAddress.setEndAddress(region.latitude, region.longitude, data.results[0].formatted_address);
                        }
                        // console.log(data.results[0].formatted_address,"data kaka");
                    }
                }
                )
            } 
            else if (Home.isStartDefault && isStart !== true && isEnd !== true) {
                getNameAddressCallback(region.latitude, region.longitude, (data, status) => {
                    if (status) {
                        if (data && data.results.length > 0) {
                            this.setState({
                                region:{
                                    latitude: region.latitude,
                                    longitude: region.longitude,
                                    latitudeDelta: values.LATITUDE_DELTA,
                                    longitudeDelta: values.LONGITUDE_DELTA,
                                }
                            })
                            EnterAddress.setStartAddress(region.latitude, region.longitude, data.results[0].formatted_address);
                        }
                        // console.log(data.results[0].formatted_address,"data kaka");
                    }
                })
            }
    
        }
       

        // this.setState({ region });
    },100)

    onLayout() {
        if (this.props.Home.screenType != screenId.HOME.screenType.start && this.props.Home.screenType != screenId.HOME.screenType.findCar) {
            this.focusMaker()
        }
    }

    cancelBooking = () => {
        Alert.alert('Huỷ chuyến', 'Bạn có chắc chắn huỷ chuyến này không?',
            [
                {
                    // text: 'No way',
                    text: 'Huỷ',
                    onPress: () => console.log('Permission denied'),
                    style: 'cancel',
                },
                {
                    text: 'Chắc chắn',
                    //  text: 'Open Settings',
                    onPress: this.goBackHomeFromFindCar
                }//vao setting xin quyen
                ,],
        )
    }

    setFalse() {
        if (this.props.Home.isStartCheck === true) {
            this.props.Home.isStartCheck = false
            this.setState({
                isStart: false
            })
        } else if (this.props.Home.isEndCheck === true) {
            this.props.Home.isEndCheck = false
            this.setState({
                isEnd: false
            })
        }
    }

    handleCheckStart = (data) => {
        this.setState({
            isStart: data
        })
    }
    handleCheckEnd = (data) => {
        this.setState({
            isEnd: data
        })
    }

    render() {
        let { Home, EnterAddress } = this.props;
        let {region} = this.state;
        console.log(region,Home.screenType,"region test2");
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => { Keyboard.dismiss() }} style={{ flex: 1, width: '100%' }}>
                {/* <StatusBar barStyle='dark-content' translucent /> */}
                <KeyboardAvoidingView
                    behavior='padding'
                    enabled={values.platform == 'ios' ? true : false}

                    style={styles.container}>
                    <View style={{ width: '100%', flex: 1, backgroundColor: 'transparent' }}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{flex:1}}
                            region={toJS(region) || toJS(Home.myPosition)}
                            customMapStyle={mapStyle}
                            loadingEnabled
                            onRegionChange={this.onRegionChange}
                            ref={(ref) => this.mapRef = ref}
                            onLayout={this.onLayout}
                            rotateEnabled={false}
                        >

                            <MarkerCarView />
                            {Home.screenType == screenId.HOME.screenType.carIsComming ? <Marker
                                coordinate={{
                                    "latitude": toJS(Home.currentOrder && Home.currentOrder.inforDriver && Home.currentOrder.inforDriver.latitude), "longitude":
                                    toJS(  Home.currentOrder && Home.currentOrder.inforDriver && Home.currentOrder.inforDriver.longitude)
                                }}
                                anchor={{ x: 0.5, y: 0.5 }}
                                image={require('../../../assets/images/xe_tai.png')}
                            /> : null}

                            <MarkerStartAdressView />
                            <MarkerEndAdressView />
                            <MarkerMeView />
                            <PolylineView /> 
                        </MapView >
                        {Home.screenType == screenId.HOME.screenType.start ?
                            <EnterAddressView
                                ref={ref => this.EnterAddressView = ref}
                                clickEnterAddress={this.clickEnterAddress} clickContinue={this.clickContinue}
                                setFalse={this.setFalse}
                                isStart={this.state.isStart}
                                isEnd={this.state.isEnd}
                                handleCheckStart={this.handleCheckStart}
                                handleCheckEnd={this.handleCheckEnd}
                            /> : null}

                        {Home.screenType == screenId.HOME.screenType.start && (Home.isStartCheck === true || Home.isEndCheck === true) ?
                            <TopBar setFalse={this.setFalse} /> : null}
                        {(Home.screenType != screenId.HOME.screenType.findCar)
                            ?
                            <View style={{ position: 'absolute', top: 0, height: values.toolbarHeight, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'transparent' }}>
                                <TouchableOpacity activeOpacity={1} onPress={this.onToggleDrawer} style={{ paddingLeft: 10, height: 44, width: 44, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={require('../../../assets/images/ic_menu.png')} style={{ width: 24, resizeMode: 'contain', tintColor: color.primaryColor }} />
                                </TouchableOpacity>
                            </View>
                            : null}

                    </View>
                    {Home.isStartCheck === true && (
                        <View style={{
                            position: "absolute",
                            left: "47%",
                            top: "47%"
                        }}>
                            <Image resizeMode={"contain"} source={require("../../../assets/images/pin.png")}
                                style={{
                                    width: 30,
                                    height: 30
                                }} />
                        </View>
                    )}
                    {Home.isStartCheck !== true && Home.isEndCheck !== true && Home.screenType == screenId.HOME.screenType.start && (
                          <View style={{
                            position: "absolute",
                            left: "47%",
                            top: "47%"
                        }}>
                            <Image resizeMode={"contain"} source={require("../../../assets/images/pin.png")}
                                style={{
                                    width: 30,
                                    height: 30
                                }} />
                        </View>
                    )}



                    {Home.isEndCheck === true && (
                        <View style={{
                            position: "absolute",
                            left: "47%",
                            top: "47%"
                        }}>
                            <Image resizeMode={"contain"} source={require("../../../assets/images/pin.png")}
                                style={{
                                    width: 30,
                                    height: 30
                                }} />
                        </View>
                    )}
                    {Home.screenType == screenId.HOME.screenType.chooseCar ? <ChooceTypeCarView findCar={this.findCar} /> : null}
                    {Home.screenType == screenId.HOME.screenType.carIsComming ? <CarIsCommingView cancelBooking={this.cancelBooking} /> : null}

                    {
                        (Home.screenType == screenId.HOME.screenType.chooseCar &&
                            Home.isShowEnterPhone
                        ) ?
                            <EnterRegisterPhoneView
                                dismiss={this.dismissEnterRegisterPhone}
                                confirmPhone={this.confirmPhone} {...this.props}
                            />
                            : null}
                    {Home.showExtraService.selected == null && Home.showExtraService.isShow ?
                        <EnterExtraServiceView dismiss={this.dismissExtraService} confirmExtraService={this.confirmExtraService} {...this.props} />
                        : null
                    }
                    {Home.isShowVote ?
                        <CompleteView hiddenView={this.hiddenView}
                        />
                        : null}
                </KeyboardAvoidingView >

                {
                    this.state.isLoading
                        ?
                        <View style={styles.blackView} >
                            <View style={{
                                width: 100, height: 100, borderRadius: 10, backgroundColor: '#00000080',
                                justifyContent: 'center', alignItems: 'center'
                            }}>
                                <ActivityIndicator size='large' color='white' />
                            </View>
                        </View>
                        :
                        null
                }
                {
                    Home.screenType == screenId.HOME.screenType.findCar
                        ?
                        <FindCarScreen cancelBooking={this.cancelBooking} goBack={this.goBackHomeFromFindCar} />
                        :
                        null
                }

                {/* <Notification ref={(ref) => { this.notification = ref; }} /> */}

            </TouchableOpacity >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    // map: {
    //     ...StyleSheet.absoluteFillObject,
    // },
    shadow:
        values.platform == 'ios' ? {
            shadowColor: 'gray',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
        }
            :
            { elevation: 2, marginBottom: 3, },

    blackView: {
        height: '100%', width: '100%', backgroundColor: 'transparent',
        position: 'absolute', justifyContent: 'center', alignItems: 'center'
    }
});

export default HomeScreen
