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
// Navigation.setRoot({
//   root:{
//     stack:{
//       children:[
//         {
//           component: {
//             name: "SplashScreen",
//             // screen: 'LoginScreen',
//             // title: "",
//             // navigatorStyle: {
//               // statusBarTextColorSchemeSingleScreen: 'light',
//               // statusBarTextColorScheme: 'light',
//               // navBarHidden: true
//             // }
//           }
//         }
//       ]
//     }
//   }


// });
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
  // Navigation.toggleNavBar({
  //   to: 'hidden', // required, 'hidden' = hide navigation bar, 'shown' = show navigation bar
  //   animated: false // does the toggle have transition animation or does it happen immediately (optional). By default animated: true
  // });
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
  // })
}

  // Navigation.setRoot({
  //   root: {
  //     component:{
  //       name: "HomeScreen",
  //     },
  //     options:{
  //       sideMenu :{
  //         left: {
  //           component: {
  //             name:'MenuScreen'
  //           }
  //         },
  //         center: {
  //           stack: {
  //             options: {},
  //             children: [{
  //               component: {}
  //             }]
  //           }
  //         },
  //         right: {
  //           component: {}
  //         }
  //     }
  //     }

  // }
    // screen: {
    //   screen: 'HomeScreen', // unique ID registered with Navigation.registerScreen
    //   title: '', // title of the screen as appears in the nav bar (optional)
    // },
    // drawer: {
    //   left: {
    //     screen: 'MenuScreen',
    //   },
    //   animationType: 'door',
    //   disableOpenGesture: true
    // },

    // appStyle: {
    //   navBarHidden: true,
    // },
    // animationType: "none"
  // });
// }
