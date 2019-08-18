//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import { inject, observer } from 'mobx-react/native'
import { toJS } from "mobx"
import MapView, { Marker, Callout, Polyline, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import { values, color, getTimeBetweenTwoDatetimes, } from '../../../config';
import _ from 'lodash'
import screenId from '../../../config/screenId';

@inject('EnterAddress', 'Home')
@observer
class MarkerStartAdressView extends Component {

    render() {
        let { EnterAddress, Home } = this.props;
        let coordinate = {};
        if (EnterAddress.startAddress != values.addressDefault) {
            coordinate = { latitude: EnterAddress.startAddress.latitude, longitude: EnterAddress.startAddress.longitude }
        }
        return (
            (Home.screenType != screenId.HOME.screenType.start
                &&
                Home.screenType != screenId.HOME.screenType.findCar
                &&
                EnterAddress.startAddress != values.addressDefault)
                ?
                <Marker
                    // onPress={}
                    coordinate={coordinate}
                    ref={(ref) => { this.mapRef = ref }}
                    anchor={{ x: 0.5, y: 0.5 }}
                    image={require('../../../assets/images//startLocation.png')}
                />
                :
                null
        );
    }
}

export default MarkerStartAdressView;
