import React, { PureComponent, Fragment } from 'react';
import { WView, WText, WRow, WTouchable } from '../ui';
import Colors from '../styles/Colors';
import { Image, ScrollView, Share } from 'react-native';
import Utils from '../util/Utils';
import { HOME_SCREEN, EDIT_SCREEN, USER_KEY, USER_DATA, DEVICE_IS_LOGGED_IN, DEVICE_KEY, DEVICE_IS_LOGIN_SKIPPED, ORDER_LIST_SCREEN, ORDER_VIEW_SCREEN, CUSTOMER_SUPPORT_SCREEN, CHAT_SCREEN } from '../../redux/Types';
import { connect } from 'react-redux';
import { logout } from '../../redux/login/Action';

class DrawableContainer extends PureComponent {
    constructor(props) {
        super(props);
    }

    openScreen = (screenName) => {
        const { navigation } = this.props;

        if (!screenName) return;

        navigation.navigate(screenName);
    }

    onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'Refill app link will be placed once the app will live',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    BtnTile = ({ lable, iconPath, isIcon = true, screenName, onPress }) => {
        const { iconStyle, btnTileContainerStyle } = this.getStyles();

        return (
            <WTouchable onPress={onPress ? onPress : this.openScreen.bind(this, screenName)}>
                <WRow dial={5} padding={[10, 0]} spaceBetween style={[btnTileContainerStyle]}>
                    <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_dark} >{lable}</WText>
                    {
                        isIcon ?
                            <Image
                                source={iconPath}
                                style={iconStyle}
                                resizeMode={"contain"}
                            />
                            : null

                    }
                </WRow>
            </WTouchable>
        );
    }

    logout = () => {
        const { logout } = this.props;

        logout();
    }

    AuthTile = ({ name, email }) =>
        <Fragment>
            <WText padding={[0, 10]} fontSize={Utils.scaleSize(18)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_dark} >{name ? name : "NA"}</WText>
            <WText padding={[0, 10]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_dark} >{email ? email : "NA"}</WText>
        </Fragment>

    UnAuthTile = () => {
        const { unAuthTileTextStyle } = this.getStyles();

        return (
            <WText padding={[Utils.scaleSize(10), 10]} fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.theme_color} onPress={this.logout.bind(this)} style={unAuthTileTextStyle}>login/signup to your account</WText>
        );
    }

    render() {
        const { imageContainerStyle, imageStyle } = this.getStyles();
        const { is_logged_in_skipped, name, email, image } = this.props;
        const iconPath = require("../../../assets/img/share.png");
        const userProfilePath = require("../../../assets/img/user1.png");
        const img = is_logged_in_skipped ? userProfilePath : typeof image === "string" ? { uri: image } : image;

        const shareIcon = require("../../../assets/img/share.png");
        const notificationIcon = require("../../../assets/img/notification1.png");
        const chatIcon = require("../../../assets/img/chat.png");
        const informationIcon = require("../../../assets/img/information.png");
        const settingIcon = require("../../../assets/img/settings.png");

        return (
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}>
                <WView flex stretch dial={2}>
                    <WView dial={4} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]} backgroundColor={Colors.white}>
                        <WView style={imageContainerStyle} backgroundColor={Colors.light_color}>
                            <Image
                                source={img}
                                style={imageStyle} />
                        </WView>
                        {
                            is_logged_in_skipped ?
                                <this.UnAuthTile />
                                :
                                <this.AuthTile
                                    name={name}
                                    email={email} />
                        }
                    </WView>
                    <WView flex={2} stretch dial={2} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]} backgroundColor={Colors.white}>
                        <this.BtnTile
                            lable={"Share"}
                            onPress={this.onShare.bind(this)}
                            iconPath={shareIcon} />
                        <this.BtnTile
                            lable={"Profile Settings"}
                            screenName={EDIT_SCREEN}
                            iconPath={settingIcon} />
                        <this.BtnTile
                            screenName={CUSTOMER_SUPPORT_SCREEN}
                            lable={"Customer Support"}
                            iconPath={informationIcon} />
                        <this.BtnTile
                            lable={"My Orders"}
                            screenName={ORDER_LIST_SCREEN}
                            iconPath={notificationIcon} />
                        <this.BtnTile
                            lable={"Chat"}
                            screenName={CHAT_SCREEN}
                            iconPath={chatIcon} />
                    </WView>
                    <WView stretch dial={1} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]} backgroundColor={Colors.light_color}>
                        <this.BtnTile
                            lable={"Terms & Conditions"}
                            iconPath={iconPath}
                            isIcon={false}
                        />
                        <this.BtnTile
                            lable={"Privacy Policy"}
                            iconPath={iconPath}
                            isIcon={false}
                        />
                        <this.BtnTile
                            lable={"Rate Us"}
                            iconPath={iconPath}
                            isIcon={false}
                        />
                    </WView>
                </WView>
            </ScrollView>
        );
    }

    getStyles = () => {

        return ({
            imageContainerStyle: {
                width: Utils.scaleSize(50),
                height: Utils.scaleSize(50),
                borderRadius: Utils.scaleSize(25),
                overflow: 'hidden'
            },
            imageStyle: {
                flex: 1,
                width: null,
                height: null
            },
            iconStyle: {
                width: Utils.scaleSize(16),
                height: Utils.scaleSize(16),
                tintColor: Colors.text_color_dark
            },
            btnTileContainerStyle: {
            },
            unAuthTileTextStyle: {
                textDecorationLine: "underline"
            }
        });
    }
}

const mapToProps = ({ user, device }) => {
    const user_info = user && user[USER_KEY] ? user[USER_KEY] : {};
    const user_data = user_info && user_info[USER_DATA] ? user_info[USER_DATA] : {};

    const device_info = device && device[DEVICE_KEY] ? device[DEVICE_KEY] : {};
    const is_logged_in_skipped = device_info && device_info[DEVICE_IS_LOGIN_SKIPPED] ? device_info[DEVICE_IS_LOGIN_SKIPPED] : false;

    const name = user_data && user_data.name ? user_data.name : "";
    const email = user_data && user_data.email ? user_data.email : "";
    const image = user_data && user_data.image ? user_data.image : require("../../../assets/img/user1.png");

    return ({
        name,
        email,
        image,
        is_logged_in_skipped
    });
}
export default connect(mapToProps, {
    logout
})(DrawableContainer);