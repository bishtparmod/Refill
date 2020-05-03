import React, { PureComponent } from 'react';
import { Image } from 'react-native';
import { WRow, WTouchable, WText, WView, WButton } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { updateProductDetailFormData, updateProductDetailUIConstraints, orderEstimateData } from '../../../redux/prodcutDetail/Action';
import { connect } from 'react-redux';
import { PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_FORM, PRODUCT_DETAIL_FORM_ORDER_QUANTITY, PRODUCT_DETAIL_IS_ORDER_TYPE_ALERT, PRODUCT_DETAIL_FORM_ORDER_TYPE, PRODUCT_DETAIL_IS_ORDER_CALENDAR_ALERT, PRODUCT_DETAIL_FORM_ORDER_START_DATE, PRODUCT_DETAIL_FORM_ORDER_END_DATE, PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES, CUSTOM_ORDER, PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST, DEVICE_KEY, DEVICE_IS_LOGGED_IN, PRODUCT_DETAIL_ERRORS, PRODUCT_DETAIL_REQUEST_LOADING, PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING, PRODUCT_DETAIL_REQUEST_DATA, ORDER_SUMMARY_SCREEN } from '../../../redux/Types';
import moment from 'moment-timezone';
import { Helper } from '../../../apis';

class ProductPlaceOrderForm extends PureComponent {
    constructor(props) {
        super(props);
    }

    openScreen = (screenName) => {
        const { navigation } = this.props;

        if (!screenName || !navigation) return;

        navigation.navigate(screenName);
    }

