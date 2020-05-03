import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, ImageBackground, Text, Image } from 'react-native';
import { AuthContainer } from '../../common/base_components'
import { ResetPasswordForm, ResetPasswordAlert } from '../../common/form/resetPassword'
import { RESET_PASSWORD_KEY, RESET_PASSWORD_REQEUST_LOADING } from '../../redux/Types';
import { resetResetPasswordState } from '../../redux/resetPassword/Action';
import { connect } from 'react-redux';
import { WTouchable } from '../../common/ui';
import Utils from '../../common/util/Utils';

/** Reset password */
class ResetPassword extends PureComponent {
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
        const { resetResetPasswordState } = this.props;

        resetResetPasswordState();
    }

    BackBtn = () => {
        const backIcon = require("../../../assets/img/left_arrow.png");
        const { btnContainer, btnStyle } = this.getStyles();

        return (
            <WTouchable onPress={this.onBack.bind(this)} stretch dial={btnContainer} style={btnContainer}>
                <Image source={backIcon} style={btnStyle} resizeMode={'contain'} />
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
                    leftBtnLabel={"Reset Password"}
                    isLeftBtnSelected
                    onSubmitPress={() => {
                        if (typeof this._callback === "function") this._callback();
                    }}
                    isSubmitBtnLoading={loading}
                >
                    <ResetPasswordForm
                        navigation={navigation}
                        initSubmit={(cb) => {
                            this._callback = cb;
                        }}
                    />
                </AuthContainer>
                <ResetPasswordAlert />
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

const mapToProps = ({ reset_password }) => {
    const reset_password_key = reset_password && reset_password[RESET_PASSWORD_KEY] ? reset_password[RESET_PASSWORD_KEY] : {};
    const loading = reset_password_key && reset_password_key[RESET_PASSWORD_REQEUST_LOADING] ? reset_password_key[RESET_PASSWORD_REQEUST_LOADING] : false;

    return ({
        loading
    });
}

export default connect(mapToProps, {
    resetResetPasswordState
})(ResetPassword);