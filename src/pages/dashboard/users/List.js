import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { UsersTable } from '../../../components/dashboard/users'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, USER_KEY, USER_DATA, PRODUCT_KEY, DELETE_PRODUCT_FORM, DELETE_PRODUCT_FORM_PRODUCT_ID, DELETE_PRODUCT_REQEUST_LOADING, DELETE_PRODUCT_REQUEST_STATUS, SERVER_NO_VALUE, SERVER_SUCCESS, TOKEN_NOT_FOUND, SUCCESS, ERROR, STATUS, MESSAGE, SERVER_VALIDATION_ERROR, EXPORT_PRODUCT_REQEUST_LOADING, EXPORT_PRODUCT_REQUEST_STATUS, USERS_KEY, EXPORT_USERS_REQUEST_STATUS, EXPORT_USERS_REQEUST_LOADING, ENABLE_USERS_REQUEST_STATUS, ENABLE_USERS_REQUEST_LOADING, DISABLE_CATEGORY_REQUEST_STATUS, DISABLE_USERS_REQUEST_STATUS, DISABLE_USERS_REQUEST_LOADING, ACTIVE, EMPTY, CHAT_USER_ID, CHAT_ADMIN_ID, CHATING_DATA, CHAT_USER_NAME, CHAT_KEY, CHAT_SCHEMA, CHAT_MESSAGE, OPEN_MODEL, SYSTEM_DATA_IS_AUTHENTICATED } from '../../../redux/Types'
import { getProductsDataTables, getAuthoriztionToken, refillExportAllProducts, getUsersDataTables, refillExportAllUsers } from '../../../apis/APIs'
import moment from 'moment';
import { ProductTable } from '../../../components/dashboard/product'
import { ConfirmAlert } from '../../../components/base_components'
import { ToastsStore } from 'react-toasts'
import { deleteProduct, updateDeleteProductFormData, resetProductState } from '../../../redux/product/Action'
import Download from '../../../apis/Download'
import { resetUserState, exportUsers, disableUsers, enableUsers, updateUsersUIConstraints } from '../../../redux/users/Action'
import { updateChatData, getChatData } from '../../../redux/chat/Action'

class ListUsers extends Component {
	static propTypes = {

	}

	constructor(props){
		super(props)
		this.state={
			textStatus:"",
		}   
	}


	componentDidMount = () => {
		this.init();
		this.user_list();
	}

	init = () => {
		const { updateSystemData,history } = this.props;

		updateSystemData({
			[SYSTEM_DATA_PAGE_TITLE]: "Refill | Product List"
		});
		
	}

	openScreen = () => {
		const { history, updateChatData, adminId, getChatData } = this.props;
		const id = window.$("#users_view_btn").data("data-users-view");
		const name = window.$("#users_view_btn").data("data-username-view");
		history.push(`/user/view/${id}`);
		updateChatData({
			[CHAT_USER_ID]: id,
			[CHAT_ADMIN_ID]:adminId,
			[CHATING_DATA]:[],
			[CHAT_USER_NAME]:name === "undefined" ? 'NA' : name
		})
		getChatData()
	}

	openEditScreen = () => {
		const { history } = this.props;
		const id = window.$("#user_edit_btn").data("data-users-view");
		history.push(`/user/edit/${id}`);
	}

	openUserDeleteScreen(){
		if(window.$("#confirm_users_delete").data("data-user-status") === `${ACTIVE}`){
            this.setState({
                textStatus:"Are you sure you want to disable User"
            })
        }else{
            this.setState({
                textStatus:"Are you sure you want to enable User"
            })
        }
	}

	openChatScreen(){
		const  {updateSystemData, updateChatData, adminId, getChatData } = this.props
		const id = window.$("#chat_btn").data("chat-view");
		const name = window.$("#chat_btn").data("chat-data-view");

		updateChatData({
			[CHAT_USER_ID]: id,
			[CHAT_ADMIN_ID]:adminId,
			[CHATING_DATA]:[],
			[CHAT_USER_NAME]:name === "undefined" ? 'NA' : name
		})
		getChatData()
	}

