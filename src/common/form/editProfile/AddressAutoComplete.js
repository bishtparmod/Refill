import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal, FlatList, Image } from 'react-native';
import { WView, WRow, WText, WButton, WSpinner, WTouchable } from '../../ui'
import Colors from '../../styles/Colors';
import Utils from '../../util/Utils';
import { Input } from '../../base_components';
import { connect } from 'react-redux';
import { ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM_TEXT, ADD_BILLING_AND_SHIPPING_ADDRESS_KEY, ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM, ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_DATA, BILLING, ADD_BILLING_ADDRESS_FORM_CITY, ADD_BILLING_ADDRESS_FORM_STATE, ADD_BILLING_ADDRESS_FORM_COUNTRY, ADD_BILLING_ADDRESS_FORM_ADDRESS, SHIPPING, ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_IS_VISIBLE, ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_TYPE, EMPTY, ADD_SHIPPING_ADDRESS_FORM_CITY, ADD_SHIPPING_ADDRESS_FORM_STATE, ADD_SHIPPING_ADDRESS_FORM_COUNTRY, ADD_SHIPPING_ADDRESS_FORM_ADDRESS, ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_LOADING } from '../../../redux/Types';
import { autoComplete, updateAutoCompleteBillingAndShippingAddressFormData, updateAddBillingAndShippingAddressUIConstraints, updateAddBillingAndShippingAddressFormData } from '../../../redux/billingAndShippingAddress/Action';

