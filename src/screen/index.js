import SplashScreen from './splashScreen/SplashScreen'

//luồng login
import LoginScreen from './login/LoginScreen'
import EnterPhoneScreen from './login/loginWithPhone/EnterPhoneScreen'
import ConfirmLoginScreen from '../screen/login/loginWithPhone/ConfirmLoginScreen'
//luồng home
import HomeScreen from './home/homeMain/HomeScreen';

//menu
import MenuScreen from './menu/MenuScreen';
import ProfileScreen from './profile/ProfileScreen';
import EditProfileScreen from './profile/EditProfileScreen';

import GuideScreen from './guide/GuideScreen';

import HistoryTransactionScreen from './historyTransaction/HistoryTransactionScreen';
import HistoryTransactionDetailScreen from './historyTransaction/HistoryTransactionDetailScreen';

import NotificationScreen from './notification/NotificationScreen';
import NotificaionDetailScreen from './notification/NotificaionDetailScreen';
import FindCarScreen from './home/homeMain/FindCarScreen';


import AnimationMap from '../component/toatoaAbc'


export {
    SplashScreen,

    //luồng login
    LoginScreen, EnterPhoneScreen,ConfirmLoginScreen,

    //luồng Home
    HomeScreen, 

    //menu
    MenuScreen, ProfileScreen, EditProfileScreen, GuideScreen, HistoryTransactionScreen, HistoryTransactionDetailScreen, NotificationScreen, NotificaionDetailScreen,
    FindCarScreen,
    //animation
    AnimationMap,
}