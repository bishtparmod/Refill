import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, PRODUCT_KEY, ADD_PRODUCT_FORM, ADD_PRODUCT_REQEUST_LOADING, ADD_PRODUCT_REQUEST_STATUS, ADD_PRODUCT_ERRORS, ADD_PRODUCT_FORM_NAME, ADD_PRODUCT_FORM_SHORT_DESCRIPTION, ADD_PRODUCT_FORM_LONG_DESCRIPTION, ADD_PRODUCT_FORM_BRAND, ADD_PRODUCT_FORM_DISTRIBUTOR, ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, ADD_PRODUCT_FORM_RETAIL_PRICE, ADD_PRODUCT_FORM_REFILL_PRICE, ADD_PRODUCT_FORM_DISCOUNT, ADD_PRODUCT_FORM_NOTES, ADD_PRODUCT_FORM_ALERT, ADD_PRODUCT_FORM_QUANTITY, ADD_PRODUCT_FORM_SIZE, ADD_PRODUCT_FORM_WEIGHT, ADD_PRODUCT_FORM_UNITS, ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, ADD_PRODUCT_FORM_MFG_DATE, ADD_PRODUCT_FORM_EXPIRY_DATE, ADD_PRODUCT_FORM_CODE, ADD_PRODUCT_FORM_PUP_GTIN_CODE, MESSAGE, SUCCESS, ERROR, STATUS, ADD_PRODUCT_FORM_CATEGORY_ID, ADD_PRODUCT_FORM_SUB_CATEGORY_ID, ADD_PRODUCT_IMAGES, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_FORM_PRODUCT_ID, EDIT_PRODUCT_FORM, EDIT_PRODUCT_FORM_NAME, EDIT_PRODUCT_FORM_SHORT_DESCRIPTION, EDIT_PRODUCT_FORM_LONG_DESCRIPTION, EDIT_PRODUCT_FORM_BRAND, EDIT_PRODUCT_FORM_DISTRIBUTOR, EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, EDIT_PRODUCT_FORM_RETAIL_PRICE, EDIT_PRODUCT_FORM_REFILL_PRICE, EDIT_PRODUCT_FORM_DISCOUNT, EDIT_PRODUCT_FORM_NOTES, EDIT_PRODUCT_FORM_ALERT, EDIT_PRODUCT_FORM_QUANTITY, EDIT_PRODUCT_FORM_WEIGHT, EDIT_PRODUCT_FORM_SIZE, EDIT_PRODUCT_FORM_UNITS, EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, EDIT_PRODUCT_FORM_MFG_DATE, EDIT_PRODUCT_FORM_EXPIRY_DATE, EDIT_PRODUCT_FORM_CODE, EDIT_PRODUCT_FORM_PUP_GTIN_CODE, EDIT_PRODUCT_FORM_CATEGORY_ID, EDIT_PRODUCT_FORM_SUB_CATEGORY_ID, EDIT_PRODUCT_FORM_UPLOADED_IMAGES, EDIT_PRODUCT_ERRORS, EDIT_PRODUCT_REQEUST_LOADING, EDIT_PRODUCT_REQUEST_STATUS, EDIT_PRODUCT_IMAGES, EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_IS_UPLOADING_IMAGES, USER_CUSTOMER_NAME, USER_CUSTOMER_EMAIL, USER_CUSTOMER_PHONENO, USER_CUSTOMER_NOTES, USER_CUSTOMER_ADDRESS, USER_CUSTOMER_CITY, USER_CUSTOMER_STATE, USER_CUSTOMER_COUNTRY, USER_CUSTOMER_ZIPCODE, USER_EDIT_FORM, USER_CUSTOMER_ERROR, USER_CUSTOMER_ID, USER_EDIT_REQUEST_STATUS, USER_DATA, USER_KEY, CHATING_DATA, CHAT_ADMIN_ID, CHAT_USER_ID } from '../../../redux/Types'
import { updateProductUIConstraints, resetProductState, updateEditProductFormData, getProductViaID, editProduct } from '../../../redux/product/Action'
import { Helper } from '../../../apis'
import { SelectCalendar, SelectCategory, UploadImageContainer, EditUploadImageContainer } from '../../../components/dashboard/product'
import { refillAddSubCategory } from '../../../apis/APIs'
import SelectSubCategory from '../../../components/dashboard/product/SelectSubCategory'
import Utils from '../../../components/util/Utils'
import { ToastsStore } from 'react-toasts'
import { } from '../../../redux/Types'
import { updateEditUserFormData, getUserviaId, updateUsersUIConstraints, editUserData } from '../../../redux/users/Action'
import { updateChatData, getChatData } from '../../../redux/chat/Action'

