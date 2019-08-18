import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    FlatList,
    Button,
    TouchableOpacity,
    Image,
    ImageBackground,
    Alert, Linking,
    AsyncStorage,
} from 'react-native';
import _ from 'lodash'
import color from '../../config/color'
import { observer, inject } from 'mobx-react'
import { showLogin } from '../../../App';
import RenderStart from '../../component/RenderStart';
import { values, api, config } from '../../config';
import screenId from '../../config/screenId';
import MenuScreenFlatListItem from './MenuScreenFlatListItem';
import Communication from '../../utils/Communication';
import SimpleToast from 'react-native-simple-toast'
const FBSDK = require('react-native-fbsdk');
const {
    LoginManager,
    AccessToken,
} = FBSDK;
import {
    Navigation
} from "react-native-navigation";
const data_menu_not_login = [
    {
        'id': screenId.MENU.screenType.home,
        'title': 'Trang chủ',
        'img': require('../../assets/images/home.png')

    },
    {
        'id': screenId.MENU.screenType.history,
        'title': 'Lịch sử giao dịch',
        'img': require('../../assets/images/history.png')

    },
    {
        'id': screenId.MENU.screenType.notification,
        'title': 'Thông báo',
        'img': require('../../assets/images/notification-important.png')

    },
    {
        'id': screenId.MENU.screenType.guide,
        'title': 'Hướng dẫn',
        'img': require('../../assets/images/info.png')

    },
    {
        'id': screenId.MENU.screenType.hotline,
        'title': 'Tổng đài',
        'img': require('../../assets/images/headset-mic.png')

    },
    {
        'id': screenId.MENU.screenType.login,
        'title': 'Đăng nhập',
        'img': require('../../assets/images/ic_login.png')

    }
]

const data_menu = [
    {
        'id': screenId.MENU.screenType.home,
        'title': 'Trang chủ',
        'img': require('../../assets/images/home.png')

    },
    {
        'id': screenId.MENU.screenType.history,
        'title': 'Lịch sử giao dịch',
        'img': require('../../assets/images/history.png')

    },
    {
        'id': screenId.MENU.screenType.notification,
        'title': 'Thông báo',
        'img': require('../../assets/images/notification-important.png')

    },
    {
        'id': screenId.MENU.screenType.guide,
        'title': 'Hướng dẫn',
        'img': require('../../assets/images/info.png')

    },
    {
        'id': screenId.MENU.screenType.hotline,
        'title': 'Tổng đài',
        'img': require('../../assets/images/headset-mic.png')

    },
    {
        'id': screenId.MENU.screenType.logout,
        'title': "Đăng xuất",
        'img': require('../../assets/images/googleplus-reshare.png')
    },
]

