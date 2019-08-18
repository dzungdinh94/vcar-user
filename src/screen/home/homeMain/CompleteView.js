import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, } from 'react-native';
import { values, color } from '../../../config';
import RenderStart from '../../../component/RenderStart';
import RenderStartVote from '../../../component/RenderStartVote';
import SimpleToast from '../../../../node_modules/react-native-simple-toast';

import { inject, observer } from 'mobx-react/native'

@inject('User', 'Home', 'EnterAddress')
@observer
export default class CompleteView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowView: false,
      star: 4,
    };
  }

  clickCall = () => {

  };

  changeView = () => {
    this.setState({
      isShowView: !this.state.isShowView
    })
    // const move = Animated.timing(
    //     this.state.heightView,
    //     {
    //         toValue: 1,
    //         duration: 1000
    //     })
  }

  hiddenView = () => {
    let { Home, EnterAddress, User } = this.props;
    console.log('star: ' + this.state.star)
    Home.rate(User.token, this.state.star)
    Home.resetToHome()
    EnterAddress.resetToHomeEnterAdress()
    this.props.hiddenView()
  }

  componentWillUnmount() {
    this.setState({ star: 4 })
  }

  render() {
    let { EnterAddress, Home, User } = this.props;
    // const heightView = this.state.heightView.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: [this.state.heightViewChild, this.state.heightViewParent],
    // })
    return (
      <TouchableOpacity activeOpacity={1}
        style={{
          flex: 1, width: '100%', height: '100%', paddingHorizontal: 20, backgroundColor: '#00000070',
          justifyContent: 'center', alignItems: 'center',
          position: 'absolute',
        }}>
        <View style={{ width: '100%', backgroundColor: '#E7E7E7', borderRadius: 12, }}>
          <Text style={{
            width: '100%', color: 'black', fontSize: 17, fontWeight: 'normal',
            textAlign: 'center', paddingVertical: 20, paddingHorizontal: 20,
          }}>{'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!'}</Text>
          <Text style={{ width: '100%', color: 'rgba(0, 0, 0, 0.45)', fontSize: 13, fontWeight: 'normal', textAlign: 'center', paddingHorizontal: 15, }}>{'Mời bạn đánh giá chất lượng dịch vụ'}</Text>
          <View style={{ width: '100%', paddingVertical: 15, }}>
            <RenderStartVote
              voteStar={(star) => { this.setState({ star: star }) }}
              styleImgStart={{ width: 28, height: 28, resizeMode: 'contain', tintColor: color.primaryColor }}
            />
          </View>
          <View style={{ width: '100%', flexDirection: 'row', backgroundColor: 'transparent', borderTopColor: '#4d4d4d', borderTopWidth: 0.5 }}>
            <TouchableOpacity onPress={this.hiddenView} activeOpacity={0.7} style={{ flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderRightColor: '#4d4d4d', borderRightWidth: 0.5, }}>
              <Text style={{ fontSize: 17, fontWeight: 'normal', textAlign: 'center', color: color.primaryColor }}>{'Huỷ'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.hiddenView} activeOpacity={0.7} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
              <Text style={{ fontSize: 17, fontWeight: 'normal', textAlign: 'center', color: color.primaryColor }}>{'OK'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity >
    );
  }
}
const styles = StyleSheet.create({

  shadow:
    values.platform == 'ios' ? {
      shadowColor: 'gray',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
    }
      :
      { elevation: 2, marginBottom: 3, },
});
