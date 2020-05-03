import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, USER_KEY, USER_DATA, PRODUCT_KEY, DELETE_PRODUCT_FORM, DELETE_PRODUCT_FORM_PRODUCT_ID, DELETE_PRODUCT_REQEUST_LOADING, DELETE_PRODUCT_REQUEST_STATUS, SERVER_NO_VALUE, SERVER_SUCCESS, TOKEN_NOT_FOUND, SUCCESS, ERROR, STATUS, MESSAGE, SERVER_VALIDATION_ERROR, EXPORT_PRODUCT_REQEUST_LOADING, EXPORT_PRODUCT_REQUEST_STATUS, ACTIVE, DRIVER_KEY, DRIVER_ENABLE_LOADING, DRIVER_DISABLE_LOADING, DRIVER_REQUEST_STATUS, DRIVER_REQUEST_LOADING } from '../../../redux/Types'
import { getProductsDataTables, getAuthoriztionToken, refillExportAllProducts, getDriverDataTables } from '../../../apis/APIs'
import moment from 'moment';
import { ProductTable } from '../../../components/dashboard/product'
import { ConfirmAlert } from '../../../components/base_components'
import { ToastsStore } from 'react-toasts'
import { deleteProduct, updateDeleteProductFormData, resetProductState, exportProduct } from '../../../redux/product/Action'
import { enableDriver, disableDriver , resetDriverState} from '../../../redux/driver/Action'
import Download from '../../../apis/Download'
import Utils from '../../../components/util/Utils'
import Table from '../../../components/dashboard/driver/Table'

class ListProduct extends PureComponent {
	static propTypes = {

	}

	constructor(){
		super()
		this.state={
			textStatus:""
		}
	}

	componentDidMount = () => {
		this.driver_list();
		this.init();
	}

	init = () => {
		const { updateSystemData } = this.props;

		updateSystemData({
			[SYSTEM_DATA_PAGE_TITLE]: "Refill | Driver List"
		});
	}

