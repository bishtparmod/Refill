import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'
import { Image, View } from 'react-native';
import { WTouchable, WView, WRow, WText, WSpinner } from '../ui';
import Colors from '../styles/Colors';
import Utils from '../util/Utils';

class AuthContainer extends PureComponent {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        topIcon: PropTypes.any,
        leftBtnLabel: PropTypes.string,
        rightBtnLabel: PropTypes.string,
        onRightBtnClick: PropTypes.func,
        isLeftBtnSelected: PropTypes.bool,
        isRightBtnSelected: PropTypes.bool,
        onSubmitPress: PropTypes.func,
        isSubmitBtnLoading: PropTypes.bool
    }

    render() {
        const { children, topIcon, leftBtnLabel, rightBtnLabel, isRightBtnSelected, isLeftBtnSelected, onRightBtnClick, onSubmitPress, isSubmitBtnLoading } = this.props;
        const { topImageContainer, image, iconStyle, btnContainer, btnStyle, selectedBtn, container } = this.getStyles();
        const rightIcon = require("../../../assets/img/right.png");

        return (
            <WView dial={5} margin={[120, 0, 40, 0]} padding={[10, 0, 0, 0]} backgroundColor={Colors.transparent} stretch style={container}>
                {
                    topIcon ?
                        <View style={topImageContainer}>
                            <Image source={topIcon} style={image} resizeMode={"contain"} />
                        </View> : null
                }
                <WRow margin={[30, 20, 0, 20]} dial={5} spaceBetween>
                    {
                        leftBtnLabel &&
                        <WView dial={4}>
                            <WText fontSize={Utils.scaleSize(18)} fontWeight={"700"} fontFamily={"Poppins-Bold"} color={Colors.white}>{leftBtnLabel}</WText>
                            <WView style={isLeftBtnSelected ? selectedBtn : {}} margin={[5, 0, 0, 0]} backgroundColor={Colors.white} />
                        </WView>
                    }
                    {
                        rightBtnLabel &&
                        <WTouchable dial={5} onPress={onRightBtnClick}>
                            <WText fontSize={Utils.scaleSize(18)} fontWeight={"700"} fontFamily={"Poppins-Bold"} color={Colors.gray}>{rightBtnLabel}</WText>
                            <WView style={isRightBtnSelected ? selectedBtn : {}} margin={[5, 0, 0, 0]} backgroundColor={Colors.white} />
                        </WTouchable>
                    }
                </WRow>
                {children}
                <WTouchable dial={5} style={btnContainer} onPress={onSubmitPress}>
                    {
                        isSubmitBtnLoading ?
                            <WSpinner size={"small"} color={Colors.theme_color} />
                            :
                            <Image source={rightIcon} style={iconStyle} resizeMode={"contain"} />
                    }
                </WTouchable>
                <WView style={[
                    container,
                    {
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: Utils.scaleSize(25),
                        left: 0,
                        zIndex: -1,
                    }]} backgroundColor={Colors.theme_color} />
            </WView>
        );
    }

    getStyles = () => {
        return ({
            container: {
                borderTopRightRadius: Utils.scaleSize(70),
                borderBottomRightRadius: Utils.scaleSize(30),
                borderBottomLeftRadius: Utils.scaleSize(70)
            },
            topImageContainer: {
                position: "absolute",
                top: Utils.scaleSize(-90),
                left: 0,
                right: 0,
                alignSelf: 'center',
                minHeight: Utils.scaleSize(100)
            },
            image: {
                flex: 1,
                width: null,
                height: null
            },
            btnContainer: {
                alignSelf: 'center',
                borderRadius: Utils.scaleSize(25),
                backgroundColor: Colors.white,
                height: Utils.scaleSize(50),
                width: Utils.scaleSize(50),
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            },
            iconStyle: {
                height: Utils.scaleSize(25),
                width: Utils.scaleSize(25)
            },
            btnStyle: {
                width: Utils.scaleSize(100),
                height: Utils.scaleSize(56)
            },
            selectedBtn: {
                width: Utils.scaleSize(25),
                height: Utils.scaleSize(5),
                borderRadius: 2
            }
        });
    }
}

export default AuthContainer;