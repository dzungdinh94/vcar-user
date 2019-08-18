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
    ScrollView,
    RefreshControl,
    Alert,
    StatusBar,
} from 'react-native';
import { toJS } from 'mobx'
import moment from 'moment'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import HistoryTransactionScreenFlatListItem from './HistoryTransactionScreenFlatListItem'
import { color } from '../../config';
import screenId from '../../config/screenId';
import NavBarCustom from '../../component/NavBarCustom';
import NoData from '../../component/NoData';
import {
    Navigation
  } from "react-native-navigation";
@inject('Transaction', 'OnApp', 'User')
@observer
class HistoryTransactionScreen extends Component {
    static navigatorStyle = {
        navBarHidden: true,
        //     navBarBackgroundColor: color.primaryColor,
        //     topBarElevationShadowEnabled: false,
        //     navBarTextColor: 'white',
        //     navBarButtonColor: 'white',
        //     // navBarTranslucent: false, // make the nav bar semi-translucent, works best with drawUnderNavBar:true
        //     // navBarTransparent: false,
        //     // drawUnderNavBar: false
        //     // statusBarTextColorSchemeSingleScreen: 'light',
        //     // statusBarTextColorScheme: 'light'
    };

    // static navigatorButtons = {
    //     leftButtons: [
    //         {
    //             id: 'drawer',
    //             icon: require('../../assets/images/ic_menu.png'),
    //             // icon: require('../../assets/images/ic_arrow_left.png'),
    //         }
    //     ]
    // }
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            isNoData: 0,
            refreshing: false,
            isLoading: false
        };
        // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.renderItem = this.renderItem.bind(this);
    };

    onToggleDrawer = () => {
        // this.props.navigator.toggleDrawer({
        //     side: 'left',
        //     animated: true
        // });
        Navigation.mergeOptions(this.props.componentId, {
            sideMenu: {
              left: {
                visible: true
              }
            }
          });
    }

    // onNavigatorEvent(event) {
    //     if (event.type == 'NavBarButtonPress') {
    //         if (event.id == 'drawer') {
    //             // this.props.navigator.pop()
    //             this.onToggleDrawer()
    //         }
    //     }
    // };

    componentWillMount() {
        let { OnApp, User, Transaction } = this.props;
        OnApp.screenCurrent = screenId.MENU.screenType.history;
        Transaction.clearDataHistory()
        Transaction.getHistory(User.token, this.state.page, Transaction.transaction, (status) => {
            this.setState({ isNoData: 1 })
        })
    }

    componentWillUnmount() {
        let { Transaction } = this.props;
        Transaction.clearDataHistory()
    }

    onRefresh = () => {
        let { OnApp, User, Transaction } = this.props;
        this.setState({
            refreshing: true,
            page: 1,
            isNoData: 0,
        }, () => {
            Transaction.clearDataHistory()
            Transaction.getHistory(User.token, 1, [], (status) => {
                this.setState({
                    refreshing: false,
                    isNoData: 1
                })
            })
        })
    }

    onClickTransaction = (item) => {
        // alert('ss')
        // this.props.navigator.push({
        //     screen: 'HistoryTransactionDetailScreen',
        //     title: "Chi tiết lịch sử",
        //     passProps: { id: item.id }
        // });
    }
    onLoadMore = () => {
        let { Transaction, User } = this.props
        let page = this.state.page
        if (!this.state.isLoading) {
            this.setState({
                isLoading: true
            }, () => {
                Transaction.getHistory(User.token, page + 1, toJS(Transaction.transaction), (status) => {
                    if (status) {
                        this.setState({
                            page: page + 1,
                            isNoData: 1,
                            isLoading: false
                        })
                    } else {
                        this.setState({
                            isNoData: 1,
                            isLoading: false
                        })
                    }
                })
            })
        }
    }

    renderItem({ item, index }) {
        return (
            <HistoryTransactionScreenFlatListItem
                length={this.props.Transaction.transaction.length}
                index={index}
                item={item} onClickTransaction={this.onClickTransaction} />
        );
    }

    render() {
        let { Transaction } = this.props
        return (
            <View style={styles.container}>
                <NavBarCustom
                    onPress={this.onToggleDrawer}
                    title='Lịch sử giao dịch'
                />

                <ScrollView
                    style={{ width: '100%' }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                >
                    <View style={{ width: '100%', marginTop: 10 }}>
                        <View>
                            {
                                this.state.isNoData == 1
                                    ?
                                    toJS(Transaction.transaction).length > 0
                                        ?
                                        <FlatList
                                            style={{ width: '100%', paddingVertical: 10, }}
                                            data={toJS(Transaction.transaction)}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={this.renderItem}
                                            onEndReached={this.onLoadMore}
                                        />
                                        :
                                        <NoData
                                            tintColor={color.primaryColor}
                                            imageSource={require('../../assets/images/icon_Calendar.png')}
                                            title={'Bạn không có giao dịch nào!'}
                                        />
                                    :
                                    null
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white',
    }
});
export default HistoryTransactionScreen;