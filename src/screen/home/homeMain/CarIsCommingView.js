import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, } from 'react-native';
import { values, color, config } from '../../../config';
import RenderStart from '../../../component/RenderStart';

import { inject, observer } from 'mobx-react/native'
import Communication from '../../../utils/Communication';
import InfoExtra from './InfoExtra';
@inject('User', 'Home')
@observer
export default class CarIsCommingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowView: false,
        };
    }

    clickCall = () => {
        let { Home } = this.props;
        if (Home.currentOrder && Home.currentOrder.inforDriver && Home.currentOrder.inforDriver.phone) {
            console.log('Home.currentOrder.inforDriver.phone:' + Home.currentOrder.inforDriver.phone)
            Communication.phonecall(Home.currentOrder.inforDriver.phone, true)
        }
    };

    changeView = () => {
        this.setState({
            isShowView: !this.state.isShowView
        })

    }

    componentDidMount() {

    }

    render() {
        let widthImage = values.deviceWidth * 0.133;
        let { Home } = this.props;
        console.log(Home.currentOrder,"info driver");
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.changeView}
                style={{
                    width: '100%',
                    //  position: 'absolute', bottom: 0,
                    // paddingHorizontal: 7,
                    // paddingBottom: 10,
                }}>
                <TouchableOpacity
                    activeOpacity={1} onPress={this.changeView}
                    style={[{
                        width: '100%', backgroundColor: '#ffffff',
                    }, styles.shadow]}>

                    {/* <View style={{ paddingTop: 20, paddingBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Text
                            style={{ fontSize: 18, fontWeight: 'normal', color: 'rgba(0, 0, 0, 0.85)', }}>{'Xe đang tới'}</Text>
                    </View> */}
                    <View style={{ width: '100%', paddingHorizontal: 15, }}>
                        <View style={{
                            width: '100%', backgroundColor: 'transparent', paddingVertical: 5,
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                            <View style={{ backgroundColor: '#DCDDDE', width: 40, borderRadius: 2, height: 4 }} />
                        </View>

                        <View
                            style={{
                                width: '100%', flexDirection: 'row', backgroundColor: 'transparent',
                                paddingBottom: 12, paddingTop: 8,
                                // borderTopColor: color.lineColor,borderTopWidth: 0.5, 
                                borderBottomColor: color.lineColor, borderBottomWidth: 0.5,
                            }}>
                            <View style={{
                                borderRadius: (widthImage / 2 + 10), overflow: 'hidden',
                                justifyContent: 'center', alignItems: 'center', borderColor: '#EFF1F7', borderWidth: 1,
                            }}>
                                <View style={{ borderRadius: widthImage / 2, overflow: 'hidden', margin: 2.5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image style={{ width: widthImage, height: widthImage, resizeMode: 'cover' }}
                                        source={
                                            Home.currentOrder && Home.currentOrder.inforDriver && Home.currentOrder.inforDriver.avatar
                                                ?
                                                { uri: config.domain + '/' + Home.currentOrder.inforDriver.avatar }
                                                :
                                                require('../../../assets/images/account-circle.png')} />
                                </View>
                            </View>
                            <View style={{ flex: 1, paddingLeft: 10, }}>
                                <View style={{
                                    flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'space-between',
                                    flexDirection: 'row'
                                }}>
                                    <Text
                                        ellipsizeMode='middle'
                                        numberOfLines={1} style={{
                                            flex: 1.7,
                                            fontSize: 20, fontWeight: '300', color: color.primaryColor, backgroundColor: 'transparent',
                                        }}>{Home.currentOrder && Home.currentOrder.inforDriver && Home.currentOrder.inforDriver.fullname || ''}
                                        
                                        </Text>
                                    <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'flex-end', }}>
                                        <RenderStart
                                            numberOfStar={Home.currentOrder && Home.currentOrder.inforDriver && Math.round(Home.currentOrder.inforDriver.rate + '') || 0}
                                            styleImgStart={{ width: 14, height: 14, resizeMode: 'contain', marginRight: 1.5, tintColor: '#e5c555' }}
                                        />
                                    </View>
                                </View>
                                <Text style={{
                                    fontSize: 14, fontWeight: 'normal', color: 'rgba(0, 0, 0, 0.65)', backgroundColor: 'transparent',
                                }}>{Home.currentOrder && Home.currentOrder.inforDriver && Home.currentOrder.inforDriver.numberCar || ''} {' - '}
                                {Home.currentOrder && Home.currentOrder.inforDriver && Home.currentOrder.inforDriver.nameCar || ''}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        justifyContent: 'space-between',
                        alignItems: 'center', paddingHorizontal: 15,
                        paddingVertical: 15, flexDirection: 'row', backgroundColor: 'transparent'
                    }}>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <Text style={{ color: 'rgba(0, 0, 0, 0.25)', fontSize: 12, fontWeight: 'bold' }}>{'THỜI GIAN DỰ KIẾN'}</Text>
                            <Text style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 14, fontWeight: 'normal' }}>{Home.currentOrder && Home.currentOrder.inforDriver && (Home.currentOrder.duration + ' phút') || ''}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={this.clickCall}
                            activeOpacity={0.7} style={{
                                borderRadius: 20, borderWidth: 1, flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5,
                                borderColor: color.primaryColor, alignItems: 'center', justifyContent: 'space-around',
                            }}>
                            <Image
                                source={require('../../../assets/images/ic_phone.png')}
                                style={{ tintColor: color.primaryColor, width: 15, height: 15, marginRight: 7, resizeMode: 'contain' }} />
                            <Text style={{ fontSize: 11, fontWeight: '500', color: color.primaryColor, }}>{'GỌI ĐIỆN'}</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.isShowView
                            ?
                            <InfoExtra item={Home.currentOrder} cancelBooking={this.props.cancelBooking} />
                            :
                            null
                    }

                </TouchableOpacity>

            </TouchableOpacity >
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
            shadowColor: 'gray',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
        }
            :
            { elevation: 2, marginBottom: 3, },
});
