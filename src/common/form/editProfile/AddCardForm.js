import React, { PureComponent } from 'react';
import { WView, WText, WRow, WTouchable, WButton } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { Input } from '../../base_components';
import { ScrollView, Image, Keyboard } from 'react-native';
import AddCard from '../../../scene/postLogin/editProfile/AddCard';
import { connect } from 'react-redux';
import { ADD_CARD_KEY, ADD_CARD_FORM, ADD_CARD_FORM_CARDHOLDER_NAME, ADD_CARD_FORM_CARD_NUMBER, ADD_CARD_FORM_CVV, ADD_CARD_FORM_EXPIRE_DATE, ADD_CARD_REQUEST_LOADING, ADD_CARD_ERRORS, ADD_CARD_IS_CALENDAR_VISIBLE, SUCCESS, STATUS, ADD_CARD_REQUEST_STATUS } from '../../../redux/Types';
import { updateAddCardFormData, updateAddCardUIConstraints, addCardAddress, resetAddCardState, listCardAddress } from '../../../redux/addCard/Action';
import { Helper } from '../../../apis';
import { CalendarAlert } from '.';
import { getCVVDate } from '../../../apis/APIs';

class AddCardForm extends PureComponent {
    constructor(props) {
        super(props);

    }

    onChangeText = (key, value) => {
        const { updateAddCardFormData, updateAddCardUIConstraints, loading } = this.props;
        if (loading) return;

        if (key === ADD_CARD_FORM_CARD_NUMBER) {
            updateAddCardFormData &&
                updateAddCardFormData({
                    [key]: Helper.MakeCardMask(value)
                });

            return;
        }

        if (key === ADD_CARD_FORM_EXPIRE_DATE) {
            Keyboard.dismiss();
            updateAddCardUIConstraints({
                [ADD_CARD_IS_CALENDAR_VISIBLE]: true
            });
            return;
        }

        updateAddCardFormData &&
            updateAddCardFormData({
                [key]: value
            });
    }

    submit = () => {
        const {
            card_holder_name,
            card_number,
            cvv,
            expire_date,

            loading,
            addCardAddress,
            updateAddCardUIConstraints
        } = this.props;

        const requestBody = {
            card_holder_name,
            card_number,
            cvv,
            expire_date
        };
        Keyboard.dismiss();

        if (loading) return;

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateAddCardUIConstraints({
                        [ADD_CARD_ERRORS]: []
                    });

                    //Add card action
                    addCardAddress();
                } else updateAddCardUIConstraints({
                    [ADD_CARD_ERRORS]: response && response.length ? response : []
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

    componentDidUpdate = (prevProps) => {
        const { type, onBack } = this.props;

        if (prevProps.type !== type) {
            if (type === SUCCESS) {
                if (typeof onBack === "function") onBack();
            }
        }
    }

    componentWillUnmount = () => {
        const { resetAddCardState, listCardAddress } = this.props;
        resetAddCardState();
        listCardAddress();
    }

    render() {
        const mapIcon = require('../../../../assets/img/map.png');
        const { inputViewContainer, btnContainerStyle } = this.getStyles();
        const {
            card_holder_name,
            card_number,
            cvv,
            expire_date,
            loading
        } = this.props;

        //Cardholder Name
        this.cardholderName = {
            onChangeText: (value) => this.onChangeText(ADD_CARD_FORM_CARDHOLDER_NAME, value),
            placeholderName: 'e.g.: cardholder name',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            value: card_holder_name,
            isError: this.isError('card_holder_name'),
            keyboardType: "default",
            labelName: "CARDHOLDER NAME",
            isHorizontal: true,
            onSubmitEditing: () => { }
        };

        //Card Number
        this.cardNumber = {
            onChangeText: (value) => this.onChangeText(ADD_CARD_FORM_CARD_NUMBER, value),
            placeholderName: 'e.g.: card number',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            value: card_number,
            isError: this.isError('card_number'),
            keyboardType: "numeric",
            labelName: "CARD NUMBER",
            isHorizontal: true,
            onSubmitEditing: () => { }
        };

        //Expiry Date
        this.expiryDate = {
            onChangeText: (value) => this.onChangeText(ADD_CARD_FORM_EXPIRE_DATE, value),
            placeholderName: 'e.g.: expiry date',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            value: getCVVDate(expire_date),
            isError: this.isError('expire_date'),
            keyboardType: "numeric",
            labelName: "EXPIRY DATE",
            isHorizontal: true,
            onSubmitEditing: () => { }
        };

        //CVV
        this.cvv = {
            onChangeText: (value) => this.onChangeText(ADD_CARD_FORM_CVV, value),
            placeholderName: 'e.g.: cvv',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            value: cvv,
            isError: this.isError('cvv'),
            keyboardType: "numeric",
            labelName: "CVV",
            isHorizontal: true,
            onSubmitEditing: () => { }
        };

        return (
            <ScrollView
                style={inputViewContainer}
                alwaysBounceVertical={false}>
                <CalendarAlert />
                <WText padding={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(18)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>Add Payment Method</WText>

                <WView dial={2} stretch padding={[0, Utils.scaleSize(10)]}>
                    <Input
                        {...this.cardholderName} />
                    <Input
                        {...this.cardNumber} />
                    <Input
                        {...this.expiryDate} />
                    <Input
                        {...this.cvv} />
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

const mapToProps = ({ add_card }) => {
    const add_card_info = add_card && add_card[ADD_CARD_KEY] ? add_card[ADD_CARD_KEY] : {};

    const form_data = add_card_info && add_card_info[ADD_CARD_FORM] ? add_card_info[ADD_CARD_FORM] : {};

    const card_holder_name = form_data && form_data[ADD_CARD_FORM_CARDHOLDER_NAME] ? form_data[ADD_CARD_FORM_CARDHOLDER_NAME] : "";
    const card_number = form_data && form_data[ADD_CARD_FORM_CARD_NUMBER] ? form_data[ADD_CARD_FORM_CARD_NUMBER] : "";
    const cvv = form_data && form_data[ADD_CARD_FORM_CVV] ? form_data[ADD_CARD_FORM_CVV] : "";
    const expire_date = form_data && form_data[ADD_CARD_FORM_EXPIRE_DATE] ? form_data[ADD_CARD_FORM_EXPIRE_DATE] : ""

    const loading = add_card_info && add_card_info[ADD_CARD_REQUEST_LOADING] ? add_card_info[ADD_CARD_REQUEST_LOADING] : false;
    const errors = add_card_info && add_card_info[ADD_CARD_ERRORS] ? add_card_info[ADD_CARD_ERRORS] : [];

    const request_status = add_card_info && add_card_info[ADD_CARD_REQUEST_STATUS] ? add_card_info[ADD_CARD_REQUEST_STATUS] : {};
    const type = request_status && request_status[STATUS] ? request_status[STATUS] : '';

    return ({
        card_holder_name,
        card_number,
        cvv,
        expire_date,

        loading,
        errors,
        type
    });
}

export default connect(mapToProps, {
    addCardAddress,
    updateAddCardFormData,
    updateAddCardUIConstraints,
    resetAddCardState,
    listCardAddress
})(AddCardForm);