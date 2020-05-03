import React, { PureComponent } from 'react';
import { ScrollView, ImageBackground, Text, Image } from 'react-native';
import { AuthContainer } from '../../../common/base_components'
import { ChangePasswordForm, ChangePasswordAlert } from '../../../common/form/changePassword'
import { resetChangePasswordState } from '../../../redux/changePassword/Action';
import { connect } from 'react-redux';
import { CHANGE_PASSWORD_KEY, CHANGE_PASSWORD_REQEUST_LOADING } from '../../../redux/Types';
import { WTouchable } from '../../../common/ui';
import Utils from '../../../common/util/Utils';

class ChangePassword extends PureComponent {
    constructor(props) {
        super(props);

        this._callback = undefined;
    }

    onBack = () => {
        const { navigation } = this.props;

        if (!navigation) return;

        navigation.pop();
    }

    //Open new screen
    openScrenn = (screen) => {
        const { navigation } = this.props;

        if (!screen) return;

        navigation.navigate(screen);
    }

    componentWillUnmount = () => {
        const { resetChangePasswordState } = this.props;

        resetChangePasswordState();
    }

    BackBtn = () => {
        const backIcon = require("../../../../assets/img/left_arrow.png");
        const { btnContainer, btnStyle } = this.getStyles();

        return (
            <WTouchable onPress={this.onBack.bind(this)} stretch dial={btnContainer} style={btnContainer}>
                <Image source={backIcon} style={btnStyle} resizeMode={'contain'} />
            </WTouchable>
        );
    }

    render() {
        const { container } = this.getStyles();
        const imgBackground = require("../../../../assets/img/signup_background.png");
        const signup_img_1 = require('../../../../assets/img/signup_img_1.png');
        const { loading, navigation } = this.props;

        return (
            <ImageBackground source={imgBackground} style={container} resizeMode={"repeat"}>
                <AuthContainer
                    topIcon={signup_img_1}
                    leftBtnLabel={"Change Password"}
                    isLeftBtnSelected
                    onSubmitPress={() => {
                        if (typeof this._callback === "function") this._callback();
                    }}
                    isSubmitBtnLoading={loading}
                >
                    <ChangePasswordForm
                        navigation={navigation}
                        onBack={this.onBack.bind(this)}
                        initSubmit={(cb) => {
                            this._callback = cb;
                        }} />
                </AuthContainer>
                <ChangePasswordAlert />
                <this.BackBtn />
            </ImageBackground>
        );
    }

    getStyles = () => {
        return ({
            container: {
                flex: 1,
                width: null,
                height: null,
                justifyContent: 'center',
                alignItems: 'stretch'
            },
            btnContainer: {
                position: 'absolute',
                top: Utils.scaleSize(10),
                left: Utils.scaleSize(15),
                width: Utils.scaleSize(20),
                height: Utils.scaleSize(20)
            },
            btnStyle: {
                flex: 1,
                width: null,
                height: null
            }
        });
    }
}

const mapToProps = ({ change_password }) => {
    const change_password_key = change_password && change_password[CHANGE_PASSWORD_KEY] ? change_password[CHANGE_PASSWORD_KEY] : {};
    const loading = change_password_key && change_password_key[CHANGE_PASSWORD_REQEUST_LOADING] ? change_password_key[CHANGE_PASSWORD_REQEUST_LOADING] : false;

    return ({
        loading
    });
}

export default connect(mapToProps, {
    resetChangePasswordState
})(ChangePassword);