    submit = () => {
        const {
            order_type,
            custom_date,
            order_start_date,
            order_end_date,
            updateProductDetailUIConstraints,
            product_list_estimate,
            orderEstimateData
        } = this.props;

        const requestBody = order_type === CUSTOM_ORDER ? {
            custom_date: custom_date && custom_date.length ? custom_date : ""
        } : {
                order_start_date,
                order_end_date
            };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                console.log(response);
                if (status) {
                    updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_ERRORS]: []
                    });

                    if (product_list_estimate && product_list_estimate.length) {
                        this.openScreen(ORDER_SUMMARY_SCREEN);
                    } else orderEstimateData();
                } else updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_ERRORS]: response && response.length ? response : []
                });
            }).catch(err => console.log(err));
    }

    /** On error */
    isError = (key) => {
        const { errors } = this.props;

        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    _showAlert = () => {
        if (this.isError("order_start_date").status || this.isError("order_end_date").status || this.isError("custom_date").status)
            return (
                <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.danger1}>
                    *Required
            </WText>
            );

        return null;
    }

    incrementQantity = () => {
        const { quantity } = this.props;

        this.manageQuantity(quantity + 1);
    }

    decrementQantity = () => {
        const { quantity } = this.props;
        const count = quantity > 1 ? quantity - 1 : 1;

        this.manageQuantity(count);
    }

    manageQuantity = (quantity) => {
        const { updateProductDetailFormData, updateProductDetailUIConstraints } = this.props;

        updateProductDetailFormData({
            [PRODUCT_DETAIL_FORM_ORDER_QUANTITY]: quantity
        });

        updateProductDetailUIConstraints({
            [PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST]: []
        })
    }

    openOrderTypeAlert = () => {
        const { updateProductDetailUIConstraints } = this.props;

        updateProductDetailUIConstraints({
            [PRODUCT_DETAIL_IS_ORDER_TYPE_ALERT]: true
        })
    }

    openCalendarAlert = () => {
        const { updateProductDetailUIConstraints } = this.props;

        updateProductDetailUIConstraints({
            [PRODUCT_DETAIL_IS_ORDER_CALENDAR_ALERT]: true
        });
    }

    _getDate = () => {
        const { order_start_date, order_end_date, order_type, custom_date } = this.props;

        if (order_type === CUSTOM_ORDER)
            return custom_date && custom_date.length ? `${moment(new Date(custom_date[0])).format('MMM DD')} ${custom_date.length >= 2 ? moment(new Date(custom_date[custom_date.length - 1])).format('MMM DD') : ''}` : "Select Date";
        else return !order_start_date && !order_end_date ? "Select Date" : `${order_start_date ? moment(new Date(order_start_date)).format('MMM DD') : ''} ${(order_end_date && order_start_date !== order_end_date) ? moment(new Date(order_end_date)).format('MMM DD') : ''}`
    }

    QuantityBtn = ({ }) => {
        const { quantityBtnStyle } = this.getStyles();
        const { quantity } = this.props;

        return (
            <WView>
                <WText fontFamily={"Poppins-Bold"} padding={[Utils.scaleSize(10), 0, 0, 0]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} >Quantity</WText>
                <WRow dial={4}>
                    <WTouchable style={quantityBtnStyle} onPress={this.decrementQantity.bind(this)} dial={5}>
                        <WText fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} >-</WText>
                    </WTouchable>
                    <WText padding={[Utils.scaleSize(10), Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} >{quantity}</WText>
                    <WTouchable style={quantityBtnStyle} onPress={this.incrementQantity.bind(this)} dial={5}>
                        <WText fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} >+</WText>
                    </WTouchable>
                </WRow>
            </WView>
        );
    }

    PlacedOrder = ({ isBorder = true, item = {} }) => {
        const { dotStyle, placeOrderContainer } = this.getStyles();
        const { totalPrice, place_order_date_iso } = item;

        return (
            <WRow dial={4} padding={[Utils.scaleSize(10), 0]} style={[isBorder ? placeOrderContainer : {}]}>
                <WView dial={4} style={dotStyle} margin={[0, Utils.scaleSize(10)]} backgroundColor={Colors.start_date} />
                <WView dial={4} flex>
                    <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} left>Order Rate on</WText>
                    <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(12)} fontWeight={"400"} color={Colors.text_color_light_dark} left>{`${moment(new Date(place_order_date_iso)).format('DD MMM, YYYY')}`}</WText>
                </WView>
                <WView dial={6} flex>
                    <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} right>{Utils.formatCurrency(totalPrice)}</WText>
                    <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(10)} fontWeight={"500"} color={Colors.red} right lines={10}>* including sales tax and delivery charges</WText>
                </WView>
            </WRow>
        );
    }

    PlaceOrderCard = () => {
        const arrowIcon = require('../../../../assets/img/arrow_down.png');
        const calendarIcon = require('../../../../assets/img/calendar.png');
        const editIcon = require('../../../../assets/img/edit.png');
        const { iconStyle, calendarIconStyle, calendarIconContainer, calendarEditIconContainer, placedOrderContainer, squareDotStyle } = this.getStyles();
        const { order_type, product_list_estimate, order_estimate_loading, discount_description, discount, totoal_saving, total_price } = this.props;

        return (
            <WView dial={5}>
                <WRow dial={5}>
                    <WView flex dial={4}>
                        <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} >Refill On</WText>
                    </WView>
                    <WView flex dial={6}>
                        <WTouchable dial={5} onPress={this.openOrderTypeAlert.bind(this)}>
                            <WRow dial={5}>
                                <WText fontFamily={"Poppins-Bold"} padding={[0, 5]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.theme_color} >{order_type}</WText>
                                <Image source={arrowIcon} style={iconStyle} resizeMode={"contain"} />
                            </WRow>
                        </WTouchable>
                    </WView>
                </WRow>
                <WView dial={5} padding={[Utils.scaleSize(20), 0]}>
                    <WTouchable dial={5} onPress={this.openCalendarAlert.bind(this)} padding={[Utils.scaleSize(10), Utils.scaleSize(10)]} style={calendarIconContainer}>
                        <Image source={calendarIcon} style={calendarIconStyle} resizeMode={"contain"} />
                        <WText fontFamily={"Poppins-Bold"} padding={[Utils.scaleSize(10), Utils.scaleSize(5), 0, Utils.scaleSize(5)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.theme_color} >{this._getDate()}</WText>
                        <WTouchable dial={5} onPress={this.openCalendarAlert.bind(this)} padding={[Utils.scaleSize(5), Utils.scaleSize(5)]} style={calendarEditIconContainer}>
                            <Image source={editIcon} style={iconStyle} resizeMode={"contain"} />
                        </WTouchable>
                    </WTouchable>
                    {this._showAlert()}
                </WView>
                {
                    order_estimate_loading ?
                        <WView>
                            <WSpinner size={"small"} color={Colors.theme_color} />
                            <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(12)} fontWeight={"bold"} color={Colors.theme_color} right>Estimate orders loading, please wait..</WText>
                        </WView>
                        : null
                }
                <WView dial={5} padding={product_list_estimate && product_list_estimate.length ? [Utils.scaleSize(20), Utils.scaleSize(10)] : [0, 0]} style={product_list_estimate && product_list_estimate.length ? placedOrderContainer : {}}>
                    {

                        product_list_estimate && product_list_estimate.length ?
                            product_list_estimate.map((ele, index) => {

                                return (
                                    <this.PlacedOrder
                                        item={ele}
                                        key={`product-list-estimate-${index}`}
                                        isBorder={((product_list_estimate.length - 1) !== index) ? true : false} />

                                );
                            })
                            : null
                    }
                </WView>

                {/* <WRow dial={5} padding={[10, 0, 0, 0]}>
                    <WView flex={8} padding={[0, 10]} dial={6}>
                        <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} right>Total</WText>
                    </WView>
                    <WView flex={3} dial={4}>
                        <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(16)} fontWeight={"500"} color={Colors.theme_color} right>{Utils.formatCurrency(total_price)}</WText>
                    </WView>
                </WRow>
                <WRow dial={5}>
                    <WView flex={8} padding={[0, 10]} dial={6}>
                        <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} left>Total Saving</WText>
                    </WView>
                    <WView flex={3} dial={4}>
                        <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(12)} fontWeight={"500"} color={Colors.text_color_dark} left>{Utils.formatCurrency(totoal_saving)}</WText>
                    </WView>
                </WRow> */}
                {
                    discount || discount_description ?
                        <WView dial={4} style={{ alignSelf: 'stretch' }}>
                            <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(18)} fontWeight={"bold"} color={Colors.text_color_dark} left>Offer</WText>
                            <WRow dial={4}>
                                <WView dial={4} style={squareDotStyle} margin={[0, Utils.scaleSize(10), 0, 0]} backgroundColor={Colors.theme_color} />
                                <WView dial={4}>
                                    <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(12)} fontWeight={"500"} color={Colors.text_color_dark} left>{discount_description}</WText>
                                </WView>
                            </WRow>
                        </WView> : null
                }
            </WView>
        )
    }

    render() {
        const { submitBtnStyle } = this.getStyles();
        const { isLogin, discount, discount_description, total_price, totoal_saving, product_list_estimate } = this.props;

        if (!isLogin) {
            return (
                <WView dial={5}>
                    {/* <WRow dial={5} padding={[10, 0, 0, 0]}>
                        <WView flex={8} padding={[0, 10]} dial={6}>
                            <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} right>Total</WText>
                        </WView>
                        <WView flex={2} dial={4}>
                            <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(16)} fontWeight={"500"} color={Colors.theme_color} right>{Utils.formatCurrency(total_price)}</WText>
                        </WView>
                    </WRow>
                    <WRow dial={5}>
                        <WView flex={8} padding={[0, 10]} dial={6}>
                            <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} left>Total Saving</WText>
                        </WView>
                        <WView flex={2} dial={4}>
                            <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(12)} fontWeight={"500"} color={Colors.text_color_dark} left>{Utils.formatCurrency(totoal_saving)}</WText>
                        </WView>
                    </WRow> */}
                    {
                        discount || discount_description ?
                            <WView dial={4} style={{ alignSelf: 'stretch' }}>
                                <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(18)} fontWeight={"bold"} color={Colors.text_color_dark} left>Offer</WText>
                                <WRow dial={4}>
                                    <WView dial={4} style={squareDotStyle} margin={[0, Utils.scaleSize(10), 0, 0]} backgroundColor={Colors.theme_color} />
                                    <WView dial={4}>
                                        <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(12)} fontWeight={"500"} color={Colors.text_color_dark} left>{discount_description}</WText>
                                    </WView>
                                </WRow>
                            </WView> : null
                    }
                </WView>
            );
        }

        return (
            <WView dial={4}>
                <this.QuantityBtn />
                <this.PlaceOrderCard />
                <WButton
                    onPress={this.submit.bind(this)}
                    containerStyle={submitBtnStyle}
                    label={product_list_estimate && product_list_estimate.length ? "Next" : "Get Order List"} />
            </WView>
        );
    }

    getStyles = () => {

        return ({
            quantityBtnStyle: {
                width: Utils.scaleSize(20),
                height: Utils.scaleSize(20),
                borderRadius: Utils.scaleSize(15),
                borderWidth: 1,
                borderColor: Colors.text_color_dark,
                borderStyle: "solid"
            },
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
            calendarEditIconContainer: {
                borderRadius: Utils.scaleSize(20),
                backgroundColor: Colors.white,
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                position: 'absolute',
                top: -Utils.scaleSize(10),
                right: -Utils.scaleSize(10)
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
            submitBtnStyle: {
                backgroundColor: Colors.theme_color,
                flex: 1,
                alignSelf: 'stretch',
                height: Utils.scaleSize(30),
                borderRadius: Utils.scaleSize(15),
                marginVertical: Utils.scaleSize(20)
            },
            dotStyle: {
                width: Utils.scaleSize(10),
                height: Utils.scaleSize(10),
                borderRadius: Utils.scaleSize(5)
            },
            squareDotStyle: {
                width: Utils.scaleSize(10),
                height: Utils.scaleSize(10)
            },
            placeOrderContainer: {
                borderBottomWidth: 2,
                borderColor: Colors.light_color,
                borderStyle: 'solid'
            }
        });
    }
}