@inject('User', 'OnApp', 'Home')
@observer
class MenuScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    'id': screenId.MENU.screenType.home,
                    'title': 'Trang chủ',
                    'img': require('../../assets/images/home.png')

                },
                {
                    'id': screenId.MENU.screenType.history,
                    'title': 'Lịch sử giao dịch',
                    'img': require('../../assets/images/history.png')

                },
                {
                    'id': screenId.MENU.screenType.notification,
                    'title': 'Thông báo',
                    'img': require('../../assets/images/notification-important.png')

                },
                {
                    'id': screenId.MENU.screenType.guide,
                    'title': 'Hướng dẫn',
                    'img': require('../../assets/images/info.png')

                },
                {
                    'id': screenId.MENU.screenType.hotline,
                    'title': 'Tổng đài',
                    'img': require('../../assets/images/headset-mic.png')

                },
                {
                    'id': screenId.MENU.screenType.logout,
                    'title': "Đăng xuất",
                    'img': require('../../assets/images/googleplus-reshare.png')
                },
            ]
        };

        this.renderItem = this.renderItem.bind(this);
    };



    onSetDrawerEnabled = () => {
        Navigation.mergeOptions(this.props.componentId, {
            sideMenu: {
                left: {
                    visible: false
                }
            }
        });
    }

    onClickItemMenu = (item) => {
        let { User, OnApp, Home } = this.props;
        switch (item.id) {
            case screenId.MENU.screenType.home:
                //trang chu
                this.onSetDrawerEnabled()
                if (OnApp.screenCurrent != item.id) {
                    // Navigation.push(this.props.componentId, {
                    //     component: {
                    //         name: 'HomeScreen',
                    //     }
                    // });
                    Navigation.setRoot({
                        root: {
                            sideMenu: {
                                id: "sideMenu",
                                left: {
                                    component: {
                                        id: "Drawer",
                                        name: "MenuScreen"
                                    }
                                },
                                center: {
                                    stack: {
                                        id: "AppRoot",
                                        children: [{
                                            component: {
                                                name: "HomeScreen",
                                                options: {
                                                    topBar: {
                                                      visible: false,
                                                    },
                                                  }
                                            },
                                        }]
                                    }
                                }
                            }
                        }
                    });
    
                    // User.rootNavigator.push({
                    //     screen: 'HomeScreen',
                    // });
                }

                break;
            case screenId.MENU.screenType.history:
                //lich su giao dich
                if (_.size(User.userInfo) > 0) {
                    this.onSetDrawerEnabled()
                    if (OnApp.screenCurrent != item.id) {
                        // Navigation.push(this.props.componentId, {
                        //     component: {
                        //         name: 'HistoryTransactionScreen',
                        //         options: {
                        //             topBar: {
                        //                 title: {
                        //                     text: 'Lịch sử giao dịch'
                        //                 }
                        //             }
                        //         }
                        //     }
                        // });
                        Navigation.setRoot({
                            root: {
                                sideMenu: {
                                    id: "sideMenu",
                                    left: {
                                        component: {
                                            id: "Drawer",
                                            name: "MenuScreen"
                                        }
                                    },
                                    center: {
                                        stack: {
                                            id: "AppRoot",
                                            children: [{
                                                component: {
                                                    name: "HistoryTransactionScreen",
                                                    options: {
                                                        topBar: {
                                                          visible: false,
                                                        },
                                                      }
                                                },
                                            }]
                                        }
                                    }
                                }
                            }
                        });
        
                        // User.rootNavigator.push({
                        //     screen: 'HistoryTransactionScreen',
                        //     title: "Lịch sử giao dịch",
                        // });
                    }
                } else {
                    this.showLogin()
                }
                break;
            case screenId.MENU.screenType.notification:
                //thong bao
                this.onSetDrawerEnabled()
                if (OnApp.screenCurrent != item.id) {
                    Navigation.setRoot({
                        root: {
                            sideMenu: {
                                id: "sideMenu",
                                left: {
                                    component: {
                                        id: "Drawer",
                                        name: "MenuScreen"
                                    }
                                },
                                center: {
                                    stack: {
                                        id: "AppRoot",
                                        children: [{
                                            component: {
                                                name: "NotificationScreen",
                                                options: {
                                                    topBar: {
                                                      visible: false,
                                                    },
                                                  }
                                            },
                                        }]
                                    }
                                }
                            }
                        }
                    });
                    // User.rootNavigator.push({
                    //     screen: 'NotificationScreen',
                    //     title: "Thông báo"
                    // });
                }
                break;
            case screenId.MENU.screenType.guide:
                if (Home.linkGuide) {
                    Linking.openURL(Home.linkGuide);
                } else {
                    SimpleToast.show('Không tìm thấy đường dẫn')
                }
                break;
            case screenId.MENU.screenType.hotline:
                if (Home.hotline) {
                    Communication.phonecall(Home.hotline, true);
                } else {
                    SimpleToast.show('Không tìm thấy số điện thoại')
                }
                break;

            case screenId.MENU.screenType.login:
                showLogin()
                break;

            default:
                this.logout()

                break;
        }
        // alert(JSON.stringify(item))
    }

    logout = () => {
        let { User } = this.props;
        var self = this;
        Alert.alert('Đăng xuất', 'Bạn thực sự muốn đăng xuất?',
            [
                {
                    text: 'Huỷ', onPress: () => {
                        console.log('huỷ đăng xuất')
                        self.onSetDrawerEnabled()
                    }, style: 'cancel'
                },
                {
                    text: 'Đồng ý', onPress: () => {

                        // AsyncStorage.getItem('fcmId', (err, fcmId) => {
                        //     if (fcmId != null || fcmId != '') {
                        //         PostWithToken(config.service + api.ACCOUNT.logout,
                        //             {
                        //                 fcmId: fcmId
                        //             }, mainStores.token, (data, status) => {
                        //                 // console.log('dataDangxuat: ' + JSON.stringify(data))
                        //                 if (status) {
                        //                     if (data && data.ResponseCode) {
                        //                     } else {
                        //                         Toast.show(data.ResponseText)
                        //                     }
                        //                 }
                        //             })
                        //     }
                        // })
                        LoginManager.logOut();
                        User.logout()
                        self.onSetDrawerEnabled()
                        showLogin()
                    }, style: 'destructive'
                },
            ],
        )
    }

    showLogin = () => {
        var self = this;
        Alert.alert('Bạn chưa đăng nhập', 'Đăng nhập để có thêm nhiều tiện ích hơn?',
            [
                {
                    text: 'Huỷ', onPress: () => {
                        console.log('huỷ đăng xuất')
                        self.onSetDrawerEnabled()
                    }, style: 'cancel'
                },
                {
                    text: 'Đăng nhập', onPress: () => {

                        // let key = ['userInfo', 'token', 'isTheFirst', 'fcmId']
                        // AsyncStorage.multiRemove(key)
                        // LoginManager.logOut();
                        // User.logout()
                        // self.onSetDrawerEnabled()
                        showLogin()
                    }, style: 'destructive'
                },
            ],
        )
    }

    onClickProfile = () => {
        let { User } = this.props;
        if (_.size(User.userInfo) > 0) {
            this.onSetDrawerEnabled()
            // User.rootNavigator.push({
            //     screen: 'ProfileScreen',
            // });
            Navigation.setRoot({
                root: {
                    sideMenu: {
                        id: "sideMenu",
                        left: {
                            component: {
                                id: "Drawer",
                                name: "MenuScreen"
                            }
                        },
                        center: {
                            stack: {
                                id: "AppRoot",
                                children: [{
                                    component: {
                                        name: "ProfileScreen",
                                        options: {
                                            topBar: {
                                              visible: false,
                                            },
                                          }
                                    },
                                }]
                            }
                        }
                    }
                }
            });
        } else {
            this.showLogin()
        }
    }
    renderItem({ item }) {
        return (
            <MenuScreenFlatListItem item={item} onClickItemMenu={this.onClickItemMenu} />
        );
    }

    render() {
        // const params = this.props.navigation.state.params;
        let { User } = this.props
        let widthAvatar = values.deviceWidth / 6
        return (
            <View style={styles.container}>
                <ImageBackground style={{
                    marginTop: values.toolbarHeight,
                    width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',
                }}
                    source={require('../../assets/images/menu-bg.png')}
                >
                    <TouchableOpacity
                        onPress={this.onClickProfile} style={{
                            width: "100%", backgroundColor: 'transparent',
                            paddingHorizontal: 10,
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                        <View
                            style={{ justifyContent: 'center', alignItems: 'center', height: (widthAvatar + 24), width: (widthAvatar + 24), borderRadius: (widthAvatar + 24) / 2, backgroundColor: '#d32c46', overflow: 'hidden' }}>
                            <View
                                style={{ justifyContent: 'center', alignItems: 'center', height: (widthAvatar + 16), width: (widthAvatar + 16), borderRadius: (widthAvatar + 16) / 2, backgroundColor: 'rgba(255, 255, 255, 0.25)', overflow: 'hidden' }}>
                                <View
                                    style={{ justifyContent: 'center', alignItems: 'center', height: (widthAvatar + 8), width: (widthAvatar + 8), borderRadius: (widthAvatar + 8) / 2, backgroundColor: '#eedce3', overflow: 'hidden' }}>
                                    <View
                                        style={{
                                            height: widthAvatar, width: widthAvatar, justifyContent: 'center', alignItems: 'center',
                                            borderRadius: widthAvatar / 2, backgroundColor: 'grey', overflow: 'hidden'
                                        }}>
                                        <Image source={
                                            User.userInfo.avatar
                                                ?
                                                { uri: User.userInfo.avatar }
                                                :
                                                require('../../assets/images/account-circle.png')
                                        } style={{ height: widthAvatar, width: widthAvatar, resizeMode: 'cover' }} />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Text numberOfLines={2} style={{ fontSize: 22, color: 'white', textAlign: 'center', fontWeight: '300', paddingVertical: 15, }}>{
                            _.size(User.userInfo) > 0
                                ?
                                User.userInfo.fullname
                                    ?
                                    User.userInfo.fullname
                                    :
                                    'Cập nhật tên của bạn!'
                                :
                                'Bạn chưa đăng nhập!'}</Text>
                    </TouchableOpacity>
                    <FlatList
                        style={{ width: '100%', marginTop: 40 }}
                        data={
                            _.size(User.userInfo) > 0
                                ?
                                data_menu
                                :
                                data_menu_not_login
                        }
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                    />
                </ImageBackground>
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', position: "absolute", bottom: 10, paddingHorizontal: 10 }}>
                    <Text style={{ textAlign: 'center', fontSize: 11, color: 'white', }}>
                        <Text style={{}}>Phiên bản </Text>
                        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{config.app_version}</Text>
                    </Text>
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: color.primaryColor,
    },
    image: {
        height: 40,
        width: 40,
        borderRadius: 20
    }
});
export default MenuScreen;
