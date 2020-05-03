import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../components/dashboard/category'
import { getAuthoriztionToken, getCategoriesDataTables, getSubCategoriesDataTables, refillDisableCategory } from '../../../apis/APIs.js'
import { connect } from 'react-redux'
import { USER_KEY, USER_DATA, SYSTEM_DATA_PAGE_TITLE, ACTIVE, CATEGORY_KEY, CATEGORY_REQUEST_STATUS, ENABLE_CATEGORY_REQUEST_STATUS, DISABLE_CATEGORY_REQUEST_STATUS, ENABLE_CATEGORY_REQEUST_LOADING, SUCCESS, STATUS, TOKEN_NOT_FOUND, ERROR, SERVER_VALIDATION_ERROR, SERVER_NO_VALUE, MESSAGE, DISABLE_CATEGORY_REQEUST_LOADING, ENABLE_SUB_CATEGORY_REQEUST_LOADING, DISABLE_SUB_CATEGORY_REQUEST_STATUS, ENABLE_SUB_CATEGORY_REQUEST_STATUS, DISABLE_SUB_CATEGORY_REQEUST_LOADING, EMPTY } from '../../../redux/Types.js'
import moment from 'moment';
import { updateSystemData } from '../../../redux/system/Action'
import { ConfirmAlert } from '../../../components/base_components'
import { enableCategory, disableCategory, disableSubCategory, enableSubCategory,updateCategoryUIConstraints } from '../../../redux/category/Action'
import { ToastsStore } from 'react-toasts'
import Utils from '../../../components/util/Utils'

class List extends PureComponent {
    static propTypes = {

    }

    constructor(){
        super()
        this.state={
            textStatus:""
        }
    }

    _openPage = (url) => {
        const { history } = this.props;

        if (!url) return;

        history.push(url);
    }

    componentDidMount = () => {
        this.category_list();
        this.sub_category_list();
        this.init();
    }

    init = () => {
        const { updateSystemData } = this.props;

        updateSystemData({
            [SYSTEM_DATA_PAGE_TITLE]: "Refill | Category List"
        });
    }

    dataApi = () => {
    }

