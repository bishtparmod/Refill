import React, { PureComponent } from 'react'
import { Root } from './src'
import { injectStore, store } from './src/redux';
import 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage';

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import Utils from './src/common/util/Utils';
import { RefillStorage } from './src/apis';

const WrappedComponent = injectStore(Root, store);
class App extends PureComponent {
    constructor(props) {
        super(props);

        this.initFirebase();
    }

    componentWillUnmount = async () => {
        if (firebase.messaging().isRegisteredForRemoteNotifications) {
            // await firebase.messaging().unregisterForRemoteNotifications();
        }

        this._onmessage_subscriber && this._onmessage_subscriber();
    }

    initFirebase = async () => {
        var data = await AsyncStorage.getItem('messages1');

        this._onmessage_subscriber = firebase.messaging().onMessage(async (remoteMessage) => {
            console.log('FCM Message Data: on message', remoteMessage.data);
            alert(JSON.stringify(remoteMessage.data));
        });

        if (!firebase.messaging().isRegisteredForRemoteNotifications) {
            await firebase.messaging().registerForRemoteNotifications();
        }

        const permissionGranted = await firebase.messaging().requestPermission();
        const fcmToken = await firebase.messaging().getToken();

        await RefillStorage.storeRefillFCMDeviceTokenData(fcmToken);
        Utils.log("Check Firebase Permission ===> ", fcmToken);
    }

    render() {
        return (
            <WrappedComponent />
        );
    }
}

export default App;