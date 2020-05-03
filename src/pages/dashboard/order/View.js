import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Helper } from '../../../apis'
import Utils from '../../../components/util/Utils';
import { ViewOrder, clearStatus, updateOrderUIConstraints,updateEditOrderFormData, addNotes, editNotes } from '../../../redux/order/Action'
import { ORDER_KEY, ASSIGN_DRIVER_ID, ASSIGN_DRIVER_LOADING, ASSIGN_DRIVER_ERROR, DRIVER_KEY, ASSIGN_DRIVER_KEY, USER_KEY, USER_DATA, ORDER_REQUEST_STATUS, TOKEN_NOT_FOUND, ERROR, SUCCESS, STATUS, EMPTY, MESSAGE, ORDER_NOTES_TEXT, EDIT_ORDER_FORM, ORDER_NOTES_LOADING, EDIT_PRODUCT_FORM_NOTES } from '../../../redux/Types';
import SelectDriver from '../../../components/dashboard/order/SelectDriver';
import { updateAssignDriver, updateDriverUIConstraints } from '../../../redux/driver/Action'
import { refillOrderShip } from '../../../apis/APIs';

class View extends PureComponent {

    componentDidMount() {
        this.init()
    }

    init = () => {
        const { ViewOrder, history, updateOrderUIConstraints, driverLoading, driver_id } = this.props
        const location = window.location
        const id = location && location.pathname ? location.pathname.split("view/").length ? location.pathname.split("view/")[1] : "" : "";
        if (!id) {
            history.push('/order/list')
        }
        ViewOrder(id)
    }

    onChangeDriver = (key, value) => {
        const { updateAssignDriver } = this.props;

        updateAssignDriver({
            [key]: value
        });
    }

    onChangeNotes = (key, value) => {
        const { updateEditOrderFormData } = this.props;

        updateEditOrderFormData({
            [key]: value
        });
    }

