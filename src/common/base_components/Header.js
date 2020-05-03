import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { WRow, WTouchable, WView, WText } from '../ui'
import { Image } from 'react-native'
import Colors from '../styles/Colors'
import Utils from '../util/Utils'
import { HOME_SCREEN, EDIT_SCREEN, ADD_SHIPPING_AND_BILLING_ADDRESS_SCREEN, ADD_CARD_SCREEN, LIST_CARD_SCREEN, PRODUCT_DETAIL_SCREEN, PRODUCT_LIST_SCREEN, ORDER_SUMMARY_SCREEN, ORDER_LIST_SCREEN, ORDER_VIEW_SCREEN, NOTIFICATIONS_SCREEN, CUSTOMER_SUPPORT_SCREEN, CHAT_SCREEN } from '../../redux/Types'
import { View } from 'react-native';
import { SearchInput } from '../base_components'

export default class Header extends PureComponent {

    static propTypes = {
        screenType: PropTypes.oneOf([HOME_SCREEN, EDIT_SCREEN, LIST_CARD_SCREEN, ADD_SHIPPING_AND_BILLING_ADDRESS_SCREEN, ADD_CARD_SCREEN, NOTIFICATIONS_SCREEN, ORDER_VIEW_SCREEN, ORDER_LIST_SCREEN, CUSTOMER_SUPPORT_SCREEN, CHAT_SCREEN]),
        onDrawerPress: PropTypes.func,
        onNotificationPress: PropTypes.func,
        onBack: PropTypes.func,
        onSort: PropTypes.func,
        isBack: PropTypes.bool
    }

    static defaultProps = {
        screenType: HOME_SCREEN,
        isBack: true
    }

    /**
     * Home screen header
     */
    _renderHomeScreenHeaderBody = () => {
        const { iconStyle, bottomStrip, editSubContainer, bottomSearchStrip } = this.getStyle();
        const { onDrawerPress, onBack, onNotificationPress } = this.props;
        const drawableIcon = require('../../../assets/img/drawable.png');
        const notificationIcon = require('../../../assets/img/notification.png');
        const backIcon = require('../../../assets/img/left_arrow.png');

        return (
            <WView flex stretch dial={4} spaceBetween>
                <WRow dial={4} padding={[0, 10]} spaceBetween backgroundColor={Colors.theme_color}>
                    <WTouchable dial={5} onPress={onDrawerPress} padding={[10, 10]}>
                        <Image source={drawableIcon} style={[iconStyle, { tintColor: Colors.white }]} resizeMode={"contain"} />
                    </WTouchable>
                    <WTouchable dial={5} onPress={onNotificationPress} padding={[10, 10]}>
                        <Image source={notificationIcon} style={iconStyle} resizeMode={"contain"} />
                    </WTouchable>
                </WRow>
                <SearchInput />
                <WView style={bottomSearchStrip} backgroundColor={Colors.theme_color} />
            </WView>
        );
    }

    /**
     * Product list screen header
     */
    _renderProductListScreenHeaderBody = () => {
        const { iconStyle } = this.getStyle();
        const { onBack, onSort } = this.props;
        const backIcon = require('../../../assets/img/left_arrow.png');
        const sortIcon = require('../../../assets/img/sort.png');

        return (
            <WView flex stretch dial={4} spaceBetween backgroundColor={Colors.white}>
                <WRow flex dial={4} padding={[0, 10]}>
                    <WTouchable dial={5} onPress={onBack} padding={[10, 10]}>
                        <Image source={backIcon} style={[iconStyle, { tintColor: Colors.black }]} resizeMode={"contain"} />
                    </WTouchable>
                    <WView dial={5} flex stretch>
                        <SearchInput
                            backgroundColor={Colors.light_color} />
                    </WView>
                    <WTouchable dial={5} onPress={onSort} padding={[10, 10]}>
                        <Image source={sortIcon} style={[iconStyle, { tintColor: Colors.black }]} resizeMode={"contain"} />
                    </WTouchable>
                </WRow>
            </WView>
        );
    }

