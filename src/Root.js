import EventEmitter from 'EventEmitter';
import React, { PureComponent } from 'react';
import {
    Dimensions,
    Platform,
    StatusBar,
    Alert,
    SafeAreaView,
    NativeModules
} from 'react-native';
import { MainScene } from './scene';
import Colors from './common/styles/Colors';
import { ConnectionInfo } from './common/base_components';
import { connect } from 'react-redux'
import Utils from './common/util/Utils';
import { SILENT_LOGOUT, ORDER_VIEW_SCREEN, ORDER_VIEW_REQUEST_ID } from './redux/Types';
import { silentLogout } from './redux/login/Action';
import NotifyService from '../NotifyService';
import NavigationService from './NavigationService';
import { updateOrderViewUIConstraints } from './redux/orderView/Action';
import { RefillStorage } from './apis';

const PORTRAIT = 0;
const LANDSCAPE = 1;

class Rootrn extends PureComponent {

    constructor(props) {
        super(props);
        this._orientationEventEmitter = new EventEmitter();
        this.state = {
            booted: false,
            orientation: null,
            viewableScreenWidth: null,
            viewableScreenHeightWithHeader: null,
            viewableScreenHeight: null,
            screenWidth: null,
            screenHeight: null,
            scale: null,
            fontScale: null,
            userHasActivatedCallback: null,
            isOnline: null
        };

        this._isMount = true;
        this.refillEventEmitter = new EventEmitter();

        Utils.setRefillEventEmitter(this.refillEventEmitter);
        this.notif = new NotifyService(this.onNotify.bind(this));
    }

    onNotify = (data, test) => {
        this.checkNavigation(data, this.checkNavigation);
    }

    checkNavigation = (payload = {}, cb) => {
        setTimeout(async () => {
            if (NavigationService.is_navigator()) {
                const { updateOrderViewUIConstraints } = this.props;
                if (Platform.OS === "android") {
                    const { response: order_id } = await RefillStorage.getRefillNotificationData("order_id");

                    updateOrderViewUIConstraints({
                        [ORDER_VIEW_REQUEST_ID]: order_id
                    });
                    NavigationService.navigate(ORDER_VIEW_SCREEN);
                    await RefillStorage.clearRefillNotificationData();
                } else {
                    const { data: { data }, foreground } = payload;
                    const { order_id } = JSON.parse(data);

                    if (!foreground) {
                        updateOrderViewUIConstraints({
                            [ORDER_VIEW_REQUEST_ID]: order_id
                        });
                        NavigationService.navigate(ORDER_VIEW_SCREEN);
                    }
                }
            } else cb(this.checkNavigation);
        }, 500);
    }

    _setState = (value, cb) => {
        if (!this._isMount) return;

        if (cb) this.setState(value, cb);
        else this.setState(value);
    }

    componentWillUnmount = async () => {
        this._isMount = false;

        // if (firebase.messaging().isRegisteredForRemoteNotifications) {
        // await firebase.messaging().unregisterForRemoteNotifications();
        // }

        this._onmessage_subscriber && this._onmessage_subscriber();
    }

    componentDidMount() {
        const { silentLogout } = this.props;

        // Get some initial size data
        const width = Math.round(Dimensions.get('window').width);
        const height = Math.round(Dimensions.get('window').height);
        const scale = Dimensions.get('window').scale;
        const fontScale = Dimensions.get('window').fontScale;

        // Set to state
        this.setState({
            screenWidth: width,
            screenHeight: height,
            orientation: width > height ? LANDSCAPE : PORTRAIT,
            scale: scale,
            fontScale: fontScale
        });

        this.closeSplash();

        this.refillEventEmitter.on(SILENT_LOGOUT, () => {
            silentLogout();
        });
    }

    closeSplash = () => {
        if (Platform.OS === "android") {
            NativeModules.RefillCommon.closeSplashScreen();
        }
    }

    showAlert(title, body) {
        Alert.alert(
            title, body,
            [
                { text: 'OK', onPress: () => Utils.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }

    _onScreenUpdate(event) {
        const width = Math.round(event.nativeEvent.layout.width);
        const height = Math.round(event.nativeEvent.layout.height);
        const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
        if (orientation !== this.state.orientation) {
            // emit orientation change event
            this._orientationEventEmitter.emit('orientation');
        }
        if (
            this.state.viewableScreenWidth !== width
        ) {
            this.setState({
                viewableScreenWidth: width,
                viewableScreenHeightWithHeader: height - this.headerHeight(),
                viewableScreenHeight: height,
                orientation: orientation
            });
        }
    }

    /**
     * Get header height
     */
    headerHeight() {
        return Platform.OS === 'ios' ? 64 : 56;
    }

    Wrapper = ({ children }) => {
        return <SafeAreaView
            onLayout={(event) => this._onScreenUpdate(event)}
            style={{
                flex: 1,
                backgroundColor: Colors.theme_color
            }}>
            {children}
        </SafeAreaView>
    }

    _handleStatus = async (isOnline) => {
        try {

        } catch (error) {

        }
    }

    render() {

        return (
            <this.Wrapper>
                <StatusBar hidden={false} barStyle={"light-content"} backgroundColor={Colors.theme_color} />
                {React.createElement(MainScene, {
                    screenProps: {
                        booted: this.state.booted,
                        isPortrait: this.state.viewableScreenHeight > this.state.viewableScreenWidth,
                        screenWidth: this.state.viewableScreenWidth,
                        screenHeight: this.state.viewableScreenHeight,
                        screenHeightWithHeader: this.state.viewableScreenHeightWithHeader,
                        screenOrientation: this.state.screenOrientation,
                        scale: this.state.scale,
                        fontScale: this.state.fontScale,
                        gcScannerEventEmitter: this.refillEventEmitter,
                        isOnline: this.state.isOnline
                    }
                })}
                <ConnectionInfo
                    onConnectionStatusChange={this._handleStatus.bind(this)} />
            </this.Wrapper>
        );
    }
}

const mapToProps = ({ }) => {

    return ({});
}

export default connect(mapToProps, {
    silentLogout,
    updateOrderViewUIConstraints
})(Rootrn);
