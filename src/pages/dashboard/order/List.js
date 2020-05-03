import React, { PureComponent } from 'react'
import Table from '../../../components/dashboard/order/Table'
import SelectDriver from '../../../components/dashboard/order/SelectDriver'
import { getCategoriesDataTables, getAuthoriztionToken, getOrderDataTables, refillOrderShip } from '../../../apis/APIs';
import moment from 'moment';
import { connect } from 'react-redux'
import { Helper } from '../../../apis'
import Utils from '../../../components/util/Utils';
import { updateSystemData } from '../../../redux/system/Action'
import { updateOrderState, exportOrders, SkipOrder, ClearRedux, CancelOrder, CancelRefillOrder, ApproveOrder, resetOrderState, updateEditOrderFormData, updateOrderUIConstraints } from '../../../redux/order/Action'
import { SYSTEM_DATA_PAGE_TITLE, USER_KEY, USER_DATA, PRODUCT_KEY, DELETE_PRODUCT_FORM, DELETE_PRODUCT_FORM_PRODUCT_ID, DELETE_PRODUCT_REQEUST_LOADING, DELETE_PRODUCT_REQUEST_STATUS, SERVER_NO_VALUE, SERVER_SUCCESS, TOKEN_NOT_FOUND, SUCCESS, ERROR, STATUS, MESSAGE, SERVER_VALIDATION_ERROR, EXPORT_PRODUCT_REQEUST_LOADING, EXPORT_PRODUCT_REQUEST_STATUS, USERS_KEY, EXPORT_USERS_REQUEST_STATUS, EXPORT_USERS_REQEUST_LOADING, ENABLE_USERS_REQUEST_STATUS, ENABLE_USERS_REQUEST_LOADING, DISABLE_CATEGORY_REQUEST_STATUS, DISABLE_USERS_REQUEST_STATUS, DISABLE_USERS_REQUEST_LOADING, ACTIVE, ORDER_KEY, EDIT_ORDER_QUANTITY, EDIT_ORDER_FORM_LOADING, EDIT_ORDER_ERROR, TABLE_DATA, TABLE_NAME, TABLE_ID, TABLE_TYPE, PENDING_ORDER_APPROVE_LOADING, PENDING_ORDER_CANCEL_LOADING, REFILL_ORDER_SKIP_LOADING, REFILL_ORDER_SHIP_LOADING, ORDER_REQUEST_STATUS, ASSIGN_DRIVER_ID, DRIVER_KEY, ASSIGN_DRIVER_KEY, DRIVER_EDIT_FORM_UPLOADED_IMAGES, ASSIGN_DRIVER_LOADING, ASSIGN_DRIVER_ERROR, REFILL_ORDER_CANCEL_LOADING, PENDING_ORDER_APPROVE_REQUEST, PENDING_ORDER_CANCEL_REQUEST, REFILL_ORDER_CANCEL_REQUEST, REFILL_ORDER_SKIP_REQUEST, EMPTY, REFILL_ORDER_SHIP_REQUEST, DRIVER_REQUEST_STATUS, DRIVER_REQUEST_LOADING, ORDER_REQUEST_LOADING } from '../../../redux/Types'
import { SelectCalendar, SelectCategory, UploadImageContainer } from '../../../components/dashboard/product'
import { ToastsStore } from 'react-toasts'
import { ConfirmAlert } from '../../../components/base_components';
import { updateAssignDriver, updateDriverUIConstraints } from '../../../redux/driver/Action'

class List extends PureComponent {

    constructor() {
        super()
    }

    componentDidMount = () => {
        const { table_Id } = this.props

        this.pending_list();
        this.active_list();
        this.refill_list();
        this.past_list();
        this.init();
    }

    refresh = () => {
        this.pastListRedraw()
        this.pendingListRedraw()
        this.activeListRedraw()
        this.refillListRedraw()
    }

