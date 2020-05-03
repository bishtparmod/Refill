import React, { PureComponent } from 'react'
import Table from '../../../components/dashboard/order/Table'
import { UsersTable } from '../../../components/dashboard/users'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, USER_KEY, USER_DATA, PRODUCT_KEY, DELETE_PRODUCT_FORM, DELETE_PRODUCT_FORM_PRODUCT_ID, DELETE_PRODUCT_REQEUST_LOADING, DELETE_PRODUCT_REQUEST_STATUS, SERVER_NO_VALUE, SERVER_SUCCESS, TOKEN_NOT_FOUND, SUCCESS, ERROR, STATUS, MESSAGE, SERVER_VALIDATION_ERROR, EXPORT_PRODUCT_REQEUST_LOADING, EXPORT_PRODUCT_REQUEST_STATUS, USERS_KEY, EXPORT_USERS_REQUEST_STATUS, EXPORT_USERS_REQEUST_LOADING, ENABLE_USERS_REQUEST_STATUS, ENABLE_USERS_REQUEST_LOADING, DISABLE_CATEGORY_REQUEST_STATUS, DISABLE_USERS_REQUEST_STATUS, DISABLE_USERS_REQUEST_LOADING, ACTIVE, REPORT_START_DATE, REPORT_KEY, REPORT_END_DATE } from '../../../redux/Types'
import { getProductsDataTables, getAuthoriztionToken, refillExportAllProducts, getUsersDataTables, refillExportAllUsers } from '../../../apis/APIs'
import moment from 'moment';
import { ProductTable } from '../../../components/dashboard/product'
import { ConfirmAlert } from '../../../components/base_components'
import { ToastsStore } from 'react-toasts'
import { updateReportState  } from '../../../redux//report/Action'
import Download from '../../../apis/Download'
import { resetUserState, exportUsers, disableUsers, enableUsers } from '../../../redux/users/Action'
import $ from "jquery";
import { SelectCalendar, SelectCategory, UploadImageContainer } from '../../../components/dashboard/product'

class List extends PureComponent {
    constructor(){
        super()
        this.state={
            orderFilterValue:"",
            orderFilter:[
                {
                    name:"By orderId",
                    value:"1"
                },
                {
                    name:"By user",
                    value:"1"
                },
            ]
        }
    }

    componentDidMount = () => {
		this.user_list();
        this.init();
        this.selectOrderFilter(
            {
                name:"By orderId",
                value:"1"
            }
        )
    }
    
    selectOrderFilter(ele){
        const { updateOrderUIConstraints } = this.props
        this.setState({
            orderFilterValue:ele.name
        })
        
    }

    init = () => {
		const { updateSystemData } = this.props;

		updateSystemData({
			[SYSTEM_DATA_PAGE_TITLE]: "Refill | Report List"
		});
    }
    
    addFilter = () =>{
    /* Custom filtering function which will search data in column four between two values */
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                var min = parseInt( $('#min').val(), 10 );
                var max = parseInt( $('#max').val(), 10 );
                var age = parseFloat( data[3] ) || 0; // use data for the age column
        
                if ( ( isNaN( min ) && isNaN( max ) ) ||
                    ( isNaN( min ) && age <= max ) ||
                    ( min <= age   && isNaN( max ) ) ||
                    ( min <= age   && age <= max ) )
                {
                    return true;
                }
                return false;
            }
);
 