    /**
     * Edit screen header
     */
    _renderEditHeaderBody = () => {
        const { iconStyle, bottomStrip, editSubContainer } = this.getStyle();
        const { isBack, onDrawerPress, onNotificationPress, onBack } = this.props;
        const drawableIcon = require('../../../assets/img/drawable.png');
        const notificationIcon = require('../../../assets/img/notification.png');
        const backIcon = require('../../../assets/img/left_arrow.png');

        return (
            <WView flex dial={4} style={[editSubContainer]} backgroundColor={Colors.theme_color}>
                <WRow flex dial={4} padding={[10, 10]}>
                    <WTouchable dial={5} onPress={isBack ? onBack : onDrawerPress} padding={[10, 10]}>
                        <Image source={isBack ? backIcon : drawableIcon} style={[iconStyle, { tintColor: Colors.white }]} resizeMode={"contain"} />
                    </WTouchable>
                    <WTouchable dial={5} onPress={onNotificationPress} padding={[10, 10]}>
                        <Image source={notificationIcon} style={iconStyle} resizeMode={"contain"} />
                    </WTouchable>
                </WRow>
                <WView style={bottomStrip} />
            </WView>
        );
    }

    /**
     * Simple Header Body
     */
    _renderSimpleHeaderBody = () => {
        const { iconStyle } = this.getStyle();
        const { onBack } = this.props;
        const backIcon = require('../../../assets/img/left_arrow.png');

        return (
            <WView flex dial={4}>
                <WRow flex dial={4} padding={[10, 10]}>
                    <WTouchable dial={5} onPress={onBack} padding={[0, 10]}>
                        <Image source={backIcon} style={iconStyle} resizeMode={"contain"} />
                    </WTouchable>
                </WRow>
            </WView>
        );
    }

    /** Render elements */
    _renderHeaderElements = () => {
        const { screenType } = this.props;

        switch (screenType) {
            case HOME_SCREEN:
                return this._renderHomeScreenHeaderBody();
            case PRODUCT_LIST_SCREEN:
                return this._renderProductListScreenHeaderBody();
            case EDIT_SCREEN:
                return this._renderEditHeaderBody();
            case NOTIFICATIONS_SCREEN:
            case ORDER_VIEW_SCREEN:
            case ORDER_LIST_SCREEN:
            case ORDER_SUMMARY_SCREEN:
            case ADD_CARD_SCREEN:
            case ADD_SHIPPING_AND_BILLING_ADDRESS_SCREEN:
            case PRODUCT_DETAIL_SCREEN:
            case LIST_CARD_SCREEN:
                return this._renderSimpleHeaderBody();
        }
    }

    render() {
        const { container } = this.getStyle();

        return (
            <WView flex stretch dial={5} style={container} backgroundColor={Colors.white}>
                {this._renderHeaderElements()}
            </WView>
        )
    }

    getHeaderHeight = () => {
        const { screenType } = this.props;

        switch (screenType) {
            case HOME_SCREEN:
                return Utils.scaleSize(60);
            case EDIT_SCREEN:
                return Utils.scaleSize(64);
            case NOTIFICATIONS_SCREEN:
            case ORDER_VIEW_SCREEN:
            case ORDER_LIST_SCREEN:
            case ORDER_SUMMARY_SCREEN:
            case PRODUCT_LIST_SCREEN:
            case ADD_CARD_SCREEN:
            case PRODUCT_DETAIL_SCREEN:
            case ADD_SHIPPING_AND_BILLING_ADDRESS_SCREEN:
            case LIST_CARD_SCREEN:
                return Utils.scaleSize(44);
        }
    }

    getStyle = () => {

        return {
            container: {
                maxHeight: Utils.scaleSize(this.getHeaderHeight())
            },
            iconStyle: {
                width: Utils.scaleSize(20),
                height: Utils.scaleSize(20)
            },
            bottomStrip: {
                height: Utils.scaleSize(30)
            },
            editSubContainer: {
                borderBottomRightRadius: Utils.scaleSize(30)
            },
            bottomSearchStrip: {
                position: 'absolute',
                bottom: Utils.scaleSize(15),
                right: 0,
                left: 0,
                height: Utils.scaleSize(30),
                zIndex: -1,
                borderBottomRightRadius: Utils.scaleSize(40)
            }
        }
    }
}
