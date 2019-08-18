import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { color, values } from '../../../config';
import { inject, observer } from 'mobx-react/native'

@inject('EnterAddress')
@observer
export default class ViewTextInputEnd extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    onBlur=()=>{
        // console.log("test xem");
        this.props.isCheckEnd(false)
    }
    onFocus=()=>{
        this.props.isCheckEnd(true)
    }
    render() {
        let { EnterAddress } = this.props;
        return (
            <View style={{
                width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                borderBottomWidth: 1, borderBottomColor: '#F0F2F8', paddingBottom: 7, paddingTop: 5
            }}>
                {
                    !EnterAddress.isGetSuggestAddressEnd
                        ?
                        <Image style={{
                            width: 17, height: 17, marginRight: 10, tintColor: color.primaryColor, resizeMode: 'contain'
                        }} source={require('../../../assets/images/ic_bottom.png')} />
                        :
                        <View style={{ marginRight: 5 }}>
                            <ActivityIndicator size="small" />
                        </View>
                }
                <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.textInput}
                    placeholderTextColor={color.colorTextDes}
                    placeholder={'Điểm đến'}
                    value={EnterAddress.endAddress.title}
                    blurOnSubmit={false}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    autoCorrect={false} 
                    onChangeText={(text) => this.props.onChangeText('endAddress', text)}
                />
                {
                    EnterAddress.endAddress.title.trim() == ''
                        ?
                        <TouchableOpacity onPress={() => this.props.getMyLocation('endAddress')} style={{
                            width: 35, height: 35, backgroundColor: 'transparent',
                            justifyContent: 'center', alignItems: 'flex-end'
                        }}>
                            <Image style={{
                                width: 20, height: 20, resizeMode: 'contain', tintColor: color.primaryColor,
                            }} source={require('../../../assets/images/ic_myLocation.png')} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => this.props.clearTextInput('endAddress')}
                            style={{
                                width: 35, height: 35, backgroundColor: 'transparent',
                                justifyContent: 'center', alignItems: 'flex-end'
                            }}>
                            <Image style={{
                                width: 14, height: 14, resizeMode: 'contain',
                            }} source={require('../../../assets/images/icClear.png')} />
                        </TouchableOpacity>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    textInput: {
        flex: 1, height: 40, backgroundColor: 'white',
        paddingLeft: 5,
    }
});