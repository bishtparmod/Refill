import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, USER_KEY, USER_DATA, PRODUCT_KEY, DELETE_PRODUCT_FORM, DELETE_PRODUCT_FORM_PRODUCT_ID, DELETE_PRODUCT_REQEUST_LOADING, DELETE_PRODUCT_REQUEST_STATUS, SERVER_NO_VALUE, SERVER_SUCCESS, TOKEN_NOT_FOUND, SUCCESS, ERROR, STATUS, MESSAGE, SERVER_VALIDATION_ERROR, EXPORT_PRODUCT_REQEUST_LOADING, EXPORT_PRODUCT_REQUEST_STATUS } from '../../../redux/Types'
import { getProductsDataTables, getAuthoriztionToken, refillExportAllProducts } from '../../../apis/APIs'
import moment from 'moment';
import { ProductTable } from '../../../components/dashboard/product'
import { ConfirmAlert } from '../../../components/base_components'
import { ToastsStore } from 'react-toasts'
import { deleteProduct, updateDeleteProductFormData, resetProductState, exportProduct } from '../../../redux/product/Action'
import Download from '../../../apis/Download'
import Utils from '../../../components/util/Utils'

class ListProduct extends PureComponent {
	static propTypes = {

	}

	componentDidMount = () => {
		this.product_list();
		this.init();
	}

	init = () => {
		const { updateSystemData } = this.props;

		updateSystemData({
			[SYSTEM_DATA_PAGE_TITLE]: "Refill | Product List"
		});
	}

	openEditScreen = () => {
		const { history } = this.props;
		const id = window.$("#product_edit_btn").data("data-users-view");
		history.push(`/product/edit/${id}`);
	}

