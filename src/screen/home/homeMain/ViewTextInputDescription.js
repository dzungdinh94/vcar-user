import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { color, values } from '../../../config';
import { inject, observer } from 'mobx-react/native'

@inject('EnterAddress')
@observer
export default class ViewTextInputDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { EnterAddress } = this.props;
        return (
            <View style={{
                width: '100%', flexDirection: 'row', justifyContent: 'center',
                borderBottomWidth: 1, borderBottomColor: '#F0F2F8', alignItems: 'center', paddingBottom: 7, paddingTop: 5
            }}>

                <Image style={{
                    width: 17, height: 17, marginRight: 10, tintColor: color.primaryColor, resizeMode: 'contain'
                }} source={require('../../../assets/images/ic_note.png')} />

                <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.textInput}
                    placeholderTextColor={color.colorTextDes}
                    placeholder={'Mô tả...'}
                    value={EnterAddress.description}
                    blurOnSubmit={false}
                    autoCorrect={false} 
                    onChangeText={(text) => this.props.onChangeText('description', text)}
                />
                {
                    EnterAddress.description != ''
                        ?
                        <TouchableOpacity
                            onPress={() => this.props.clearTextInput('description')}
                            style={{
                                width: 35, height: 35, backgroundColor: 'transparent',
                                justifyContent: 'center', alignItems: 'flex-end'
                            }}>
                            <Image style={{
                                width: 14, height: 14, resizeMode: 'contain',
                            }} source={require('../../../assets/images/icClear.png')} />
                        </TouchableOpacity>
                        :
                        null
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
