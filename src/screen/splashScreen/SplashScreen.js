//import liraries
import React, { Component } from 'react';
import {
    View, Text, StyleSheet,
    Dimensions, Platform,
    Image, Animated,
    Easing, StatusBar,
    Alert, NetInfo,
    PermissionsAndroid, ImageBackground,
} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage"
import firebase from 'react-native-firebase'
import type { Notification, NotificationOpen } from 'react-native-firebase';

import Permissions from 'react-native-permissions'
import { inject, observer } from "mobx-react/native";
import styles from './StyleSheet'
import _ from 'lodash'
import { values, color, config, } from '../../config'
import Toast from 'react-native-simple-toast';
import moment from 'moment'
import { showLogin, showApp } from '../../../App';
import screenId from '../../config/screenId';
import { getPositionListDirection } from '../../utils/Func';
import Home from '../../store/Home';
// import geolib from 'geolib'
var isGoLogin = false;
// create a component
var isShowAlert = false;
console.disableYellowBox = true;

@inject("User", 'Home', 'OnApp', 'EnterAddress')
@observer
class SplashScreen extends Component {
    static navigatorStyle = {
        navBarHidden: true,
        statusBarTextColorSchemeSingleScreen: 'light',
        statusBarTextColorScheme: 'light'
    };

    constructor(props) {
        super(props)
        this.state = {
            permissionLocation: false,
        };
        this.onLetGo = this.onLetGo.bind(this);
        this.getFCM = this.getFCM.bind(this);
        this.getData = this.getData.bind(this);
        this.requestLocationPermissionAccess = this.requestLocationPermissionAccess.bind(this);
        this.checkLocationPermissionAccess = this.checkLocationPermissionAccess.bind(this);
        this.requestLocationPermission = this.requestLocationPermission.bind(this)
        this.checkNetWork = this.checkNetWork.bind(this)
    };

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            ],
                {
                    'title': 'Cool Photo App Camera Permission',
                    'message': 'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                firebase.notifications().getInitialNotification()
                .then((notificationOpen: NotificationOpen) => {
                    if (notificationOpen) {
                        this.props.OnApp.setDataNoti(JSON.parse(notificationOpen.notification._data.custom_notification).data)
                    }
                });
                this.setState({
                    permissionLocation: true
                })
            } else {
                this.setState({
                    permissionLocation: false
                })
            }

        } catch (err) {
            console.warn(err)
        }
        try {
            const checkACCESS_FINE_LOCATION = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            const checkACCESS_COARSE_LOCATION = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
            if (checkACCESS_FINE_LOCATION && checkACCESS_COARSE_LOCATION) {
                firebase.notifications().getInitialNotification()
                .then((notificationOpen: NotificationOpen) => {
                    if (notificationOpen) {
                        this.props.OnApp.setDataNoti(JSON.parse(notificationOpen.notification._data.custom_notification).data)
                    }
                });
                this.setState({
                    permissionLocation: true
                })
            } else {
                this.setState({
                    permissionLocation: false
                })
            }
        } catch (err) {
            console.warn(err)
        }
    }
    checkLocationPermissionAccess() {
        var self = this;
        Permissions.check('location', { type: 'whenInUse' }).then(response => {
            console.log(' -------=========check quyen=======----------- ' + JSON.stringify(response))
            if (response != 'authorized') {
                self.requestLocationPermissionAccess()
            } else {
                self.setState({ permissionLocation: true })
            }
        })
    };

    requestLocationPermissionAccess() {
        var self = this;
        var check = true;
        if (!isShowAlert) {
            Permissions.request('location', { type: 'whenInUse' }).then(response => {
                if (response != 'authorized') {
                    isShowAlert = true;
                    // Alert.alert('Open Settings', 'Please allow the app to use your location',
                    Alert.alert('Mở Cài đặt', 'Vui lòng cho phép ứng dụng sử dụng vị trí của bạn',
                        [
                            {
                                // text: 'Cancel',
                                text: 'Huỷ',
                                onPress: () => {
                                    isShowAlert = false;
                                    self.requestLocationPermissionAccess()
                                },
                                style: 'cancel',
                            },
                            {
                                // text: 'Open Settings',
                                text: 'Mở Cài đặt',
                                onPress: () => {
                                    isShowAlert = false;
                                    Permissions.openSettings();
                                    check = true;
                                }
                            }//vao setting xin quyen
                            ,],
                    )
                } else {
                    self.setState({ permissionLocation: true })
                }
            })
        }
    };

    async getData() {
        let self = this;
        let { User, Home, OnApp, EnterAddress } = this.props;
        await AsyncStorage.getItem('isTheFirst').then((isTheFirst) => {
            //da login
            if (isTheFirst && isTheFirst == 'true') {
                User.isTheFirst = true
            } else {//chua vao app lan nao

         
                firebase.messaging().getToken()
                    .then(fcmId => {
                        if (fcmId != null && fcmId != '' && fcmId != undefined) {
                            AsyncStorage.setItem('fcmId', fcmId);
                            User.fcmId = fcmId;
                            OnApp.subscribeToTopic(fcmId);
                        } else {
                            // FCM.on(FCMEvent.RefreshToken, (fcmId) => {
                            //     if (fcmId != null && fcmId != '' && fcmId != undefined) {
                            //         User.fcmId = fcmId;
                            //         AsyncStorage.setItem('fcmId', fcmId);
                            //         OnApp.subscribeToTopic(fcmId);
                            //     } else {
                            //     }
                            // })
                        }
                    });

                User.isTheFirst = false;
                AsyncStorage.setItem('isTheFirst', 'true');
            }
        })

        await AsyncStorage.getItem('token').then((token) => {
            //da login
            if (token) {
                User.token = token;
                console.log('`````token: ' + token)
                User.getUserInfo()
                OnApp.countNotif(token);

                //thong tin don hang
                AsyncStorage.getItem('currentOrder').then((currentOrder) => {
                    if (currentOrder) {
                        console.log('---splash-currentOrder: ' + currentOrder)
                        Home.currentOrder = JSON.parse(currentOrder);

                        AsyncStorage.getItem('screenType').then((screenTypeOld) => {
                            if (screenTypeOld) {

                                if (screenTypeOld == screenId.HOME.screenType.carIsComming) {
                                    if (Home.currentOrder) {
                                        let startAddress = { latitude: Home.currentOrder.fromLat, longitude: Home.currentOrder.fromLog, title: Home.currentOrder.fromLocation }
                                        let endAddress = { latitude: Home.currentOrder.toLat, longitude: Home.currentOrder.toLog, title: Home.currentOrder.toLocation }
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
                                }

                                console.log('---splash-screenType: ' + screenTypeOld)
                                Home.screenType = screenTypeOld;
                            } else {
                                console.log('screenType khong ton tai')
                            }
                        })

                        //Kiểm tra xe trong ds đơn hàng hiện tại của user, có đơn hàng nào 
                        Home.getInfoOrder(token, JSON.parse(currentOrder).id, (status, data) => {
                            
                            if (status) {
                                if (_.size(data)) {
                                    switch (data.status) {

                                        case 1://vua tao
                                            Home.currentOrder = data;
                                            Home.screenType = screenId.HOME.screenType.findCar;
                                            break;
                                        case 2://da nhan
                                            if (EnterAddress.endAddress == values.addressDefault || EnterAddress.startAddress == values.addressDefault || _.size(Home.listCoords) == 0) {
                                                let startAddress = { latitude: data.fromLat, longitude: data.fromLog, title: data.fromLocation }
                                                let endAddress = { latitude: data.toLat, longitude: data.toLog, title: data.toLocation }
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
                                            console.log(data,"splash2 SCreen");
                                            Home.currentOrder = data;
                                            Home.screenType = screenId.HOME.screenType.carIsComming;
                                            break;
                                        case 3://user da xoa
                                            Home.screenType = screenId.HOME.screenType.start;
                                            Home.resetToHome()
                                            EnterAddress.resetToHomeEnterAdress()
                                            break;
                                        case 4://Hoan thanh
                                            Home.currentOrder = data;
                                            if (!Home.isShowVote) {
                                                Home.isShowVote = true;
                                            }
                                            Home.screenType = screenId.HOME.screenType.complete;
                                            Home.resetToHome()
                                            EnterAddress.resetToHomeEnterAdress()
                                            break;
                                        case 5: //len xe
                                        if (EnterAddress.endAddress == values.addressDefault || EnterAddress.startAddress == values.addressDefault || _.size(Home.listCoords) == 0) {
                                            let startAddress = { latitude: data.fromLat, longitude: data.fromLog, title: data.fromLocation }
                                            let endAddress = { latitude: data.toLat, longitude: data.toLog, title: data.toLocation }
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
                                        console.log(data,"splash2 SCreen");
                                        Home.currentOrder = data;
                                        Home.screenType = screenId.HOME.screenType.carIsComming;
                                        break;    
                                        default:
                                            break;
                                    }
                                }
                            }
                        })

                    } else {
                        console.log('currentOrder khong ton tai')
                    }
                })

                //fcm
                AsyncStorage.getItem('fcmId').then((fcmId) => {
                    if (fcmId && fcmId != null && fcmId != '' && fcmId != undefined) {
                        console.log('fcmId: ' + fcmId)
                        User.fcmId = fcmId;
                    } else {
                        console.log('lay lai fcm')
                        this.getFCM()
                    }
                })
                isGoLogin = false;
            } else {//chua login
                AsyncStorage.getItem('fcmId').then((fcmId) => {
                    if (fcmId && fcmId != null && fcmId != '' && fcmId != undefined) {
                        console.log('fcmId: ' + fcmId)
                        User.fcmId = fcmId;
                    } else {
                        console.log('lay lai fcm')
                        this.getFCM()
                    }
                })
                isGoLogin = true;
            }
        })

        this.checkNetWork()
    }


    getFCM() {
        let { User } = this.props;
        // if (FCM.getFCMToken() != undefined) {
        //     FCM.getFCMToken().then(fcmId => {
        //         console.log('fcmId getFCMToken: ' + fcmId)
        //         if (fcmId != null && fcmId != '' && fcmId != undefined) {
        //             AsyncStorage.setItem('fcmId', fcmId);
        //             User.fcmId = fcmId;
        //         } else {
        //             console.log("k cos FCMID")
        //             FCM.on(FCMEvent.RefreshToken, (fcmId) => {
        //                 console.log('fcmIddddd: ' + fcmId)
        //                 if (fcmId != null && fcmId != '' && fcmId != undefined) {
        //                     User.fcmId = fcmId;
        //                     AsyncStorage.setItem('fcmId', fcmId);
        //                 } else {
        //                     this.getFCM()
        //                 }
        //             })
        //         }
        //     });
        // } else {
        //     console.log("FCM.getFCMToken()  == undefined")
        // }
        firebase.messaging().getToken()
            .then(fcmId => {
                if (fcmId != null && fcmId != '' && fcmId != undefined) {
                    console.log('fcmId: ' + fcmId)
                    AsyncStorage.setItem('fcmId', fcmId);
                    User.fcmId = fcmId;
                    OnApp.subscribeToTopic(fcmId);
                } else {
                    // FCM.on(FCMEvent.RefreshToken, (fcmId) => {
                    //     if (fcmId != null && fcmId != '' && fcmId != undefined) {
                    //         User.fcmId = fcmId;
                    //         AsyncStorage.setItem('fcmId', fcmId);
                    //         OnApp.subscribeToTopic(fcmId);
                    //     } else {
                    //     }
                    // })
                }
            })
    }


    // checkLocationPermissionAccess() {
    //     var self = this;
    //     Permissions.check('location', { type: 'whenInUse' }).then(response => {
    //         console.log(' -------=========check quyen=======----------- ' + JSON.stringify(response))
    //         if (response != 'authorized') {
    //             self.requestLocationPermissionAccess()
    //         } else {
    //             self.setState({ permissionLocation: true })
    //         }
    //     })
    // };

    requestLocationPermissionAccess() {
        var self = this;
        var check = true;
        if (!isShowAlert) {
            Permissions.request('location', { type: 'whenInUse' }).then(response => {
                if (response != 'authorized') {
                    isShowAlert = true;
                    // Alert.alert('Open Settings', 'Please allow the app to use your location',
                    Alert.alert('Mở Cài đặt', 'Vui lòng cho phép ứng dụng sử dụng vị trí của bạn',
                        [
                            {
                                // text: 'Cancel',
                                text: 'Huỷ',
                                onPress: () => {
                                    isShowAlert = false;
                                    self.requestLocationPermissionAccess()
                                },
                                style: 'cancel',
                            },
                            {
                                // text: 'Open Settings',
                                text: 'Mở Cài đặt',
                                onPress: () => {
                                    isShowAlert = false;
                                    Permissions.openSettings();
                                    check = true;
                                }
                            }//vao setting xin quyen
                            ,],
                    )
                } else {
                    self.setState({ permissionLocation: true })
                }
            })
        }
    };
    componentWillUnmount = () => {
        // this.notificationListener();
    };


    componentWillMount() {

        var self = this;
        if (values.platform === 'ios') {
            self.checkLocationPermissionAccess()
        }
        else {
            self.requestLocationPermission()
        }
    
    }

    componentDidMount() {
        var self = this;
        this.getData()
    };
    async checkNetWork() {
        let self = this
        let checkNet = (isConnected) => {
            console.log("isConnectedddddddd", isConnected)
            if (isConnected) {
                //Check token
                this.props.OnApp.isConnect = true;
                setTimeout(() => {
                    self.onLetGo()
                }, 1000);
            } else {
                setTimeout(() => {
                    this.props.OnApp.isConnect = false;
                }, 5000);
            }
        }
        NetInfo.isConnected.fetch().then(isConnected => checkNet(isConnected));
        NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => checkNet(isConnected));
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', () => { });
    };

    onLetGo() {
        let { User, Home } = this.props;
        if (!User.isTheFirst) {//nếu lần đầu vào app=> checck quyền ở trang login
            if (isGoLogin) {
                showLogin()
            } else {
                showApp()
            }
        } else {
            if (User.isTheFirst && this.state.permissionLocation) {
                Home.getCurrentPosition()
                if (isGoLogin) {
                    showLogin()
                } else {
                    showApp()
                }
            }
            else {
                if (values.platform == 'ios') {
                    this.checkLocationPermissionAccess()
                } else {
                    this.requestLocationPermission()
                }
            }
        }
    }

    render() {
        let { User, OnApp } = this.props;
        return (
            <View style={styles.container}>
                <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                    <Image source={require('../../assets/images/logo.png')}
                        style={styles.logo} />
                </View>
                {
                    !User.isTheFirst && !OnApp.isConnect
                    &&
                    <Text style={styles.textDisconnect}>Đường truyền mạng trên thiết bị đã mất kết nối. Vui lòng kiểm tra và thử lại!</Text>
                }
            </View>
        );
    }
}

//make this component available to the app
export default SplashScreen;