	driver_list = function () {
		const { user_token, updateDeleteProductFormData } = this.props;
		const that = this;

		var table = window.$('#driver_list');

		// begin first table
		table.DataTable({
			responsive: true,
			processing: true,
			serverSide: true,
			ajax: {
				url: getDriverDataTables(),
				type: 'POST',
				data: { user_token },
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", getAuthoriztionToken());
				}
			},
			columns: [
				{ data: '_id' },
				{ data: 'name' },
				{ data: 'vehicalName' },
				{ data: 'vehicalNumber' },
				{ data: 'email' },
				{ data: 'licenseNumber' },
				{ data: 'address' },
				{ data: 'createdAt' },
				{ data: 'Actions' },
			],
			columnDefs: [
				{
					targets: -1,
					orderable: false,
					render: function (data, type, full, meta) {
						Utils.log("driver",full)
						return `
						<script>
                            function deleteCategoryId(id, status){
								$("#confirm_driver_delete").data("data-driver-id", id);
								$("#confirm_driver_delete").data("data-driver-name", status);
								$("#driver_delete_btn").click();
							}
							function getDriverView(id){
								$("#driver_view_btn").data("data-users-view", id);
								$("#driver_view_btn").click();
							}
							function getDriverEdit(id){
								$("#driver_edit_btn").data("data-users-view", id);
								$("#driver_edit_btn").click();
							}
                        </script>
                       
						<button class="btn btn-sm btn-clean btn-icon btn-icon-md" >
						<a class="dropdown-item" id="${full._id}" onClick="getDriverEdit(this.id)"><i class="la la-edit"></i></a>
						</button>
						<button class="btn btn-sm btn-clean btn-icon btn-icon-md" id="${full._id}" onClick="getDriverView(this.id)">
						<a ><i class="fas fa-eye"></i></a>
						</button>
						
                        <button class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="modal" data-target="#driver_delete" name="${full.status}" id="${full._id}" onClick="deleteCategoryId(this.id, this.name)">
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

						return '<span class="kt-font-bold">' + moment(full.createdAt).format('DD/MM/YYYY') + '</span>';
					},
				},
				{
					targets: -3,
					render: function (data, type, full, meta) {

						return '<span class="kt-font-bold">' + (full.address.fullAddress ? full.address.fullAddress : "")  + '</span>';
					},
				},
				{
					targets: -4,
					render: function (data, type, full, meta) {

						return '<span class="kt-font-bold">' + full.licenseNumber + '</span>';
					},
				},
				{
					targets: -5,
					render: function (data, type, full, meta) {

						return '<span class="kt-font-bold">' + full.email  + '</span>';
					},
				},
				{
					targets: -6,
					render: function (data, type, full, meta) {

						return '<span class="kt-font-bold">' + full.vehicalName + '</span>';
					},
				},
				{
					targets: -7,
					render: function (data, type, full, meta) {

						return '<span class="kt-font-bold">' + full.vehicalName + '</span>';
					},
				},
				{
					targets: -8,
					render: function (data, type, full, meta) {

						return '<span class="kt-font-bold">' + full.name + '</span>';
					},
				},
				{
					targets: -9,
					render: function (data, type, full, meta) {

						return '<span class="kt-font-bold">' + full._id + '</span>';
					},
				},
			],
		});
	};

	redraw = function () {
		var table = window.$('#driver_list').DataTable();
		table.draw();
	}

	_openPage = (url) => {
		const { history } = this.props;

		if (!url) return;

		history.push(url);
	}

	componentDidUpdate = (prevProps) => {
		const { deleteDriverRequestStatus, history } = this.props;

		const prevReqeustStatus = prevProps && prevProps.deleteDriverRequestStatus ? prevProps.deleteDriverRequestStatus : {};
		if (deleteDriverRequestStatus[STATUS] !== prevReqeustStatus[STATUS]) {
			switch (deleteDriverRequestStatus[STATUS]) {
				case SUCCESS:
					ToastsStore.success("Driver successfully Status change", 3000);
					window.$("#close_driver_delete").click();
					this.resetDriverData();
					this.redraw();
					break;
				case TOKEN_NOT_FOUND:
					ToastsStore.error("Token not available, Please try again", 3000);
					break;
				case ERROR:
					const status = deleteDriverRequestStatus[MESSAGE] && deleteDriverRequestStatus[MESSAGE].message ? deleteDriverRequestStatus[MESSAGE].message : '';

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

	componentWillUnmount = () => {
		this.resetDriverData();
	}

	resetDriverData = () => {
		const { resetDriverState } = this.props;

		resetDriverState();
	}

	exportCSVFile = () => {
		const { exportProduct } = this.props;

		exportProduct();
	}

	openScreen = () => {
		const { history } = this.props;
		const id = window.$("#driver_view_btn").data("data-users-view");
		history.push(`/deriver/view/${id}`);
	}

	openEditScreen = () => {
		const { history } = this.props;
		const id = window.$("#driver_edit_btn").data("data-users-view");
		history.push(`/deriver/edit/${id}`);
	}
	openDriverDeleteScreen(){
		if(window.$("#confirm_driver_delete").data("data-driver-name") === `${ACTIVE}`){
            this.setState({
                textStatus:"Are you sure you want to disable driver"
            })
        }else{
            this.setState({
                textStatus:"Are you sure you want to enable driver"
            })
        }
	}

	render() {
		const { deleteDriverLoading, deleteProduct, exportProductLoading,enableDriver,disableDriver, enable_driver_loading, disable_driver_loading } = this.props;

		return (
			<div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

				{/* <!-- begin:: Subheader --> */}
				<div className="kt-subheader   kt-grid__item" id="kt_subheader">
					<div className="kt-container  kt-container--fluid ">
						<div className="kt-subheader__main">
							<h3 className="kt-subheader__title">
								Driver </h3>
							<span className="kt-subheader__separator kt-hidden"></span>
							<div className="kt-subheader__breadcrumbs">
								<a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
								<span className="kt-subheader__breadcrumbs-separator"></span>
								<a  className="kt-subheader__breadcrumbs-link">
									List </a>
							</div>
						</div>
						<div className="kt-subheader__toolbar">
							<div className="kt-subheader__wrapper">
								<button type="button" class="btn btn-outline-brand" onClick={this._openPage.bind(this, '/deriver/add')}>
									<i class="la la-plus"></i>
									Add Driver
                                </button>
							</div>
						</div>
					</div>
				</div>

				{/* <!-- end:: Subheader --> */}

				<Table 
					table_id="driver_list"
				/>
				<ConfirmAlert
					_id={"driver_delete"}
					label="Confirm"
					loading={enable_driver_loading || disable_driver_loading}
					description={this.state.textStatus}
					confirm_btn={"Continue"}
					onConfirm={() => {
						if (window.$("#confirm_driver_delete").data("data-driver-name") === `${ACTIVE}`) {
							disableDriver(window.$("#confirm_driver_delete").data("data-driver-id"));
						} else {
							enableDriver(window.$("#confirm_driver_delete").data("data-driver-id"));
						}
					}}
				/>
				{/* <!-- begin:: Content --> */}
				<div class="modal" id="enable">
					<div class="modal-dialog">
						<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title">Confirm</h4>
							<button type="button" class="close" data-dismiss="modal"></button>
						</div>    
						<div class="modal-body">
							Are you sure to Disable the driver
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
							<button type="button" class="btn btn-danger" data-dismiss="modal">Continue</button>
						</div>

						</div>
					</div>
				</div>

				{/* disable */}
				<div class="modal" id="disable">
					<div class="modal-dialog">
						<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title">Confirm</h4>
							<button type="button" class="close" data-dismiss="modal">&times;</button>
						</div>    
						<div class="modal-body">
							Are you sure you want to enable the Driver
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-danger" data-dismiss="modal">Continue</button>
						</div>

						</div>
					</div>
				</div>
				<button id="driver_view_btn" className="d-none" onClick={this.openScreen.bind(this)} />
				<button id="driver_edit_btn" className="d-none" onClick={this.openEditScreen.bind(this)} />
				<button id="driver_delete_btn" className="d-none" onClick={this.openDriverDeleteScreen.bind(this)} />
				{/* <!-- end:: Content --> */}
			</div>
		)
	}
}

const mapToProps = ({ user, product, driver }) => {
	const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
	const user_token = user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false;

	const product_data = product && product[PRODUCT_KEY] ? product[PRODUCT_KEY] : undefined;
	const driver_data = driver && driver[DRIVER_KEY] ? driver[DRIVER_KEY] : undefined

	const deleteDriverRequestStatus = driver_data && driver_data[DRIVER_REQUEST_STATUS] ? driver_data[DRIVER_REQUEST_STATUS] : "";
	const deleteDriverLoading = driver_data && driver_data[DRIVER_REQUEST_LOADING] ? driver_data[DRIVER_REQUEST_LOADING] : "";

	const exportProductRequestStatus = product_data && product_data[EXPORT_PRODUCT_REQUEST_STATUS] ? product_data[EXPORT_PRODUCT_REQUEST_STATUS] : "";
	const exportProductLoading = product_data && product_data[EXPORT_PRODUCT_REQEUST_LOADING] ? product_data[EXPORT_PRODUCT_REQEUST_LOADING] : false;

	const enable_driver_loading= driver_data[DRIVER_ENABLE_LOADING]
	const disable_driver_loading=driver_data[DRIVER_DISABLE_LOADING]

	return ({
		user_token,
		deleteDriverRequestStatus,
		deleteDriverLoading,

		exportProductRequestStatus,
		exportProductLoading,
		enable_driver_loading,
		disable_driver_loading
	});
}

export default connect(mapToProps, {
	updateSystemData,
	deleteProduct,
	updateDeleteProductFormData,
	resetDriverState,
	exportProduct,
	enableDriver,
	disableDriver
})(ListProduct);