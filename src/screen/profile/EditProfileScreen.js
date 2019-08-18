import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import color from '../../config/color'
import { checkPhoneNumber, Toast, checkPhone } from '../../utils/Func';
import NavBarCustom from '../../component/NavBarCustom';
import ViewShadow from '../../component/ViewShadow';
import SimpleToast from 'react-native-simple-toast';
import { inject, observer } from 'mobx-react'
import { Navigation } from 'react-native-navigation';
@inject('User', 'OnApp')
@observer
class EditProfileScreen extends Component {
    static navigatorStyle = {
        // drawUnderNavBar: false,
        // navBarTranslucent: false,
        // navBarBackgroundColor: color.primaryColor,
        // navBarTextColor: 'white',
        // navBarButtonColor: 'white'
        navBarHidden: true,
    };

    static navigatorButtons = {
        leftButtons: [
            {
                id: 'back',
                // icon: require('../../assets/images/ic_menu.png'),
                icon: require('../../assets/images/ic_arrow_left.png'),
            }
        ]
    }
    constructor(props) {
        super(props);
        this.state = {
            values: this.props.values,
            type: this.props.type,
            isLoading: false,
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
    }

    onNavigatorEvent(event) {
        if (event.type == 'NavBarButtonPress') {
            if (event.id == 'back') {
                Navigation.pop(this.props.componentId)
                // this.onToggleDrawer()
            }
        }
    };

    onClickUpdate = () => {
        Keyboard.dismiss()
        let { User } = this.props;
        switch (this.state.type) {
            case 'name':
                if (this.state.values.trim() != '') {
                    let json = {
                        "phone": User.userInfo.phone,
                        "fullname": this.state.values,
                        "avatar": User.userInfo.avatar,
                        "userType": 1
                    }
                    this.setState({ isLoading: true })
                    User.updateInfo(json, (status) => {
                        this.setState({ isLoading: false })
                        if (status) {
                            SimpleToast.show('Cập nhật họ tên thành công')
                            User.setFullname(this.state.values)
                            Navigation.pop(this.props.componentId);
                        } else {
                            SimpleToast.show('Cập nhật  họ tên thất bại!')
                        }
                    })
                } else {
                    SimpleToast.show('Bạn cần nhập họ tên!')
                }

                break;

            case 'phone':
                if (this.state.values.trim() != '') {
                    if (checkPhone(this.state.values)) {
                        let json = {
                            "phone": this.state.values,
                            "fullname": User.userInfo.fullname,
                            "avatar": User.userInfo.avatar,
                            "userType": 1
                        }
                        this.setState({ isLoading: true })
                        User.updateInfo(json, (status) => {
                            this.setState({ isLoading: false })
                            if (status) {
                                SimpleToast.show('Cập nhật số điện thoại thành công')
                                User.setPhone(this.state.values)
                                Navigation.pop(this.props.componentId)
                            } else {
                                SimpleToast.show('Cập nhật số điện thoại thất bại!')
                            }
                        })
                    } else {
                        SimpleToast.show('Bạn cần nhập đúng định dạng là số điện thoại!')
                    }
                } else {
                    SimpleToast.show('Bạn cần nhập số điện thoại')
                }

                break;

        }
    }


    render() {
        let { type } = this.props;
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => { Keyboard.dismiss() }} style={{ flex: 1, width: '100%' }}>
                <KeyboardAvoidingView behavior='padding' style={styles.container}>
                    <NavBarCustom
                        leftButton={require('../../assets/images/ic_arrow_left.png')}
                        onPress={() => { Navigation.pop(this.props.componentId); }}
                        title={type == 'phone' ? 'Số điện thoại' : 'Họ và tên'}
                    />
                    <View style={{
                        flex: 1,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        paddingHorizontal: 20,
                    }}>
                        <TextInput style={{ width: '100%', height: 45, borderRadius: 7, paddingHorizontal: 5, borderColor: '#dedede', borderWidth: 0.5 }}
                            underlineColorAndroid="transparent"
                            value={this.state.values}
                            clearButtonMode='while-editing'
                            placeholder={type == 'phone' ? 'Số điện thoại bạn ..' : 'Họ và tên bạn ..'}
                            onChangeText={(values) => { this.setState({ values }) }}
                        />
                        <View style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 40 }}>
                            <ViewShadow
                                onPress={this.onClickUpdate}
                                height={45}
                                backgroundColor={color.primaryColor}
                                shadowColor={color.primaryColor}
                                colorText={'white'}
                                textTitle={'CẬP NHẬT'}
                            />
                        </View>
                    </View>
                    {
                        this.state.isLoading
                        &&
                        <View style={styles.blackView} >
                            <View style={{
                                width: 100, height: 100, borderRadius: 10, backgroundColor: '#00000080',
                                justifyContent: 'center', alignItems: 'center'
                            }}>
                                <ActivityIndicator size='large' color='white' />
                            </View>
                        </View>
                    }
                </KeyboardAvoidingView>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
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
    blackView: {
        height: '100%', width: '100%', backgroundColor: 'transparent',
        position: 'absolute', justifyContent: 'center', alignItems: 'center'
    }
});

export default EditProfileScreen