const mapToProps = ({ product_detail, device }) => {
    const product_detail_info = product_detail && product_detail[PRODUCT_DETAIL_KEY] ? product_detail[PRODUCT_DETAIL_KEY] : {};
    const form_data = product_detail_info && product_detail_info[PRODUCT_DETAIL_FORM] ? product_detail_info[PRODUCT_DETAIL_FORM] : {};
    const device_info = device && device[DEVICE_KEY] ? device[DEVICE_KEY] : {};

    const product_detail_data = product_detail_info && product_detail_info[PRODUCT_DETAIL_REQUEST_DATA] ? product_detail_info[PRODUCT_DETAIL_REQUEST_DATA] : {};
    const discount_data = product_detail_data && product_detail_data.discount ? product_detail_data.discount : {};
    const discount_description = discount_data && discount_data.description ? discount_data.description : "";
    let discount = discount_data && discount_data.value ? discount_data.value : 0;
    const discount_end_date = discount_data && discount_data.end_date ? discount_data.end_date : "";

    if (discount_end_date && new Date(discount_end_date) <= new Date()) {
        discount = 0;
    }

    const refill_price = product_detail_data && product_detail_data.refillPrice ? product_detail_data.refillPrice : 0;
    const totoal_saving = discount && refill_price ? (refill_price * (discount / 100)) : 0;
    const total_price = totoal_saving && refill_price ? refill_price - totoal_saving : refill_price;
    console.log("discount ===> ", discount, refill_price);

    const quantity = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_QUANTITY] ? form_data[PRODUCT_DETAIL_FORM_ORDER_QUANTITY] : 0;
    const order_type = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_TYPE] ? form_data[PRODUCT_DETAIL_FORM_ORDER_TYPE] : "";
    const order_start_date = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_START_DATE] ? form_data[PRODUCT_DETAIL_FORM_ORDER_START_DATE] : "";
    const order_end_date = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_END_DATE] ? form_data[PRODUCT_DETAIL_FORM_ORDER_END_DATE] : "";
    const custom_date = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES] ? form_data[PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES] : [];

    const order_estimate_loading = product_detail_info && product_detail_info[PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING] ? product_detail_info[PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING] : false;

    const product_list_estimate = product_detail_info && product_detail_info[PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST] ? product_detail_info[PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST] : [];
    const isLogin = device_info && device_info[DEVICE_IS_LOGGED_IN] ? device_info[DEVICE_IS_LOGGED_IN] : false;

    const errors = product_detail_info && product_detail_info[PRODUCT_DETAIL_ERRORS] ? product_detail_info[PRODUCT_DETAIL_ERRORS] : [];

    return ({
        quantity,
        order_type,
        custom_date,
        order_start_date,
        order_end_date,
        custom_date_length: custom_date.length,
        product_list_estimate,
        isLogin,
        errors,
        order_estimate_loading,
        discount_description,
        discount,
        total_price,
        totoal_saving
    });
}
export default connect(mapToProps, {
    updateProductDetailFormData,
    updateProductDetailUIConstraints,
    orderEstimateData
})(ProductPlaceOrderForm);