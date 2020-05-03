import React, { PureComponent } from 'react';
import { View, Animated, Image } from 'react-native';
import { WRow, WTouchable, WText, WView } from '../../ui'
import { GoogleBtn, FacebookBtn } from '.';
import Colors from '../../styles/Colors';
import Utils from '../../util/Utils';
import { connect } from 'react-redux';
import { skipLogin } from '../../../redux/login/Action';

class SocialLogin extends PureComponent {
    constructor(props) {
        super(props);

        this.containerAnim = new Animated.Value(120);
    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        Animated.timing(this.containerAnim, {
            toValue: 0,
            duration: 1000
        }).start();
    }

    skipLogin = () => {
        const { skipLogin } = this.props;

        skipLogin();
    }

    render() {
        const { container, subContainer, iconStyle } = this.getStyles();
        const rightArrow = require("../../../../assets/img/right_arrow.png");

        return (
            <WView dial={5} style={container}>
                <Animated.View style={subContainer}>
                    <WText fontSize={Utils.scaleSize(14)} color={Colors.black} center>Or Login With</WText>
                    <WRow flex style={{ overflow: 'hidden' }} padding={[0, 20]} dial={5}>
                        <FacebookBtn />
                        <GoogleBtn />
                    </WRow>
                    <WTouchable onPress={this.skipLogin.bind(this)}>
                        <WRow padding={[10, 20]} dial={5}>
                            <WText fontSize={Utils.scaleSize(14)} color={Colors.black} center>Skip Continue Shopping</WText>
                            <Image source={rightArrow} style={iconStyle} resizeMode={"contain"} />
                        </WRow>
                    </WTouchable>
                </Animated.View>
            </WView>
        );
    }

    getStyles = () => {
        return ({
            container: {
                flex: 1,
                height: Utils.scaleSize(110),
                maxHeight: Utils.scaleSize(110)
            },
            subContainer: {
                position: 'absolute',
                top: this.containerAnim,
                bottom: 0,
                left: 0,
                right: 0
            },
            iconStyle: {
                width: Utils.scaleSize(30),
                height: Utils.scaleSize(15)
            }
        });
    }
}

const mapToProps = () => {

    return ({});
}

export default connect(mapToProps, {
    skipLogin
})(SocialLogin);