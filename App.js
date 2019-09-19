import {
  Navigation
} from "react-native-navigation";
import {
  registerScreens
} from "./src/screen/RegisterScreens";
import stores from "./src/store";
import Provider from "./src/utils/MobxRnnProvider";
import { values, color, config } from './src/config'
import screenId from "./src/config/screenId";
console.disableYellowBox = true;
registerScreens(stores, Provider);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'SplashScreen'
      }
    },
  });
});
export function showLogin() {
  Navigation.setRoot({
    root: {
      component: {
        name: "LoginScreen",
      }
    }
  });
}

export function toggleNavBar(type) {

}

export function hiddenPopup() {
  Navigation.dismissLightBox()
};

export function showPopup() {
  Navigation.showLightBox({
    screen: 'PopupTarget', // unique ID registered with Navigation.registerScreen
    passProps: {
      // onClose: Navigation.dismissLightBox()
    }, // simple serializable object that will pass as props to the lightbox (optional)
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      opacity: 0.7,
      tapBackgroundToDismiss: true
    },
  });
}

export function showApp() {
  // start the app
  // Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      sideMenu: {
        id: "sideMenu",
        left: {
          component: {
            id: "Drawer",
            name: "MenuScreen"
          }
        },
        center: {
          stack: {
            id: "AppRoot",
            children: [{
              component: {
                id: "App",
                name: "HomeScreen",
                options: {
                  topBar: {
                    visible: false,
                  },
                }
              },
            }]
          }
        }
      }
    }
  });
}
