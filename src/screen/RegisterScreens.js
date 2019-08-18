import {
  Navigation
} from "react-native-navigation";
import React from "react";
import {
  SplashScreen,
  LoginScreen, EnterPhoneScreen,
  HomeScreen, 
  MenuScreen, ProfileScreen, EditProfileScreen, GuideScreen, HistoryTransactionScreen,
  FindCarScreen,
  HistoryTransactionDetailScreen, NotificationScreen, NotificaionDetailScreen,ConfirmLoginScreen
} from './index'
import { Provider } from 'mobx-react/native';
export function registerScreens(store) {
  console.log(store.User,"store");

  Navigation.registerComponent("SplashScreen",  () => (props) => (
    <Provider {...store}>
      <SplashScreen {...props} />
    </Provider>
  ),() => SplashScreen)

  Navigation.registerComponent("LoginScreen",  () => (props) => (
    <Provider {...store}>
      <LoginScreen {...props} />
    </Provider>
  ),() => LoginScreen)
  Navigation.registerComponent("EnterPhoneScreen", () => (props) => (
    <Provider {...store}>
      <EnterPhoneScreen {...props} />
    </Provider>
  ), () => EnterPhoneScreen)

  Navigation.registerComponent("HomeScreen", () => (props) => (
    <Provider {...store}>
      <HomeScreen {...props} />
    </Provider>
  ), () => HomeScreen)
  Navigation.registerComponent("BeingDeliveredScreen", () => (props) => (
    <Provider {...store}>
      <BeingDeliveredScreen {...props} />
    </Provider>
  ), () => BeingDeliveredScreen)
  Navigation.registerComponent("FinddingCarScreen", () => (props) => (
    <Provider {...store}>
      <FinddingCarScreen {...props} />
    </Provider>
  ), () => FinddingCarScreen)



  Navigation.registerComponent("MenuScreen", () => (props) => (
    <Provider {...store}>
      <MenuScreen {...props} />
    </Provider>
  ), () => MenuScreen)
  Navigation.registerComponent("ProfileScreen", () => (props) => (
    <Provider {...store}>
      <ProfileScreen {...props} />
    </Provider>
  ), () => ProfileScreen)
  Navigation.registerComponent("EditProfileScreen", () => (props) => (
    <Provider {...store}>
      <EditProfileScreen {...props} />
    </Provider>
  ), () => EditProfileScreen)
  Navigation.registerComponent("GuideScreen", () => (props) => (
    <Provider {...store}>
      <GuideScreen {...props} />
    </Provider>
  ), () => GuideScreen)
  Navigation.registerComponent("HistoryTransactionScreen", () => (props) => (
    <Provider {...store}>
      <HistoryTransactionScreen {...props} />
    </Provider>
  ), () => HistoryTransactionScreen)
  Navigation.registerComponent("HistoryTransactionDetailScreen", () => (props) => (
    <Provider {...store}>
      <HistoryTransactionDetailScreen {...props} />
    </Provider>
  ), () => HistoryTransactionDetailScreen)
  Navigation.registerComponent("NotificationScreen", () => (props) => (
    <Provider {...store}>
      <NotificationScreen {...props} />
    </Provider>
  ), () => NotificationScreen)
  Navigation.registerComponent("NotificaionDetailScreen", () => (props) => (
    <Provider {...store}>
      <NotificaionDetailScreen {...props} />
    </Provider>
  ), () => NotificaionDetailScreen)
  Navigation.registerComponent("FindCarScreen", () => (props) => (
    <Provider {...store}>
      <FindCarScreen {...props} />
    </Provider>
  ), () => FindCarScreen)
  Navigation.registerComponent("ConfirmLoginScreen", () => (props) => (
    <Provider {...store}>
      <ConfirmLoginScreen {...props} />
    </Provider>
  ), () => ConfirmLoginScreen)
  
}
