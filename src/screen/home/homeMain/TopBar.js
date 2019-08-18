import React, {Component} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { color } from '../../../config';
import { inject, observer } from 'mobx-react/native'
import Utils from '../../../utils/Utils'

@inject('User', 'Home', 'EnterAddress')
@observer
class TopBar extends Component {
    render() {
        const { setFalse, Home, EnterAddress } = this.props;
        const address = Home.isStartCheck === true ? EnterAddress.startAddress.title : EnterAddress.endAddress.title
        return (
            <View 
                style={{
                    paddingTop: Utils.isIphoneX() ? 34 : 20,
                    backgroundColor: 'white',
                    position: 'absolute',
                    zIndex: 999,
                    top: 0,
                    left: 0,
                    right: 0,
                    minHeight: 60,
                    paddingHorizontal: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <TouchableOpacity onPress={() => setFalse()}>
                    <Image
                        style={{ width: 24, height: 24, resizeMode: 'contain', tintColor: color.primaryColor }}
                        source={require('../../../assets/images/arrow-back.png')} />
                </TouchableOpacity>
                <Text style={{ paddingHorizontal: 15 }} numberOfLines={1}>{address}</Text>
                <Image
                        style={{ width: 24, height: 24, resizeMode: 'contain', tintColor: 'white' }}
                        source={require('../../../assets/images/arrow-back.png')} />
            </View>
        );
    }
}

export default TopBar;