//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import { inject, observer } from 'mobx-react/native'
import { toJS } from "mobx"
import MapView, { Marker, Callout, Polyline, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import { values, color, getTimeBetweenTwoDatetimes, } from '../../../config';
import _ from 'lodash'
import screenId from '../../../config/screenId';

@inject('Home')
@observer
class MarkerCarView extends Component {

    render() {
        let { Home } = this.props;
        // console.log('Home.listCarAvailable: ' + JSON.stringify(Home.listCarAvailable))
        return (
            (Home.listCarAvailable && _.size(Home.listCarAvailable) > 0
                &&
                Home.screenType != screenId.HOME.screenType.findCar
                &&
                Home.screenType != screenId.HOME.screenType.carIsComming
            )
                ?
                Home.listCarAvailable.map((item, index) => {
                    return (
                        item.latitude && item.longitude
                            ?
                            <Marker
                                // onPress={}
                                key={index}
                                coordinate={{ latitude: toJS(item.latitude), longitude: toJS(item.longitude) }}
                                ref={(ref) => { this.mapRef = ref }
                                }
                                anchor={{ x: 0.5, y: 0.5 }}
                                image={

                                    item.typeCarId == 1//Thuowng binh
                                        ?
                                        require('../../../assets/images/xebagac.png')
                                        :
                                        item.typeCarId == 3//Xe ban Tai
                                            ?
                                            require('../../../assets/images/xebantai.png')
                                            :
                                            item.typeCarId == 2//Xe  Tai
                                            &&
                                            require('../../../assets/images/xe_tai.png')
                                }
                            />
                            :
                            null
                    )
                })
                :
                null
        );
    }
}

export default MarkerCarView;
