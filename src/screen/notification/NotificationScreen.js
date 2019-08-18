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
    StatusBar,
    ScrollView,
    RefreshControl
} from 'react-native';
import _ from 'lodash'
import NotificationScreenFlatListItem from './NotificationScreenFlatListItem'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx';
import { color, api } from '../../config';
import screenId from '../../config/screenId';
import NavBarCustom from '../../component/NavBarCustom';
import { PostWithToken } from '../../config/request';
import NoData from '../../component/NoData';
import {
    Navigation
  } from "react-native-navigation";
@inject('Home', 'OnApp', 'User')
@observer
class NotificationScreen extends Component {
    static navigatorStyle = {
        navBarHidden: true
    };

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            isNoData: 0,
            refreshing: false,
            loadding: false
        };
        // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.renderItem = this.renderItem.bind(this);
    };
    onRefresh = () => {
        let { OnApp, User } = this.props;
        let self = this;
        this.setState({
            refreshing: true,
            isNoData: 0,
            page: 1
        }, () => {
            OnApp.clearDataNotif()
            OnApp.getAllNotifi(User.token, [], this.state.page, (status) => {
                self.setState({
                    refreshing: false
                })
                if (status) {
                    self.setState({ isNoData: 1 })
                }
            })
        })
    }
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

    componentWillMount() {
        let { OnApp, Home, User } = this.props;
        let self = this;
        OnApp.screenCurrent = screenId.MENU.screenType.notification;
        OnApp.clearDataNotif()
        OnApp.setDataNoti(null)
        OnApp.countNotif(User.token)



        OnApp.getAllNotifi(User.token, toJS(OnApp.dataNotif), this.state.page, (status) => {
            if (status) {
                if (status) {
                    self.setState({ isNoData: 1 })
                }
            } else {

            }
        })
    }

    componentWillUnmount() {
        let { OnApp, User } = this.props;
        OnApp.clearDataNotif()
        OnApp.countNotif(User.token)
    }

    onClickNotif = (item, index) => {
        let { OnApp, User } = this.props;
        // Đọc thông báo
        OnApp.readNotif(item.id, User.token)
        // OnApp.seenNotif(index)
        // console.log("asdasd",index)
        Navigation.showModal({
            stack: {
              children: [{
                component: {
                  name: 'NotificaionDetailScreen',
                  passProps: { title: item.title, url: item.url },
                  options: {
                    topBar: {
                      visible:false
                    }
                  }
                }
              }]
            }
          });
        // this.props.navigator.showModal({
        //     screen: 'NotificaionDetailScreen',
        //     passProps: { title: item.title, url: item.url }
        // });

        OnApp.seenNotif(index)
    };

    onLoadMore = () => {
        let { OnApp, Home, User } = this.props;
        let page = this.state.page
        if (!this.state.loadding) {
            this.setState({ loadding: true }, () => {
                OnApp.getAllNotifi(User.token, toJS(OnApp.dataNotif), page + 1, (status) => {
                    if (status) {
                        this.setState({
                            loadding: false,
                            page: page + 1
                        })
                    } else {
                        this.setState({
                            loadding: false
                        })
                    }

                })
            })
        }
    }

    renderItem({ item, index }) {
        return (
            <NotificationScreenFlatListItem item={item} index={index} onClickNotif={this.onClickNotif} />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBarCustom
                    onPress={this.onToggleDrawer}
                    title='Thông báo'
                />
                {/* <StatusBar barStyle='light-content' translucent /> */}

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                    style={{ backgroundColor: 'white', width: '100%', flex: 1 }} >
                    {
                        this.state.isNoData == 1
                            ?
                            _.size(this.props.OnApp.dataNotif) > 0
                                ?
                                <FlatList
                                    style={{ flex: 1, width: '100%', paddingVertical: 10, }}
                                    data={toJS(this.props.OnApp.dataNotif)}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this.renderItem}
                                    onEndReachedThreshold={0.5}
                                    onEndReached={this.onLoadMore}
                                />
                                :
                                <NoData
                                    tintColor={color.primaryColor}
                                    imageSource={require('../../assets/images/icon_Notification.png')}
                                    title='Hiện bạn chưa có thông báo nào.'
                                />
                            :
                            null
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white',
    },
    image: {
        height: 40,
        width: 40,
        borderRadius: 20
    }
});

export default NotificationScreen;