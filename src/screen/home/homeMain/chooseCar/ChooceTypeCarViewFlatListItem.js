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
import { values, color, config } from '../../../../config';
import Carousel from 'react-native-snap-carousel';
import numeral from 'numeral'
import { inject, observer } from 'mobx-react'
@inject('Home')
@observer
class ChooceTypeCarViewFlatListItem extends Component {
    constructor(props) {
        super(props);
        this.onItemPressed = this.onItemPressed.bind(this);
    };

    onItemPressed(e) {
        this.props.clickItem(this.props.item)
    };

    render() {
        let widthImage = values.deviceWidth / 8
        let { Home, item } = this.props;
        let img = config.domain + '/' + item.icon;

        console.log('icon: ' + img,item)
        return (
            <View
                style={{ width: '100%', paddingHorizontal: 10, }}>
                <TouchableOpacity onPress={this.onItemPressed}
                    activeOpacity={values.activeOpacity}
                    style={[{
                        // width: '100%',
                        marginBottom: 10,
                        paddingVertical: 7,
                        borderRadius: 4,
                        paddingHorizontal: 10,
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'
                    }, Home.itemTypeCarSelected.id == item.id ? [{
                        borderWidth: 2, borderColor: color.primaryColor,
                    }, styles.shadow] : {
                            borderWidth: 0.5, borderColor: '#dce0ee',
                        },]}>
                    <View style={[{
                        width: widthImage, height: widthImage, borderRadius: widthImage / 2,
                        overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
                    }, Home.itemTypeCarSelected.id == item.id ? { backgroundColor: color.primaryColor } : { backgroundColor: '#dce0ee' }]}>
                        <Image
                            style={[{ width: widthImage * 2 / 3, height: widthImage * 2 / 3, resizeMode: 'contain', }]}
                            source={{ uri: img }} />
                    </View>

                    <View style={{ flex: 1, backgroundColor: 'transparent', paddingLeft: 15, }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text
                                numberOfLines={3}
                                style={{ fontSize: 14, fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.85)', marginVertical: 5, flex: 1.5 }}>{(item.name + '').toUpperCase()}</Text>
                            {
                                item.price
                                    ?
                                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', }}>

                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: color.primaryColor, }}>{numeral(item.price).format('0,0')}</Text>
                                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: color.primaryColor, bottom: 2, }}>{'đ'}</Text>
                                    </View>
                                    :
                                    null
                            }

                        </View>
                        {
                            item.time
                                ?
                                <Text style={{ fontSize: 11, color: 'rgba(0, 0, 0, 0.45)', fontWeight: 'normal', fontStyle: 'italic' }}>{item.time + ' phút'}</Text>
                                :
                                null
                        }
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    shadow:
        values.platform == 'ios' ? {
            shadowColor: color.primaryColor,
            shadowOffset: { width: 2, height: 3 },
            shadowOpacity: 0.6,
            shadowRadius: 5,
        }
            :
            { elevation: 2, marginBottom: 3, },

});
export default ChooceTypeCarViewFlatListItem