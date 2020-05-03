import React, { PureComponent } from 'react';
import { ImageBackground, Image } from 'react-native';
import { AuthContainer } from '../../common/base_components'
import { CustomerSupportForm } from '../../common/form/customerSupport';
import { LOGIN_KEY, LOGIN_REQEUST_LOADING, CUSTOMER_SUPPORT_REQUEST_LOADING, CUSTOMER_SUPPORT_KEY } from '../../redux/Types';
import { resetLoginState } from '../../redux/login/Action';
import { connect } from 'react-redux'
import Utils from '../../common/util/Utils';
import { WTouchable, WView } from '../../common/ui';
import { resetCustomerSupportState } from '../../redux/customerSupport/Action';

class CustomerSupport extends PureComponent {
    constructor(props) {
        super(props);
    }

    openScrenn = (screen) => {
        const { navigation } = this.props;

        if (!screen) return;

        navigation.navigate(screen);
    }

    componentWillUnmount = () => {
        const { resetCustomerSupportState } = this.props;

        resetCustomerSupportState();
    }

    onBack = () => {
        const { navigation } = this.props;

        if (!navigation) return;

        navigation.pop();
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
        const { container, imageStyle, bottomImageContainer } = this.getStyles();
        const imgBackground = require("../../../assets/img/signup_background.png");
        const login_img_1 = require('../../../assets/img/login_img_1.png');
        const { loading, navigation } = this.props;

        return (
            <WView style={container} padding={[0, 0, Utils.scaleSize(20), 0]} resizeMode={"repeat"}>
                <AuthContainer
                    leftBtnLabel={"Customer Support"}
                    onRightBtnClick={this.openScrenn.bind(this, "Signup")}
                    onSubmitPress={() => {
                        if (typeof this._callback === "function") this._callback();
                    }}
                    isLeftBtnSelected
                    isSubmitBtnLoading={loading}
                >
                    <CustomerSupportForm
                        navigation={navigation}
                        initSubmit={(cb) => {
                            this._callback = cb;
                        }} />
                </AuthContainer>
                <this.BackBtn />
                <WView style={bottomImageContainer}>
                    <Image source={login_img_1} style={imageStyle} resizeMode={"contain"} />
                </WView>
            </WView>
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
            },
            bottomImageContainer: {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                alignSelf: 'center',
                minHeight: Utils.scaleSize(80)
            },
            imageStyle: {
                flex: 1,
                width: null,
                height: null
            }
        });
    }
}

const mapToProps = ({ customer_support }) => {
    const customer_support_key = customer_support && customer_support[CUSTOMER_SUPPORT_KEY] ? customer_support[CUSTOMER_SUPPORT_KEY] : {};
    const loading = customer_support_key && customer_support_key[CUSTOMER_SUPPORT_REQUEST_LOADING] ? customer_support_key[CUSTOMER_SUPPORT_REQUEST_LOADING] : false;

    return ({
        loading
    });
}

export default connect(mapToProps, {
    resetCustomerSupportState
})(CustomerSupport);