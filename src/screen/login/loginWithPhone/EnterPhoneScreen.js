import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import color from "../../../config/color";
import { checkPhoneNumber, Toast } from '../../../utils/Func';
import RNAccountKit, { LoginButton,StatusBarStyle,Color } from 'react-native-facebook-account-kit'
class EnterPhoneScreen extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setStyle({
      // navBarHidden:true,
      topBarElevationShadowEnabled: false,
      navBarButtonColor: "white",
      statusBarHidden: false,
      navBarTextColor: "#FFFFFF",
      statusBarTextColorScheme: "light"
    });
    this.state = {
      phone: '01296100196'
    }
    

  };
  componentDidMount(){

  }

  onClickNext = () => {
    // RNAccountKit.getCurrentAccount().then(account => {
    //   console.log(`Current access token: ${account}`);
    //   //   this.props.User.loginAccountKit(token);
    // });
    RNAccountKit.loginWithPhone()
      .then(token => {
        if (!token) {
          console.log("Login cancelled");
        } else {
          //  this.loginPhoneToServer(token);
          console.log(`Logged with phone. Token:` + JSON.stringify(token));
        }
      })
      .catch(error => {
        console.log("log o");
      });


    // this.props.navigator.push({
    //   screen: 'ConfirmLoginScreen',
    //   title: 'Mã xác nhận',
    //   passProps: { phone: this.state.phone }
    // });
    // if (checkPhoneNumber(this.state.phone)) {
    //   Toast("Gửi mã xác nhận")
    //   this.props.navigator.push({
    //     screen: 'ConfirmLoginScreen',
    //     title: 'Mã xác nhận'
    //   });
    // } else {
    //   Toast("Không đúng định dạng số điện thoại")
    // }
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '500', color: 'black' }}>Nhập số điện thoại của bạn</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: 'http://flagsvancouver.com/fotw/images/v/vn.gif' }} style={{ height: 30, width: 30, resizeMode: 'contain' }} />
            <TextInput
              style={styles.txtInpPhone} placeholder="0123456789" value={this.state.phone} onChangeText={(phone) => { this.setState({ phone }) }} />
          </View>
        </View>
        <TouchableOpacity
          style={styles.touClickNext}
          onPress={this.onClickNext}
        >
          <Image style={styles.imgArrow} source={require('../../../assets/images/icArrowRight.png')} />
        </TouchableOpacity>
        {/* <LoginButton/> */}

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  txtInpPhone: { flex: 1, fontSize: 17, marginLeft: 10 },
  imgArrow: { height: 30, width: 30, resizeMode: 'contain' },
  touClickNext: { justifyContent: 'center', alignItems: 'center', backgroundColor: color.primaryColor, height: 50, width: 50, borderRadius: 25, overflow: 'hidden', position: 'absolute', right: 20, bottom: 20 },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: 20,
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

export default EnterPhoneScreen