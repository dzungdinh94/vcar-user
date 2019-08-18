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
class MarkerCarDriverView extends Component {

    render() {
        let { EnterAddress, Home } = this.props;
        console.log(Home.infoDriver,"info driver");
        return (
            (
                Home.screenType == screenId.HOME.screenType.carIsComming
                &&
                Home.infoDriver.coordinate)
                ?
                <Marker
                    // onPress={}
                    coordinate={Home.infoDriver.coordinate}
                    ref={(ref) => { this.mapRef = ref }}
                    anchor={{ x: 0.5, y: 0.5 }}
                    image={require('../../../assets/images//endLocation.png')}
                />
                :
                null
        );
    }
}

export default MarkerCarDriverView;
