import React, { PureComponent, Fragment } from 'react';
import { WView, WText, WRow, WTouchable, WButton } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { Input } from '../../base_components';
import { ScrollView, Image, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { ADD_BILLING_AND_SHIPPING_ADDRESS_KEY, ADD_BILLING_AND_SHIPPING_ADDRESS_FORM, ADD_SHIPPING_ADDRESS_FORM_ADDRESS, ADD_SHIPPING_ADDRESS_FORM_CITY, ADD_SHIPPING_ADDRESS_FORM_STATE, ADD_SHIPPING_ADDRESS_FORM_NAME, ADD_SHIPPING_ADDRESS_FORM_ZIP_CODE, ADD_BILLING_ADDRESS_FORM_ADDRESS, ADD_BILLING_ADDRESS_FORM_CITY, ADD_BILLING_ADDRESS_FORM_STATE, ADD_BILLING_ADDRESS_FORM_NAME, ADD_BILLING_ADDRESS_FORM_ZIP_CODE, IS_ADD_BILLING_ADDRESS_AS_SHIPPING_ADDRESS, ADD_BILLING_AND_SHIPPING_ADDRESS_ERRORS, ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_LOADING, ADD_SHIPPING_ADDRESS_FORM_PHONE, ADD_BILLING_ADDRESS_FORM_PHONE, ADD_SHIPPING_ADDRESS_FORM_COUNTRY, ADD_BILLING_ADDRESS_FORM_COUNTRY, ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_IS_VISIBLE, ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_TYPE, SHIPPING, BILLING, STATUS, CHANGE_PASSWORD_REQUEST_STATUS, ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS, SUCCESS } from '../../../redux/Types';
import { updateAddBillingAndShippingAddressUIConstraints, updateAddBillingAndShippingAddressFormData, addBillingAndShippingAddress, setBillingAndShippingAddress, resetAddBillingAndShippingAddressState } from '../../../redux/billingAndShippingAddress/Action';
import AddressAutoComplete from './AddressAutoComplete';
import { Helper } from '../../../apis';

class AddShippingAndBillingAddressContainer extends PureComponent {
    constructor(props) {
        super(props);

    }

    componentDidMount = () => {
        const { setBillingAndShippingAddress } = this.props;

        setBillingAndShippingAddress();
    }

    submit = () => {
        const {
            is_add_billing_address_as_shipping_address,

            customer_shipping_address,
            customer_shipping_city,
            customer_shipping_state,
            customer_shipping_country,
            customer_shipping_zip_code,
            customer_shipping_name,
            customer_shipping_phone,

            customer_billing_address,
            customer_billing_city,
            customer_billing_state,
            customer_billing_country,
            customer_billing_zip_code,
            customer_billing_name,
            customer_billing_phone,

            loading,
            updateAddBillingAndShippingAddressUIConstraints,
            addBillingAndShippingAddress
        } = this.props;

        const requestBody = is_add_billing_address_as_shipping_address ? {
            customer_shipping_address,
            customer_shipping_city,
            customer_shipping_state,
            customer_shipping_country,
            customer_shipping_zip_code,
            customer_shipping_name,
            customer_shipping_phone
        } : {
                customer_shipping_address,
                customer_shipping_city,
                customer_shipping_state,
                customer_shipping_country,
                customer_shipping_zip_code,
                customer_shipping_name,
                customer_shipping_phone,

                customer_billing_address,
                customer_billing_city,
                customer_billing_state,
                customer_billing_country,
                customer_billing_zip_code,
                customer_billing_name,
                customer_billing_phone
            };
        Keyboard.dismiss();

        if (loading) return;

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateAddBillingAndShippingAddressUIConstraints({
                        [ADD_BILLING_AND_SHIPPING_ADDRESS_ERRORS]: []
                    });

                    //Add billing and shipping address action
                    addBillingAndShippingAddress();
                } else updateAddBillingAndShippingAddressUIConstraints({
                    [ADD_BILLING_AND_SHIPPING_ADDRESS_ERRORS]: response && response.length ? response : []
                });
            }).catch(err => console.log(err));
    }

    CheckBox = ({ isBillingAddress }) => {
        const { iconStyle } = this.getStyles();
        const checked = require("../../../../assets/img/checked_checkbox.png");
        const unchecked = require("../../../../assets/img/unchecked_checkbox.png");

        return (
            <WTouchable onPress={this.toggleCechekbox.bind(this)}>
                <WRow dial={4}>
                    <Image source={isBillingAddress ? checked : unchecked} style={iconStyle} resizeMode={"contain"} />
                    <WText padding={[Utils.scaleSize(10), Utils.scaleSize(10)]} fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>Billing Address Same as Shipping Address</WText>
                </WRow>
            </WTouchable>
        );
    }

    toggleCechekbox = () => {
        const { is_add_billing_address_as_shipping_address, updateAddBillingAndShippingAddressUIConstraints } = this.props;

        updateAddBillingAndShippingAddressUIConstraints({
            [IS_ADD_BILLING_ADDRESS_AS_SHIPPING_ADDRESS]: !is_add_billing_address_as_shipping_address
        });
    }

    onChangeText = (key, value) => {
        const { loading, updateAddBillingAndShippingAddressFormData, updateAddBillingAndShippingAddressUIConstraints } = this.props;
        if (loading) return;

        if (key === ADD_SHIPPING_ADDRESS_FORM_ADDRESS) {
            updateAddBillingAndShippingAddressUIConstraints({
                [ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_IS_VISIBLE]: true,
                [ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_TYPE]: SHIPPING
            });
            return;
        }

        if (key === ADD_BILLING_ADDRESS_FORM_ADDRESS) {
            updateAddBillingAndShippingAddressUIConstraints({
                [ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_IS_VISIBLE]: true,
                [ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_TYPE]: BILLING
            });
            return;
        }

        if (key === ADD_BILLING_ADDRESS_FORM_PHONE || key === ADD_SHIPPING_ADDRESS_FORM_PHONE) {
            updateAddBillingAndShippingAddressFormData &&
                updateAddBillingAndShippingAddressFormData({
                    [key]: Helper.MakePhoneNumberMask(value)
                });

            return;
        }

        updateAddBillingAndShippingAddressFormData &&
            updateAddBillingAndShippingAddressFormData({
                [key]: value
            });
    }

    /** On error */
    isError = (key) => {
        const { errors } = this.props;

        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    componentDidUpdate = (prevProps) => {
        const { type, onBack } = this.props;

        if (prevProps.type !== type) {
            if (type === SUCCESS) {
                if (typeof onBack === "function") onBack();
            }
        }
    }

    componentWillUnmount = () => {
        const { resetAddBillingAndShippingAddressState } = this.props;

        resetAddBillingAndShippingAddressState();
    }

    _renderShippingAddress = () => {
        const userIcon = require('../../../../assets/img/user.png');
        const mapIcon = require('../../../../assets/img/map.png');
        const phoneIcon = require('../../../../assets/img/phone.png');
        const { customer_shipping_name, customer_shipping_address, customer_shipping_city, customer_shipping_state, customer_shipping_country, customer_shipping_zip_code, customer_shipping_phone } = this.props;

        //Name
        this.name = {
            onChangeText: (value) => this.onChangeText(ADD_SHIPPING_ADDRESS_FORM_NAME, value),
            placeholderName: 'e.g.: name',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "default",
            labelName: "Name",
            isVertical: true,
            value: customer_shipping_name,
            isError: this.isError('customer_shipping_name'),
            labelIconPath: userIcon,
            onSubmitEditing: () => { }
        };

        //Address
        this.address = {
            onChangeText: (value) => this.onChangeText(ADD_SHIPPING_ADDRESS_FORM_ADDRESS, value),
            placeholderName: 'e.g.: address',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "default",
            labelName: "Address",
            isVertical: true,
            value: customer_shipping_address,
            isError: this.isError('customer_shipping_address'),
            labelIconPath: mapIcon,
            onSubmitEditing: () => { }
        };

        //City
        this.city = {
            onChangeText: (value) => this.onChangeText(ADD_SHIPPING_ADDRESS_FORM_CITY, value),
            placeholderName: 'e.g.: city',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "default",
            labelName: "City",
            isVertical: true,
            value: customer_shipping_city,
            isError: this.isError('customer_shipping_city'),
            labelIconPath: mapIcon,
            onSubmitEditing: () => { }
        };

        //State
        this.state = {
            onChangeText: (value) => this.onChangeText(ADD_SHIPPING_ADDRESS_FORM_STATE, value),
            placeholderName: 'e.g.: state',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "default",
            labelName: "State",
            isVertical: true,
            labelIconPath: mapIcon,
            value: customer_shipping_state,
            isError: this.isError('customer_shipping_state'),
            onSubmitEditing: () => { }
        };

        //Country
        this.country = {
            onChangeText: (value) => this.onChangeText(ADD_SHIPPING_ADDRESS_FORM_COUNTRY, value),
            placeholderName: 'e.g.: country',
            value: customer_shipping_country,
            isError: this.isError('customer_shipping_country'),
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "default",
            labelName: "Country",
            isVertical: true,
            labelIconPath: mapIcon,
            onSubmitEditing: () => { }
        };

        //Zip Code
        this.zipcode = {
            onChangeText: (value) => this.onChangeText(ADD_SHIPPING_ADDRESS_FORM_ZIP_CODE, value),
            placeholderName: 'e.g.: zip code',
            value: customer_shipping_zip_code,
            isError: this.isError('customer_shipping_zip_code'),
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "numeric",
            returnKeyType: "done",
            labelName: "Zip Code",
            isVertical: true,
            labelIconPath: mapIcon,
            onSubmitEditing: () => { }
        };

        //phone
        this.phone = {
            onChangeText: (value) => this.onChangeText(ADD_SHIPPING_ADDRESS_FORM_PHONE, value),
            placeholderName: 'e.g.: phone',
            value: customer_shipping_phone,
            isError: this.isError('customer_shipping_phone'),
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "numeric",
            returnKeyType: "done",
            labelName: "Phone",
            isVertical: true,
            labelIconPath: phoneIcon,
            onSubmitEditing: () => { }
        };

        return (
            <Fragment>
                <WText padding={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(18)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>Add Shipping Address</WText>
                <WView dial={2} padding={[0, Utils.scaleSize(10)]} stretch>
                    <Input
                        {...this.name} />
                    <Input
                        {...this.address} />
                    <Input
                        {...this.city} />
                    <Input
                        {...this.state} />
                    <Input
                        {...this.country} />
                    <Input
                        {...this.zipcode} />
                    <Input
                        {...this.phone} />
                </WView>
            </Fragment>
        )
    }

    _renderBillingAddress = () => {
        const userIcon = require('../../../../assets/img/user.png');
        const mapIcon = require('../../../../assets/img/map.png');
        const phoneIcon = require('../../../../assets/img/phone.png');
        const { customer_billing_name, customer_billing_address, customer_billing_city, customer_billing_state, customer_billing_country, customer_billing_zip_code, customer_billing_phone, is_add_billing_address_as_shipping_address } = this.props;

        //Phone
        this.phone = {
            onChangeText: (value) => this.onChangeText(ADD_BILLING_ADDRESS_FORM_PHONE, value),
            placeholderName: 'e.g.: phone',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "numeric",
            returnKeyType: "done",
            labelName: "Phone",
            isVertical: true,
            value: customer_billing_phone,
            isError: this.isError('customer_billing_phone'),
            labelIconPath: phoneIcon,
            onSubmitEditing: () => { }
        };

        //Name
        this.name = {
            onChangeText: (value) => this.onChangeText(ADD_BILLING_ADDRESS_FORM_NAME, value),
            placeholderName: 'e.g.: name',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "default",
            labelName: "Name",
            isVertical: true,
            value: customer_billing_name,
            isError: this.isError('customer_billing_name'),
            labelIconPath: userIcon,
            onSubmitEditing: () => { }
        };

        //Address
        this.address = {
            onChangeText: (value) => this.onChangeText(ADD_BILLING_ADDRESS_FORM_ADDRESS, value),
            placeholderName: 'e.g.: address',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "default",
            labelName: "Address",
            isVertical: true,
            value: customer_billing_address,
            isError: this.isError('customer_billing_address'),
            labelIconPath: mapIcon,
            onSubmitEditing: () => { }
        };

        //City
        this.city = {
            onChangeText: (value) => this.onChangeText(ADD_BILLING_ADDRESS_FORM_CITY, value),
            placeholderName: 'e.g.: city',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "default",
            labelName: "City",
            isVertical: true,
            labelIconPath: mapIcon,
            value: customer_billing_city,
            isError: this.isError('customer_billing_city'),
            onSubmitEditing: () => { }
        };

        //State
        this.state = {
            onChangeText: (value) => this.onChangeText(ADD_BILLING_ADDRESS_FORM_STATE, value),
            placeholderName: 'e.g.: state',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "default",
            labelName: "State",
            isVertical: true,
            labelIconPath: mapIcon,
            value: customer_billing_state,
            isError: this.isError('customer_billing_state'),
            onSubmitEditing: () => { }
        };

        //Country
        this.country = {
            onChangeText: (value) => this.onChangeText(ADD_BILLING_ADDRESS_FORM_COUNTRY, value),
            placeholderName: 'e.g.: country',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            isError: this.isError('email'),
            keyboardType: "default",
            labelName: "Country",
            isVertical: true,
            labelIconPath: mapIcon,
            value: customer_billing_country,
            isError: this.isError('customer_billing_country'),
            onSubmitEditing: () => { }
        };

        //Zip Code
        this.zipcode = {
            onChangeText: (value) => this.onChangeText(ADD_BILLING_ADDRESS_FORM_ZIP_CODE, value),
            placeholderName: 'e.g.: zip code',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "numeric",
            returnKeyType: "done",
            labelName: "Zip Code",
            isVertical: true,
            labelIconPath: mapIcon,
            value: customer_billing_zip_code,
            isError: this.isError('customer_billing_zip_code'),
            onSubmitEditing: () => { }
        };

        if (is_add_billing_address_as_shipping_address) return;

        return (
            <Fragment>
                <WText padding={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(18)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>Add Billing Address</WText>
                <WView dial={2} padding={[0, Utils.scaleSize(10)]} stretch>
                    <Input
                        {...this.name} />
                    <Input
                        {...this.address} />
                    <Input
                        {...this.city} />
                    <Input
                        {...this.state} />
                    <Input
                        {...this.country} />
                    <Input
                        {...this.zipcode} />
                    <Input
                        {...this.phone} />
                </WView>
            </Fragment>
        )
    }

    render() {
        const { inputViewContainer, btnContainerStyle } = this.getStyles();
        const { is_add_billing_address_as_shipping_address, loading, errors } = this.props;

        console.log("errors ===> ", errors);

        return (
            <ScrollView
                style={inputViewContainer}
                alwaysBounceVertical={false}>
                <WView dial={2} stretch>
                    <AddressAutoComplete />
                    {this._renderShippingAddress()}
                    {this._renderBillingAddress()}
                    <this.CheckBox
                        isBillingAddress={is_add_billing_address_as_shipping_address} />
                    <WButton
                        label={"Done"}
                        isLoading={loading}
                        onPress={this.submit.bind(this)}
                        containerStyle={btnContainerStyle} />
                </WView>
            </ScrollView>
        );
    }

    getStyles = () => {
        return ({
            inputViewContainer: {
                flexGrow: 1,
                paddingHorizontal: Utils.scaleSize(10)
            },
            iconStyle: {
                width: Utils.scaleSize(20),
                height: Utils.scaleSize(20)
            },
            btnContainerStyle: {
                backgroundColor: Colors.theme_color,
                paddingVertical: Utils.scaleSize(5),
                borderRadius: Utils.scaleSize(20),
                marginBottom: Utils.scaleSize(20)
            }
        });
    }
}

const mapToProps = ({ add_billing_and_shipping_address }) => {
    const add_billing_and_shipping_address_info = add_billing_and_shipping_address && add_billing_and_shipping_address[ADD_BILLING_AND_SHIPPING_ADDRESS_KEY] ? add_billing_and_shipping_address[ADD_BILLING_AND_SHIPPING_ADDRESS_KEY] : {};
    const form_data = add_billing_and_shipping_address_info && add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_FORM] ? add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_FORM] : {};

    const customer_shipping_address = form_data && form_data[ADD_SHIPPING_ADDRESS_FORM_ADDRESS] ? form_data[ADD_SHIPPING_ADDRESS_FORM_ADDRESS] : "";
    const customer_shipping_city = form_data && form_data[ADD_SHIPPING_ADDRESS_FORM_CITY] ? form_data[ADD_SHIPPING_ADDRESS_FORM_CITY] : "";
    const customer_shipping_state = form_data && form_data[ADD_SHIPPING_ADDRESS_FORM_STATE] ? form_data[ADD_SHIPPING_ADDRESS_FORM_STATE] : "";
    const customer_shipping_country = form_data && form_data[ADD_SHIPPING_ADDRESS_FORM_COUNTRY] ? form_data[ADD_SHIPPING_ADDRESS_FORM_COUNTRY] : "";
    const customer_shipping_zip_code = form_data && form_data[ADD_SHIPPING_ADDRESS_FORM_ZIP_CODE] ? form_data[ADD_SHIPPING_ADDRESS_FORM_ZIP_CODE] : "";
    const customer_shipping_name = form_data && form_data[ADD_SHIPPING_ADDRESS_FORM_NAME] ? form_data[ADD_SHIPPING_ADDRESS_FORM_NAME] : "";
    const customer_shipping_phone = form_data && form_data[ADD_SHIPPING_ADDRESS_FORM_PHONE] ? form_data[ADD_SHIPPING_ADDRESS_FORM_PHONE] : "";

    const customer_billing_address = form_data && form_data[ADD_BILLING_ADDRESS_FORM_ADDRESS] ? form_data[ADD_BILLING_ADDRESS_FORM_ADDRESS] : "";
    const customer_billing_city = form_data && form_data[ADD_BILLING_ADDRESS_FORM_CITY] ? form_data[ADD_BILLING_ADDRESS_FORM_CITY] : "";
    const customer_billing_state = form_data && form_data[ADD_BILLING_ADDRESS_FORM_STATE] ? form_data[ADD_BILLING_ADDRESS_FORM_STATE] : "";
    const customer_billing_country = form_data && form_data[ADD_BILLING_ADDRESS_FORM_COUNTRY] ? form_data[ADD_BILLING_ADDRESS_FORM_COUNTRY] : "";
    const customer_billing_zip_code = form_data && form_data[ADD_BILLING_ADDRESS_FORM_ZIP_CODE] ? form_data[ADD_BILLING_ADDRESS_FORM_ZIP_CODE] : "";
    const customer_billing_name = form_data && form_data[ADD_BILLING_ADDRESS_FORM_NAME] ? form_data[ADD_BILLING_ADDRESS_FORM_NAME] : "";
    const customer_billing_phone = form_data && form_data[ADD_BILLING_ADDRESS_FORM_PHONE] ? form_data[ADD_BILLING_ADDRESS_FORM_PHONE] : "";

    const is_add_billing_address_as_shipping_address = add_billing_and_shipping_address_info && add_billing_and_shipping_address_info[IS_ADD_BILLING_ADDRESS_AS_SHIPPING_ADDRESS] ? add_billing_and_shipping_address_info[IS_ADD_BILLING_ADDRESS_AS_SHIPPING_ADDRESS] : false;
    const errors = add_billing_and_shipping_address_info && add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_ERRORS] ? add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_ERRORS] : [];
    const loading = add_billing_and_shipping_address_info && add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_LOADING] ? add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_LOADING] : false;

    const request_status = add_billing_and_shipping_address_info && add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS] ? add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS] : {};
    const type = request_status && request_status[STATUS] ? request_status[STATUS] : '';

    return ({
        customer_shipping_address,
        customer_shipping_city,
        customer_shipping_state,
        customer_shipping_country,
        customer_shipping_zip_code,
        customer_shipping_name,
        customer_shipping_phone,

        customer_billing_address,
        customer_billing_city,
        customer_billing_state,
        customer_billing_country,
        customer_billing_zip_code,
        customer_billing_name,
        customer_billing_phone,

        loading,
        errors,
        is_add_billing_address_as_shipping_address,
        type
    });
}

export default connect(mapToProps, {
    updateAddBillingAndShippingAddressUIConstraints,
    updateAddBillingAndShippingAddressFormData,
    addBillingAndShippingAddress,
    setBillingAndShippingAddress,
    resetAddBillingAndShippingAddressState
})(AddShippingAndBillingAddressContainer);