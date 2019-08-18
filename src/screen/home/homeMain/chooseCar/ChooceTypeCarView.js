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
  Alert
} from 'react-native';
import { values, color } from '../../../../config';
import Carousel from 'react-native-snap-carousel';
import ChooceTypeCarViewFlatListItem from './ChooceTypeCarViewFlatListItem';
import ViewShadow from '../../../../component/ViewShadow';
import * as Animatable from 'react-native-animatable';
import AnimationMap from '../../../../component/toatoaAbc'
import LinearGradient from 'react-native-linear-gradient';

import { inject, observer } from 'mobx-react'
import User from '../../../../store/User';
@inject('Home', 'EnterAddress')
@observer
class ChooceTypeCarView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // data: [{
      //   'id': 1,
      //   'title': 'Xe thương binh',
      //   'icon': require('../../../../assets/images/xe-ba-gac.png'),
      //   price: '90000',
      //   time: '10 phút'
      // },
      // {
      //   'id': 2,
      //   'title': 'Xe tải',
      //   'icon': require('../../../../assets/images/xe-tai.png'),
      //   price: '140000',
      //   time: '11 phút'
      // },
      // {
      //   'id': 3,
      //   'title': 'Xe bán tải',
      //   'icon': require('../../../../assets/images/xe-ban-tai.png'),
      //   price: '120000',
      //   time: '9 phút'
      // }]
    };

    this.renderItem = this.renderItem.bind(this);
  };

  clickItem = (item) => {
    console.log('item: ' + JSON.stringify(item))
    this.props.Home.updateItemTypeCarSelected(item)
  }

  renderItem({ item }) {
    return (
      <ChooceTypeCarViewFlatListItem clickItem={this.clickItem} item={item} />
    );
  }

  findCar = () => {
    this.props.findCar()
  }

  goBack = () => {
    let { Home, EnterAddress } = this.props;
    Home.resetToHome()
    EnterAddress.resetToHomeEnterAdress()


  }

  render() {
    let { Home } = this.props;
    console.log('Home.listTypeCar: ' + JSON.stringify(Home.listTypeCar))
    return (
      <View
        //   onLayout={(event) => {
        //     console.log('du lieu ChooceTypeCarViewFlatListItem: ' + JSON.stringify(event.nativeEvent.layout))
        // }}
        style={[{
          width: '100%', paddingHorizontal: 10,
          // paddingBottom: 10,
          // bottom: 0, position: 'absolute'
        },
          // styles.shadow
        ]}>
        <View style={{
          width: '100%', backgroundColor: 'white', borderRadius: 12
        }}>
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
              color: 'rgba(0, 0, 0, 0.85)',
              fontSize: 18, fontWeight: 'normal', paddingTop: 10, paddingBottom: 5,
              width: '100%', paddingHorizontal: 10, textAlign: 'center'
            }}>{'Chọn loại xe'}</Text>
            <TouchableOpacity activeOpacity={0.7}
              onPress={this.goBack}
              style={{ backgroundColor: 'transparent', paddingTop: 10, width: 30, paddingBottom: 5, position: 'absolute', left: 10, justifyContent: 'center' }}>
              <Image style={{ width: 24, height: 24, resizeMode: 'contain', tintColor: color.primaryColor }}
                source={require('../../../../assets/images/ic_arrow_left.png')}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            style={{ width: '100%', backgroundColor: 'transparent', maxHeight: values.deviceHeight / 2 - 100, paddingTop: 10, }}
            data={Home.listTypeCarChooseCar}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
          />
          <View style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 10 }}>
            <ViewShadow
              onPress={this.findCar}
              height={40}
              backgroundColor={color.primaryColor}
              shadowColor={color.primaryColor}
              colorText={'white'}
              textTitle={'TÌM XE'}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  shadow:
    values.platform == 'ios' ? {
      shadowColor: '#000000',
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
    }
      :
      { elevation: 2, marginBottom: 3, },
});
export default ChooceTypeCarView;