import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Keyboard } from 'react-native';
import { WView, WText, WTouchable } from '../../ui'
import { Input } from '../../base_components';
import Utils from '../../util/Utils';
import { connect } from 'react-redux';
import { Helper } from '../../../apis';
import { updateCustomerSupportFormData, updateCustomerSupportUIConstraints, sendMessage, resetCustomerSupportState } from '../../../redux/customerSupport/Action';
import { CUSTOMER_SUPPORT_FORM_MESSAGE, CUSTOMER_SUPPORT_KEY, CUSTOMER_SUPPORT_FORM, CUSTOMER_SUPPORT_REQUEST_LOADING, CUSTOMER_SUPPORT_ERRORS, USER_KEY, USER_DATA, USER_TYPE, CHAT_SCREEN } from '../../../redux/Types';
import firestore from '@react-native-firebase/firestore';

/** Login form */
class Form extends PureComponent {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        initSubmit: PropTypes.func,
        navigation: PropTypes.any
    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { initSubmit } = this.props;

        if (typeof initSubmit === "function") initSubmit(this.submit);
    }

    onChangeText = (key, value) => {
        const { updateCustomerSupportFormData, loading } = this.props;
        if (loading) return;

        updateCustomerSupportFormData({
            [key]: value
        });
    }

    submit = () => {
        const { loading, message, updateCustomerSupportUIConstraints, resetCustomerSupportState, sendMessage, user_id, navigation } = this.props;
        const requestBody = { message };
        Keyboard.dismiss();

        if (loading) return;

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(async ({ status, response }) => {
                if (status) {
                    updateCustomerSupportUIConstraints({
                        [CUSTOMER_SUPPORT_ERRORS]: [],
                    });

                    //Add data
                    updateCustomerSupportUIConstraints({
                        [CUSTOMER_SUPPORT_REQUEST_LOADING]: true
                    });
                    const documentRef = await firestore()
                        .collection('users').add({
                            userType: USER_TYPE,
                            message,
                            userId: user_id,
                            createdDate: new Date().getTime()
                        });
                    resetCustomerSupportState();
                    navigation.navigate(CHAT_SCREEN);
                } else updateCustomerSupportUIConstraints({
                    [CUSTOMER_SUPPORT_ERRORS]: response && response.length ? response : []
                });
            }).catch(err => console.log(err));
    }

    componentDidUpdate = (prevProps) => {
        const { type } = this.props;

        if (prevProps.type !== type) {
            if (type === SUCCESS) {
                this.openScren('Home');
            }
        }

    }

    /** On error */
    isError = (key) => {
        const { errors } = this.props;

        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    openScren = (screen) => {
        const { navigation } = this.props;

        if (!screen) return;

        navigation.navigate(screen);
    }

    render() {
        const { message } = this.props;

        //Message
        this.message = {
            onChangeText: (value) => this.onChangeText(CUSTOMER_SUPPORT_FORM_MESSAGE, value),
            autoCapitalize: "none",
            value: message,
            multiline: true,
            multilineStyle: {
                height: Utils.scaleSize(100)
            },
            isError: this.isError('message'),
            labelName: "Message",
            onSubmitEditing: () => {
            }
        };

        return (
            <WView dial={5} padding={[50, 10, 50, 10]} stretch>
                <Input
                    {...this.message} />
            </WView>
        );
    }
}

const mapToProps = ({ customer_support, user }) => {
    const customer_support_key = customer_support && customer_support[CUSTOMER_SUPPORT_KEY] ? customer_support[CUSTOMER_SUPPORT_KEY] : {};
    const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
    const customer_support_form = customer_support_key && customer_support_key[CUSTOMER_SUPPORT_FORM] ? customer_support_key[CUSTOMER_SUPPORT_FORM] : {};

    const message = customer_support_form && customer_support_form[CUSTOMER_SUPPORT_FORM_MESSAGE] ? customer_support_form[CUSTOMER_SUPPORT_FORM_MESSAGE] : "";

    const loading = customer_support_key && customer_support_key[CUSTOMER_SUPPORT_REQUEST_LOADING] ? customer_support_key[CUSTOMER_SUPPORT_REQUEST_LOADING] : false;

    const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};
    const user_id = user_data && user_data._id ? user_data._id : "";

    return ({
        message,
        loading,
        user_id
    });
}

export default connect(mapToProps, {
    updateCustomerSupportFormData,
    updateCustomerSupportUIConstraints,
    resetCustomerSupportState,
    sendMessage
})(Form);