    submit = () => {
        const { updateAssignDriver, updateDriverUIConstraints } = this.props

        updateAssignDriver({
            [ASSIGN_DRIVER_LOADING]: true
        });

        const { driver_id, driverLoading } = this.props
        if (driverLoading) return;

        const requestBody = {
            driver_id
        };

        // const id = location && location.pathname ? location.pathname.split("edit/").length ? location.pathname.split("edit/")[1] : "" : "";

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                Utils.log(status, response)
                if (status) {
                    updateDriverUIConstraints({
                        [ASSIGN_DRIVER_ERROR]: []
                    });
                    this.ShipOrder()
                } else {
                    updateDriverUIConstraints({
                        [ASSIGN_DRIVER_ERROR]: response && response.length ? response : []
                    });
                    updateAssignDriver({
                        [ASSIGN_DRIVER_LOADING]: false
                    });
                }
            }).catch(err => {
                updateAssignDriver({
                    [ASSIGN_DRIVER_LOADING]: false
                });
                console.log(err)
            });
    }

    ShipOrder() {
        const { driver_id, user_token, driverLoading } = this.props
        this.onChangeDriver(ASSIGN_DRIVER_LOADING, true)
        const location = window.location
        const id = location && location.pathname ? location.pathname.split("view/").length ? location.pathname.split("view/")[1] : "" : "";
        const body = {
            driver_id: driver_id,
            user_token: user_token,
            order_id: id
        }


        refillOrderShip(body).then((res) => {
            window.$("#close_order_ship").click();
            this.onChangeDriver(ASSIGN_DRIVER_LOADING, false)
            this.init()
        }).catch((error) => {
            this.onChangeDriver(ASSIGN_DRIVER_LOADING, false)
        })
    }

    isError = (key) => {
        const { errors } = this.props;
        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    _handleErrorMessage = (key) => {
        const data = this.isError(key);
        Utils.log(data)
        if (data && data.status)
            return <span className="form-text text-error text-right">{data.message}</span>;

        return <div />
    }

    submitNotes(){
        const {notesLoading, notesText, editNotes, addNotes} = this.props
        if(notesLoading) return;
        if(notesText){
            editNotes()
        }else{
            addNotes()
        }
    }

    render() {
        const { shippingAddress, billingAddress, order_detail, productDriver, driverLoading, customerDetail, productDetail, productCategory, productSubCategory, notesText } = this.props
        return (
            <div className="kt-body kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-grid--stretch mt-4 pt-3" id="kt_body">
                <div className="kt-container  kt-container--fluid  kt-grid kt-grid--ver">
                    <button className="kt-aside-close " id="kt_aside_close_btn"><i className="la la-close"></i></button>

                    <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                        <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid pl-0" >
                            <div className="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app">
                                <button className="kt-app__aside-close" id="kt_user_profile_aside_close">
                                    <i className="la la-close"></i>
                                </button>
                                <div className="kt-grid__item kt-app__toggle" id="kt_user_profile_aside" style={{ width: "100%" }}>
                                    <div className="kt-portlet ">
                                        {/* <!--begin::Widget --> */}
                                        <div class="card" >
                                            <div class="card-header">
                                                Order Detail
                                            <span class="float-right">
                                                    <strong>Status:</strong> {order_detail.orderStatus}
                                                </span>
                                            </div>
                                            <div class="card-body">
                                                <div class="row mb-4" >
                                                    <div class="col-sm-3">
                                                        <h6 class="mb-3">Billing Address:</h6>
                                                        <div>
                                                            <strong>{customerDetail.name}</strong>
                                                        </div>
                                                        <div>{customerDetail.address}</div>
                                                        <div>{billingAddress.fullAddress}</div>
                                                        <table>
                                                            <tr>
                                                                <td>Email</td><td>:</td>
                                                                <td className="ml-3">{customerDetail.email}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Phone</td><td>:</td>
                                                                <td className="ml-3">{customerDetail.phone}</td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <h6 class="mb-3">Shipping Address:</h6>
                                                        <div>
                                                            <strong>{customerDetail.name}</strong>
                                                        </div>
                                                        <div>{customerDetail.companyAddress}</div>
                                                        <div>{shippingAddress.fullAddress}</div>
                                                        <table>
                                                            <tr>
                                                                <td>Email</td><td>:</td>
                                                                <td className="ml-3">{customerDetail.email}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Phone</td><td>:</td>
                                                                <td className="ml-3">{customerDetail.phone}</td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <h6 class="mb-3">Order Detail:</h6>
                                                        <div>
                                                            <strong>{productDetail.name}</strong>
                                                        </div>
                                                        <table>
                                                            <tr>
                                                                <td>Category</td><td>:</td>
                                                                <td className="ml-3">{productCategory.name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Subcategory</td><td>:</td>
                                                                <td className="ml-3">{productSubCategory.name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Order Type</td><td>:</td>
                                                                <td className="ml-3">{order_detail.orderType}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Order Status</td><td>:</td>
                                                                <td className="ml-3">{order_detail.orderStatus}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Sales Tax</td><td>:</td>
                                                                <td className="ml-3">{order_detail.appliedSalesTax}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Quantity</td><td>:</td>
                                                                <td className="ml-3">{order_detail.quantity}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Total Price</td><td>:</td>
                                                                <td className="ml-3">{order_detail.totalPrice}</td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                    {
                                                        productDriver.name
                                                            ?
                                                            <div class="col-sm-3">
                                                                <h6 class="mb-3">Driver Detail:</h6>
                                                                <div>
                                                                    <strong>{productDriver.name}</strong>
                                                                </div>
                                                                {/* <div>{productDriver.address.fullAddress}</div>
                                                      <div>{productDriver.address.street}, {productDriver.address.state}</div> */}
                                                                <table>
                                                                    <tr>
                                                                        <td>Email</td><td>:</td>
                                                                        <td className="ml-3">{productDriver.email}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Phone</td><td>:</td>
                                                                        <td className="ml-3">{productDriver.phone}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Vehical Name</td><td>:</td>
                                                                        <td className="ml-3">{productDriver.vehicalName}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Vehical Number</td><td>:</td>
                                                                        <td className="ml-3">{productDriver.vehicalNumber}</td>
                                                                    </tr>
                                                                </table>
                                                                <div className="pt-3">
                                                                {order_detail.orderStatus === "shipped"
                                                            ?
                                                            <button className="btn btn-primary" data-toggle="modal" data-target="#order_ship">Change driver</button>
                                                            :
                                                            <div></div>
                                                        }
                                                                </div>
                                                            </div>
                                                            :
                                                            null
                                                    }

                                                </div>
                                                <div class="table-responsive-sm">
                                                    <table class="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th class="center">Id</th>
                                                                <th>Item</th>
                                                                <th>Quantity</th>
                                                                <th>Description</th>

                                                                <th class="right">Unit Cost</th>

                                                                <th class="right">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td class="center">{order_detail._id}</td>
                                                                <td class="left strong">{productDetail.name}</td>
                                                                <td class="left">{order_detail.quantity}</td>
                                                                <td class="left">{productDetail.shortDescription}</td>

                                                                <td class="right">{productDetail.refillPrice}$</td>

                                                                <td class="right">{order_detail.totalPrice}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="row">
                                                    <div class="col-lg-4 col-sm-5 mt-5">
                                                        {/* order ship assign driver model */}
                                                        <div class="modal" id="order_ship">
                                                            <div class="modal-dialog">
                                                                <div class="modal-content">
                                                                    <div class="modal-header">
                                                                        <h4 class="modal-title">Assign Driver</h4>
                                                                        <button type="button" class="close" data-dismiss="modal"></button>
                                                                    </div>
                                                                    <div class="modal-body">
                                                                        <SelectDriver
                                                                            error_label={this._handleErrorMessage("driver_id")}
                                                                            handleOnChangeCategory={(id) => this.onChangeDriver(ASSIGN_DRIVER_ID, id)}
                                                                            label={"Driver"}
                                                                            _id={"order_driver_list"}
                                                                            Order_id={window.$("#confirm_order_ship").data("data-order-ship")}
                                                                        />
                                                                    </div>
                                                                    <div class="modal-footer">
                                                                        <button type="button" id="close_order_ship" class="btn btn-danger" data-dismiss="modal">Close</button>
                                                                        <button type="button" class="btn btn-danger" onClick={() => { this.submit() }}>{driverLoading ? "Loading..." : "Submit"}</button>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-4 col-sm-5 ml-auto">
                                                        <table class="table table-clear">
                                                            <tbody>

                                                                <tr>
                                                                    <td class="left">
                                                                        <strong>Discount (%)</strong>
                                                                    </td>
                                                                    <td class="text-left">{order_detail.discount}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="left">
                                                                        <strong>VAT (%)</strong>
                                                                    </td>
                                                                    <td class="text-left">{order_detail.appliedSalesTax}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="left">
                                                                        <strong>Total ($)</strong>
                                                                    </td>
                                                                    <td class="text-left">
                                                                        <strong>{order_detail.totalPrice}</strong>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </div>

                                                </div>
                                                <div className="form-group row">
                                                    <div className="col-lg-12 col-xl-12">
                                                        <textarea className="form-control" placeholder="Notes"
                                                        onChange={(e) => this.onChangeNotes(ORDER_NOTES_TEXT, e.target.value)}
                                                        value={notesText}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                                <div className="kt-form__actions">
                                                    <button type="submit" className="btn btn-brand" style={{float:"right"}}>
                                                        Submit
                                                </button>
                                                </div>
                                            </div>

                                        </div>



                                        {/* <!--end::Widget --> */}
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
        )
    }
}

export default connect(({ order, user, driver }) => {
    const order_data = order[ORDER_KEY] ? order[ORDER_KEY] : undefined;
    const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
    const driver_data = driver[DRIVER_KEY] ? driver[DRIVER_KEY] : undefined;
    const assign_driver_data = driver[DRIVER_KEY][ASSIGN_DRIVER_KEY] ? driver[DRIVER_KEY][ASSIGN_DRIVER_KEY] : undefined;
    console.log("order_data ===   >",order_data)
    return ({
        user_token: user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false,
        order_detail: order_data && order_data.order_detail ? order_data.order_detail : "",
        customerDetail: order_data && order_data.order_detail.customerDetail ? order_data.order_detail.customerDetail : {},
        shippingAddress: order_data && order_data.order_detail.customerDetail ? order_data.order_detail.customerDetail.shippingAddress : {},
        billingAddress: order_data && order_data.order_detail.customerDetail ? order_data.order_detail.customerDetail.billingAddress : {},
        productDetail: order_data && order_data.order_detail.productDetail ? order_data.order_detail.productDetail : {},
        productCategory: order_data && order_data.order_detail.productCategory ? order_data.order_detail.productCategory : {},
        productSubCategory: order_data && order_data.order_detail.productSubCategory ? order_data.order_detail.productSubCategory : {},
        productDriver: order_data && order_data.order_detail.productDriver ? order_data.order_detail.productDriver : {},
        loading: order_data.order_detail_loading,

        requestStatus: order_data[ORDER_REQUEST_STATUS],

        driver_id: assign_driver_data[ASSIGN_DRIVER_ID],
        driverLoading: assign_driver_data[ASSIGN_DRIVER_LOADING],
        errors: driver_data[ASSIGN_DRIVER_ERROR],

        notesText:order_data[EDIT_ORDER_FORM] && order_data[EDIT_ORDER_FORM][ORDER_NOTES_TEXT] ? order_data[EDIT_ORDER_FORM][ORDER_NOTES_TEXT] : "",
        notesLoading:order_data[EDIT_ORDER_FORM] && order_data[EDIT_ORDER_FORM][ORDER_NOTES_LOADING] ? order_data[EDIT_ORDER_FORM][ORDER_NOTES_LOADING] : ""
    })
}, {
    ViewOrder,
    clearStatus,
    updateOrderUIConstraints,
    updateAssignDriver,
    updateDriverUIConstraints,
    updateEditOrderFormData,
    editNotes,
    addNotes
})(View)