import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,

} from 'react-native';
import { values, color } from '../../../config';
import { checkPhone } from '../../../utils/Func';
import SimpleToast from 'react-native-simple-toast';

class EnterRegisterPhoneView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      phone: '',
    };
  };

  onChangeText = (text) => {
    this.setState({
      phone: text
    })
  }


  render() {
    return (
      <TouchableOpacity activeOpacity={1}
        style={{
          height: '100%', width: '100%', paddingHorizontal: 20, backgroundColor: '#00000070',
          justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0,
        }}>
        <View style={{ width: '100%', backgroundColor: '#E7E7E7', borderRadius: 12, }}>
          <Text style={{
            width: '100%', color: 'black', fontSize: 17, fontWeight: 'normal',
            textAlign: 'center', paddingTop: 20, paddingBottom: 10, paddingHorizontal: 20,
          }}>{'Bạn chưa đăng nhập'}</Text>
          <Text style={{
            width: '100%', color: 'black', fontSize: 13,
            fontWeight: 'normal', textAlign: 'center', paddingHorizontal: 15,
          }}>{'Vui lòng nhập số điện thoại của bạn'}</Text>
          <View style={{ width: '100%', paddingVertical: 15, paddingHorizontal: 20, }}>
            <TextInput
              underlineColorAndroid='transparent'
              style={styles.textInput}
              placeholderTextColor='#BBBDCB'
              value={this.state.phone}
              keyboardType='numeric'
              placeholder={'Ví dụ: 0972123456'}
              onChangeText={(text) => this.onChangeText(text)}
            />
          </View>
          <View style={{ width: '100%', flexDirection: 'row', backgroundColor: 'transparent', borderTopColor: color.borderColor_gray, borderTopWidth: 0.5 }}>
            <TouchableOpacity onPress={this.props.dismiss} activeOpacity={0.7} style={{ flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderRightColor: color.borderColor_gray, borderRightWidth: 0.5, }}>
              <Text style={{ fontSize: 17, fontWeight: 'normal', textAlign: 'center', color: color.primaryColor }}>{'Huỷ'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.confirmPhone(this.state.phone)} activeOpacity={0.7} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
              <Text style={{ fontSize: 17, fontWeight: 'normal', textAlign: 'center', color: color.primaryColor }}>{'OK'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  textInput: {
    backgroundColor: 'white', height: 40, paddingHorizontal: 5, borderRadius: 5,
    borderColor: color.borderColor_gray, borderWidth: 0.5
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default EnterRegisterPhoneView