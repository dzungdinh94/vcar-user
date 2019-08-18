import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    StatusBar,
} from 'react-native';
import _ from 'lodash'
import color from '../../config/color'
import { observer, inject } from 'mobx-react'
import RenderStart from '../../component/RenderStart'
import { values, api, config } from '../../config';
import screenId from '../../config/screenId';

import { Toast } from '../../utils/Func';
var ImagePicker = require('react-native-image-picker');
var options = {
    title: 'Chọn ảnh đại diện',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
import { UploadImageAxios } from '../../config/request';
import SimpleToast from 'react-native-simple-toast';
import { Navigation } from 'react-native-navigation';
@inject('User', 'OnApp')
@observer
class ProfileScreen extends Component {
    static navigatorStyle = {
        navBarHidden: true,
    };
    constructor(props) {
        super(props);
        // this.props.navigator.setStyle({
        // navBarHidden:true,
        //     navBarBackgroundColor: color.primaryColor,
        //     topBarElevationShadowEnabled: false,
        //     navBarButtonColor: "white",
        //     statusBarHidden: false,

        //     navBarTextColor: "#FFFFFF",
        //     statusBarTextColorScheme: "light"
        // });
        this.state = {
            percent: 0,
        }
        // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    };

    onToggleDrawer = () => {
        Navigation.mergeOptions(this.props.componentId, {
            sideMenu: {
              left: {
                visible: true
              }
            }
          });
        // this.props.navigator.toggleDrawer({
        //     side: 'left',
        //     animated: true
        // });
    }

    // onNavigatorEvent(event) {
    //     if (event.type == 'NavBarButtonPress') {
    //         if (event.id == 'drawer') {
    //             // this.props.navigator.pop()
    //             this.onToggleDrawer()
    //         }
    //     }
    // };

    componentWillMount() {
        let { OnApp } = this.props;
        OnApp.screenCurrent = screenId.MENU.screenType.profile;
    }

    onClickEditName = () => {
        let { User } = this.props
        Navigation.push(this.props.componentId, {
            component: {
              name: 'EditProfileScreen',
              passProps: { values: User.userInfo.fullname, type: 'name'},
              options: {
                topBar: {
                  visible:false
                }
              }
            }
          });
        // this.props.navigator.push({
        //     screen: 'EditProfileScreen',
        //     title: 'Họ và tên',
        //     passProps: { values: User.userInfo.fullname, type: 'name', }
        // });
    }
    onClickEditPhone = () => {
        let { User } = this.props
        // this.props.navigator.push({
        //     screen: 'EditProfileScreen',
        //     title: 'Số điện thoại',
        //     passProps: { values: User.userInfo.phone, type: 'phone' }
        // });
        Navigation.push(this.props.componentId, {
            component: {
              name: 'EditProfileScreen',
              passProps:{ values: User.userInfo.phone, type: 'phone'},
              options: {
                topBar: {
                  visible:false
                }
              }
            }
          });
    }

    changeAvatar = () => {
        let { User } = this.props
        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };
                UploadImageAxios(api.UPLOAD.fileupload, response.uri, User.token, (data) => {
                    // console.log("jsjsjsjsjsjsjsjjs")
                    console.log(JSON.stringify(data))
                    if (data.ResponseCode) {
                        this.updateAvatar(config.domain + '/' + data.data)
                        console.log(JSON.stringify(User.userInfo))
                    } else {

                    }
                }, (percent) => {
                    // console.log(percent)
                    this.setState({ percent })
                })
            }
        });
    }

    onClickChangeAvatar = () => {
        if (this.state.percent == 0) {
            this.changeAvatar()
        }
    }

    updateAvatar = (avatar) => {
        let { User } = this.props;
        let json = {
            "phone": User.userInfo.phone,
            "fullname": User.userInfo.fullname,
            "avatar": avatar,
            "userType": 1
        }
        console.log('json1: ' + JSON.stringify(json))
        User.updateInfo(json, (status) => {
            if (status) {
                SimpleToast.show('Cập nhật ảnh đại diện thành công')
                User.setAvatar(avatar)
                this.setState({ percent: 0 })
            } else {
                Toast('Cập nhật ảnh đại diện thất bại!')
            }
        })
    }

    render() {
        let { User } = this.props
        let widthAvatar = values.deviceWidth / 4
        return (
            <View style={styles.container}>
                {/* <StatusBar barStyle='light-content' translucent /> */}
                <View style={{ alignItems: 'center', backgroundColor: color.primaryColor, width: '100%', paddingTop: values.toolbarHeight }}>
                    <TouchableOpacity
                        onPress={this.onClickChangeAvatar}
                        style={{ justifyContent: 'center', alignItems: 'center', height: (widthAvatar + 24), width: (widthAvatar + 24), borderRadius: (widthAvatar + 24) / 2, backgroundColor: '#d32c46', overflow: 'hidden' }}>
                        <View
                            style={{ justifyContent: 'center', alignItems: 'center', height: (widthAvatar + 16), width: (widthAvatar + 16), borderRadius: (widthAvatar + 16) / 2, backgroundColor: 'rgba(255, 255, 255, 0.25)', overflow: 'hidden' }}>
                            <View
                                style={{ justifyContent: 'center', alignItems: 'center', height: (widthAvatar + 8), width: (widthAvatar + 8), borderRadius: (widthAvatar + 8) / 2, backgroundColor: '#eedce3', overflow: 'hidden' }}>
                                <View
                                    style={{
                                        height: widthAvatar, width: widthAvatar, borderRadius: widthAvatar / 2,
                                        backgroundColor: 'grey', overflow: 'hidden', justifyContent: 'center', alignItems: 'center'
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
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, color: 'white', textAlign: 'center', fontWeight: '300', paddingVertical: 15, }}>{
                        _.size(User.userInfo) > 0
                            ?
                            User.userInfo.fullname
                                ?
                                User.userInfo.fullname
                                :
                                ''
                            :
                            ''
                    }</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 10 }}>
                    <TouchableOpacity style={styles.btnEditName} onPress={this.onClickEditName}>
                        <View style={{ flex: 1, paddingLeft: 10, paddingBottom: 5, }} >
                            <Text style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.45)', fontWeight: 'normal' }}>Họ và tên</Text>
                            <Text numberOfLines={2} style={[{ marginTop: 3, fontSize: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'normal' },
                            !User.userInfo.fullname && { fontSize: 13, color: 'rgba(0, 0, 0, 0.85)', }
                            ]}>{
                                    _.size(User.userInfo) > 0
                                        ?
                                        User.userInfo.fullname
                                            ?
                                            User.userInfo.fullname
                                            :
                                            'Cập nhật họ tên của bạn ..'
                                        :
                                        'Cập nhật họ tên của bạn ..'
                                }</Text>
                        </View>
                        <Image style={{ height: 10, width: 10, resizeMode: 'contain' }} source={require('../../assets/images/ic_arrow_right.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnEditName} onPress={this.onClickEditPhone}>
                        <View style={{ flex: 1, paddingLeft: 10, paddingBottom: 5, }}>
                            <Text style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.45)', fontWeight: 'normal' }}>Số điện thoại</Text>
                            <Text style={{ marginTop: 3, fontSize: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'normal' }}>{User.userInfo.phone || 'Cập nhật số điện thoại..'}</Text>
                        </View>
                        <Image style={{ height: 10, width: 10, resizeMode: 'contain' }} source={require('../../assets/images/ic_arrow_right.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ position: 'absolute', top: 0, height: values.toolbarHeight, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'transparent' }}>
                    <TouchableOpacity activeOpacity={1} onPress={this.onToggleDrawer} style={{ paddingLeft: 10, height: 44, width: 44, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={require('../../assets/images/ic_menu.png')} style={{ width: 24, resizeMode: 'contain', tintColor: 'white' }} />
                    </TouchableOpacity>
                </View>
                {
                    this.state.percent != 0 && this.state.percent != 100
                    &&
                    <View style={{ position: 'absolute', bottom: values.isIphoneX ? 35 : 15, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 }}>
                        <Text style={{ fontSize: 13, color: 'black', textAlign: 'center' }}>
                            <Text style={{ fontWeight: 'bold' }}>{'Ảnh được cập nhật '}</Text>
                            <Text>{this.state.percent + '%'}</Text>
                        </Text>
                    </View>
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    btnEditName: {
        width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20,
        alignItems: 'center', paddingVertical: 0, borderBottomWidth: 0.5, borderColor: '#dedede'
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default ProfileScreen