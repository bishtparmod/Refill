import React, { PureComponent } from 'react';
import { WView, WRow, WText, WButton } from '../../ui';
import { connect } from 'react-redux';
import Colors from '../../styles/Colors';
import Utils from '../../util/Utils';
import { Image } from 'react-native';
import { LIST_CARD_SCREEN, ADD_SHIPPING_AND_BILLING_ADDRESS_SCREEN, ORDER_SUMMARY_SCREEN, SCREEN_TYPE_PAYMENT, PRODUCT_DETAIL_KEY, USER_ROOT, USER_KEY, USER_DATA, PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST, PRODUCT_DETAIL_REQUEST_DATA, SERVER_ORDER_STATUS_RECEIVED, PRODUCT_DETAIL_REQUEST_STATUS, EMPTY, STATUS, MESSAGE, ERROR } from '../../../redux/Types';
import { Helper } from '../../../apis';
import moment from 'moment-timezone';
import { updateProductDetailUIConstraints } from '../../../redux/prodcutDetail/Action';

class OrderSummaryCard extends PureComponent {
    constructor(props) {
        super(props);

    }

    openScreen = (screenName, parmas = {}) => {
        const { navigation } = this.props;

        if (!navigation || !screenName) return;

        navigation.navigate(screenName, parmas);
    }

    orderNow = () => {
        this.openScreen(LIST_CARD_SCREEN, {
            from: ORDER_SUMMARY_SCREEN,
            screen_type: SCREEN_TYPE_PAYMENT
        });
    }