class View extends PureComponent {

    constructor(props) {
        super(props)
        this.initForm()
    }

    initForm = () => {
		
        const { updateEditUserFormData, getUserviaId, history, updateChatData, getChatData, adminId } = this.props;
        const location = window.location;

        const id = location && location.pathname ? location.pathname.split("view/").length ? location.pathname.split("view/")[1] : "" : "";
        setTimeout(() => {
            if (!id) {
                history.push('/user/list')
                return;
            }
        }, 1000)

        updateEditUserFormData({
            [USER_CUSTOMER_ID]: id
        });

        getUserviaId(id);

    }

   

    render() {
        const { loading, customerBillingAddress, reqeustStatus, userData, customerAddress, customerStreet, customerCity, customerCountry, customerEmail, customerName, customerNotes, customerPhoneno, customerState, customerZipcode,
            customerBillingCity, customerBillingStreet, customerBillingCountry, customerBillingState, customerBillingZipcode } = this.props

        return (
            <div className="ml-5">
                <div className="kt-body kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-grid--stretch" id="kt_body">
                    <div className="kt-container  kt-container--fluid  kt-grid kt-grid--ver">
                        <button className="kt-aside-close " id="kt_aside_close_btn"><i className="la la-close"></i></button>

                        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                                <div className="kt-container  kt-container--fluid ">
                                    <div className="kt-subheader__main">
                                        <h3 className="kt-subheader__title">
                                            <button className="kt-subheader__mobile-toggle kt-subheader__mobile-toggle--left" id="kt_subheader_mobile_toggle"><span></span></button>
                                            User</h3>
                                        <span className="kt-subheader__separator kt-hidden"></span>
                                        <div className="kt-subheader__breadcrumbs">
                                            <a className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
                                            <span className="kt-subheader__breadcrumbs-separator"></span>
                                            <a className="kt-subheader__breadcrumbs-link">
                                                View </a>

                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">


                                <div className="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app">


                                    <button className="kt-app__aside-close" id="kt_user_profile_aside_close">
                                        <i className="la la-close"></i>
                                    </button>


                                    <div className="kt-grid__item kt-app__toggle" id="kt_user_profile_aside" >


                                        <div class="kt-portlet kt-portlet--height-fluid">
                                            <div class="kt-portlet__body">
                                                <div class="kt-widget kt-widget--user-profile-3">
                                                    <div class="kt-widget__top">
                                                        <div class="kt-widget__media kt-hidden-">
                                                            <img src="/assets/img/plus.png" alt="image" />
                                                        </div>
                                                        <div class="kt-widget__pic kt-widget__pic--danger kt-font-danger kt-font-boldest kt-font-light kt-hidden">
                                                            JM
                </div>
                                                        <div class="kt-widget__content row">
                                                            <div class="kt-widget__head col-6">
                                                                <a class="kt-widget__username">
                                                                    {customerName}
                                                                    <i class="flaticon2-correct"></i>
                                                                </a>

                                                                {/* <div class="kt-widget__action">
                            <button type="button" class="btn btn-label-success btn-sm btn-upper">ask</button>&nbsp;
                            <button type="button" class="btn btn-brand btn-sm btn-upper">hire</button>
                        </div> */}
                                                            </div>

                                                            <div class="kt-widget__subhead col-6">
                                                                <a ><i class="flaticon2-new-email"></i>{customerEmail}</a>
                                                                {/* <a ><i class="flaticon2-calendar-3"></i>PR Manager </a> */}
                                                                <a ><i class="fas fa-home"></i>{customerAddress}</a>
                                                            </div>

                                                            <div class="kt-widget__info mt-4">
                                                                <div class="kt-widget__desc">
                                                                    {customerNotes}
                                                                    <br />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="kt-widget__bottom row">
                                                        <div class="kt-widget__item col-6">
                                                            <div class="kt-widget__icon">
                                                                <i class="fas fa-building"></i>
                                                            </div>
                                                            <div class="kt-widget__details">
                                                                <span class="kt-widget__title">Billing Address</span>
                                                                <div> {customerBillingStreet} {customerBillingCity}<br />{customerBillingState} {customerBillingZipcode},<br />{customerBillingCountry}</div>
                                                            </div>
                                                        </div>

                                                        <div class="kt-widget__item col-6">
                                                            <div class="kt-widget__icon">
                                                                <i class="flaticon-home"></i>
                                                            </div>
                                                            <div class="kt-widget__details">
                                                                <span class="kt-widget__title">Shipping Address</span>
                                                                <div> {customerStreet} {customerCity}<br />{customerState} {customerZipcode},<br />{customerCountry}</div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!--end:: Widgets/Applications/User/Profile1--> */}
                                    </div>

                                    {/* <!--End:: App Aside--> */}

                                    {/* <!--Begin:: App Content--> */}

                                </div>

                                {/* <!--End::App--> */}
                            </div>

                            {/* <!-- end:: Content --> */}
                        </div>
                    </div>
                </div>


                {/* <!-- end:: Page --> */}

                {/* <!-- begin::Quick Panel --> */}


                {/* <!-- begin::Scrolltop --> */}


                {/* <!-- end::Scrolltop --> */}

                {/* <!-- begin::Sticky Toolbar --> */}
                <ul className="kt-sticky-toolbar" style={{ "marginTop": "30px" }}>
                    <li className="kt-sticky-toolbar__item kt-sticky-toolbar__item--danger" id="kt_sticky_toolbar_chat_toggler" data-toggle="kt-tooltip" title="Chat Example" data-placement="left">
                        <a data-toggle="modal" data-target="#kt_chat_modal"><i className="flaticon2-chat-1"></i></a>
                    </li>
                </ul>

                {/* <!-- end::Sticky Toolbar --> */}


                {/* <!--Begin:: Chat--> */}

            </div>
        )
    }
}