    category_list = function () {
        var table = window.$('#category_list');
        const { user_token } = this.props;
        const that = this;

        var redraw = function () {
            table.draw();
        }

        // begin first table
        table.DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            ajax: {
                url: getCategoriesDataTables(),
                type: 'POST',
                data: { user_token },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", getAuthoriztionToken());
                }
            },
            columns: [
                { data: '_id' },
                { data: 'name' },
                { data: 'created_at' },
                { data: 'Actions' },
            ],
            columnDefs: [
                {
                    targets: -1,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        Utils.log(full)
                        return `
                        <script>
                            function deleteCategoryId(id, status){
                                $("#confirm_category_delete").data("data-category-id", id);
                                $("#confirm_category_delete").data("data-category-name", status);
                                $("#category_delete_btn").click();
                            }
                        </script>
                        <button class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="modal" data-target="#category_delete" id="${full._id}" name="${full.status}" onClick="deleteCategoryId(this.id, this.name)">
                          ${
                            full.status === ACTIVE ?
                                '<i class="fa fa-lock" style="color: red;"></i>' :
                                '<i class="fa fa-unlock"></i>'
                            }
                        </button>
                    `;
                    },
                },
                {
                    targets: -2,
                    render: function (data, type, full, meta) {

                        return '<span class="kt-font-bold">' + moment(data).format('DD/MM/YYYY') + '</span>';
                    },
                },
                {
                    targets: -4,
                    render: function (data, type, full, meta) {

                        return '<span class="kt-font-bold">' + data ? `...${data.substring(data.length - 8, data.length)}` : 'No ID Found' + '</span>';
                    },
                }
            ],
        });
    };

    sub_category_list = function () {
        var table = window.$('#sub_category_list');
        const { user_token } = this.props;

        // begin first table
        table.DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            ajax: {
                url: getSubCategoriesDataTables(),
                type: 'POST',
                data: { user_token },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", getAuthoriztionToken());
                }
            },
            columns: [
                { data: '_id' },
                { data: 'categoryId' },
                { data: 'name' },
                { data: 'created_at' },
                { data: 'Actions', responsivePriority: -1 },
            ],
            columnDefs: [
                {
                    targets: -1,
                    title: 'Actions',
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return `
                        <script>
                            function deleteSubCategoryId(id, name){
                                var category = name ? name.split('-')[0] : "";
                                var status = name ? name.split('-')[1] : ""; 
                                $("#confirm_sub_category_delete").data("data-sub-category-id", id);
                                $("#confirm_sub_category_delete").data("data-sub-category-category-id", category);
                                $("#confirm_sub_category_delete").data("data-sub-category-status", status);
                                $("#subcategory_delete_btn").click();
                            }
                        </script>
                        <button class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="modal" data-target="#sub_category_delete" id="${full._id}" name="${full.categoryId}-${full.status}" onClick="deleteSubCategoryId(this.id, this.name)">
                          ${
                            full.status === ACTIVE ?
                                '<i class="fa fa-lock" style="color: red;"></i>' :
                                '<i class="fa fa-unlock"></i>'
                            }
                        </button>`;
                    },
                },
                {
                    targets: -2,
                    render: function (data, type, full, meta) {

                        return '<span class="kt-font-bold">' + moment(data).format('DD/MM/YYYY') + '</span>';
                    },
                },
                {
                    targets: -4,
                    render: function (data, type, full, meta) {

                        return '<span class="kt-font-bold">' + data ? `...${data.substring(data.length - 8, data.length)}` : 'No ID Found' + '</span>';
                    },
                },
                {
                    targets: -5,
                    render: function (data, type, full, meta) {

                        return '<span class="kt-font-bold">' + data ? `...${data.substring(data.length - 8, data.length)}` : 'No ID Found' + '</span>';
                    },
                }
            ]
        });
    };

    redraw = function () {
        var table = window.$('#category_list').DataTable();
        table.draw();
    }

    subCategoryredraw = function () {
        var table = window.$('#sub_category_list').DataTable();
        table.draw();
    }

    componentDidUpdate = (prevProps) => {
        const {updateCategoryUIConstraints, enable_category_request, disable_category_request, history, enable_sub_category_request, disable_sub_category_request } = this.props;

        const prevReqeustStatus = prevProps && prevProps.enable_category_request ? prevProps.enable_category_request : {};
        if (enable_category_request[STATUS] !== prevReqeustStatus[STATUS]) {
            switch (enable_category_request[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("Category successfully enabled", 3000);
                    window.$("#close_category_delete").click();
                    this.redraw();
                    updateCategoryUIConstraints({
                        
                    })
                    break;
                case TOKEN_NOT_FOUND:
                    ToastsStore.error("Token not available, Please try again", 3000);
                    break;
                case ERROR:
                    const status = enable_category_request[MESSAGE] && enable_category_request[MESSAGE].message ? enable_category_request[MESSAGE].message : '';

                    switch (status) {
                        case SERVER_VALIDATION_ERROR:
                            ToastsStore.error("Validation error, Please try again", 3000);
                            break;
                        case SERVER_NO_VALUE:
                            ToastsStore.error("Product not Found, Please try again", 3000);
                            break;
                        default:
                    }
                    break;
            }
        }

        const prevDisableCategoryReqeustStatus = prevProps && prevProps.disable_category_request ? prevProps.disable_category_request : {};
        if (disable_category_request[STATUS] !== prevDisableCategoryReqeustStatus[STATUS]) {
            switch (disable_category_request[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("Category successfully disabled", 3000);
                    window.$("#close_category_delete").click();
                    this.redraw();
                    break;
                case TOKEN_NOT_FOUND:
                    ToastsStore.error("Token not available, Please try again", 3000);
                    break;
                case ERROR:
                    const status = disable_category_request[MESSAGE] && disable_category_request[MESSAGE].message ? disable_category_request[MESSAGE].message : '';

                    switch (status) {
                        case SERVER_VALIDATION_ERROR:
                            ToastsStore.error("Validation error, Please try again", 3000);
                            break;
                        case SERVER_NO_VALUE:
                            ToastsStore.error("Product not Found, Please try again", 3000);
                            break;
                        default:
                    }
                    break;
            }
        }


        const prevsubReqeustStatus = prevProps && prevProps.enable_sub_category_request ? prevProps.enable_sub_category_request : {};
        if (enable_sub_category_request[STATUS] !== prevsubReqeustStatus[STATUS]) {
            switch (enable_sub_category_request[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("SubCategory successfully enabled", 3000);
                    window.$("#close_sub_category_delete").click();
                    this.subCategoryredraw();
                    break;
                case TOKEN_NOT_FOUND:
                    ToastsStore.error("Token not available, Please try again", 3000);
                    break;
                case ERROR:
                    const status = enable_sub_category_request[MESSAGE] && enable_sub_category_request[MESSAGE].message ? enable_sub_category_request[MESSAGE].message : '';

                    switch (status) {
                        case SERVER_VALIDATION_ERROR:
                            ToastsStore.error("Validation error, Please try again", 3000);
                            break;
                        case SERVER_NO_VALUE:
                            ToastsStore.error("Product not Found, Please try again", 3000);
                            break;
                        default:
                    }
                    break;
            }
        }

        const prevDisablesubCategoryReqeustStatus = prevProps && prevProps.disable_sub_category_request ? prevProps.disable_sub_category_request : {};
        if (disable_sub_category_request[STATUS] !== prevDisablesubCategoryReqeustStatus[STATUS]) {
            switch (disable_sub_category_request[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("SubCategory successfully disabled", 3000);
                    window.$("#close_sub_category_delete").click();
                    this.subCategoryredraw();
                    break;
                case TOKEN_NOT_FOUND:
                    ToastsStore.error("Token not available, Please try again", 3000);
                    break;
                case ERROR:
                    const status = disable_sub_category_request[MESSAGE] && disable_sub_category_request[MESSAGE].message ? disable_sub_category_request[MESSAGE].message : '';

                    switch (status) {
                        case SERVER_VALIDATION_ERROR:
                            ToastsStore.error("Validation error, Please try again", 3000);
                            break;
                        case SERVER_NO_VALUE:
                            ToastsStore.error("Product not Found, Please try again", 3000);
                            break;
                        default:
                    }
                    break;
            }
        }
    }

    openCategoryDeleteScreen(){
        const {textStatus} = this.state
        if(window.$("#confirm_category_delete").data("data-category-name") === `${ACTIVE}`){
            this.setState({
                textStatus:"Are you sure you want to disable category"
            })
        }else{
            this.setState({
                textStatus:"Are you sure you want to enable category"
            })
        }

    }

    openSubCategoryDeleteScreen(){
        if(window.$("#confirm_sub_category_delete").data("data-sub-category-status") === `${ACTIVE}`){
            this.setState({
                textStatus:"Are you sure you want to disable subcategory"
            })
        }else{
            this.setState({
                textStatus:"Are you sure you want to enable subcategory"
            })
        }
    }

    render() {
        const { disableCategory, enableCategory, enable_category_loading, disable_category_loading, enable_sub_category_loading, disable_sub_category_loading, enableSubCategory, disableSubCategory } = this.props;
        return (
            <div class="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                {/* <!-- begin:: Subheader --> */}
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Category </h3>
                            <span className="kt-subheader__separator kt-hidden"></span>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a  className="kt-subheader__breadcrumbs-link">
                                    List </a>
                            </div>
                        </div>
                        <div class="kt-subheader__toolbar">
                            <div class="kt-subheader__wrapper">
                                <button type="button" class="btn btn-outline-brand" onClick={this._openPage.bind(this, '/category/add')}>
                                    <i class="la la-plus"></i>
                                    Add Category
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- end:: Subheader --> */}

                {/* <!-- begin:: Content --> */}
                <div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

                    {/* <!--Begin:: Portlet--> */}
                    <div class="kt-portlet kt-portlet--tabs">
                        <div class="kt-portlet__head">
                            <div class="kt-portlet__head-toolbar">
                                <ul class="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-tabs-bold nav-tabs-line-3x nav-tabs-line-brand" role="tablist">
                                    <li class="nav-item">
                                        <a class="nav-link active" data-toggle="tab" href="#kt_apps_contacts_view_tab_2" role="tab">
                                            Category
														</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link " data-toggle="tab" href="#kt_apps_contacts_view_tab_3" role="tab">
                                            Sub-Category
														</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="kt-portlet__body">
                            <div class="tab-content  kt-margin-t-20">

                                {/* <!--Begin:: Tab Content--> */}
                                <div class="tab-pane active" id="kt_apps_contacts_view_tab_2" role="tabpanel">
                                
                                    <Table type="category" table_id="category_list" />
                                    <ConfirmAlert
                                        _id={"category_delete"}
                                        label="Confirm"
                                        loading={enable_category_loading || disable_category_loading}
                                        description={this.state.textStatus}
                                        confirm_btn={"Continue"}
                                        onConfirm={() => {
                                            // alert(window.$("#confirm_category_delete").data("data-category-id"));
                                            if (window.$("#confirm_category_delete").data("data-category-name") === `${ACTIVE}`) {
                                                disableCategory(window.$("#confirm_category_delete").data("data-category-id"));
                                            } else {
                                                enableCategory(window.$("#confirm_category_delete").data("data-category-id"));
                                            }
                                        }}
                                    />
                                </div>

                                {/* <!--End:: Tab Content--> */}

                                {/* <!--Begin:: Tab Content--> */}
                                <div class="tab-pane" id="kt_apps_contacts_view_tab_3" role="tabpanel">
                                    <Table type="sub_category" table_id="sub_category_list" />
                                    <ConfirmAlert
                                        _id={"sub_category_delete"}
                                        label="Confirm"
                                        loading={enable_sub_category_loading || disable_sub_category_loading}
                                        description={this.state.textStatus}
                                        confirm_btn={"Continue"}
                                        onConfirm={() => {
                                            if (window.$("#confirm_sub_category_delete").data("data-sub-category-status") === `${ACTIVE}`) {
                                                disableSubCategory({
                                                    category_id: window.$("#confirm_sub_category_delete").data("data-sub-category-category-id"),
                                                    sub_category_id: window.$("#confirm_sub_category_delete").data("data-sub-category-id")
                                                });
                                            } else {
                                                enableSubCategory({
                                                    category_id: window.$("#confirm_sub_category_delete").data("data-sub-category-category-id"),
                                                    sub_category_id: window.$("#confirm_sub_category_delete").data("data-sub-category-id")
                                                });
                                            }
                                        }}
                                    />
                                </div>
                                <button id="category_delete_btn" className="d-none" onClick={this.openCategoryDeleteScreen.bind(this)} />
                                <button id="subcategory_delete_btn" className="d-none" onClick={this.openSubCategoryDeleteScreen.bind(this)} />
                                {/* <!--End:: Tab Content--> */}
                            </div>
                        </div>
                    </div>

                    {/* <!--End:: Portlet--> */}
                </div>

                {/* <!-- end:: Content --> */}
            </div>
        )
    }
}

const mapToProps = ({ user, category }) => {
    const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
    const user_token = user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false;

    const category_data = category && category[CATEGORY_KEY] ? category[CATEGORY_KEY] : undefined;

    const enable_category_request = category_data && category_data[ENABLE_CATEGORY_REQUEST_STATUS] ? category_data[ENABLE_CATEGORY_REQUEST_STATUS] : {};
    const enable_category_loading = category_data && category_data[ENABLE_CATEGORY_REQEUST_LOADING] ? category_data[ENABLE_CATEGORY_REQEUST_LOADING] : false;

    const disable_category_request = category_data && category_data[DISABLE_CATEGORY_REQUEST_STATUS] ? category_data[DISABLE_CATEGORY_REQUEST_STATUS] : {};
    const disable_category_loading = category_data && category_data[DISABLE_CATEGORY_REQEUST_LOADING] ? category_data[DISABLE_CATEGORY_REQEUST_LOADING] : false;

    const enable_sub_category_request = category_data && category_data[ENABLE_SUB_CATEGORY_REQUEST_STATUS] ? category_data[ENABLE_SUB_CATEGORY_REQUEST_STATUS] : {};
    const enable_sub_category_loading = category_data && category_data[ENABLE_SUB_CATEGORY_REQEUST_LOADING] ? category_data[ENABLE_SUB_CATEGORY_REQEUST_LOADING] : false;

    const disable_sub_category_request = category_data && category_data[DISABLE_SUB_CATEGORY_REQUEST_STATUS] ? category_data[DISABLE_SUB_CATEGORY_REQUEST_STATUS] : {};
    const disable_sub_category_loading = category_data && category_data[DISABLE_SUB_CATEGORY_REQEUST_LOADING] ? category_data[DISABLE_SUB_CATEGORY_REQEUST_LOADING] : false;

    return ({
        user_token,

        enable_category_request,
        enable_category_loading,
        disable_category_request,
        disable_category_loading,

        enable_sub_category_loading,
        enable_sub_category_request,
        disable_sub_category_request,
        disable_sub_category_loading
    });
}

export default connect(mapToProps, {
    updateSystemData,
    disableCategory,
    enableCategory,
    enableSubCategory,
    disableSubCategory,
    updateCategoryUIConstraints
})(List);

// <span class="dropdown">
                        //     <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
                        //       <i class="la la-ellipsis-h"></i>
                        //     </a>
                        //     <div class="dropdown-menu dropdown-menu-right">
                        //         <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>
                        //     </div>
                        // </span>