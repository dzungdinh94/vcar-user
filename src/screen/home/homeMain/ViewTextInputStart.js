import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { color, values } from '../../../config';
import { inject, observer } from 'mobx-react/native'

@inject('EnterAddress')
@observer
export default class ViewTextInputStart extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    onFocus = () => {
        // this.props.getMyLocation('startAddress')
        this.props.isCheckStart(true)
    }
    onBlur=()=>{
        // console.log("test xem");
        this.props.isCheckStart(false)
    }

    render() {
        let { EnterAddress } = this.props;
        return (
            <View style={{
                width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                borderBottomWidth: 1, borderBottomColor: '#F0F2F8', backgroundColor: 'transparent', paddingBottom: 7, paddingTop: 5
            }}>
                {
                    !EnterAddress.isGetSuggestAddressStart
                        ?
                        <Image style={{
                            width: 17, height: 17, marginRight: 10, tintColor: color.primaryColor, resizeMode: 'contain'
                        }} source={require('../../../assets/images/ic_top.png')} />
                        :
                        <View style={{ marginRight: 5 }}>
                            <ActivityIndicator size="small" />
                        </View>
                }
                <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.textInput}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    placeholderTextColor={color.colorTextDes}
                    placeholder={'Điểm đi'}
                    value={EnterAddress.startAddress.title}
                    blurOnSubmit={false}
                    onChangeText={(text) => this.props.onChangeText('startAddress', text)}
                />
                {
                    EnterAddress.startAddress.title.trim() == ''
                        ?
                        <TouchableOpacity onPress={() => this.props.getMyLocation('startAddress')} style={{
                            width: 35, height: 35, backgroundColor: 'transparent',
                            justifyContent: 'center', alignItems: 'flex-end'
                        }}>
                            <Image style={{
                                width: 20, height: 20, resizeMode: 'contain', tintColor: color.primaryColor,
                            }} source={require('../../../assets/images/ic_myLocation.png')} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => this.props.clearTextInput('startAddress')}
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