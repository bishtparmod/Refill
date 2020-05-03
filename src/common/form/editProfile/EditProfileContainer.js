import React, { PureComponent } from 'react';
import { WView, WRow, WTouchable, WText } from '../../ui';
import Utils from '../../util/Utils';
import { Image } from 'react-native';
import Colors from '../../styles/Colors';
import { CHANGE_PASSWORD_SCREEN, ADD_SHIPPING_AND_BILLING_ADDRESS_SCREEN, LIST_CARD_SCREEN, USER_KEY, USER_DATA, DEVICE_KEY, DEVICE_IS_LOGGED_IN, DEVICE_IS_LOGIN_SKIPPED } from '../../../redux/Types';
import { connect } from 'react-redux';
import { logout } from '../../../redux/login/Action';

class EditProfileContainer extends PureComponent {
    constructor(props) {
        super(props);
    }

    openScreen = (screenName) => {
        const { navigation } = this.props;

        if (!navigation || !screenName) return;

        navigation.navigate(screenName);
    }

    //Auth Actions
    AuthActions = ({ }) =>
        <WView margin={[10, 10]}>
            <this.BtnTile
                screenName={CHANGE_PASSWORD_SCREEN}
                lable={"Change Password"} />
            <this.BtnTile
                screenName={ADD_SHIPPING_AND_BILLING_ADDRESS_SCREEN}
                lable={"Add Address"} />
            <this.BtnTile
                screenName={LIST_CARD_SCREEN}
                lable={"Delete Card"} />
            <this.BtnTile
                lable={"Logout"}
                onPress={this.logout.bind(this)}
                isLogout />
        </WView>

    //Profile Detail Tile
    LableTile = ({ lable, value, iconPath }) => {
        const { iconStyle } = this.getStyles();

        return (
            <WView dial={4} padding={[0, 0, 10, 0]}>
                <WRow>
                    <Image
                        source={iconPath}
                        style={iconStyle}
                        resizeMode={"contain"}
                    />
                    <WText padding={[0, 10]} fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Bold"} fontWeight={"400"} color={Colors.text_color_dark} >{lable}</WText>
                </WRow>
                <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.theme_color}>{value}</WText>
            </WView>
        );
    }

    BtnTile = ({ lable, isLogout, screenName, onPress = () => { } }) => {
        const { iconStyle, btnTileContainerStyle } = this.getStyles();
        const iconPath = require("../../../../assets/img/right1.png");

        return (
            <WTouchable onPress={isLogout ? onPress : this.openScreen.bind(this, screenName)}>
                <WRow dial={5} padding={[10, 0]} spaceBetween style={[isLogout ? {} : btnTileContainerStyle]}>
                    <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={isLogout ? Colors.theme_color : Colors.text_color_dark} >{lable}</WText>
                    {
                        isLogout ?
                            null :
                            <Image
                                source={iconPath}
                                style={iconStyle}
                                resizeMode={"contain"}
                            />
                    }
                </WRow>
            </WTouchable>
        );
    }

    logout = () => {
        const { logout } = this.props;

        logout();
    }

    render() {
        const { imageContainerStyle, imageStyle, loginBtnStyle, profileImageContainer } = this.getStyles();
        const userIcon = require("../../../../assets/img/user.png");
        const userProfileImg = require("../../../../assets/img/user1.png");
        const { is_logged_in_skipped, name, email, image } = this.props;
        const img = is_logged_in_skipped ? userProfileImg : typeof image === "string" ? { uri: image } : image;

        return (
            <WView flex>
                <WRow margin={[10, 10]} padding={[0, 0, 10, 0]} style={profileImageContainer}>
                    <WView dial={5} stretch style={imageContainerStyle} backgroundColor={Colors.light_color}>
                        <Image
                            source={img}
                            style={imageStyle}
                            resizeMode={"cover"}
                        />
                    </WView>
                    <WRow dial={5} flex padding={[10, 0, 10, 10]}>
                        <WView flex dial={4}>
                            <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_dark} >{name ? name : ""}</WText>
                            <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Light"} color={Colors.text_color_light_dark}>{email ? email : ""}</WText>
                        </WView>
                        <WView dial={5}>
                            {
                                is_logged_in_skipped ?
                                    <WTouchable padding={[Utils.scaleSize(5), Utils.scaleSize(30)]} style={loginBtnStyle} onPress={this.logout.bind(this)}>
                                        <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Medium"} fontWeight={"500"}>Login</WText>
                                    </WTouchable>
                                    :
                                    null
                            }
                        </WView>
                    </WRow>
                </WRow>
                <WView margin={[10, 10]}>
                    <this.LableTile
                        lable={"Name"}
                        value={name ? name : "NA"}
                        iconPath={userIcon} />
                    <this.LableTile
                        lable={"Email"}
                        value={email ? email : "NA"}
                        iconPath={userIcon} />
                </WView>
                {
                    is_logged_in_skipped ?
                        null
                        : <this.AuthActions />
                }
            </WView>
        );
    }

    getStyles = () => {
        return ({
            imageContainerStyle: {
                width: Utils.scaleSize(70),
                height: Utils.scaleSize(70),
                borderRadius: Utils.scaleSize(35),
                overflow: 'hidden'
            },
            imageStyle: {
                flex: 1,
                width: null,
                height: null
            },
            loginBtnStyle: {
                borderRadius: Utils.scaleSize(20),
                backgroundColor: Colors.theme_color
            },
            profileImageContainer: {
                borderStyle: 'solid',
                borderBottomWidth: 1,
                borderColor: Colors.light_color
            },
            iconStyle: {
                width: Utils.scaleSize(16),
                height: Utils.scaleSize(16),
                tintColor: Colors.text_color_dark
            },
            btnTileContainerStyle: {
                borderStyle: 'solid',
                borderBottomWidth: 1,
                borderColor: Colors.light_color
            }
        });
    }
}

const mapToProps = ({ user, device }) => {
    const user_info = user && user[USER_KEY] ? user[USER_KEY] : {};
    const user_data = user_info && user_info[USER_DATA] ? user_info[USER_DATA] : {};

    const device_info = device && device[DEVICE_KEY] ? device[DEVICE_KEY] : {};
    const is_logged_in = device_info && device_info[DEVICE_IS_LOGGED_IN] ? device_info[DEVICE_IS_LOGGED_IN] : false;
    const is_logged_in_skipped = device_info && device_info[DEVICE_IS_LOGIN_SKIPPED] ? device_info[DEVICE_IS_LOGIN_SKIPPED] : false;

    const user_token = user_data && user_data.user_token ? user_data.user_token : "";
    const name = user_data && user_data.name ? user_data.name : "";
    const email = user_data && user_data.email ? user_data.email : "";
    const image = user_data && user_data.image ? user_data.image : require("../../../../assets/img/user1.png");
    return ({
        name,
        email,
        image,
        is_logged_in,
        is_logged_in_skipped
    });
}
export default connect(mapToProps, {
    logout
})(EditProfileContainer);