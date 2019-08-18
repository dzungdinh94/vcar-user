import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import MapView, { Marker, Callout, Polyline, PROVIDER_GOOGLE, AnimatedRegion, Animated } from 'react-native-maps';
import { inject, observer } from 'mobx-react/native'
import MarkerMeView from './MarkerMeView';
import PolylineView from './PolylineView';
import { config, mapStyle } from '../../../config';
import MarkerDirectView from './MarkerDirectView';
import MarkerStartAdressView from './MarkerStartAdressView';
import MarkerEndAdressView from './MarkerEndAdressView';
import MarkerCarView from './MarkerCarView';
import MarkerCarDriverView from './MarkerCarDriverView';

@inject('Home')
@observer
class MapViewScreen extends Component {

    render() {
        let { Home } = this.props;
        return (
            <MapView.Animated
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={Home.myPosition}
                customMapStyle={mapStyle}
                loadingEnabled
                ref={(ref) => this.mapRef = ref}
            >
                <MarkerCarView />
                {/* < Marker
                    // onPress={}
                    coordinate={{ "latitude": 21.036572, "longitude": 105.805550 }
                    }
                    anchor={{ x: 0.5, y: 0.5 }}
                    image={require('../../../assets/images/xebagac.png')}
                />
                <Marker
                    // onPress={}
                    coordinate={{ "latitude": 21.006195, "longitude": 105.843175 }}
                    anchor={{ x: 0.5, y: 0.5 }}
                    image={require('../../../assets/images/xebagac.png')}
                />
                <Marker
                    // onPress={}
                    coordinate={{ "latitude": 21.040032, "longitude": 105.815849 }}
                    anchor={{ x: 0.5, y: 0.5 }}
                    image={require('../../../assets/images/xebantai.png')}
                />
                <Marker
                    // onPress={}
                    coordinate={{ "latitude": 21.004459, "longitude": 105.793018 }}
                    anchor={{ x: 0.5, y: 0.5 }}
                    image={require('../../../assets/images/xe_tai.png')}
                /> */}
                <MarkerStartAdressView />
                <MarkerEndAdressView />
                <MarkerMeView />
                <MarkerDirectView />
                {/* <PolylineView /> */}

                {/* Xe của lái xe trong màn hình xe đang đến */}
                <MarkerCarDriverView />
            </MapView.Animated >
        );
    }
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    }
});

export default MapViewScreen