    submit = () => {
        const {
            full_address,
            updateProductDetailUIConstraints
        } = this.props;

        const requestBody = {
            full_address
        };

        updateProductDetailUIConstraints({
            [PRODUCT_DETAIL_REQUEST_STATUS]: {
                [STATUS]: EMPTY,
                [MESSAGE]: ""
            }
        });
        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                console.log(response);
                if (status) {

                    this.orderNow();
                } else {
                    updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: "Billing and Shipping address is required"
                        }
                    });
                }
            }).catch(err => console.log(err));
    }

    /** On error */
    isError = (key) => {
        const { errors } = this.props;

        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    OrderItem = ({ label, value, sub_label, sub_value, isBorder = true, dotColor = Colors.start_date }) => {
        const { dotNotch, borderStyle } = this.getStyles();

        return (
            <WRow padding={[Utils.scaleSize(10), 0]} style={isBorder ? borderStyle : {}}>
                <WView margin={[Utils.scaleSize(6), Utils.scaleSize(5), 0, 0]}>
                    <WView style={dotNotch} backgroundColor={dotColor} />
                </WView>
                <WView flex dial={4}>
                    <WText fontSize={Utils.scaleSize(16)} fontFamily={"Poppins-Bold"} fontWeight={"600"} color={Colors.text_color_dark} center>{label}</WText>
                    {
                        sub_label ?
                            <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.theme_color} center>{sub_label}</WText>
                            : null
                    }
                </WView>
                <WView dial={6}>
                    <WText fontSize={Utils.scaleSize(16)} fontFamily={"Poppins-Bold"} fontWeight={"600"} color={Colors.text_color_dark} center>{value}</WText>
                    {
                        sub_value ?
                            <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.theme_color} center>{sub_value}</WText>
                            : null
                    }
                </WView>
            </WRow>
        );
    }

    OrderSummary = ({ }) => {
        const { container } = this.getStyles();
        const { received_order = {}, product_detail_data } = this.props;
        const { totalPrice, appliedSalesTax, appliedDeliveryCharges, discount, productDetail = {}, quantity = 1 } = received_order;
        const { refillPrice } = product_detail_data;
        const _refillPrice = refillPrice - (refillPrice * (discount / 100));
        return (
            <WView dial={4} style={container} backgroundColor={Colors.white} margin={[Utils.scaleSize(10), Utils.scaleSize(20)]} padding={[Utils.scaleSize(10), Utils.scaleSize(10)]}>
                <WText margin={[Utils.scaleSize(10), 0, 0, Utils.scaleSize(12)]} fontSize={Utils.scaleSize(20)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} center>Order Summary</WText>

                <this.OrderItem
                    label={"Sub Total"}
                    value={_refillPrice ? Utils.formatCurrency(_refillPrice*quantity) : "NA"}
                    sub_label={discount ? `${discount}% Discount Added` : ''}
                    sub_value={discount ? Utils.formatCurrency(_refillPrice * (100 / discount)) : ""} />
                <this.OrderItem
                    label={"Shipping"}
                    value={appliedDeliveryCharges ? Utils.formatCurrency(appliedDeliveryCharges) : "NA"}
                    dotColor={Colors.theme_color} />
                <this.OrderItem
                    label={"Sales Tax"}
                    value={appliedSalesTax ? Utils.formatCurrency((_refillPrice * (appliedSalesTax / 100))*quantity) : "NA"}
                    isBorder={false}
                    dotColor={Colors.end_date} />

                <WRow margin={[Utils.scaleSize(10), 0]}>
                    <WView flex dial={4} margin={[0, Utils.scaleSize(10)]}>
                        <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_dark} center>Total Pay Today</WText>
                    </WView>
                    <WView dial={6}>
                        <WText fontSize={Utils.scaleSize(18)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.theme_color} center>{Utils.formatCurrency(totalPrice)}</WText>
                    </WView>
                </WRow>
            </WView>
        );
    }

    AllOrders = ({ }) => {
        const { container } = this.getStyles();
        const { product_list_estimate } = this.props;

        return (
            <WView dial={4} style={container} backgroundColor={Colors.white} margin={[Utils.scaleSize(10), Utils.scaleSize(20)]} padding={[Utils.scaleSize(10), Utils.scaleSize(10)]}>
                <WText margin={[Utils.scaleSize(10), 0, 0, Utils.scaleSize(12)]} fontSize={Utils.scaleSize(20)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} center>Order Rate</WText>

                {
                    product_list_estimate && product_list_estimate.length ?
                        product_list_estimate.map((ele, index) => {
                            return (
                                <this.OrderItem
                                    label={"Order Rate on"}
                                    key={`orders-${index}`}
                                    sub_label={ele.place_order_date_iso ? moment(new Date(ele.place_order_date_iso)).format("DD MMM, YYYY") : "NA"}
                                    value={Utils.formatCurrency(ele.totalPrice)}
                                    isBorder={product_list_estimate.length - 1 === index ? false : true}
                                    dotColor={Colors.theme_color} />
                            );
                        }) : null
                }
            </WView>
        );
    }

    AddressItem = ({ userIcon, label, value, isBorder = true }) => {
        const { iconStyle, stretch, borderStyle } = this.getStyles();

        return (
            <WView dial={4} padding={[Utils.scaleSize(5), 0]} style={[stretch, isBorder ? borderStyle : {}]}>
                <WRow dial={4}>
                    <Image source={userIcon} style={iconStyle} resizeMode={"contain"} />
                    <WText padding={[0, Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_light_dark} center>{label}</WText>
                </WRow>
                <WView>
                    <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"600"} color={Colors.text_color_dark} left lines={5}>{value}</WText>
                </WView>
            </WView>
        );
    }

    Address = ({ header, fullAddress, city, state, country, name, phone, zipCode }) => {
        const { container, stretch } = this.getStyles();
        const userIcon = require("../../../../assets/img/user.png");
        const mapIcon = require('../../../../assets/img/map.png');
        const phoneIcon = require('../../../../assets/img/phone.png');

        return (
            <WView dial={4} style={[container, stretch]} backgroundColor={Colors.white} margin={[Utils.scaleSize(10), Utils.scaleSize(20)]} padding={[Utils.scaleSize(10), Utils.scaleSize(10)]}>
                <WText margin={[Utils.scaleSize(10), 0, 0, Utils.scaleSize(12)]} fontSize={Utils.scaleSize(20)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.theme_color} center>{header}</WText>

                <this.AddressItem
                    userIcon={userIcon}
                    label={"Name"}
                    value={name} />
                <this.AddressItem
                    userIcon={mapIcon}
                    label={"Address"}
                    value={fullAddress} />
                <this.AddressItem
                    userIcon={mapIcon}
                    label={"City"}
                    value={city} />
                <this.AddressItem
                    userIcon={mapIcon}
                    label={"State"}
                    value={state} />
                <this.AddressItem
                    userIcon={mapIcon}
                    label={"Country"}
                    value={country} />
                <this.AddressItem
                    userIcon={mapIcon}
                    label={"Zip Code"}
                    value={zipCode}
                    isBorder={false} />
                <this.AddressItem
                    userIcon={phoneIcon}
                    label={"Phone"}
                    value={phone}
                    isBorder={false} />
            </WView>
        );
    }

    render() {
        const { submitBtnStyle, iconStyle, stretch, billingAndShipping } = this.getStyles();
        const pencilIcon = require("../../../../assets/img/edit.png");
        const { shippingAddressPhone, shippingAddressName, shippingAddressCity, shippingAddressState, shippingAddressCountry, shippingAddressZipCode, shippingAddressFullAddress, billingAddressPhone, billingAddressName, billingAddressCity, billingAddressState, billingAddressCountry, billingAddressZipCode, billingAddressFullAddress } = this.props;

        return (
            <WView dial={2} flex>
                <this.OrderSummary />
                <this.AllOrders />

                <WRow style={stretch} dial={4} margin={[Utils.scaleSize(5), Utils.scaleSize(20)]}>
                    <WText fontSize={Utils.scaleSize(14)} onPress={this.openScreen.bind(this, ADD_SHIPPING_AND_BILLING_ADDRESS_SCREEN, {
                        from: ORDER_SUMMARY_SCREEN
                    })} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_medium_dark} style={billingAndShipping} center>{"Billing & Shipping"}</WText>
                    <Image source={pencilIcon} style={iconStyle} />
                </WRow>

                <this.Address
                    header={"Billing Address"}
                    name={billingAddressName}
                    city={billingAddressCity}
                    state={billingAddressState}
                    country={billingAddressCountry}
                    zipCode={billingAddressZipCode}
                    fullAddress={billingAddressFullAddress}
                    phone={billingAddressPhone}
                />
                <this.Address
                    header={"Shipping Address"}
                    name={shippingAddressName}
                    city={shippingAddressCity}
                    state={shippingAddressState}
                    country={shippingAddressCountry}
                    zipCode={shippingAddressZipCode}
                    fullAddress={shippingAddressFullAddress}
                    phone={shippingAddressPhone}
                />

                <WButton
                    containerStyle={submitBtnStyle}
                    label={"Order Now"}
                    onPress={this.submit.bind(this)}
                />
            </WView>
        );
    }

    getStyles = () => {

        return ({
            dotNotch: {
                width: Utils.scaleSize(10),
                height: Utils.scaleSize(10),
                borderRadius: Utils.scaleSize(5)
            },
            container: {
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                borderRadius: Utils.scaleSize(15)
            },
            iconStyle: {
                width: Utils.scaleSize(15),
                height: Utils.scaleSize(15),
                tintColor: Colors.text_color_light_dark
            },
            stretch: {
                alignSelf: 'stretch'
            },
            borderStyle: {
                borderBottomWidth: 1,
                borderColor: Colors.light_color,
                borderStyle: 'solid'
            },
            submitBtnStyle: {
                backgroundColor: Colors.theme_color,
                flex: 1,
                alignSelf: 'stretch',
                height: Utils.scaleSize(30),
                borderRadius: Utils.scaleSize(15),
                marginVertical: Utils.scaleSize(20),
                marginHorizontal: Utils.scaleSize(20),
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            },
            billingAndShipping: {
                textDecorationLine: "underline"
            }
        });
    }
}