class AddressAutoComplete extends PureComponent {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        autoCompleteType: PropTypes.string,
        isVisible: PropTypes.isVisible
    }

    static defaultProps = {
        autoComplete: SHIPPING
    }

    onChangeText = (key, value) => {
        const { updateAutoCompleteBillingAndShippingAddressFormData, loading, search_text, autoComplete } = this.props;
        if (loading) return;

        updateAutoCompleteBillingAndShippingAddressFormData &&
            updateAutoCompleteBillingAndShippingAddressFormData({
                [key]: value
            });

        if (search_text && search_text.length >= 3) {
            autoComplete();
        }
    }

    sortAddress = (terms = [], description = "") => {
        const { autoCompleteType, updateAddBillingAndShippingAddressFormData, updateAddBillingAndShippingAddressUIConstraints } = this.props;

        let obj = {};

        const country = terms && terms.length >= 1 ? terms[terms.length - 1].value : "";
        const state = terms && terms.length >= 2 ? terms[terms.length - 2].value : "";
        const city = terms && terms.length >= 3 ? terms[terms.length - 3].value : "";

        if (autoCompleteType === BILLING) {
            obj = {
                [ADD_BILLING_ADDRESS_FORM_CITY]: city,
                [ADD_BILLING_ADDRESS_FORM_STATE]: state,
                [ADD_BILLING_ADDRESS_FORM_COUNTRY]: country,
                [ADD_BILLING_ADDRESS_FORM_ADDRESS]: description
            }
        }

        if (autoCompleteType === SHIPPING) {
            obj = {
                [ADD_SHIPPING_ADDRESS_FORM_CITY]: city,
                [ADD_SHIPPING_ADDRESS_FORM_STATE]: state,
                [ADD_SHIPPING_ADDRESS_FORM_COUNTRY]: country,
                [ADD_SHIPPING_ADDRESS_FORM_ADDRESS]: description
            }
        }

        updateAddBillingAndShippingAddressFormData(obj);
        updateAddBillingAndShippingAddressUIConstraints({
            [ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_IS_VISIBLE]: false,
            [ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_TYPE]: EMPTY
        });
    }

    closeModal = () => {
        const { updateAddBillingAndShippingAddressUIConstraints } = this.props;

        updateAddBillingAndShippingAddressUIConstraints({
            [ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_IS_VISIBLE]: false,
            [ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_TYPE]: EMPTY
        });
    }

    _renderAddress = () => {
        const { search_text, data, loading } = this.props;

        //Name
        this.name = {
            onChangeText: (value) => this.onChangeText(ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM_TEXT, value),
            placeholderName: 'Find your near by location',
            placeholderTextColor: Colors.light_color,
            autoCapitalize: "none",
            keyboardType: "default",
            returnKeyType: "done",
            autoFocus: true,
            labelName: "Name",
            isVertical: true,
            value: search_text,
            onSubmitEditing: () => { }
        };

        return (
            <WView dial={2} stretch padding={[Utils.scaleSize(20), Utils.scaleSize(10)]}>
                <WText fontSize={Utils.scaleSize(18)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>Add Address</WText>
                <WView dial={2} padding={[0, 0, Utils.scaleSize(30), 0]} stretch>
                    <Input
                        {...this.name} />
                </WView>
                <WView dial={6}>
                    <WButton
                        label={"Close"}
                        onPress={this.closeModal.bind(this)}
                        color={Colors.text_color_dark} />
                </WView>
                <FlatList
                    data={data}
                    ListEmptyComponent={
                        <WView dial={4}>
                            <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} left>Please search your location...</WText>
                        </WView>
                    }
                    ListHeaderComponent={
                        loading ?
                            <WView dial={5} padding={[20, 0]}>
                                <WSpinner size={"small"} color={Colors.theme_color} />
                                <WText padding={[5, 0]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Light"} fontWeight={"400"} color={Colors.theme_color} left>please wait...</WText>
                            </WView> :
                            null
                    }
                    keyExtractor={(item, index) => `address-auto-complete-${index}`}
                    renderItem={({ item, index }) => <this.LocationItem {...item} />} />
            </WView>
        )
    }

    LocationItem = ({ structured_formatting = {}, description, terms }) => {
        const mapIcon = require('../../../../assets/img/map.png');
        const { iconStyle } = this.getStyles();

        return (
            <WTouchable onPress={this.sortAddress.bind(this, terms, description)}>
                <WRow dial={4} padding={[Utils.scaleSize(10), 0]}>
                    <Image source={mapIcon} style={iconStyle} resizeMode={"contain"} />
                    <WView dial={4} margin={[0, 0, 0, Utils.scaleSize(10)]}>
                        <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_dark} left lines={2}>{structured_formatting && structured_formatting.main_text ? structured_formatting.main_text : ""}</WText>
                        <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Light"} fontWeight={"400"} color={Colors.text_color_light_dark} left lines={2}>{structured_formatting && structured_formatting.secondary_text ? structured_formatting.secondary_text : ""}</WText>
                    </WView>
                </WRow>
            </WTouchable>
        );
    }

    render() {
        const { isVisible } = this.props;

        return (
            <Modal
                visible={isVisible}
                onRequestClose={() => { }}
                transparent={true}
            >
                <WView flex stretch dial={2} padding={[Utils.scaleSize(10), Utils.scaleSize(10)]} backgroundColor={Colors.white}>
                    {this._renderAddress()}
                </WView>
            </Modal>
        );
    }

    getStyles = () => {
        return ({
            iconStyle: {
                width: Utils.scaleSize(20),
                height: Utils.scaleSize(20)
            }
        });
    }
}

const mapToProps = ({ add_billing_and_shipping_address }) => {

    const add_billing_and_shipping_address_info = add_billing_and_shipping_address && add_billing_and_shipping_address[ADD_BILLING_AND_SHIPPING_ADDRESS_KEY] ? add_billing_and_shipping_address[ADD_BILLING_AND_SHIPPING_ADDRESS_KEY] : {};
    const form_data = add_billing_and_shipping_address_info && add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM] ? add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM] : {};

    const search_text = form_data && form_data[ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM_TEXT] ? form_data[ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM_TEXT] : "";
    const data = add_billing_and_shipping_address_info && add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_DATA] ? add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_DATA] : [];
    const loading = add_billing_and_shipping_address_info && add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_LOADING] ? add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_LOADING] : false;

    const isVisible = add_billing_and_shipping_address_info && add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_IS_VISIBLE] ? add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_IS_VISIBLE] : false;
    const autoCompleteType = add_billing_and_shipping_address_info && add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_TYPE] ? add_billing_and_shipping_address_info[ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_TYPE] : EMPTY;

    return ({
        search_text,
        data,
        isVisible,
        autoCompleteType,
        loading
    });
}

export default connect(mapToProps, {
    updateAutoCompleteBillingAndShippingAddressFormData,
    updateAddBillingAndShippingAddressFormData,
    updateAddBillingAndShippingAddressUIConstraints,
    autoComplete
})(AddressAutoComplete);