	user_list = function () {
		const { user_token, updateDeleteProductFormData, history } = this.props;
		const that = this;
		
		var table = window.$('#user_list');

		// begin first table
		table.DataTable({
			responsive: true,
			processing: true,
			serverSide: true,
			ajax: {
				url: getUsersDataTables(),
				type: 'POST',
				data: { user_token },
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", getAuthoriztionToken());
				}
			},
			columns: [
				{ data: '_id' },
				{ data :'name'},
				{ data: 'email' },
				{ data: 'createdAt' },
				{ data: 'Actions' },
			],
			columnDefs: [
				{
					targets: -1,
					orderable: false,
					render: function (data, type, full, meta) {
						return `
						<script>
							function getUserId(id, status){
								$("#confirm_users_delete").data("data-users-user-id", id);
								$("#confirm_users_delete").data("data-user-status", status);
								$("#user_delete_btn").click();
							}

							function getUserView(id){
								$("#users_view_btn").data("data-users-view", id);
								$("#users_view_btn").data("data-username-view", name);
								$("#users_view_btn").click();
							}
							function getUserEdit(id){
								$("#user_edit_btn").data("data-users-view", id);
								$("#user_edit_btn").click();
							}
							function getUserChat(id,name){
								$("#chat_btn").data("chat-view", id);
								$("#chat_btn").data("chat-data-view", name);
								$("#chat_btn").click();
							}
						</script>
                       
						<button class="btn btn-sm btn-clean btn-icon btn-icon-md" >
						<a class="dropdown-item" id="${full._id}" onClick="getUserEdit(this.id)"><i class="la la-edit"></i></a>
						</button>
                        <button data-toggle="modal" data-target="#users_delete" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="${full._id}" name="${full.status}" onclick="getUserId(this.id, this.name)" data-toggle="modal" data-target="#product_delete">
							${
								full.status === ACTIVE ?
									'<i class="fa fa-lock" style="color: red;"></i>' :
									'<i class="fa fa-unlock"></i>'
							}
						</button>
						<button class="btn btn-sm btn-clean btn-icon btn-icon-md" id="${full._id}" name="${full.name}"  data-target="#users_view" onClick="getUserView(this.id,this.name)">
						<a ><i class="fas fa-eye"></i></a>
						</button>
						<button type="button" data-toggle="modal" data-target="#kt_chat_modal" class="btn btn-sm btn-clean btn-icon btn-icon-md" name="${full.name}" id="${full._id}" onClick="getUserChat(this.id,this.name)">
						<i class="flaticon2-chat-1"></i>
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
						return '<span class="kt-font-bold">' + data  + '</span>';

					},
				},
				{
					targets: -4,
					render: function (data, type, full, meta) {

						return '<span class="kt-font-bold">' +  (full.name ? full.name : 'NA')  + '</span>';
					},
				},
				{
					targets: -5,
					render: function (data, type, full, meta) {

						return '<span class="kt-font-bold">' + data ? `...${data.substring(data.length - 8, data.length)}` : 'No ID Found' + '</span>';
					},
				}
			],
		});
	};

	redraw = function () {
		var table = window.$('#user_list').DataTable();
		table.draw();
	}

	_openPage = (url) => {
		const { history } = this.props;

		if (!url) return;

		history.push(url);
	}

	exportCSVFile = () => {
		const { exportUsers } = this.props;

		// refillExportAllUsers(user_token)
		// 	.then(blob => {
		// 		Download.download(blob, "users.csv", "csv");
		// 	})
		// 	.catch(res => { console.log("export all users ===> error", res) });
		exportUsers();
	}

	componentDidUpdate = (prevProps) => {
		const { enable_users_request, disable_users_request, exportUsersRequestStatus,updateUsersUIConstraints } = this.props;

		const prevReqeustStatus = prevProps && prevProps.enable_users_request ? prevProps.enable_users_request : {};
		if (enable_users_request[STATUS] !== prevReqeustStatus[STATUS]) {
			switch (enable_users_request[STATUS]) {
				case SUCCESS:
					ToastsStore.success("User successfully enabled", 3000);
					window.$("#users_delete").click();
					this.redraw();
					break;
				case TOKEN_NOT_FOUND:
					ToastsStore.error("Token not available, Please try again", 3000);
					break;
				case ERROR:
					const status = enable_users_request[MESSAGE] && enable_users_request[MESSAGE].message ? enable_users_request[MESSAGE].message : '';

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

		const prevDisableUsersReqeustStatus = prevProps && prevProps.disable_users_request ? prevProps.disable_users_request : {};
		if (disable_users_request[STATUS] !== prevDisableUsersReqeustStatus[STATUS]) {
			switch (disable_users_request[STATUS]) {
				case SUCCESS:
					ToastsStore.success("User successfully disabled", 3000);
					window.$("#users_delete").click();
					this.redraw();
					break;
				case TOKEN_NOT_FOUND:
					ToastsStore.error("Token not available, Please try again", 3000);
					break;
				case ERROR:
					const status = disable_users_request[MESSAGE] && disable_users_request[MESSAGE].message ? disable_users_request[MESSAGE].message : '';

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

		const prevExportUsersRequestStatus = prevProps && prevProps.exportUsersRequestStatus ? prevProps.exportUsersRequestStatus : {};
		if (exportUsersRequestStatus[STATUS] !== prevExportUsersRequestStatus[STATUS]) {
			switch (exportUsersRequestStatus[STATUS]) {
				case SUCCESS:
					ToastsStore.success("File exported successfully!", 3000);
					break;
				case TOKEN_NOT_FOUND:
					ToastsStore.error("Token not available, Please try again", 3000);
					break;
				case ERROR:
					const status = exportUsersRequestStatus[MESSAGE] && exportUsersRequestStatus[MESSAGE].message ? exportUsersRequestStatus[MESSAGE].message : '';

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
		// this.resetUsersData();
	}

	resetUsersData = () => {
		const { resetUserState } = this.props;

		resetUserState();
	}

	
	render() {
		const { user_token,history, exportUsersLoading, enable_users_loading, disable_users_loading, enableUsers, disableUsers } = this.props;

		return (
			<div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

				{/* <!-- begin:: Subheader --> */}
				<div className="kt-subheader   kt-grid__item" id="kt_subheader">
					<div className="kt-container  kt-container--fluid ">
						<div className="kt-subheader__main">
							<h3 className="kt-subheader__title ">
								Users </h3>
							<span className="kt-subheader__separator kt-hidden"></span>
							<div className="kt-subheader__breadcrumbs">
								<a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
								<span className="kt-subheader__breadcrumbs-separator"></span>
								<a  className="kt-subheader__breadcrumbs-link">
									List </a>
							</div>
						</div>
					</div>
				</div>
				<input type="text" id="changePage" hidden="true" history={JSON.stringify(history)} />
				{/* <!-- end:: Subheader --> */}

				{/* <!-- begin:: Content --> */}
				<UsersTable
					table_id="user_list"
					exportUsersLoading={exportUsersLoading}
					exportCSVFileData={this.exportCSVFile}
				/>

				<ConfirmAlert
					_id={"users_delete"}
					label="Confirm"
					loading={enable_users_loading || disable_users_loading}
					description={this.state.textStatus}
					confirm_btn={"Continue"}
					onConfirm={() => {
						if (window.$("#confirm_users_delete").data("data-user-status") === `${ACTIVE}`) {
							disableUsers(window.$("#confirm_users_delete").data("data-users-user-id"));
							// alert(window.$("#confirm_users_delete").data("data-users-user-id")+"===>"+window.$("#confirm_users_delete").data("data-user-status"));
						} else {
							enableUsers(window.$("#confirm_users_delete").data("data-users-user-id"));
							// alert(window.$("#confirm_users_delete").data("data-users-user-id")+"===>"+window.$("#confirm_users_delete").data("data-user-status"));
						}
					}}
				/>
				<button id="users_view_btn" className="d-none" onClick={this.openScreen.bind(this)} />
				<button id="user_edit_btn" className="d-none" onClick={this.openEditScreen.bind(this)} />
				<button id="user_delete_btn" className="d-none" onClick={this.openUserDeleteScreen.bind(this)} />
				<button id="chat_btn" className="d-none" onClick={this.openChatScreen.bind(this)} />
				{/* <!-- end:: Content --> */}
				
				</div>
		)
	}
}

const mapToProps = ({ user, users, chat }) => {
	const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
	const chatData = chat && chat[CHAT_KEY][CHAT_SCHEMA] ? chat[CHAT_KEY][CHAT_SCHEMA] : undefined
	
	const user_token = user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false;
	const adminId = user_data && user_data[USER_DATA] && user_data[USER_DATA]._id ? user_data[USER_DATA]._id : "" ;
	
	const users_data = users && users[USERS_KEY] ? users[USERS_KEY] : undefined;

	const exportUsersRequestStatus = users_data && users_data[EXPORT_USERS_REQUEST_STATUS] ? users_data[EXPORT_USERS_REQUEST_STATUS] : "";
	const exportUsersLoading = users_data && users_data[EXPORT_USERS_REQEUST_LOADING] ? users_data[EXPORT_USERS_REQEUST_LOADING] : "";

	const enable_users_request = users_data && users_data[ENABLE_USERS_REQUEST_STATUS] ? users_data[ENABLE_USERS_REQUEST_STATUS] : {};
	const enable_users_loading = users_data && users_data[ENABLE_USERS_REQUEST_LOADING] ? users_data[ENABLE_USERS_REQUEST_LOADING] : false;

	const disable_users_request = users_data && users_data[DISABLE_USERS_REQUEST_STATUS] ? users_data[DISABLE_USERS_REQUEST_STATUS] : {};
	const disable_users_loading = users_data && users_data[DISABLE_USERS_REQUEST_LOADING] ? users_data[DISABLE_USERS_REQUEST_LOADING] : false;

	const chatIngData = chat && chat[CHAT_KEY][CHATING_DATA] ? chat[CHAT_KEY][CHATING_DATA] : []
    const chatMessage = chatData[CHAT_MESSAGE] ? chatData[CHAT_MESSAGE] : ""
	return ({
		user_token,
		adminId,
		exportUsersRequestStatus,
		exportUsersLoading,
		enable_users_request,
		enable_users_loading,
		disable_users_request,
		disable_users_loading,
		chatMessage,
		chatIngData
	});
}

export default connect(mapToProps, {
	updateSystemData,
	updateUsersUIConstraints,
	getChatData,
	exportUsers,
	resetUserState,
	enableUsers,
	disableUsers,
	updateChatData
})(ListUsers);
