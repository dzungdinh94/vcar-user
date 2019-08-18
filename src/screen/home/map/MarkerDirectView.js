//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import { inject, observer } from 'mobx-react/native'
import { toJS } from "mobx"
import MapView, { Marker, Callout, Polyline, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import { values, color, getTimeBetweenTwoDatetimes, } from '../../../config';
import { getDegree } from '../../../utils/Func'
import _ from 'lodash'
import screenId from '../../../config/screenId';

@inject('Home')
@observer
class MarkerDirectView extends Component {

    // componentDidMount() {
    //     var self = this;
    //     let { Home } = this.props;
    //     interval = setInterval(function () {
    //         if (_.size(Home.listCoords) > 0) {
    //             if (Home.indexArray < _.size(Home.listCoords) - 1) {
    //                 self.updateCoordinate()
    //             } else {
    //                 setTimeout(() => {
    //                     Home.resetPlayBack()
    //                 }, 1500);
    //                 self.updateCoordinate()

    //             }

    //         } else {//chay den cuoi mang
    //         }
    //     }, 250)
    // }
    // updateCoordinate = () => {
    //     let self = this;
    //     let { Home } = this.props;
    //     let { step, listCoords, indexArray } = this.props.Home;

    //     if (_.size(listCoords) > 0) {
    //         //Nếu  vị trí hiện tại tồn tại; vị trí tiếp theo (vị trí hiện tại + step) tồn tại
    //         // if ()100/0.25

    //         if (
    //             listCoords
    //             && ((indexArray + step) <= listCoords.length - 1)
    //             && listCoords[indexArray + step]
    //             && listCoords[indexArray + step] != undefined
    //         ) {
    //             // console.log('---------------------------listCoords[indexArray + step]: ' + JSON.stringify(listCoords[indexArray + step]))
    //             //Nếu  vị trí hiện tại tồn tại; vị trí tiếp theo (vị trí hiện tại + step) tồn tại
    //             // => item next chisnh laf listCoords[current + step]
    //             let startPoint = listCoords[indexArray];
    //             let endPoint = listCoords[indexArray + step];

    //             Home.updateRotateCoordMarkerDirect(getDegree(startPoint, endPoint))

    //             Home.updateCoordMarkerDirect(listCoords[indexArray + step])

    //             Home.indexArray += parseInt(step);

    //             // if (
    //             //     (Math.abs(Home.coordDirection.latitude - Home.myPosition.latitude) < Home.myPosition.latitudeDelta / 2)
    //             //     &&
    //             //     (Math.abs(Home.coordDirection.longitude - Home.myPosition.longitude) < Home.myPosition.longitudeDelta / 2)
    //             // ) {
    //             // } else {
    //             //     Home.updatePosition(endPoint.latitude, endPoint.longitude)
    //             // }
    //         } else {
    //             // nếu vị trí listCoords[current + strep_up] khong ton tai thi tìm item gần nó nhất tồn tại, bằng cách
    //             //     => chính là vị trí listCoords.length - 1
    //             if (indexArray < (listCoords.length)) {
    //                 let startPoint = listCoords[indexArray];
    //                 let endPoint = listCoords[listCoords.length - 1]
    //                 Home.updateRotateCoordMarkerDirect(getDegree(startPoint, endPoint))
    //                 Home.updateCoordMarkerDirect(listCoords[listCoords.length - 1])
    //                 Home.indexArray = listCoords.length - 1;
    //             }
    //             // if (
    //             //     (Math.abs(Home.coordDirection.latitude - Home.myPosition.latitude) < Home.myPosition.latitudeDelta / 2)
    //             //     &&
    //             //     (Math.abs(Home.coordDirection.longitude - Home.myPosition.longitude) < Home.myPosition.longitudeDelta / 2)
    //             // ) {
    //             // } else {
    //             //     Home.updatePosition(endPoint.latitude, endPoint.longitude)
    //             // }


    //         }
    //     } else {

    //     }
    // }

    // componentWillUnmount() {
    //     var self = this;
    //     clearInterval(interval)
    // };
    render() {
        let { Home } = this.props;
        // console.log('Home.rotateMarkerDirect: ' + Home.rotateMarkerDirect)
        return (
            (Home.screenType != screenId.HOME.screenType.start
                &&
                Home.screenType != screenId.HOME.screenType.findCar
                &&
                Home.coordDirection && _.size(Home.coordDirection) > 0)
                ?
                <Marker
                    coordinate={  { "latitude": 221.004459, "longitude": 105.793018 }}
                    // ref={(ref) => { this.mapRef = ref }}
                    // anchor={{ x: 0.5, y: 0.5 }}
                    // calloutVisible={true}
                    // rotation={(Home.rotateMarkerDirect)}
                    // image={require('../../../assets/images/ic_direct.png')}
                />  
                :
                null
        );
    }
}

export default MarkerDirectView;
