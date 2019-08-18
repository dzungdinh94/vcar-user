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
import numeral from 'numeral'
import { inject, observer } from 'mobx-react/native'
@inject('Home')
@observer
class EnterExtraServiceView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      phone: '',
    };
  };

  render() {
    let { Home } = this.props;
    return (
      <TouchableOpacity activeOpacity={1}
        style={{
          height: '100%', width: '100%', paddingHorizontal: 30, backgroundColor: '#00000070',
          justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0,
        }}>
        <View style={{ width: '100%', backgroundColor: '#E7E7E7', borderRadius: 12, }}>
          <Text style={{
            width: '100%', color: 'black', fontSize: 17, fontWeight: 'normal',
            textAlign: 'center', paddingTop: 20, paddingBottom: 10, paddingHorizontal: 20,
          }}>{'Dịch vụ hỗ trợ'}</Text>
          <Text style={{
            width: '100%', color: 'rgba(0, 0, 0, 0.55)', fontSize: 13,
            fontWeight: 'normal', textAlign: 'center', paddingHorizontal: 15, paddingBottom: 20,
          }}>
            {/* <Text>
              {'Mang đến sự phục vụ tốt hơn Vcar có thêm dịch vụ hỗ trợ khách hàng chuyển đồ ra xe và chuyển đồ vào nhà. Giá '}
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'rgba(0, 0, 0, 0.80)' }}>{
                (Home.serviceAttach && Home.serviceAttach[0] && Home.serviceAttach[0].price) ? (numeral(Home.serviceAttach[0].price).format('0,0').toString() + ' đồng') : '0 đồng'
              }</Text>
            </Text>
            <Text>{'/ người. Cảm ơn quý khách đã sử dụng dịch vụ.'}</Text> */}
            <Text>Mang đến dịch vụ khách hàng tốt hơn V-car cung cấp dịch vụ đặt xe trước tại </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'rgba(0, 0, 0, 0.80)' }}>v-car.vn </Text>
            <Text>và dịch vụ thuê xe theo ngày tại </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'rgba(0, 0, 0, 0.80)' }}>xedulichquynhon.vn</Text>
            <Text>! Cám ơn quý khách đã sử dụng dịch vụ! </Text>
          </Text>


          <View style={{ width: '100%', flexDirection: 'row', backgroundColor: 'transparent', borderTopColor: color.borderColor_gray, borderTopWidth: 0.5 }}>
            <TouchableOpacity onPress={this.props.dismiss} activeOpacity={0.7} style={{ flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderRightColor: color.borderColor_gray, borderRightWidth: 0.5, }}>
              <Text style={{ fontSize: 17, fontWeight: '300', textAlign: 'center', color: color.primaryColor }}>{'Bỏ qua'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.confirmExtraService} activeOpacity={0.7} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
              <Text style={{ fontSize: 17, fontWeight: 'normal', textAlign: 'center', color: color.primaryColor }}>{'Đồng ý'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity >
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

export default EnterExtraServiceView