export default connect(({ users, user, chat }) => {
    const { users_key } = users
    const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
    
    return ({
 
        user_token : user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false,
        adminId : user_data && user_data[USER_DATA] && user_data[USER_DATA]._id ? user_data[USER_DATA]._id : "" ,
    
        userData: users_key[USER_EDIT_FORM],
        customerName: users_key[USER_EDIT_FORM].user_customer_name,
        customerEmail: users_key[USER_EDIT_FORM].user_customer_email,
        customerNotes: users_key[USER_EDIT_FORM].user_customer_notes,
        customerPhoneno: users_key[USER_EDIT_FORM].user_customer_phoneno,

        customerAddress: users_key[USER_EDIT_FORM].user_customer_address,
        customerCity: users_key[USER_EDIT_FORM].user_customer_city,
        customerCountry: users_key[USER_EDIT_FORM].user_customer_country,
        customerState: users_key[USER_EDIT_FORM].user_customer_state,
        customerZipcode: users_key[USER_EDIT_FORM].user_customer_zipcode,
        customerStreet: users_key[USER_EDIT_FORM].user_customer_street,

        loading: users_key[USER_EDIT_FORM].user_customer_loading,
        reqeustStatus: users_key[USER_EDIT_REQUEST_STATUS] ? users_key[USER_EDIT_REQUEST_STATUS] : {},
        errors: users_key[USER_CUSTOMER_ERROR],

        customerBillingAddress: users_key[USER_EDIT_FORM].user_customer_company_address,
        customerBillingCity: users_key[USER_EDIT_FORM].user_customer_billing_city,
        customerBillingCountry: users_key[USER_EDIT_FORM].user_customer_billing_country,
        customerBillingState: users_key[USER_EDIT_FORM].user_customer_billing_state,
        customerBillingZipcode: users_key[USER_EDIT_FORM].user_customer_billing_zipcode,
        customerBillingStreet: users_key[USER_EDIT_FORM].user_customer_billing_street,
    })
}, {
    updateEditUserFormData,
    updateUsersUIConstraints,
    getUserviaId,
    editUserData,
    updateChatData, 
    getChatData
})(View)
