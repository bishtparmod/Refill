import React, { PureComponent } from 'react';
import { Image } from 'react-native';
import { WRow, WTouchable, WText, WView, WButton } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { updateProductDetailFormData, updateProductDetailUIConstraints, orderDetail } from '../../../redux/prodcutDetail/Action';
import { connect } from 'react-redux';
import { PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_FORM, PRODUCT_DETAIL_FORM_ORDER_QUANTITY, PRODUCT_DETAIL_IS_ORDER_TYPE_ALERT, PRODUCT_DETAIL_FORM_ORDER_TYPE, PRODUCT_DETAIL_IS_ORDER_CALENDAR_ALERT, PRODUCT_DETAIL_FORM_ORDER_START_DATE, PRODUCT_DETAIL_FORM_ORDER_END_DATE, PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES, CUSTOM_ORDER, PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST, DEVICE_KEY, DEVICE_IS_LOGGED_IN, PRODUCT_DETAIL_ERRORS, PRODUCT_DETAIL_REQUEST_LOADING, PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING, PRODUCT_DETAIL_REQUEST_DATA, ORDER_SUMMARY_SCREEN, PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_VISIBLE, PRODUCT_DETAIL_REFILL_ORDER_IS_CANCEL_VISIBLE, PRODUCT_DETAIL_REFILL_ORDER_IS_GET_NOW_VISIBLE, PRODUCT_DETAIL_ORDERS_REFILL_DATA, PRODUCT_DETAIL_SCREEN } from '../../../redux/Types';
import moment from 'moment-timezone';
import { Helper } from '../../../apis';
import ActionOrderAlert from '../order/ActionOrderAlert';

class ProductPlaceOrderForm extends PureComponent {
    constructor(props) {
        super(props);
    }

    openScreen = (screenName, config) => {
        const { navigation } = this.props;

        if (!screenName || !navigation) return;

        navigation.replace(screenName, config);
    }

    _getDate = () => {
        const { date = {}, order_type } = this.props;
        const { startDate, endDate } = date;
        console.log("this.props ===> ", this.props)

        if (order_type === CUSTOM_ORDER)
            return startDate ? `${moment(new Date(startDate)).format('MMM DD')} ${endDate ? moment(new Date(endDate)).format('MMM DD') : ''}` : "No Date";
        else return !startDate && !endDate ? "No Date" : `${startDate ? moment(new Date(startDate)).format('MMM DD') : ''} ${(endDate && startDate !== endDate) ? moment(new Date(endDate)).format('MMM DD') : ''}`
    }

    DateCard = () => {
        const calendarIcon = require('../../../../assets/img/calendar.png');
        const { iconStyle, calendarIconStyle, calendarIconContainer, calendarEditIconContainer, placedOrderContainer, squareDotStyle } = this.getStyles();

        return (
            <WView dial={5} stretch>
                <WView dial={5} padding={[Utils.scaleSize(20), 0]}>
                    <WView dial={5} padding={[Utils.scaleSize(10), Utils.scaleSize(10)]} style={calendarIconContainer}>
                        <Image source={calendarIcon} style={calendarIconStyle} resizeMode={"contain"} />
                        <WText fontFamily={"Poppins-Bold"} padding={[Utils.scaleSize(10), Utils.scaleSize(5), 0, Utils.scaleSize(5)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.theme_color} >{this._getDate()}</WText>
                    </WView>
                </WView>
            </WView>
        )
    }

    onSkipPress = () => {
        const { updateProductDetailUIConstraints } = this.props;
        updateProductDetailUIConstraints({
            [PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_VISIBLE]: true
        });
    }

    onCancelPress = () => {
        const { updateProductDetailUIConstraints } = this.props;
        updateProductDetailUIConstraints({
            [PRODUCT_DETAIL_REFILL_ORDER_IS_CANCEL_VISIBLE]: true
        });
    }

    onGetNowPress = () => {
        const { updateProductDetailUIConstraints } = this.props;
        updateProductDetailUIConstraints({
            [PRODUCT_DETAIL_REFILL_ORDER_IS_GET_NOW_VISIBLE]: true
        });
    }

    render() {
        const { getNowBtnStyle, skipBtnStyle, cancelOrderBtnStyle } = this.getStyles();
        const { navigation } = this.props;

        return (
            <WView dial={4} stretch>
                <ActionOrderAlert navigation={navigation} />
                <this.DateCard />
                <WButton
                    onPress={this.onGetNowPress.bind(this)}
                    containerStyle={getNowBtnStyle}
                    label={"Get Now"} />
                <WButton
                    onPress={this.onSkipPress.bind(this)}
                    containerStyle={skipBtnStyle}
                    label={"Skip"} />
                <WButton
                    onPress={this.onCancelPress.bind(this)}
                    containerStyle={cancelOrderBtnStyle}
                    label={"Cancel Order"} />
            </WView>
        );
    }

    getStyles = () => {

        return ({
            iconStyle: {
                width: Utils.scaleSize(15),
                height: Utils.scaleSize(15)
            },
            calendarIconContainer: {
                borderRadius: 10,
                backgroundColor: Colors.white,
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                borderWidth: 1,
                borderColor: Colors.text_color_dark,
                borderStyle: 'solid',
            },
            calendarIconStyle: {
                width: Utils.scaleSize(30),
                height: Utils.scaleSize(30)
            },
            placedOrderContainer: {
                borderRadius: Utils.scaleSize(10),
                backgroundColor: Colors.white,
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            },
            getNowBtnStyle: {
                backgroundColor: Colors.theme_color,
                flex: 1,
                alignSelf: 'stretch',
                height: Utils.scaleSize(35),
                borderRadius: Utils.scaleSize(18),
                marginVertical: Utils.scaleSize(5)
            },
            skipBtnStyle: {
                backgroundColor: Colors.cancel_tile_color,
                flex: 1,
                alignSelf: 'stretch',
                height: Utils.scaleSize(35),
                borderRadius: Utils.scaleSize(18),
                marginVertical: Utils.scaleSize(5)
            },
            cancelOrderBtnStyle: {
                backgroundColor: Colors.text_color_dark,
                flex: 1,
                alignSelf: 'stretch',
                height: Utils.scaleSize(35),
                borderRadius: Utils.scaleSize(18),
                marginVertical: Utils.scaleSize(5)
            }
        });
    }
}

const mapToProps = ({ product_detail, device }) => {
    const product_detail_info = product_detail && product_detail[PRODUCT_DETAIL_KEY] ? product_detail[PRODUCT_DETAIL_KEY] : {};
    const device_info = device && device[DEVICE_KEY] ? device[DEVICE_KEY] : {};

    const order_detail_data = product_detail_info && product_detail_info[PRODUCT_DETAIL_ORDERS_REFILL_DATA] ? product_detail_info[PRODUCT_DETAIL_ORDERS_REFILL_DATA] : {};
    const date = order_detail_data && order_detail_data.date ? order_detail_data.date : {};
    const order_type = order_detail_data && order_detail_data.orderType ? order_detail_data.orderType : "";

    return ({
        date,
        order_type
    });
}
export default connect(mapToProps, {
    updateProductDetailFormData,
    updateProductDetailUIConstraints,
    orderDetail
})(ProductPlaceOrderForm);