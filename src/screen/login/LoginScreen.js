import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  // AsyncStorage,
  KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage"
import firebase from 'react-native-firebase'
import { values, color, api, } from '../../config'
import { showApp } from '../../../App';

import { checkPhoneNumber, Toast, checkPhone } from '../../utils/Func';
import RNAccountKit, { LoginButton, StatusBarStyle, Color } from 'react-native-facebook-account-kit'
const FBSDK = require("react-native-fbsdk");
const { LoginManager, AccessToken, GraphRequest, GraphRequestManager } = FBSDK;

import { inject, observer } from 'mobx-react'
import EnterRegisterPhoneView from '../../component/EnterRegisterPhoneView';
import SimpleToast from 'react-native-simple-toast';
import _ from 'lodash'
@inject('User', 'OnApp')
@observer
class LoginScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true

  };
  constructor(props) {
    super(props);
    this.state = {
      isShowEnterPhone: false,
      info: null,
      tokenfb: null,
    }
    RNAccountKit.configure({
      responseType: 'token', // 'token' by default,
      titleType: 'login',
      initialAuthState: '',
      initialPhoneCountryPrefix: '+84', // autodetected if none is provided
      initialPhoneNumber: '',
      facebookNotificationsEnabled: true, // true by default
      readPhoneStateEnabled: true, // true by default,
      receiveSMS: true, // true by default,
      countryWhitelist: [], // [] by default 'VN'
      countryBlacklist: [], // [] by default
      defaultCountry: 'VN',
      theme: {
        backgroundColor: Color.hex('#ffffff'),
        buttonBackgroundColor: Color.hex('#f7a430'),
        buttonBorderColor: Color.hex('#f7a430'),
        buttonTextColor: Color.hex('#ffffff'),
        headerBackgroundColor: Color.hex('#f7a430'),
        headerButtonTextColor: Color.hex('#ffffff'),
        headerTextColor: Color.hex('#ffffff'),
        // Input
        inputBackgroundColor: Color.hex('#FAEBEA'),
        inputBorderColor: Color.hex('#FAEBEA'),
        inputTextColor: Color.hex('#000000'),
        // Others
        iconColor: Color.hex('#f7a430'),
        textColor: Color.hex('#464646'),
        titleColor: Color.hex('#000000'),
      } // for iOS only, see the Theme section
    })


    this.loginWithPhone = this.loginWithPhone.bind(this);
    this._getCurrentAccount = this._getCurrentAccount.bind(this);
    this.goToApp = this.goToApp.bind(this);
    this.getFCM = this.getFCM.bind(this);
  };

  async _getCurrentAccount() {
    let self = this;
    let { User, OnApp } = self.props;
    console.log('=================getCurrentAccount===================');
    console.log('User.fcmId: ' + User.fcmId);
    console.log('====================================');

    await RNAccountKit.getCurrentAccount()
      .then(function(account) {
        // {"id":"302539490546101","phoneNumber":{"countryCode":"84","number":"373343623"}}
        console.log(`Current account:` + JSON.stringify(account))
        let json = {
          // phone: account.phoneNumber.countryCode + '' + account.phoneNumber.number,
          phone: '0' + account.phoneNumber.number,
          fullname: null,
          avatar: null,
          tokenfb: null,
          fcmId: User.fcmId
        }
        User.login(json, (data, status) => {
          if (status) {
            console.log(status)
            OnApp.countNotif(User.token)
          }
        })
      }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        // ADD THIS THROW error
        throw error;
    })
  }

  goToApp() {
    setTimeout(() => {
      showApp()
    }, 500);
  };

  getFCM() {
    let { User,OnApp } = this.props;
    firebase.messaging().getToken()
        .then(fcmId => {
            if (fcmId != null && fcmId != '' && fcmId != undefined) {
                console.log('fcmId: ' + fcmId)
                AsyncStorage.setItem('fcmId', fcmId);
                User.fcmId = fcmId;
                OnApp.subscribeToTopic(fcmId);
            } else {
              this.getFCM()
            }
        })
}


  componentDidMount() {
    console.log('================componentDidMount ahihi====================');
    console.log(this.props.User.fcmId);
    if (!this.props.User.fcmId) {
      this.getFCM()
    }
    console.log('====================================');
  }

  loginWithServer = () => {

  }

  async loginWithPhone() {
    let self = this;
    await RNAccountKit.loginWithPhone()
      .then(token => {
        if (!token) {
          console.log("Login cancelled");
        } else {
          //  this.loginPhoneToServer(token);
          console.log(`Logged with phone. Token:` + JSON.stringify(token));
          self._getCurrentAccount()//lấy số điện thoại

          // Retrieves the logged user access token, if any user is logged
          self.goToApp()
        }
      })
      .catch(error => {
        console.log("log phone err");
      });
  }

  onClickLoginWithPhone = () => {
    this.loginWithPhone()


  }

  onClickLoginFb = () => {
    // showApp()
    // LoginManager.logOut();
    LoginManager.logInWithPermissions([
      "public_profile"
    ])
      .then(result => {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " + JSON.stringify(result)
          );

          AccessToken.getCurrentAccessToken()
            .then(data => {
              console.log('data.accessToken.toString(): ' + data.accessToken.toString());
              //   this.props.User.loginFBAccount(data.accessToken.toString());
              this.setState({
                tokenfb: data.accessToken.toString()
              });
              // this.log();

              // picture
              const infoRequest = new GraphRequest(
                `/me?fields=id,name&access_token=${
                this.state.tokenfb
                }`,
                null,
                this._responseInfoCallback.bind(this)
              );
              new GraphRequestManager().addRequest(infoRequest).start();
            })
            .catch(error => {
              console.log("error: " + error);
            });
        }
      })
      .catch(error => {
        // console.error(error)
        console.log("Login fail with error: " + error);
      });

  }

  _responseInfoCallback(error: ?Object, result: ?Object) {
    let self = this;
    let { User, OnApp } = self.props;
    console.log('================_responseInfoCallback====================');
    console.log('User.fcmId: ' + User.fcmId);
    console.log('====================================');
    if (error) {
      // console.error(error)
      console.log(error);
    } else {
      console.log("data:FB " + JSON.stringify(result));

      let json = {
        phone: '',
        fullname: result.name,
        avatar: `https://graph.facebook.com/${result.id}/picture?height=300&width=300`,
        tokenfb: self.state.tokenfb,
        idfacebook: result.id,
        fcmId: User.fcmId
      }
      this.setState({
        info: json
      })
      console.log('json: ',json)
      User.login(json, (data, status) => {
        console.log('data------: ' + JSON.stringify(data))
        if (status) {
          // OnApp.countNotif(User.token)
          if (!data.phone) {
            setTimeout(() => {
              self.setState({
                isShowEnterPhone: true
              })
            }, 500);
          } else {
            setTimeout(() => {
              showApp()
            }, 500);
          }
        }
      })

    }
  };

  dismissEnterRegisterPhone = () => {
    let { User } = this.props;

    this.setState({
      isShowEnterPhone: false
    })
    User.logout()
    LoginManager.logOut()

  };


  confirmPhone = (phone) => {
    let { OnApp, User } = this.props;
    //validate so dien thoai
    if (phone.trim() != '') {
      if (checkPhone(phone)) {
        //thong tin nguoi dung
        let { User } = this.props;
        let json = {
          "phone": phone,
          "fullname": User.userInfo.fullname,
          "avatar": User.userInfo.avatar,
          "userType": 1
        }
        console.log('json1: ' + JSON.stringify(json))
        User.updateInfo(json, (status) => {
          if (status) {
          } else {
          }
        })


        this.setState({
          isShowEnterPhone: false
        }, () => {
          showApp()
        })

      } else {
        SimpleToast.show('Vui lòng nhập đúng định dạng số điện thoại')
      }
    } else {
      SimpleToast.show('Bạn cần nhập số điện thoại')
    }
  }

  onClickSkip = () => {
    showApp()
  }
  render() {
    return (
      <KeyboardAvoidingView
        behavior='padding'
        style={styles.container}>

        <View style={{ paddingTop: 20, backgroundColor: 'transparent' }}>
          <Text style={{
            textAlign: 'center', fontWeight: '300', fontSize: 24, color: color.primaryColor,
            paddingHorizontal: 20, paddingBottom: 20,
          }}>Xin chào!</Text>
          <Text style={{
            textAlign: 'center', fontWeight: '300', fontSize: 18, paddingHorizontal: 20,
            color: color.LOGIN.colorTextDes
          }}>Đăng nhập vào tài khoản của bạn</Text>
        </View>
        <View style={{
          width: '100%', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'transparent', paddingBottom: 20, paddingHorizontal: 15,
        }}>

          <TouchableOpacity onPress={this.onClickLoginFb} style={[styles.btnLoginFb, styles.shadowFB]}>
            <Text style={styles.txtLoginFb}>{'Đăng nhập với Facebook'.toUpperCase()}</Text>
            <View style={[{
              position: 'absolute', backgroundColor: '#276cbc', left: 0, height: '100%', borderTopLeftRadius: 22.5, borderBottomLeftRadius: 22.5,
              justifyContent: 'center', alignItems: 'center'
            }, values.deviceWidth <= 320 ? { width: 30, } : { width: 40, }]}>
              <Image style={{ width: 17, resizeMode: 'contain', tintColor: 'white' }} source={require('../../assets/images/ic_fb.png')} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={1} onPress={this.onClickSkip} style={styles.btnSkip}>
          <Text style={styles.txtSkip}>Bỏ qua</Text>
        </TouchableOpacity>

        {
          this.state.isShowEnterPhone
            ?
            <EnterRegisterPhoneView
              dismiss={this.dismissEnterRegisterPhone}
              confirmPhone={this.confirmPhone} {...this.props} />
            : null
        }
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  txtLoginFb: { color: 'white', fontSize: 16, fontWeight: '500', },
  txtLogin: { color: 'white', fontSize: 16, fontWeight: '500', },
  txtSkip: { color: color.primaryColor, fontWeight: '300', fontSize: 14, },
  btnLoginFb: {
    width: "100%", backgroundColor: color.LOGIN.buttonLoginFB.bg, height: 45,
    borderRadius: 22.5, justifyContent: 'center', alignItems: 'center',

  },
  btnLogin: {
    width: "100%",
    backgroundColor: color.primaryColor, height: 45,
    borderRadius: 22.5, justifyContent: 'center', alignItems: 'center',
    marginVertical: 20,
  },
  btnSkip: {
    backgroundColor: 'transparent', height: 45, paddingHorizontal: 30,
    justifyContent: 'center', alignItems: 'center',
    position: 'absolute', bottom: 10,
  },

  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: { width: values.deviceWidth / 4, height: 70, resizeMode: 'contain' },
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
  shadowFB:
    values.platform == 'ios' ? {
      shadowColor: color.LOGIN.buttonLoginFB.bg,
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.65,
      shadowRadius: 7,
    }
      :
      { elevation: 7, },

  shadowPhone:
    values.platform == 'ios' ? {
      shadowColor: color.primaryColor,
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.65,
      shadowRadius: 7,
    }
      :
      { elevation: 7, marginBottom: 20, },
});

export default LoginScreen
