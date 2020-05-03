import React, { PureComponent } from 'react';
import { ScrollView, ImageBackground, Text } from 'react-native';
import { AuthContainer } from '../../common/base_components'
import { SignupForm, SignupAlert } from '../../common/form/signup'
import { connect } from 'react-redux'
import { SIGNUP_KEY, SIGNUP_REQEUST_LOADING } from '../../redux/Types';
import { resetSignupState } from '../../redux/signup/Action';

class Signup extends PureComponent {
    constructor(props) {
        super(props);

        this._callback = undefined;
    }

    //Open new screen
    openScrenn = (screen) => {
        const { navigation } = this.props;

        if (!screen) return;

        navigation.navigate(screen);
    }

    componentWillUnmount = () => {
        const { resetSignupState } = this.props;

        resetSignupState();
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
                    leftBtnLabel={"SignUp"}
                    rightBtnLabel={"Login"}
                    onSubmitPress={() => {
                        if (typeof this._callback === "function") this._callback();
                    }}
                    onRightBtnClick={this.openScrenn.bind(this, "Login")}
                    isLeftBtnSelected
                    isSubmitBtnLoading={loading}
                >
                    <SignupForm
                        navigation={navigation}
                        initSubmit={(cb) => {
                            this._callback = cb;
                        }} />
                </AuthContainer>
                <SignupAlert />
            </ImageBackground>
        );
    }

    // Component styles
    getStyles = () => {
        return ({
            container: {
                flex: 1,
                width: null,
                height: null,
                justifyContent: 'center',
                alignItems: 'stretch'
            }
        });
    }
}

const mapToProps = ({ signup }) => {
    const signup_key = signup && signup[SIGNUP_KEY] ? signup[SIGNUP_KEY] : {};
    const loading = signup_key && signup_key[SIGNUP_REQEUST_LOADING] ? signup_key[SIGNUP_REQEUST_LOADING] : false;

    return ({
        loading
    });
}

export default connect(mapToProps, {
    resetSignupState
})(Signup);