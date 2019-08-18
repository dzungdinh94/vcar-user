import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { values, color, config } from '../../../config';
import { AnimationMap } from '../..';
import * as Animatable from 'react-native-animatable';
import Dash from 'react-native-dash';
import { inject, observer } from 'mobx-react/native'
import ViewShadow from '../../../component/ViewShadow';
import screenId from '../../../config/screenId';
import SimpleToast from 'react-native-simple-toast'
import _ from 'lodash'
@inject('User', 'Home', 'EnterAddress')
@observer
export default class FindCarScreen extends Component {
    // static navigatorStyle = {
    //     navBarTranslucent: true,
    //     // navBarBackgroundColor: color.primaryColor,
    //     // navBarTextColor: 'white',
    //     navBarButtonColor: color.primaryColor,
    //     // navBarTranslucent: true, // make the nav bar semi-translucent, works best with drawUnderNavBar:true
    //     navBarTransparent: true,
    //     // navBarBackgroundColor:'transparent',
    //     // navBarButtonColor: color.primaryColor,
    //     drawUnderNavBar: true,
    //     topBarElevationShadowEnabled: false,
    //     // screenBackgroundColor: 'transparent',
    //     // modalPresentationStyle: 'overFullScreen'
    // };


    // static navigatorButtons = {
    //     leftButtons: [
    //         {
    //             id: 'back',
    //             icon: require('../../../assets/images/ic_arrow_left.png'),
    //         }
    //     ],
    // }
    constructor(props) {
        super(props);
        this.state = {
        };
        // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    };

    componentWillMount() {
        let { User, Home } = this.props;
    };

    componentDidMount() {
        console.log("did mount hihi");
        this.listeningConnectSocket();

    };
    listeningConnectSocket = () => {
        let { User, Home } = this.props;
        console.log('token: ' + this.props.User.token)
        let self = this;
        if (config.socket) {
            console.log('_________---------________')
            //khi có lái xe nhận chuyến=> xe dang den
            config.socket.on(config.type_socket_notif.acceptedorder, (data) => {
                console.log('````1socket_acceptedorder```` ' + JSON.stringify(data))
                Home.saveInfoTrip(data)
                self.carIsComming()

            })

            //ket thuc don hang=> vote
            config.socket.on('finishorder', (data) => {
                Home.isShowVote = true;
                console.log('````1socket_finishorder```` ' + JSON.stringify(data))
            })
            //ban da len xe
            config.socket.on('gocar', (data) => {
                Home.isShowCancel = true;
                console.log('````1socket_gocar```` ' + JSON.stringify(data))
            })

            //huy chuyen
            config.socket.on(config.type_socket_notif.cancelorder, (data) => {
                console.log('```` socket_cancelorder ```` ' + JSON.stringify(data))
            })

            config.socket.on(config.type_socket_notif.driverchangelocation, (data) => {
                console.log('```` socket_driverchangelocation ```` ' + JSON.stringify(data));
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
            config.socket.on(config.type_socket_notif.updatePosition, (data) => {
                console.log('```update position ok```` ' + JSON.stringify(data))
                if (Home.currentOrder && Home.currentOrder.id == data.orderId) {
                    Home.currentOrder.inforDriver.latitude =data.latitude
                    Home.currentOrder.inforDriver.longitude =data.longitude
                }
            })
        }
    };

    carIsComming = () => {
        this.props.Home.screenType = screenId.HOME.screenType.carIsComming;
    };

    componentWillUnmount() {

    }



    render() {
        let { EnterAddress, Home } = this.props;
        let widthCircle = 10;
        console.log(Home.currentOrder,"currentOrder");
        return (
            <View style={{
                height: '100%', width: values.deviceWidth, position: 'absolute',
                paddingHorizontal: 10, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff80'
            }}>

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={()=>console.log("click toa toa")}
                    style={{
                        // marginTop: (values.platform == 'ios' ? (values.isIphoneX ? 35 : 15) : 15),
                        marginTop: values.deviceHeight/2 - values.deviceWidth/3,
                        justifyContent: 'center', alignItems: 'center', width: '100%', backgroundColor: 'transparent'
                    }}>
                    <AnimationMap
                        numberView={7} // số lớp toa toa
                        colors={color.primaryColor}  //màu toa toa 
                        children={
                            <Animatable.Image
                                animation='pulse'
                                iterationCount={'infinite'}
                                style={{ width: 25, resizeMode: 'contain', tintColor: color.primaryColor }}
                                source={require('../../../assets/images/ic_markerMe.png')}
                            />
                        } //component con nam trong
                        width={values.deviceWidth * 2 / 3}  //chieu rong 
                        height={values.deviceWidth * 2 / 3}
                        // duration: duration, //len animaton ma doc
                        // delay  //len animaton ma doc
                        // iterations // true or number : số lần lặp,
                        styleCustom={{//bỏ đi thì mất border
                            // borderColor: color.primaryColor,
                            // borderWidth: 0.5,
                            // backgroundColor: 'red',
                            alignSelf: 'center',
                        }} // styleView border
                    />
                </TouchableOpacity>
                <View style={{ marginBottom: 20, paddingBottom: 10, backgroundColor: 'transparent', width: '100%', }}>
                    <View
                        // onLayout={(event) => {
                        //     var { x, y, width, height } = event.nativeEvent.layout;
                        //     console.log(' event.nativeEvent.layout: ' + JSON.stringify(event.nativeEvent.layout))
                        // }}
                        style={[{
                            flexDirection: 'row', width: '100%',
                            maxHeight: 100,
                            minHeight: 40,
                            marginBottom: 20,
                            backgroundColor: 'white', borderRadius: 12,
                        }, styles.shadow]}>
                        <View style={{
                            maxHeight: 140, minHeight: 40,
                            width: 30, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'flex-end',
                        }}>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center', alignItems: 'center', paddingVertical: 12,
                            }}>
                                <View style={{
                                    width: widthCircle, height: widthCircle,
                                    borderRadius: widthCircle / 2, borderWidth: 1.5, borderColor: '#BFC6D0'
                                }} />
                                <Dash
                                    dashThickness={1.5}//do day cua moi net dut
                                    dashColor={'#BFC6D0'}
                                    style={{ marginRight: 1.5, width: 0.5, flex: 1, flexDirection: 'column', }} />
                                <View style={{
                                    width: widthCircle, height: widthCircle, borderRadius: widthCircle / 2,
                                    borderWidth: 1.5, borderColor: '#BFC6D0', marginTop: 2,
                                }} />
                            </View>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'transparent', paddingHorizontal: 10, }}>
                            <View style={{
                                backgroundColor: 'transparent', justifyContent: 'center', width: '100%', paddingVertical: 10,
                                borderBottomColor: color.lineColor, borderBottomWidth: 0.5,
                            }}>
                                <Text numberOfLines={2} style={{ color: 'black', fontSize: 13, }}>{Home.currentOrder.fromLocation || ''}</Text>
                            </View>
                            <View style={{
                                backgroundColor: 'transparent', justifyContent: 'center', width: '100%', paddingVertical: 10,
                            }}>
                                <Text numberOfLines={2} style={{ color: 'black', fontSize: 13, }}>{Home.currentOrder.toLocation || ''}</Text>
                            </View>
                        </View>
                    </View>
                        <View style={{ paddingHorizontal: 10, width: '100%' }}>
                        <ViewShadow
                            onPress={this.props.cancelBooking}
                            height={40}
                            backgroundColor={'#dce0ee'}
                            shadowColor={'rgba(0, 0, 0, 0.45)'}
                            colorText={'rgba(0, 0, 0, 0.45)'}
                            styleText={{ fontWeight: 'bold' }}
                            textTitle={'HUỶ CHUYẾN'}
                        />
                    </View>
            
                    
                </View>
                <TouchableOpacity
                    onPress={this.props.cancelBooking}
                    activeOpacity={1}
                    style={{
                        width: 40, height: 40, position: 'absolute',
                        top: values.marginTopScreen, left: 5, justifyContent: 'center', alignItems: 'center'
                    }}>
                    <Image
                        style={{ width: 24, height: 24, resizeMode: 'contain', tintColor: color.primaryColor }}
                        source={require('../../../assets/images/arrow-back.png')} />
                </TouchableOpacity>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    shadow:
        values.platform == 'ios' ? {
            shadowColor: 'gray',
            shadowOffset: { width: 2, height: 5 },
            shadowOpacity: 0.65,
            shadowRadius: 7,
        }
            :
            { elevation: 2, marginBottom: 20, },
});