    componentDidUpdate(prevProps) {
        const { table_Id, table_type, driverLoading, requestStatus, ClearRedux, requestPendingCancelStatus, requestRefillCancelStatus, requestSkipStatus, requestApproveStatus, updateOrderUIConstraints } = this.props;


        const prevReqeustPendingCancelStatus = prevProps && prevProps.pending_order_cancel_request ? prevProps.pending_order_cancel_request : {};
        if (requestPendingCancelStatus[STATUS] !== prevReqeustPendingCancelStatus[STATUS]) {
            switch (requestPendingCancelStatus[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("Order successfully cancel", 3000);
                    window.$("#close_order_id").click();
                    window.$("#close_active_order_id").click();
                    ClearRedux()
                    this.pendingListRedraw()
                    break;
                case TOKEN_NOT_FOUND:
                    ToastsStore.error("Token not available, Please try again", 3000);
                    break;
                    // case ERROR:
                    //     const status = requestStatus[MESSAGE] && requestStatus[MESSAGE].message ? requestStatus[MESSAGE].message : '';
                    //     const emptyKeys = requestStatus[MESSAGE] && requestStatus[MESSAGE].emptyKeys ? requestStatus[MESSAGE].emptyKeys : [];
    
                    //     switch (status) {
                    //         case SERVER_VALIDATION_ERROR:
                    //             const fields = ["discount", "start_date", "end_date"];
                    //             const index = emptyKeys.findIndex(ele => fields.indexOf(ele.fieldName) !== -1);
    
                    //             if (index === -1)
                    //                 ToastsStore.error("Validation error, Please try again", 3000);
                    //             else ToastsStore.error(emptyKeys[index].message, 6000);
                    //             break;
                    //         case SERVER_NO_VALUE:
                    //             ToastsStore.error("Product not Found, Please try again", 3000);
                    //             break;
                    //         default:
                    //     }
                    //     break;
                case ERROR:
                    // const status = requestStatus[MESSAGE] && requestStatus[MESSAGE].message ? requestStatus[MESSAGE].message : '';
                    ToastsStore.error("Validation error, Please try again", 3000);
                    break;
            }
        }

        const prevReqeustRefillCancelStatus = prevProps && prevProps.refill_order_cancel_request ? prevProps.refill_order_cancel_request : {};
        if (requestRefillCancelStatus[STATUS] !== prevReqeustRefillCancelStatus[STATUS]) {
            switch (requestRefillCancelStatus[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("Order successfully cancel", 3000);
                    window.$("#close_order_refill_cancel").click();
                    ClearRedux()
                    this.refillListRedraw()
                    break;
                case TOKEN_NOT_FOUND:
                    ToastsStore.error("Token not available, Please try again", 3000);
                    break;
                case ERROR:
                    // const status = requestStatus[MESSAGE] && requestStatus[MESSAGE].message ? requestStatus[MESSAGE].message : '';
                    ToastsStore.error("Validation error, Please try again", 3000);
                    break;
            }
        }

        const prevrequestSkipStatus = prevProps && prevProps.pending_order_skip_request ? prevProps.pending_order_skip_request : {};
        if (requestSkipStatus[STATUS] !== prevrequestSkipStatus[STATUS]) {
            switch (requestSkipStatus[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("Order successfully skip", 3000);
                    window.$("#close_order_skip").click();
                    ClearRedux()
                    this.refillListRedraw()
                    updateOrderUIConstraints({
                        [REFILL_ORDER_SKIP_REQUEST]: {
                            [STATUS]: EMPTY,
                            [MESSAGE]: ""
                        },
                    })
                    break;
                case TOKEN_NOT_FOUND:
                    ToastsStore.error("Token not available, Please try again", 3000);
                    break;
                case ERROR:
                    // const status = requestStatus[MESSAGE] && requestStatus[MESSAGE].message ? requestStatus[MESSAGE].message : '';
                    ToastsStore.error("Validation error, Please try again", 3000);
                    break;
            }
        }

        const prevrequestApproveStatus = prevProps && prevProps.pending_order_approve_request ? prevProps.pending_order_approve_request : {};
        if (requestApproveStatus[STATUS] !== prevrequestApproveStatus[STATUS]) {
            switch (requestApproveStatus[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("Order successfully Approve", 3000);
                    window.$("#close_order_approve_id").click();
                    ClearRedux()
                    this.pendingListRedraw()
                    break;
                case TOKEN_NOT_FOUND:
                    ToastsStore.error("Token not available, Please try again", 3000);
                    break;
                case ERROR:
                    // const status = requestStatus[MESSAGE] && requestStatus[MESSAGE].message ? requestStatus[MESSAGE].message : '';
                    ToastsStore.error("Validation error, Please try again", 3000);
                    break;
            }
        }


        const prevExportOrderRequestStatus = prevProps && prevProps.requestStatus ? prevProps.requestStatus : {};
        console.log("requestStatus  ==  > >.  .",requestStatus)
		if (requestStatus[STATUS] !== prevExportOrderRequestStatus[STATUS]) {
			switch (requestStatus[STATUS]) {
				case SUCCESS:
					ToastsStore.success("File exported successfully!", 3000);
					break;
				case TOKEN_NOT_FOUND:
					ToastsStore.error("Token not available, Please try again", 3000);
					break;
				case ERROR:
					const status = requestStatus[MESSAGE] && requestStatus[MESSAGE].message ? requestStatus[MESSAGE].message : '';

					switch (status) {
						case SERVER_VALIDATION_ERROR:
							ToastsStore.error("Validation error, Please try again", 3000);
							break;
						case SERVER_NO_VALUE:
							ToastsStore.error("No products available", 3000);
							break;
						default:
					}
					break;
			}
		}
    }


    exportCSVFile = () => {
		const { exportOrders } = this.props;
		exportOrders();
	}

    init = () => {
        const { updateSystemData, table_Id,table_type } = this.props;

        updateSystemData({
            [SYSTEM_DATA_PAGE_TITLE]: "Refill | Order List"
        });
        
        if(table_Id){
            this._handle_table_row(table_Id,table_type)
        }
    }

    // handel tab function
    
    _handle_table_row = (table_Id,table_type) => {
        window.$(`#${table_type}`).click()
        // switch (table_type) {
        //     case 'pendingList':
        //         return this.pending_list();
        //     case 'activeList':
        //         return this.active_list();
        //     case 'pastList':
        //         return this.past_list();
        //     case 'refillList':
        //         return this.refill_list();
        // }
    }


    // Active List
    active_list = function () {
        const { user_token, updateDeleteProductFormData, table_Id } = this.props;
        const that = this;
        var order_status = "active"
        var table = window.$(`#active_list`);
        var redraw = function () {
            table.draw();
        }

        // begin first table
        table.DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            ajax: {
                url: getOrderDataTables(),
                type: 'POST',
                data: { user_token, order_status },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", getAuthoriztionToken());
                }
            },
            columns: [
                { data: 'full._id' },
                { data: 'full.customerDetail.name' },
                { data: 'full.productDetail.name' },
                { data: 'full.createAt' },
                { data: 'full.totalPrice' },
                { data: 'full.orderType' },
                { data: 'full.customerDetail.address' },
                { data: 'full.customerDetail.companyAddress' },
                { data: 'full.orderStatus' },
                { data: 'Actions' },
            ],
            columnDefs: [
                {
                    targets: -1,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return `
                   
						<script>
							function cancelActiveOrderId(id){
                                $("#confirm_active_order_id").data("data-active-order-id",id)
								
                            }
                            function ShipOrderId(id){
								$("#order_ship").data("data-order-ship", id);
                            }
                            
                            function assignDriver(){
                                $("#order_ship").modal('show'); 
                            }
                            function getOrderView(id){
								$("#order_view_btn").data("data-users-view", id);
								$("#order_view_btn").click();
							}
                        </script>
                        
                        ${full.orderStatus === "processed"
                                ?
                                '<button type="button" data-toggle="modal" data-target="#active_order_id"  class="btn btn-sm btn-clean btn-icon btn-icon-md" id="' + full._id + '" onClick="cancelActiveOrderId(this.id)"><i class="far fa-window-close"></i></button>'
                                :
                                ""
                            }
                        
                        ${full.productDriver
                                ?
                                ""
                                :
                                '<button type="button" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="modal" data-target="#order_ship" id="' + full._id + '" onClick="ShipOrderId(this.id)"><i class="fas fa-shipping-fast"></i></button>'
                            } 
                        <button type="button" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="${full._id}" data-target="#users_view" onClick="getOrderView(this.id)" >
                        <a><i class="far fa-eye"></i></a>
                        </button>
                    `;
                    },
                },
                {
                    targets: -2,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        const status = full.orderStatus === "processed" ? "Approved" : full.orderStatus
                        return '<span class="kt-font-bold">' + status + '</span>';
                    },
                },
                {
                    targets: -3,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.customerDetail.billingAddress.fullAddress + '</span>';
                    },
                },
                {
                    targets: -4,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.customerDetail.shippingAddress.fullAddress + '</span>';
                    },
                },
                {
                    targets: -5,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.orderType + '</span>';
                    },
                },
                {
                    targets: -6,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.totalPrice + '</span>';
                    },
                },
                {
                    targets: -7,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + moment(full.createAt).format('DD/MM/YYYY') + '</span>';
                    },
                },
                {
                    targets: -8,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.productDetail.name + '</span>';
                    },
                },
                {
                    targets: -9,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + (full.customerDetail.name === undefined ? 'NA' : full.customerDetail.name) + '</span>';
                    },
                },
                {
                    targets: -10,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full._id + '</span>';
                    },
                },

            ],
        });
    };

    activeListRedraw = function () {
        var table = window.$('#active_list').DataTable();
        table.draw();
    }
    // Pending List
    pending_list = function () {

        const { user_token, updateDeleteProductFormData, table_Id } = this.props;
        const that = this;
        var order_status = "pending"
        var table = window.$('#pending_list');
        var redraw = function () {
            table.draw();
        }

        // begin first table
        table.DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            ajax: {
                url: getOrderDataTables(),
                type: 'POST',
                data: { user_token, order_status },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", getAuthoriztionToken());
                }
            },
            columns: [
                { data: 'full._id' },
                { data: 'full.customerDetail.name' },
                { data: 'full.productDetail.name' },
                { data: 'full.createAt' },
                { data: 'full.totalPrice' },
                { data: 'full.orderType' },
                { data: 'full.customerDetail.address' },
                { data: 'full.customerDetail.companyAddress' },
                { data: 'full.orderStatus' },
                { data: 'Actions' },
            ],
            columnDefs: [
                {
                    targets: -1,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return `
                       
						<script>
							function getOrderId(id){
                                $("#confirm_order_id").data("data-order-id", id);
                            }
                            
                            function getapproveOrderId(id){
                                $("#confirm_order_approve_id").data("data-order-approve-id", id);
                            }
                            function getOrderView(id){
								$("#order_view_btn").data("data-users-view", id);
								$("#order_view_btn").click();
							}
						</script>
                        <button type="button" data-toggle="modal" data-target="#order_id" class="btn btn-sm btn-clean btn-icon btn-icon-md"   id="${full._id}" onClick="getOrderId(this.id)">
                        <i class="far fa-window-close"></i>
                        </button>
                      
                        <button type="button" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="modal" data-target="#order_approve_id"  id="${full._id}" onClick="getapproveOrderId(this.id)" >
                        <i class="fas fa-check"></i>
                        <button type="button" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="${full._id}" data-target="#users_view" onClick="getOrderView(this.id)" >
                        <a><i class="far fa-eye"></i></a>
                        </button>
                    </button>
                    `;
                    },
                },
                {
                    targets: -2,
                    orderable: false,
                    render: function (data, type, full, meta) {

                        return '<span class="kt-font-bold">' + full.orderStatus + '</span>';
                    },
                },
                {
                    targets: -3,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.customerDetail.billingAddress.fullAddress + '</span>';
                    },
                },
                {
                    targets: -4,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.customerDetail.shippingAddress.fullAddress + '</span>';
                    },
                },
                {
                    targets: -5,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.orderType + '</span>';
                    },
                },
                {
                    targets: -6,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.totalPrice + '</span>';
                    },
                },
                {
                    targets: -7,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + moment(full.createAt).format('DD/MM/YYYY') + '</span>';
                    },
                },
                {
                    targets: -8,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.productDetail.name  + '</span>';
                    },
                },
                {
                    targets: -9,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + (full.customerDetail.name === undefined ? 'NA' : full.customerDetail.name) + '</span>';
                    },
                },
                {
                    targets: -10,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full._id + '</span>';
                    },
                },
            ],
        });
    };

    pendingListRedraw = function () {
        var table = window.$('#pending_list').DataTable();
        table.draw();
        this.activeListRedraw()
    }

    // Refill List
    refill_list = function () {

        const { user_token, updateDeleteProductFormData, table_Id } = this.props;
        const that = this;
        var order_status = "refill"
        var table = window.$('#refill_list');
        var redraw = function () {
            table.draw();
        }

        // begin first table
        table.DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            ajax: {
                url: getOrderDataTables(),
                type: 'POST',
                data: { user_token, order_status },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", getAuthoriztionToken());
                }
            },
            columns: [
                { data: 'full._id' },
                { data: 'full.customerDetail.name' },
                { data: 'full.productDetail.name' },
                { data: 'full.createAt' },
                { data: 'full.place_order_date_iso' },
                { data: 'full.totalPrice' },
                { data: 'full.orderType' },
                { data: 'full.customerDetail.address' },
                { data: 'full.customerDetail.companyAddress' },
                { data: 'full.orderStatus' },
                { data: 'Actions' },
            ],
            columnDefs: [
                {
                    targets: -1,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return `
                   
						<script>
							function skipOrderId(id){
								$("#confirm_order_skip").data("data-order-skip", id);
                            }
                            function cancelOrderId(id){
                               
                                $("#confirm_order_refill_cancel").data("data-order-refill-cancel", id);
                            }
                            function getOrderView(id){
								$("#order_view_btn").data("data-users-view", id);
								$("#order_view_btn").click();
							}
                        </script>
                        <button type="button" data-toggle="modal" data-target="#order_refill_cancel" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="${full.uuid}" onClick="cancelOrderId(this.id)">
                        <i class="far fa-window-close"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="${full._id}" data-target="#users_view" onClick="getOrderView(this.id)" >
                        <a><i class="far fa-eye"></i></a>
                        </button>
                    `;
                    },
                },
                {
                    targets: -2,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.orderStatus + '</span>';
                    },
                },
                {
                    targets: -3,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.customerDetail.billingAddress.fullAddress + '</span>';
                    },
                },
                {
                    targets: -4,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.customerDetail.shippingAddress.fullAddress + '</span>';
                    },
                },
                {
                    targets: -5,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.orderType + '</span>';
                    },
                },
                {
                    targets: -6,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.totalPrice + '</span>';
                    },
                },
                {
                    targets: -7,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + moment(full.place_order_date_iso).format('DD/MM/YYYY') + '</span>';
                    },
                },
                {
                    targets: -8,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + moment(full.createAt).format('DD/MM/YYYY') + '</span>';
                    },
                },
                {
                    targets: -9,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.productDetail.name  + '</span>';
                    },
                },
                {
                    targets: -10,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + (full.customerDetail.name === undefined ? 'NA' : full.customerDetail.name) + '</span>';
                    },
                },
                {
                    targets: -11,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full._id + '</span>';
                    },
                },
            ],
        });
    };

    refillListRedraw = function () {
        var table = window.$('#refill_list').DataTable();
        table.draw();
    }


    // Past list
    past_list = function () {

        const { user_token, updateDeleteProductFormData, table_Id } = this.props;
        const that = this;
        var order_status = "past"
        var table = window.$('#past_list');
        var redraw = function () {
            table.draw();
        }

        // begin first table
        table.DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            ajax: {
                url: getOrderDataTables(),
                type: 'POST',
                data: { user_token, order_status },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", getAuthoriztionToken());
                }
            },
            columns: [
                { data: 'full._id' },
                { data: 'full.customerDetail.name' },
                { data: 'full.productDetail.name' },
                { data: 'full.createAt' },
                { data: 'full.totalPrice' },
                { data: 'full.orderType' },
                { data: 'full.customerDetail.address' },
                { data: 'full.customerDetail.companyAddress' },
                { data: 'full.orderStatus' },
                { data: 'Action' },
            ],
            columnDefs: [
                {
                    targets: -1,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return `
                         <script>
                            function getOrderView(id){
                                $("#order_view_btn").data("data-users-view", id);
                                $("#order_view_btn").click();
                                }
                         </script>
                         <button type="button" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="${full._id}" data-target="#users_view" onClick="getOrderView(this.id)" >
                        <a><i class="far fa-eye"></i></a>
                        </button>
                    `;
                    },
                },
                {
                    targets: -2,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.orderStatus + '</span>';
                    },
                },
                {
                    targets: -3,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.customerDetail.billingAddress.fullAddress + '</span>';
                    },
                },
                {
                    targets: -4,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.customerDetail.shippingAddress.fullAddress + '</span>';
                    },
                },
                {
                    targets: -5,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.orderType + '</span>';
                    },
                },
                {
                    targets: -6,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.totalPrice + '</span>';
                    },
                },
                {
                    targets: -7,
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + moment(full.createAt).format('DD/MM/YYYY') + '</span>';
                    },
                },
                {
                    targets: -8,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full.productDetail.name + '</span>';
                    },
                },
                {
                    targets: -9,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + (full.customerDetail.name === undefined ? 'NA' : full.customerDetail.name) + '</span>';
                    },
                },
                {
                    targets: -10,
                    render: function (data, type, full, meta) {
                        return '<span class="kt-font-bold">' + full._id + '</span>';
                    },
                }
            ],
        });
    };

    pastListRedraw = function () {
        var table = window.$('#past_list').DataTable();
        table.draw();
    }

    redraw = function () {
        const { table_Id } = this.props
        var table = window.$(`#${table_Id}`).DataTable();
        table.draw();
    }

    onChangeText = (key, value) => {
        const { updateEditOrderFormData } = this.props;

        updateEditOrderFormData({
            [key]: value
        });
    }

    onChangeDriver = (key, value) => {
        const { updateAssignDriver, updateOrderUIConstraints } = this.props;
        updateOrderUIConstraints({
            [REFILL_ORDER_SKIP_REQUEST]: {
                [STATUS]: EMPTY,
                [MESSAGE]: ""
            },
            [PENDING_ORDER_CANCEL_REQUEST]: {
                [STATUS]: EMPTY,
                [MESSAGE]: ""
            },
            [REFILL_ORDER_SHIP_REQUEST]: {
                [STATUS]: EMPTY,
                [MESSAGE]: ""
            },
            [PENDING_ORDER_APPROVE_REQUEST]: {
                [STATUS]: EMPTY,
                [MESSAGE]: ""
            },
            [REFILL_ORDER_CANCEL_REQUEST]: {
                [STATUS]: EMPTY,
                [MESSAGE]: ""
            },
        });

        updateAssignDriver({
            [key]: value
        });
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
        const { driver_id, user_token, updateDriverUIConstraints, updateOrderUIConstraints } = this.props
        this.onChangeDriver(ASSIGN_DRIVER_LOADING, true)
        const body = {
            driver_id: driver_id,
            user_token: user_token,
            order_id: window.$("#order_ship").data("data-order-ship")
        }

        refillOrderShip(body).then((res) => {
            window.$("#close_order_ship").click();
            ToastsStore.success("Order successfully ship", 3000);
            updateDriverUIConstraints({
                [DRIVER_REQUEST_STATUS]: {
                    [STATUS]: SUCCESS,
                    [MESSAGE]: ""
                },
                [DRIVER_REQUEST_LOADING]: false
            })
            this.activeListRedraw()
            this.onChangeDriver(ASSIGN_DRIVER_LOADING, false)
        }).catch((error) => {
            this.onChangeDriver(ASSIGN_DRIVER_LOADING, false)
        })
    }

    openScreen = () => {
        const { history } = this.props;
        const id = window.$("#order_view_btn").data("data-users-view");
        history.push(`/order/view/${id}`);
    }

    markHash = (hash,table_type) => {
        const { updateOrderUIConstraints } = this.props
        
        window.location.href=hash;
        window.scroll({
            top: 0
        })
        updateOrderUIConstraints({
            [TABLE_ID]:hash,
            [TABLE_TYPE]:table_type
        })

        this._handle_table_row(hash,table_type)
    }

    render() {
        const { updateOrderUIConstraints, exportLoading, driverLoading, cancelrefillLoading, CancelRefillOrder, quantity, CancelOrder, ApproveOrder, SkipOrder, table_Id, table_type, cancelLoading, skipLoading, shipLoading, approveLoading } = this.props;
        return (

            <div className="kt-body kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-grid--stretch" id="kt_body">
                <div className="kt-container  kt-container--fluid  kt-grid kt-grid--ver">
                    <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                        <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                            <div className="kt-container  kt-container--fluid ">
                                <div className="kt-subheader__main">
                                    <h3 className="kt-subheader__title">
                                        Order Management </h3>
                                    <span className="kt-subheader__separator kt-hidden"></span>
                                    <div className="kt-subheader__breadcrumbs">
                                        <a href="#" className="kt-subheader__breadcrumbs-home">
                                            <i className="flaticon2-shelter"></i></a>
                                        <span className="kt-subheader__breadcrumbs-separator"></span>
                                        <a className="kt-subheader__breadcrumbs-link">List </a>
                                    </div>
                                </div>
                                <div className="kt-subheader__toolbar">
                                    <div className="kt-subheader__wrapper">
                                        <button type="button" className="btn btn-outline-brand" onClick={this.refresh.bind(this)}>
                                            <i className="flaticon2-refresh-button"></i>
                                            Refresh
                                </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

                            <div class="kt-portlet kt-portlet--tabs">
                                <div class="kt-portlet__head">
                                    <div class="kt-portlet__head-toolbar">
                                        <ul class="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-tabs-bold nav-tabs-line-3x nav-tabs-line-brand" role="tablist">
                                            <li class="nav-item">
                                                <a class="nav-link active" data-toggle="tab" role="tab" id="pendingList" href="#kt_apps_contacts_view_tab_1" onClick={this.markHash.bind(this, "#kt_apps_contacts_view_tab_1","pendingList")}>
                                                    Pending
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link " data-toggle="tab" id="activeList" href="#kt_apps_contacts_view_tab_2" onClick={this.markHash.bind(this, "#kt_apps_contacts_view_tab_2","activeList")} role="tab">
                                                    Active
										</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link " data-toggle="tab" href="#kt_apps_contacts_view_tab_3" id="refillList" onClick={this.markHash.bind(this, "#kt_apps_contacts_view_tab_3","refillList")} role="tab">
                                                    Refill
										</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link " data-toggle="tab" id="pastList" href="#kt_apps_contacts_view_tab_4" onClick={this.markHash.bind(this, "#kt_apps_contacts_view_tab_4","pastList")} role="tab">
                                                    Past
										</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="kt-portlet__body">
                                    <div class="tab-content  kt-margin-t-20">

                                        {/* <!--Begin:: Tab Content--> */}
                                        <div class="tab-pane active" id="kt_apps_contacts_view_tab_1" role="tabpanel">
                                            <Table 
                                            type="pending" 
                                            table_id="pending_list" 
                                            exportOrdersLoading={exportLoading}
					                        exportCSVFileData={this.exportCSVFile}
                                            />
                                            <ConfirmAlert
                                                _id={"order_approve_id"}
                                                label="Confirm"
                                                loading={approveLoading}
                                                description={"Are you sure to approve the order?"}
                                                confirm_btn={"Continue"}
                                                onConfirm={() => {
                                                    ApproveOrder(
                                                        window.$("#confirm_order_approve_id").data("data-order-approve-id"),
                                                    );
                                                }}
                                            />
                                            <ConfirmAlert
                                                _id={"order_id"}
                                                label="Confirm"
                                                loading={cancelLoading}
                                                description={"Are you sure to cancel the order?"}
                                                confirm_btn={"Continue"}
                                                onConfirm={() => {
                                                    CancelOrder(
                                                        window.$("#confirm_order_id").data("data-order-id"),
                                                    );
                                                }}
                                            />
                                        </div>
                                        {/* <!--End:: Tab Content--> */}
                                        {/* <!--Begin:: Tab Content--> */}
                                        <div class="tab-pane" id="kt_apps_contacts_view_tab_2" role="tabpanel">
                                            <Table type="active" table_id="active_list" />
                                            <ConfirmAlert
                                                _id={"active_order_id"}
                                                label="Confirm"
                                                loading={cancelLoading}
                                                description={"Are you sure to cancel the order?"}
                                                confirm_btn={"Continue"}
                                                onConfirm={() => {
                                                    CancelOrder(
                                                        window.$("#confirm_active_order_id").data("data-active-order-id"),
                                                    );
                                                }}
                                            />
                                        </div>

                                        <div class="tab-pane" id="kt_apps_contacts_view_tab_3" role="tabpanel">
                                            <Table type="refill" table_id="refill_list" />
                                            <ConfirmAlert
                                                _id={"order_skip"}
                                                label="Confirm"
                                                loading={skipLoading}
                                                description={"Are you sure to skip the order?"}
                                                confirm_btn={"Continue"}
                                                onConfirm={() => {
                                                    SkipOrder(
                                                        window.$("#confirm_order_skip").data("data-order-skip"),
                                                    );
                                                }}
                                            />
                                            <ConfirmAlert
                                                _id={"order_refill_cancel"}
                                                label="Confirm"
                                                loading={cancelrefillLoading}
                                                description={"Are you sure to cancel the order?"}
                                                confirm_btn={"Continue"}
                                                onConfirm={() => {
                                                    CancelRefillOrder(
                                                        window.$("#confirm_order_refill_cancel").data("data-order-refill-cancel")
                                                    );
                                                }}
                                            />
                                        </div>

                                        <div class="tab-pane" id="kt_apps_contacts_view_tab_4" role="tabpanel">
                                            <Table type="past" table_id="past_list" />
                                        </div>
                                        {/* <!--End:: Tab Content--> */}
                                    </div>
                                </div>
                            </div>
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
                            {/* order view model */}
                            <button id="order_view_btn" className="d-none" onClick={this.openScreen.bind(this)} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(({ user, users, order, driver }) => {
    const { order_key } = order
    const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
    const order_data = order[ORDER_KEY] ? order[ORDER_KEY] : undefined;
    const driver_data = driver[DRIVER_KEY] ? driver[DRIVER_KEY] : undefined;
    const assign_driver_data = driver[DRIVER_KEY][ASSIGN_DRIVER_KEY] ? driver[DRIVER_KEY][ASSIGN_DRIVER_KEY] : undefined;
    Utils.log("order data === >", order_data[PENDING_ORDER_CANCEL_LOADING])
    console.log("requestStatus  ==  > >.  .",order_data[ORDER_REQUEST_STATUS])
    return ({
        user_token: user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false,
        table_Id: order_key[TABLE_ID],
        table_type: order_key[TABLE_TYPE],
        quantity: order_data.edit_order_form.edit_order_quantity,
        loading: order_data.edit_order_form.edit_order_form_loading,
        approveLoading: order_data[PENDING_ORDER_APPROVE_LOADING],
        cancelLoading: order_data[PENDING_ORDER_CANCEL_LOADING],
        cancelrefillLoading: order_data[REFILL_ORDER_CANCEL_LOADING],
        skipLoading: order_data[REFILL_ORDER_SKIP_LOADING],
        shipLoading: order_data[REFILL_ORDER_SHIP_LOADING],
        
        driver_id: assign_driver_data[ASSIGN_DRIVER_ID],
        driverLoading: assign_driver_data[ASSIGN_DRIVER_LOADING],
        errors: driver_data[ASSIGN_DRIVER_ERROR],

        requestStatus: order_data[ORDER_REQUEST_STATUS],
        exportLoading : order_data[ORDER_REQUEST_LOADING] ,

        requestApproveStatus: order_data[PENDING_ORDER_APPROVE_REQUEST],
        requestPendingCancelStatus: order_data[PENDING_ORDER_CANCEL_REQUEST],
        requestRefillCancelStatus: order_data[REFILL_ORDER_CANCEL_REQUEST],
        requestSkipStatus: order_data[REFILL_ORDER_SKIP_REQUEST],
    })
},
    {
        updateSystemData,
        updateOrderState,
        updateEditOrderFormData,
        updateOrderUIConstraints,
        CancelOrder,
        ApproveOrder,
        SkipOrder,
        updateAssignDriver,
        updateDriverUIConstraints,
        CancelRefillOrder,
        ClearRedux,
        exportOrders
    })(List);