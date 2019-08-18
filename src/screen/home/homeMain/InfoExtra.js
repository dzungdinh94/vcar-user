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
import { toJS } from 'mobx'
import moment from 'moment'
import numeral from 'numeral'
import { observer, inject } from 'mobx-react'
import { values, color } from '../../../config';
import Dash from 'react-native-dash';
import ViewShadow from '../../../component/ViewShadow';
let widthCircle = 10;

@inject('User','Home')
@observer
class InfoExtra extends React.Component {

    constructor(props) {
        super(props);
    };


    render() {
        let { item, index, length, User,Home } = this.props;
        console.log(item,"item currentOrder");
        return (
            <View
                style={[styles.viewParent,]}>
                <View style={{ flex: 1, backgroundColor: 'white', }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black', paddingBottom: 15, paddingHorizontal: 10  }}>Thông tin chuyến đi</Text>
                    <View style={[{
                        flexDirection: 'row', width: '100%',
                        backgroundColor: 'transparent', height: 60
                    },]}>
                        <View style={{ flex: 1, backgroundColor: 'transparent', paddingLeft: 10, flexDirection: 'row' }}>
                            <View style={{ width: 15, height: '100%', marginRight: 5, paddingVertical: 13 }}>
                                <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: '#BFC6D0', marginBottom: 5 }} />
                                <Dash
                                    dashThickness={2}//do day cua moi net dut
                                    dashColor={'#BFC6D0'}
                                    style={{ width: 0.5, flex: 1, marginLeft: 4, flexDirection: 'column', }} />
                                <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: '#BFC6D0', marginTop: 5 }} />
                            </View>
                            <View style={{ flex: 1, height: '100%' }}>
                                <View style={{
                                    backgroundColor: 'transparent', justifyContent: 'center', width: '100%',
                                    borderBottomColor: color.lineColor, borderBottomWidth: 0.5, height: 30,
                                }}>
                                    <Text numberOfLines={1} style={{ color: 'black', fontSize: 13, }}>{item.fromLocation || ''}</Text>
                                </View>
                                <View style={{
                                    backgroundColor: 'transparent', justifyContent: 'center', width: '100%', height: 30,
                                }}>
                                    <Text numberOfLines={1} style={{ color: 'black', fontSize: 13, }}>{item.toLocation || ''}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Giá */}
                    <View style={{ flexDirection: 'row', paddingVertical: 7, alignItems: 'center', paddingHorizontal: 10 }}>
                        <Image style={{ width: 15, height: 15, marginRight: 5, resizeMode: 'contain', tintColor: '#b4bcc8' }}
                            source={require('../../../assets/images/ic_price.png')} />
                        <Text style={{ fontSize: 15, color: color.primaryColor, fontWeight: 'bold', marginRight: 10, }}>{
                            item.price ? (numeral(item.price).format('0,0') + ' VND') : ''}</Text>
                    </View>
                    {/* quãng đường */}
                    <View style={{ flexDirection: 'row', paddingVertical: 7, alignItems: 'center', paddingHorizontal: 10 }}>
                        <Image style={{ width: 15, height: 15, marginRight: 5, tintColor: '#b4bcc8' }}
                            source={require('../../../assets/images/ic_distance.png')} />
                        <Text style={{ fontSize: 15, color: color.primaryColor, fontWeight: 'bold', marginRight: 10, }}>{
                            item.long ? (numeral(item.long).format('0,0') + ' km') : ''}</Text>
                    </View>
                    {
                        item.description
                            ?
                            <View style={{ flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 10, justifyContent: 'center' }}>
                                <Image style={{ width: 15, height: 15, marginRight: 5, tintColor: '#b4bcc8' }}
                                    source={require('../../../assets/images/description.png')} />
                                <Text numberOfLines={4} style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'normal', marginRight: 10, flex: 1, }}>{item.description
                                    // ? item.description : 'Bạn không có yêu cầu nào!'
                                }</Text>
                            </View>
                            :
                            null
                    }
                    {
                        item.serviceAttach && item.serviceAttach.length > 0
                            ?
                            <View style={{ flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 10, alignItems: 'center' }}>
                                <Image style={{ width: 15, height: 15, marginRight: 5, tintColor: '#b4bcc8' }}
                                    source={require('../../../assets/images/library-add.png')} />
                                {item.serviceAttach.map((v, k) => {
                                    return (
                                        <Text key={k} style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'normal', marginRight: 10, }}>
                                            {v.name}
                                        </Text>
                                    )

                                })}
                            </View>
                            :
                            null
                    }
                    {(item && item.status === 2) && <View style={{ paddingHorizontal: 10, paddingTop: 10, width: '100%' }}>
                        <ViewShadow
                            onPress={this.props.cancelBooking}
                            height={40}
                            backgroundColor={'#dce0ee'}
                            shadowColor={'rgba(0, 0, 0, 0.45)'}
                            colorText={'rgba(0, 0, 0, 0.45)'}
                            styleText={{ fontWeight: 'bold' }}
                            textTitle={'HUỶ CHUYẾN'}
                        />
                    </View>}
                    
                </View>

            </View >
        )
    }
}


const styles = StyleSheet.create({
    viewParent: {
        width: '100%', padding: 10, backgroundColor: 'transparent', flexDirection: 'row'
    },
    txtAddress: { fontSize: 14, color: 'black', flex: 1, paddingLeft: 10, textAlign: 'left', },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#dedede',
    },
    image: {
        height: 15,
        width: 15
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
export default InfoExtra;