$(document).ready(function() {
    var table = $('#by_orderid').DataTable();
     
    // Event listener to the two range filtering inputs to redraw on input
    $('#min, #max').keyup( function() {
        table.draw();
    } );
} );
    }

	user_list = function () {
		const { user_token, updateDeleteProductFormData } = this.props;
		const that = this;

		var table = window.$('#by_orderid');

		// begin first table
		table.DataTable({
			responsive: true,
			processing: true,
			serverSide: true,
			ajax: {
				url: getUsersDataTables(),
				type: 'POST',
				data:function(d){
                    d.user_token=user_token
                    // d.startDate=$('#product_start_date').val();
                    // d.endDate=$('#product_end_date').val();
                },
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", getAuthoriztionToken());
				}
            },
           
			columns: [
				{ data: '_id' },
				{ data: 'name' },
				{ data: 'createdAt' },
				{ data: 'Actions' },
			],
			columnDefs: [
				{
					targets: -1,
					orderable: false,
					render: function (data, type, full, meta) {

						return `
                        <span class="dropdown">
                            <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
                              <i class="la la-ellipsis-h"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="/user/edit/${full._id}"><i class="la la-edit"></i>Edit</a>
                            </div>
						</span>
						<script>
							function getUserId(id, status){
								$("#confirm_users_delete").data("data-users-user-id", id);
                                $("#confirm_users_delete").data("data-user-status", status);
							}
						</script>
                        <button data-toggle="modal" data-target="#users_delete" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="${full._id}" name="${full.status}" onclick="getUserId(this.id, this.name)" data-toggle="modal" data-target="#product_delete">
							${
								full.status === ACTIVE ?
									'<i class="fa fa-lock" style="color: red;"></i>' :
									'<i class="fa fa-unlock"></i>'
							}
						</button>
						<button class="btn btn-sm btn-clean btn-icon btn-icon-md">
						<a href="/user/view/${full._id}" ><i class="fas fa-eye"></i></a>
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

	redraw = function () {
        var table = window.$('#by_orderid').DataTable();
		table.draw();
	}

    onChangeText = (key, value) => {
        const { updateReportState } = this.props;

        updateReportState({
            [key]: value
        });
    }

    render() {
        const {orderFilterValue} = this.state
        const { startDate, endDate } = this.props
        return (

            <div className="kt-body kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-grid--stretch" id="kt_body">
    <div className="kt-container  kt-container--fluid  kt-grid kt-grid--ver">
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            Report Management </h3>
                        <span className="kt-subheader__separator kt-hidden"></span>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#" className="kt-subheader__breadcrumbs-home">
                                <i className="flaticon2-shelter"></i></a>
                            <span className="kt-subheader__breadcrumbs-separator"></span>
                            <a  className="kt-subheader__breadcrumbs-link">List </a>
                        </div>
                        <div className="kt-subheader__breadcrumbs">
                            
                        </div>
                    </div>
                </div>
            </div>
           <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="kt-portlet">
                            <div className="kt-portlet__head kt-portlet__head--lg">
                                <div className="kt-portlet__head-label pb-4">
                                    <span className="kt-portlet__head-icon">
                                        <i className="kt-font-brand flaticon2-line-chart"></i>
                                    </span>
                                    <h3 className="kt-portlet__head-title">
                                        Report Management
                                    </h3>
                                </div>
                                <div className="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                                        <div className="kt-form__group kt-form__group--inline p-4">
                                                            <div className="kt-form__control">
                                                            <SelectCalendar
                                                                _id="product_start_date"
                                                                placeholder="Start Date"
                                                                handleOnChange={(date) => this.onChangeText(REPORT_START_DATE, date)}
                                                                refreshFunction={this.redraw.bind(this)}
                                                                value={startDate}
                                                                calendarOptions={{
                                                                    rtl: window.KTUtil.isRTL(),
                                                                    todayHighlight: true,
                                                                    orientation: "bottom left",
                                                                    endDate: new Date()
                                                                }}
                                                            />
                                                            </div>
                                                        </div>

                                                        
                                                    </div>
                                <div className="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                                        <div className="kt-form__group kt-form__group--inline p-4">
                                                            <div className="kt-form__control">
                                                            <SelectCalendar
                                                                _id="product_end_date"
                                                                placeholder="End Date"
                                                                handleOnChange={(date) => this.onChangeText(REPORT_END_DATE, date)}
                                                                refreshFunction={this.redraw.bind(this)}
                                                                value={endDate}
                                                                calendarOptions={{
                                                                    rtl: window.KTUtil.isRTL(),
                                                                    todayHighlight: true,
                                                                    orientation: "bottom left",
                                                                    endDate: new Date()
                                                                }}
                                                            />
                                                            </div>
                                                        </div>

                                                        
                                                    </div>
                                <div className="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                                        <div className="kt-form__group kt-form__group--inline p-4">
                                                            <div className="kt-form__control">
                                                                <div className="dropdown bootstrap-select form-control">
                                                                    <button type="button" className="btn dropdown-toggle btn-light" data-toggle="dropdown" role="combobox" aria-owns="bs-select-1" aria-haspopup="listbox" aria-expanded="false" data-id="kt_form_status" title="All">
                                                                        <div className="filter-option">
                                                                            <div className="filter-option-inner">
                                                                                <div className="filter-option-inner-inner">{orderFilterValue}</div>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                    <div className="dropdown-menu ">
                                                                    <div className="inner show" role="listbox" id="bs-select-1" tabIndex="-1"><ul className="dropdown-menu inner show" role="p2resentation"></ul>
                                                                        {this.state.orderFilter && this.state.orderFilter.length 
                                                                        ?
                                                                        this.state.orderFilter.map((ele,index)=>
                                                                        <div className="filter-option-inner" key ={index}>
                                                                                <div className="filter-option-inner-inner" onClick={()=>this.selectOrderFilter(ele)}>{ele.name}</div>
                                                                        </div>
                                                                        )
                                                                        :
                                                                        <div>No order filter</div>
                                                                        }
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        
                                                    </div>
                            </div>
                           
                            <form className="kt-form kt-form--label-right" id="kt_form_1">
                                <Table type="orderid" table_id="by_orderid" />   
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        )
    }
}

export default connect(({user,report})=>{
    const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
    const report_data = report && report[REPORT_KEY] ? report[REPORT_KEY] :undefined;
    return({
        user_token : user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false,
        startDate:report_data.report_start_date,
        endDate:report_data.report_end_date
    })
},{
    updateSystemData,
    updateReportState
}) (List)