const mapToProps = ({ product_detail, user }) => {
    const product_detail_info = product_detail && product_detail[PRODUCT_DETAIL_KEY] ? product_detail[PRODUCT_DETAIL_KEY] : {};
    const user_info = user && user[USER_KEY] ? user[USER_KEY] : {};

    const user_data = user_info && user_info[USER_DATA] ? user_info[USER_DATA] : {};

    const shippingAddress = user_data && user_data.shippingAddress ? user_data.shippingAddress : {};
    const billingAddress = user_data && user_data.billingAddress ? user_data.billingAddress : {};
    const product_list_estimate = product_detail_info && product_detail_info[PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST] ? product_detail_info[PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST] : [];
    const product_detail_data = product_detail_info && product_detail_info[PRODUCT_DETAIL_REQUEST_DATA] ? product_detail_info[PRODUCT_DETAIL_REQUEST_DATA] : {};
    const is_add_billing_address_as_shipping_address = user_data && user_data.is_add_billing_address_as_shipping_address ? user_data.is_add_billing_address_as_shipping_address : false;

    const received_order = product_list_estimate && product_list_estimate.length ? product_list_estimate.filter(ele => ele.orderStatus === SERVER_ORDER_STATUS_RECEIVED)[0] : {};

    return ({
        shippingAddressName: shippingAddress.name ? shippingAddress.name : "NA",
        shippingAddressPhone: shippingAddress.phone ? Helper.MakePhoneNumberMask(`${shippingAddress.phone}`) : "NA",
        shippingAddressFullAddress: shippingAddress.fullAddress ? shippingAddress.fullAddress : "NA",
        shippingAddressCity: shippingAddress.city ? shippingAddress.city : "NA",
        shippingAddressState: shippingAddress.state ? shippingAddress.state : "NA",
        shippingAddressCountry: shippingAddress.country ? shippingAddress.country : "NA",
        shippingAddressZipCode: shippingAddress.zipCode ? `${shippingAddress.zipCode}` : 'NA',

        billingAddressName: billingAddress.name ? billingAddress.name : shippingAddress.name ? shippingAddress.name : "NA",
        billingAddressPhone: billingAddress.phone ? Helper.MakePhoneNumberMask(`${billingAddress.phone}`) : shippingAddress.phone ? shippingAddress.phone : "NA",
        billingAddressFullAddress: billingAddress.fullAddress ? billingAddress.fullAddress : "NA",
        billingAddressCity: billingAddress.city ? billingAddress.city : shippingAddress.city ? shippingAddress.city : "NA",
        billingAddressState: billingAddress.state ? billingAddress.state : shippingAddress.state ? shippingAddress.state : "NA",
        billingAddressCountry: billingAddress.country ? billingAddress.country : shippingAddress.country ? shippingAddressCountry : "NA",
        billingAddressZipCode: billingAddress.zipCode ? `${billingAddress.zipCode}` : shippingAddress.zipCode ? `${shippingAddress.zipCode}` : 'NA',

        product_list_estimate,
        received_order,
        full_address: shippingAddress.fullAddress ? shippingAddress.fullAddress : billingAddress.fullAddress ? billingAddress.fullAddress : "",
        product_detail_data
    });
}
export default connect(mapToProps, {
    updateProductDetailUIConstraints
})(OrderSummaryCard);