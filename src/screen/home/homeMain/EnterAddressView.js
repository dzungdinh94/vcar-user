import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Button } from 'react-native';
import { values, color, status_api_google } from '../../../config';
import _ from 'lodash'

import ViewShadow from '../../../component/ViewShadow';
import SimpleToast from 'react-native-simple-toast';
import ViewTextInputEnd from './ViewTextInputEnd';
import ViewTextInputStart from './ViewTextInputStart';
import ViewTextInputDescription from './ViewTextInputDescription';
import { inject, observer } from 'mobx-react/native'
import { getSuggestAddress, getAddressFromLatlng, getLocationFromPlaceId } from '../../../utils/Func';
import SuggestAddressView from '../enterAddress/SuggestAddressView';
import { toJS } from 'mobx';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

@inject('User', 'Home', 'EnterAddress')
@observer
export default class EnterAddressView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isStart: false,
            isEnd: false
        };

        this.getDataGetSuggest = _.debounce(this.getDataGetSuggest.bind(this), 700);
    }


    componentDidMount() {
        // this.refs.scrollView.scrollResponderHandleStartShouldSetResponderCapture;
        // this.refs.scrollView.scrollResponderHandleStartShouldSetResponderCapture = e => {
        //     // if (e.dispatchMarker.indexOf('buttonNext') > -1) {
        //         return false;
        //     // }
        //     // return scrollViewPressHandler(e);
        // }
    }
    clearDataSearch = () => {
        this.props.EnterAddress.clearLissAddress()
    }

    clearTextInput = type => {
        let { EnterAddress } = this.props;
        switch (type) {
            case 'startAddress':
                EnterAddress.clearStartAddress()
                EnterAddress.clearLissAddress()

                EnterAddress.clearEndAddress()
                EnterAddress.clearLissAddress()
                break;
            case 'endAddress':
                EnterAddress.clearEndAddress()
                EnterAddress.clearLissAddress()
                break;

            case 'description':
                EnterAddress.clearDescription();
                break;

            default:
                break;
        }
    }

    getDataGetSuggest(type, text) {
        let { EnterAddress } = this.props;
        switch (type) {
            case 'startAddress':
                EnterAddress.onIsGetSuggestAddressStart()
                getSuggestAddress(text, (data, status) => {
                    EnterAddress.offIsGetSuggestAddressStart()
                    if (status) {
                        console.log(data,"data kakaa");
                        EnterAddress.setListAddress(data);
                    } else {
                    }
                })
                break;

            default:
                //endAddress
                EnterAddress.onIsGetSuggestAddressEnd()
                getSuggestAddress(text, (data, status) => {
                    EnterAddress.offIsGetSuggestAddressEnd()
                    if (status) {
                        EnterAddress.setListAddress(data);
                    } else {
                        console.log('datatext: ' + data)
                    }
                })
                break;
        }
    };


    onChangeText = (type, text) => {
        
        let { EnterAddress } = this.props;
        switch (type) {
            case 'startAddress':
                EnterAddress.setStartAddressTitle(text);
                console.log('text Start: ' + text + type)
                // this.getMyLocation()
                if (text.trim() != '') {
                    EnterAddress.typeAddress = values.typeAddress.startAddress
                    if (text.trim().length > 2) {
                        this.getDataGetSuggest('startAddress', text)
                    }
                } else {
                    EnterAddress.clearStartAddress()
                    console.log('EnterAddress.startAddress: ' + JSON.stringify(EnterAddress.startAddress))
                    if (this.props.EnterAddress.listAddress.length > 0) { this.props.EnterAddress.clearLissAddress() }
                }
                break;
            case 'endAddress':
                EnterAddress.setEndAddressTitle(text);
                if (text.trim() != '') {
                    EnterAddress.typeAddress = values.typeAddress.endAddress
                    if (text.trim().length > 2) {
                        this.getDataGetSuggest('endAddress', text)
                    }
                } else {
                    EnterAddress.clearEndAddress()
                    if (this.props.EnterAddress.listAddress.length > 0) { this.props.EnterAddress.clearLissAddress() }

                }
                break;

            case 'description':
                if (text.trim() != '') {
                    EnterAddress.description = text
                } else {
                    EnterAddress.clearDescription()
                }

                break;

            default:
                //phone
                this.setState({
                    phone: text
                })
                break;
        }
    }

    getMyLocation = (type) => {
        let { EnterAddress, Home } = this.props;
        if (type == 'startAddress') {
            EnterAddress.onIsGetSuggestAddressStart()

            getAddressFromLatlng(Home.markerMe.latitude, Home.markerMe.longitude, (data, status) => {
                EnterAddress.offIsGetSuggestAddressStart()
                if (status) {
                    if (data && _.size(data) > 0) {
                        // console.log('~~~~~~~~~~~~~~start address~~~~~~~~~~~~~~~~~~~~~: ' + JSON.stringify(data))
                        EnterAddress.setStartAddress(Home.markerMe.latitude, Home.markerMe.longitude, data[0].formatted_address)
                    }
                }
            })
        } else {
            EnterAddress.onIsGetSuggestAddressEnd()
            getAddressFromLatlng(Home.markerMe.latitude, Home.markerMe.longitude, (data, status) => {
                EnterAddress.offIsGetSuggestAddressEnd()
                if (status) {
                    if (data && _.size(data) > 0) {
                        EnterAddress.setEndAddress(Home.markerMe.latitude, Home.markerMe.longitude, data[0].formatted_address)
                    }
                }
            })
        }
    }

    clickContinue = () => {
        this.props.clickContinue()
        // buttonDrawer=null;
    }

    clickItemSuggest = (item) => {
        let { EnterAddress } = this.props;

        getLocationFromPlaceId(item.place_id, (data, status) => {

            if (status) {
                if (EnterAddress.typeAddress == values.typeAddress.startAddress) {
                    EnterAddress.setStartAddress(data.result.geometry.location.lat, data.result.geometry.location.lng, item.description);
                } else {
                    EnterAddress.setEndAddress(data.result.geometry.location.lat, data.result.geometry.location.lng, item.description);
                }
            }

        })
        this.clearDataSearch()

    }

    // handleCheckStart = (data) => {
    //     this.setState({
    //         isStart: data
    //     })
    // }
    // handleCheckEnd = (data) => {
    //     this.setState({
    //         isEnd: data
    //     })
    // }
    render() {
        let { EnterAddress, Home, setFalse, handleCheckEnd, handleCheckStart } = this.props;
        console.log(toJS(EnterAddress.listAddress), "EnterAddress.listAddress");
        return (
            // <View style={{flex: 1}}>
            <ScrollView style={{ width: '100%', position: 'absolute', bottom: 0, zIndex: 999 }}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}
            >
                {(Home.isStartCheck === false && Home.isEndCheck === false) ? (
                    <View style={{ width: '100%', paddingBottom: 15, paddingHorizontal: 15, bottom: 0 }}>
                        <View
                            style={[{
                                width: '100%', borderRadius: 12, backgroundColor: 'white',
                                justifyContent: 'center', alignItems: 'center',
                                paddingVertical: 5, paddingHorizontal: 10,
                            }, styles.shadow]}>
                            <ViewTextInputStart
                                isCheckStart={(data) => handleCheckStart(data)}
                                onChangeText={this.onChangeText}
                                getMyLocation={this.getMyLocation}
                                clearTextInput={this.clearTextInput} />
                                
                            {EnterAddress.startAddress.latitude != 0 ? <ViewTextInputEnd
                                isCheckEnd={(data) => handleCheckEnd(data)}
                                onChangeText={this.onChangeText}
                                clearTextInput={this.clearTextInput}
                                getMyLocation={this.getMyLocation}
                            /> : null}
                            {EnterAddress.startAddress.latitude != 0 && EnterAddress.endAddress.latitude != 0 ? <ViewTextInputDescription
                                onChangeText={this.onChangeText}
                                clearTextInput={this.clearTextInput}
                            /> : null}

                            {EnterAddress.startAddress.latitude != 0 && EnterAddress.endAddress.latitude != 0
                                ? <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingBottom: 10, paddingTop: 20, }}>
                                    <ViewShadow
                                        onPress={this.clickContinue}
                                        backgroundColor={color.primaryColor}
                                        shadowColor={color.primaryColor}
                                        colorText={'white'}
                                        textTitle={'TIẾP TỤC'}
                                    />
                                </View> : null}
                            {toJS(EnterAddress.listAddress) == ['OVER_QUERY_LIMIT']
                                ? <View style={{ width: '100%', paddingHorizontal: 10, height: 50, backgroundColor: 'green' }}>
                                    <Text style={{ textAlign: 'center', fontSize: 12, color: 'black' }}>Rất tiếc, có lỗi nào đó xảy ra. Bạn vui lòng thử lại!</Text>
                                </View> :
                                toJS(EnterAddress.listAddress) == ['ZERO_RESULTS']
                                    ? <View style={{ width: '100%', height: 50, paddingHorizontal: 10, backgroundColor: 'red' }}>
                                        <Text style={{ textAlign: 'center', fontSize: 12, color: 'black' }}>Không tìm thấy địa điểm nào như bạn mong đợi!</Text>
                                    </View>
                                    : EnterAddress.listAddress.length > 0
                                        ? 
                                        <SuggestAddressView clickItemSuggest={this.clickItemSuggest}
                                            data={toJS(EnterAddress.listAddress)} />
                                        : null}

                        </View>
                        {this.props.isStart && (
                            <TouchableOpacity onPress={() => { this.props.Home.isStartCheck = true }}>
                                <View style={[{
                                    width: '100%', borderRadius: 8, backgroundColor: 'white',
                                    // justifyContent: 'center', 
                                    alignItems: 'center',
                                    paddingVertical: 5, paddingHorizontal: 10,
                                    flexDirection: "row",
                                    marginTop: 5
                                }, styles.shadow]}>
                                    <Image
                                        source={require("../../../assets/images/map.png")}
                                        style={{ width: 20, height: 20 }}
                                    />
                                    <Text style={{ fontSize: 14 }}>  Chọn vị trí</Text>
                                </View>
                            </TouchableOpacity>)}

                        {this.props.isEnd && (
                            <TouchableOpacity onPress={() => { this.props.Home.isEndCheck = true }}>
                                <View style={[{
                                    width: '100%', borderRadius: 8, backgroundColor: 'white',
                                    // justifyContent: 'center', 
                                    alignItems: 'center',
                                    paddingVertical: 5, paddingHorizontal: 10,
                                    flexDirection: "row",
                                    marginTop: 5
                                }, styles.shadow]}>
                                    <Image
                                        source={require("../../../assets/images/map.png")}
                                        style={{ width: 20, height: 20 }}
                                    />
                                    <Text style={{ fontSize: 14 }}>  Chọn vị trí</Text>
                                </View>
                            </TouchableOpacity>)}
                    </View >) : (<View style={{ margin: 10 }}>
                            <TouchableOpacity 
                                activeOpacity={0.7}
                                style={{
                                    backgroundColor: color.primaryColor,
                                    height: 45,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 5
                                }}
                                onPress={() => setFalse()}
                            >
                                <Text style={{ fontSize: 16, color: 'white', fontWeight: '700' }}>Xác Nhận</Text>
                            </TouchableOpacity>
                        </View>)}
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({

    shadow:
        values.platform == 'ios' ? {
            shadowColor: 'gray',
            shadowOffset: { width: 2, height: 5 },
            shadowOpacity: 0.65,
            shadowRadius: 7,
        }
            :
            { elevation: 2, marginBottom: 3, },
});