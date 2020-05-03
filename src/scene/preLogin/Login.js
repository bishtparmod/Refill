import React, { PureComponent } from 'react';
import { ImageBackground } from 'react-native';
import { AuthContainer } from '../../common/base_components'
import { SignupForm } from '../../common/form/signup'
import { LoginForm, SocialLogin, LoginAlert } from '../../common/form/login';
import { LOGIN_KEY, LOGIN_REQEUST_LOADING } from '../../redux/Types';
import { resetLoginState } from '../../redux/login/Action';
import { connect } from 'react-redux'

class Login extends PureComponent {
    constructor(props) {
        super(props);
    }

    openScrenn = (screen) => {
        const { navigation } = this.props;

        if (!screen) return;

        navigation.navigate(screen);
    }

    componentWillUnmount = () => {
        const { resetLoginState } = this.props;

        resetLoginState();
    }

    render() {
        const { container } = this.getStyles();
        const imgBackground = require("../../../assets/img/signup_background.png");
        const login_img_1 = require('../../../assets/img/login_img_1.png');
        const { loading, navigation } = this.props;

        return (
            <ImageBackground source={imgBackground} style={container} resizeMode={"repeat"}>
                <AuthContainer
                    topIcon={login_img_1}
                    leftBtnLabel={"Login"}
                    rightBtnLabel={"SignUp"}
                    onRightBtnClick={this.openScrenn.bind(this, "Signup")}
                    onSubmitPress={() => {
                        if (typeof this._callback === "function") this._callback();
                    }}
                    isLeftBtnSelected
                    isSubmitBtnLoading={loading}
                >
                    <LoginForm
                        navigation={navigation}
                        initSubmit={(cb) => {
                            this._callback = cb;
                        }} />
                </AuthContainer>
                <SocialLogin />
                <LoginAlert />
            </ImageBackground>
        );
    }

    getStyles = () => {
        return ({
            container: {
                flex: 1,
                width: null,
                height: null,
                justifyContent: 'space-around',
                alignItems: 'stretch'
            }
        });
    }
}

const mapToProps = ({ login }) => {
    const login_key = login && login[LOGIN_KEY] ? login[LOGIN_KEY] : {};
    const loading = login_key && login_key[LOGIN_REQEUST_LOADING] ? login_key[LOGIN_REQEUST_LOADING] : false;

    return ({
        loading
    });
}

export default connect(mapToProps, {
    resetLoginState
})(Login);