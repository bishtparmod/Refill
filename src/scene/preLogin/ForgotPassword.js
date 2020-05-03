import React, { PureComponent } from 'react';
import { ScrollView, ImageBackground, Text, Image } from 'react-native';
import { AuthContainer } from '../../common/base_components'
import { ForgetPasswordForm, ForgotPasswordAlert } from '../../common/form/forgetPassword'
import { resetForgotPasswordState } from '../../redux/forgotPassword/Action';
import { connect } from 'react-redux';
import { FORGOT_PASSWORD_KEY, FORGOT_PASSWORD_REQEUST_LOADING } from '../../redux/Types';
import { WTouchable } from '../../common/ui';
import Utils from '../../common/util/Utils';

class ForgotPassword extends PureComponent {
    constructor(props) {
        super(props);

        this._callback = undefined;
    }

    onBack = () => {
        const { navigation } = this.props;

        if(!navigation) return;

        navigation.pop();
    }

    //Open new screen
    openScrenn = (screen) => {
        const { navigation } = this.props;

        if (!screen) return;

        navigation.navigate(screen);
    }

    componentWillUnmount = () => {
        const { resetForgotPasswordState } = this.props;

        resetForgotPasswordState();
    }

    BackBtn = () => {
        const backIcon = require("../../../assets/img/left_arrow.png");
        const { btnContainer, btnStyle } = this.getStyles();

        return (
            <WTouchable onPress={this.onBack.bind(this)} stretch dial={btnContainer} style={btnContainer}>
                <Image source={backIcon} style={btnStyle} resizeMode={'contain'}/>
            </WTouchable>
        );
    }

    render() {
        const { container } = this.getStyles();
        const imgBackground = require("../../../assets/img/signup_background.png");
        const signup_img_1 = require('../../../assets/img/signup_img_1.png');
        const { loading, navigation } = this.props;

        return (
            <ImageBackground source={imgBackground} style={container} resizeMode={"repeat"}>
                <AuthContainer
                    topIcon={signup_img_1}
                    leftBtnLabel={"Forgot Password"}
                    isLeftBtnSelected
                    onSubmitPress={() => {
                        if (typeof this._callback === "function") this._callback();
                    }}
                    onRightBtnClick={this.openScrenn.bind(this, "Login")}
                    isLeftBtnSelected
                    isSubmitBtnLoading={loading}
                >
                    <ForgetPasswordForm
                        navigation={navigation}
                        initSubmit={(cb) => {
                            this._callback = cb;
                        }} />
                </AuthContainer>
                <ForgotPasswordAlert />
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

const mapToProps = ({ forgot_password }) => {
    const forgot_password_key = forgot_password && forgot_password[FORGOT_PASSWORD_KEY] ? forgot_password[FORGOT_PASSWORD_KEY] : {};
    const loading = forgot_password_key && forgot_password_key[FORGOT_PASSWORD_REQEUST_LOADING] ? forgot_password_key[FORGOT_PASSWORD_REQEUST_LOADING] : false;

    return ({
        loading
    });
}

export default connect(mapToProps, {
    resetForgotPasswordState
})(ForgotPassword);