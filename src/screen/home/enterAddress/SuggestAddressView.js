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
    Alert,
    Keyboard,
    TouchableHighlight,
    TouchableNativeFeedback

} from 'react-native';
import { values } from '../../../config';
import SimpleToast from 'react-native-simple-toast';

class SuggestAddressFlatListItem extends React.PureComponent {

    constructor(props) {
        super(props);
        this.onItemPressed = this.onItemPressed.bind(this);
    };

    onItemPressed() {
        this.props.clickItemSuggest(this.props.item)
    };

    render() {
        const item = this.props.item;
        return (
            values.platform == 'ios'
                ?
                <TouchableHighlight onPress={this.onItemPressed}
                    style={{
                        borderBottomColor: '#ccc', borderBottomWidth: 0.5, flexDirection: 'row', alignItems: 'center',
                    }}>
                    <View style={{ flex: 1, backgroundColor: 'transparent', paddingVertical: 10 }}>
                        <Text numberOfLines={2} style={{ fontSize: 12, color: 'black', width: '100%', }}>
                            {item.description}
                        </Text>
                    </View>
                </TouchableHighlight>
                :
                <TouchableNativeFeedback onPress={this.onItemPressed}
                    style={{
                        borderBottomColor: '#ccc', borderBottomWidth: 0.5, flexDirection: 'row', alignItems: 'center',
                    }}>
                    <View style={{ flex: 1, backgroundColor: 'transparent', paddingVertical: 10 }}>
                        <Text numberOfLines={2} style={{ fontSize: 12, color: 'black', width: '100%', }}>
                            {item.description}
                        </Text>
                    </View>
                </TouchableNativeFeedback >
        )
    }
}

class SuggestAddressView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };

        this.renderItem = this.renderItem.bind(this);
    };

    renderItem({ item }) {
        return (
            <SuggestAddressFlatListItem
                clickItemSuggest={this.clickItemSuggest}
                item={item}
            />
        );
    }
    clickItemSuggest = (item) => {
        this.props.clickItemSuggest(item)
    }

    render() {
        console.log(this.props.data,"data kaka")
        return (
            <FlatList
                keyboardShouldPersistTaps='handled'
                keyboardDismissMode='on-drag'
                style={styles.container}
                data={this.props.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%', maxHeight: 300, paddingHorizontal: 10, backgroundColor: 'transparent',
    }
});
export default SuggestAddressView;