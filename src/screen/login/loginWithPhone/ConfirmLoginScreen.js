import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    TextInput,
    Dimensions
} from 'react-native';
import color from '../../../config/color'
class ConfirmLoginScreen extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setStyle({
            // navBarHidden:true,
            topBarElevationShadowEnabled: false,
            navBarButtonColor: "white",
            statusBarHidden: false,

            navBarTextColor: "#FFFFFF",
            statusBarTextColorScheme: "light"
        });
        let { height, width } = Dimensions.get('window')
        this.state = {
            height, width,
            keyboard: [
                {
                    value: 1,
                    key: 1
                },
                {
                    value: 2,
                    key: 2
                },
                {
                    value: 3,
                    key: 3
                },
                {
                    value: 4,
                    key: 4
                },
                {
                    value: 5,
                    key: 5
                },
                {
                    value: 6,
                    key: 6
                },
                {
                    value: 7,
                    key: 7
                },
                {
                    value: 8,
                    key: 8
                },
                {
                    value: 9,
                    key: 9
                },
                {
                    value: "",
                    key: "emtry"
                },
                {
                    value: "0",
                    key: 0
                },
                {
                    value: "del",
                    key: "Del"
                }
            ],
            listKey: [],
            key: ''
        }
    };
    onClickSend = () => {
        alert("sss")
    }
    onClickNext = () => {

        alert(this.state.key)

    }
    onClickItem = (item) => {
        switch (item.key) {
            case "Del":
                if (this.state.listKey.length > 0) {
                    this.state.listKey.splice(this.state.listKey.length - 1, 1)
                    this.setState({
                        listKey: this.state.listKey,
                        key: this.state.key.slice(0, this.state.listKey.length)
                    })
                }
                break;
            case "emtry":

                break;
            default:
                if (this.state.listKey.length < 6) {
                    this.state.listKey.push(item.value)
                    this.setState({
                        listKey: this.state.listKey,
                        key: this.state.key + item.value + ""
                    })
                }
                break;
        }


    }
    renderKeybourd = () => {
        let listView = []
        this.state.keyboard.map((v, i) => {
            listView.push(
                <TouchableOpacity onPress={() => { this.onClickItem(v) }} key={i} style={{ height: (this.state.width / 6), borderColor: 'white', borderWidth: 1, width: this.state.width / 3, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#07070b', fontSize: 18, fontWeight: '500' }}>{v.value}</Text>
                </TouchableOpacity>
            )
        })

        return listView
    }
    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: 'black' }}>Nhập mã gửi qua số </Text>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: 'black' }}>{this.props.phone}</Text>
                    <View style={{ paddingHorizontal: 20, marginTop: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: 'http://flagsvancouver.com/fotw/images/v/vn.gif' }} style={{ height: 30, width: 30, resizeMode: 'contain' }} />
                        {/* <TextInput
                            style={styles.txtInpPhone} placeholder="0123456789" value={this.state.phone} onChangeText={(phone) => { this.setState({ phone }) }} /> */}
                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                            <Text style={styles.txtKey}>{this.state.listKey[0] ? this.state.listKey[0] : "_"}</Text>
                            <Text style={styles.txtKey}>{this.state.listKey[1] ? this.state.listKey[1] : "_"}</Text>
                            <Text style={styles.txtKey}>{this.state.listKey[2] ? this.state.listKey[2] : "_"}</Text>
                            <Text style={styles.txtKey}>{this.state.listKey[3] ? this.state.listKey[3] : "_"}</Text>
                            <Text style={styles.txtKey}>{this.state.listKey[4] ? this.state.listKey[4] : "_"}</Text>
                            <Text style={styles.txtKey}>{this.state.listKey[5] ? this.state.listKey[5] : "_"}</Text>
                        </View>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', paddingHorizontal: 20, bottom: 10, width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={this.onClickSend}>
                        <Text style={{ color: color.primaryColor, fontSize: 15, textDecorationLine: 'underline', textDecorationColor: color.primaryColor }}>Gửi lại mã</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.touClickNext}
                        onPress={this.onClickNext}
                    >
                        <Image style={styles.imgArrow} source={require('../../../assets/images/icArrowRight.png')} />
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', backgroundColor: '#e0e3e8', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {this.renderKeybourd()}
                </View>


            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    txtKey: { flex: 1, textAlign: 'center', fontSize: 18, color: 'black', fontWeight: 'bold', textDecorationColor: 'black', textDecorationLine: 'underline' },
    txtInpPhone: { flex: 1, fontSize: 17, marginLeft: 10 },
    imgArrow: { height: 30, width: 30, resizeMode: 'contain' },
    touClickNext: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.primaryColor,
        height: 50,
        width: 50,
        borderRadius: 25,
        overflow: 'hidden',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: 'white',

    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default ConfirmLoginScreen