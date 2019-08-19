package com.aliki.vcar;

import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;

import java.util.Arrays;
import java.util.List;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.imagepicker.ImagePickerPackage; // <-- add this import
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import com.facebook.CallbackManager;
import io.underscope.react.fbak.RNAccountKitPackage;
public class MainApplication extends NavigationApplication {
    
    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }
    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
            // eg. new VectorIconsPackage()
             new RNFirebasePackage(),
             new MapsPackage(),
              new FBSDKPackage(mCallbackManager),
            new ImagePickerPackage(),
             new ImageResizerPackage(),
              new LinearGradientPackage(), 
              new AsyncStoragePackage(),
              new RNFirebaseNotificationsPackage(),
              new RNFirebaseMessagingPackage(),
              new RNAccountKitPackage()
        );
    }
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }

}