	product_list = function () {
		const { user_token, updateDeleteProductFormData } = this.props;
		const that = this;

		var table = window.$('#product_list');

		// begin first table
		table.DataTable({
			responsive: true,
			processing: true,
			serverSide: true,
			ajax: {
				url: getProductsDataTables(),
				type: 'POST',
				data: { user_token },
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", getAuthoriztionToken());
				}
			},
			columns: [
				{ data: '_id' },
				{ data: 'name' },
				{ data: 'category.name' },
				{ data: 'subCategory.name' },
				{ data: 'distributor' },
				{ data: 'retailPrice' },
				{ data: 'refillPrice' },
				{ data: 'quantity' },
				{ data: 'discount' },
				{ data: 'createdAt' },
				{ data: 'expiryAt' },
				{ data: 'Actions' },
			],
			columnDefs: [
				{
					targets: -1,
					orderable: false,
					render: function (data, type, full, meta) {
						Utils.log("product",full)
						return `
						<script>
							function getProductId(id){
								$("#confirm_product_delete").data("data-product-id", id);
							}
							function getProductView(id){
								$("#product_view_btn").data("data-users-view", id);
								$("#product_view_btn").click();
							}
							function getProductEdit(id){
								$("#product_edit_btn").data("data-users-view", id);
								$("#product_edit_btn").click();
							}
						</script>
                   
						<button class="btn btn-sm btn-clean btn-icon btn-icon-md" >
						<a class="dropdown-item" id="${full._id}" onClick="getProductEdit(this.id)"><i class="la la-edit"></i></a>
						</button>
                        <button class="btn btn-sm btn-clean btn-icon btn-icon-md" id="${full._id}" onclick="getProductId(this.id)" data-toggle="modal" data-target="#product_delete">
                          <i class="fa fa-trash"></i>
						</button>
						<button class="btn btn-sm btn-clean btn-icon btn-icon-md" id="${full._id}" data-target="#users_view" onClick="getProductView(this.id)">
						<a ><i class="fas fa-eye"></i></a>
						</button>
						
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
					targets: -3,
					render: function (data, type, full, meta) {

						return '<span class="kt-font-bold">' + moment(data).format('DD/MM/YYYY') + '</span>';
					},
				},
					{
						targets: -4,
						orderable: false,
						render: function (data, type, full, meta) {
							return '<span class="kt-font-bold">' + (full.discount ? full.discount.value : 0 ) + '</span>';
						},
					},
				{
					targets: -5,
					orderable: false,
					render: function (data, type, full, meta) {

						return '<span class="kt-font-bold">' + data + '</span>';
					},
				},
				{
					targets: -6,
					orderable: false,
					render: function (data, type, full, meta) {
						return '<span class="kt-font-bold">' + data + '</span>';
					},
				},
				{
					targets: -7,
					orderable: false,
					render: function (data, type, full, meta) {
						return '<span class="kt-font-bold">' + data + '</span>';
					},
				},
				{
					targets: -8,
					orderable: false,
					render: function (data, type, full, meta) {
						return '<span class="kt-font-bold">' + data + '</span>';
					},
				},
				{
					targets: -9,
					orderable: false,
					render: function (data, type, full, meta) {
						return '<span class="kt-font-bold">' + data + '</span>';
					},
				},
				{
					targets: -10,
					orderable: false,
					render: function (data, type, full, meta) {
						return '<span class="kt-font-bold">' + data + '</span>';
					},
				},
				{
					targets: -11,
					orderable: false,
					render: function (data, type, full, meta) {
						return '<span class="kt-font-bold">' + data + '</span>';
					},
				},
				{
					targets: -12,
					render: function (data, type, full, meta) {

						return '<span class="kt-font-bold">' + data ? `...${data.substring(data.length - 8, data.length)}` : 'No ID Found' + '</span>';
					},
				}
			],
		});
	};

	redraw = function () {
		var table = window.$('#product_list').DataTable();
		table.draw();
	}

	_openPage = (url) => {
		const { history } = this.props;

		if (!url) return;

		history.push(url);
	}

	componentDidUpdate = (prevProps) => {
		const { deleteProductRequestStatus, exportProductRequestStatus, history } = this.props;

		const prevReqeustStatus = prevProps && prevProps.deleteProductRequestStatus ? prevProps.deleteProductRequestStatus : {};
		if (deleteProductRequestStatus[STATUS] !== prevReqeustStatus[STATUS]) {
			switch (deleteProductRequestStatus[STATUS]) {
				case SUCCESS:
					ToastsStore.success("Product successfully deleted", 3000);
					window.$("#close_product_delete").click();
					this.resetProductData();
					this.redraw();
					break;
				case TOKEN_NOT_FOUND:
					ToastsStore.error("Token not available, Please try again", 3000);
					break;
				case ERROR:
					const status = deleteProductRequestStatus[MESSAGE] && deleteProductRequestStatus[MESSAGE].message ? deleteProductRequestStatus[MESSAGE].message : '';

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

		const prevExportReqeustStatus = prevProps && prevProps.exportProductRequestStatus ? prevProps.exportProductRequestStatus : {};
		if (exportProductRequestStatus[STATUS] !== prevExportReqeustStatus[STATUS]) {
			switch (exportProductRequestStatus[STATUS]) {
				case SUCCESS:
					ToastsStore.success("File exported successfully!", 3000);
					break;
				case TOKEN_NOT_FOUND:
					ToastsStore.error("Token not available, Please try again", 3000);
					break;
				case ERROR:
					const status = exportProductRequestStatus[MESSAGE] && exportProductRequestStatus[MESSAGE].message ? exportProductRequestStatus[MESSAGE].message : '';
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

	componentWillUnmount = () => {
		this.resetProductData();
	}

	resetProductData = () => {
		const { resetProductState } = this.props;

		resetProductState();
	}

	exportCSVFile = () => {
		const { exportProduct } = this.props;

		exportProduct();
	}

	openScreen = () => {
		const { history } = this.props;
		const id = window.$("#product_view_btn").data("data-users-view");
		history.push(`/product/view/${id}`);
	}

	render() {
		const { deleteProductLoading, deleteProduct, exportProductLoading } = this.props;

		return (
			<div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

				{/* <!-- begin:: Subheader --> */}
				<div className="kt-subheader   kt-grid__item" id="kt_subheader">
					<div className="kt-container  kt-container--fluid ">
						<div className="kt-subheader__main">
							<h3 className="kt-subheader__title">
								Product </h3>
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
								<button type="button" className="btn btn-outline-brand" onClick={this._openPage.bind(this, '/product/add')}>
									<i className="la la-plus"></i>
									Add Product
                                </button>
							</div>
						</div>
					</div>
				</div>
				<button id="product_view_btn" className="d-none" onClick={this.openScreen.bind(this)} />
				<button id="product_edit_btn" className="d-none" onClick={this.openEditScreen.bind(this)} />
				{/* <!-- end:: Subheader --> */}

				{/* <!-- begin:: Content --> */}
				<ProductTable
					table_id="product_list"
					exportProductLoading={exportProductLoading}
					exportCSVFileData={this.exportCSVFile}
				/>
				
				<ConfirmAlert
					_id={"product_delete"}
					label="Confirm"
					// loading={deleteProductLoading}
					description={"Are you sure you want to delete this product"}
					confirm_btn={"Continue"}
					onConfirm={() => {
						deleteProduct(window.$("#confirm_product_delete").data("data-product-id"));
					}}
				/>
				{/* <!-- end:: Content --> */}
			</div>
		)
	}
}

const mapToProps = ({ user, product }) => {
	const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
	const user_token = user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false;

	const product_data = product && product[PRODUCT_KEY] ? product[PRODUCT_KEY] : undefined;

	const deleteProductRequestStatus = product_data && product_data[DELETE_PRODUCT_REQUEST_STATUS] ? product_data[DELETE_PRODUCT_REQUEST_STATUS] : "";
	const deleteProductLoading = product_data && product_data[DELETE_PRODUCT_REQEUST_LOADING] ? product_data[DELETE_PRODUCT_REQEUST_LOADING] : "";

	const exportProductRequestStatus = product_data && product_data[EXPORT_PRODUCT_REQUEST_STATUS] ? product_data[EXPORT_PRODUCT_REQUEST_STATUS] : "";
	const exportProductLoading = product_data && product_data[EXPORT_PRODUCT_REQEUST_LOADING] ? product_data[EXPORT_PRODUCT_REQEUST_LOADING] : false;


	return ({
		user_token,
		deleteProductRequestStatus,
		deleteProductLoading,

		exportProductRequestStatus,
		exportProductLoading
	});
}

export default connect(mapToProps, {
	updateSystemData,
	deleteProduct,
	updateDeleteProductFormData,
	resetProductState,
	exportProduct
})(ListProduct);