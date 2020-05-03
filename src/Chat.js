import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router } from "react-router-dom";
import Routes from './Routes'
import { connect } from 'react-redux'
import { SYSTEM_DATA_KEY, SYSTEM_DATA_IS_AUTHENTICATED, LOGIN_KEY, LOGIN_REQEUST_SESSION_LOADING, LOGIN_REQUEST_SESSION_STATUS, STATUS, MESSAGE, SUCCESS, ERROR, SYSTEM_DATA_PAGE_TITLE, CHAT_KEY, CHAT_MESSAGE, CHAT_USER_ID, CHAT_ADMIN_ID, CHAT_LOADING, CHAT_SCHEMA, CHATING_DATA, USER_KEY, USER_DATA, CHAT_USER_NAME, OPEN_MODEL, CHAT_LIST_LOADING, CHAT_PHOTO, CHAT_PHOTO_LOADING, CHAT_IS_PHOTO } from './redux/Types';
import { sessionLogin } from './redux/login/Action';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import { Loader } from './components/base_components';
import firebase from './firebase'
import { updateChatData, adminChat, getChatData, resetChatDataState, ChatPhotoApi } from './redux/chat/Action'

class Chat extends Component {
    static propTypes = {

    }

    componentDidMount = () => {
        const { sessionLogin, getChatData, resetChatDataState, updateChatData, adminId, chatMessage } = this.props;
        const location = window.location;
        const pageName = location.pathname.indexOf('user')
        const id = location && location.pathname ? location.pathname.split("view/").length ? location.pathname.split("view/")[1] : "" : "";
        if (id && pageName !== -1) {
            updateChatData({
                [CHAT_USER_ID]: id,
                [CHAT_ADMIN_ID]: adminId,
                [CHATING_DATA]: []
            })
            getChatData()
        }
        sessionLogin();
    }

    onChangeText = (key, value) => {
        const { updateChatData } = this.props;

        updateChatData({
            [key]: value
        });
    }

    submit() {
        const { chatMessage, adminChat, chatPhoto, ChatPhotoApi } = this.props
        if (!chatMessage) return;
        if (chatPhoto) {
            ChatPhotoApi()
        } else {
            adminChat()
        }
    }

    selectPhoto() {
        document.getElementById('photo').click()
    }

    getRandomFileName = () => {
        const test = parseInt(`${new Date().getTime()}${Math.random() * 1000}`)
        return test + ".jpg";
    }

    selectChangePhoto(e) {
        var that = this
        const file = e.target.files[0]
        let reader = new FileReader();
        const changeImage = new File([file], this.getRandomFileName())
        reader.onloadend = function () {
            that.onChangeText(CHAT_MESSAGE, reader.result)
            that.onChangeText(CHAT_IS_PHOTO, true)
        }
        this.onChangeText(CHAT_PHOTO, changeImage)
        reader.readAsDataURL(file);
    }


    render() {
        const { isAuthenticated, isPhotoPresent, chatMessage, chatIngData, chatUserName, chatIngDataLoading, chatPhotoLoading, chatLoading } = this.props;

        return (
            <Fragment>
                <div class="modal fade- modal-sticky-bottom-right show" id="kt_chat_modal" role="dialog" data-backdrop="false" style={{ "display": "block;", "padding-right": "15px;" }} aria-modal="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="kt-chat">
                                <div class="kt-portlet kt-portlet--last">
                                    <div class="kt-portlet__head">
                                        <div class="kt-chat__head ">
                                            <div class="kt-chat__left">
                                                <div class="kt-chat__label">
                                                    <a href="#" class="kt-chat__title">{chatUserName}</a>
                                                    <span class="kt-chat__status">
                                                        {/* <span class="kt-badge kt-badge--dot kt-badge--success"></span> Active */}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="kt-chat__right">
                                                <button type="button" class="btn btn-clean btn-sm btn-icon" data-dismiss="modal">
                                                    <i class="flaticon2-cross"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="kt-portlet__body" id="test">
                                        <div class="kt-scroll kt-scroll--pull chat_scroll" data-height="350" data-mobile-height="300" >
                                            <div class="kt-chat__messages kt-chat__messages--solid">
                                                {chatIngDataLoading
                                                    ?
                                                    <div>Loading....</div>
                                                    :
                                                    <div>
                                                        {chatIngData && chatIngData.length
                                                            ?
                                                            chatIngData.map((ele, index) =>
                                                                <div className="w-100 d-inline-block">
                                                                    {ele.userType === "admin"
                                                                        ?
                                                                        <div class="kt-chat__message kt-chat__message--right kt-chat__message--brand" key={index}>
                                                                            {
                                                                                ele.isPhoto
                                                                                    ?
                                                                                    <div class="kt-chat__text">
                                                                                        <img src={ele.photo} height="100px" width="100px" />
                                                                                    </div>
                                                                                    :
                                                                                    <div class="kt-chat__text">
                                                                                        {ele.message}
                                                                                    </div>
                                                                            }
                                                                        </div>
                                                                        :
                                                                        <div class="kt-chat__message kt-chat__message--success" key={index}>
                                                                            {
                                                                                ele.isPhoto
                                                                                    ?
                                                                                    <div class="kt-chat__text">
                                                                                        <img src={ele.photo} height="100px" width="100px" />
                                                                                    </div>
                                                                                    :
                                                                                    <div class="kt-chat__text">
                                                                                        {ele.message}
                                                                                    </div>
                                                                            }
                                                                        </div>
                                                                    }
                                                                </div>
                                                            )
                                                            :
                                                            null}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class="kt-portlet__foot">
                                        <div class="kt-chat__input">
                                            <div class="kt-chat__editor">
                                                {
                                                    isPhotoPresent
                                                        ?
                                                        <img src={chatMessage} height="100px" width="100px" />
                                                        :
                                                        <textarea placeholder="Type here..." style={{ "height": "50px" }} onChange={(e) => this.onChangeText(CHAT_MESSAGE, e.target.value)} value={chatMessage}></textarea>
                                                }

                                            </div>
                                            <div class="kt-chat__toolbar">
                                                <div class="kt_chat__tools">
                                                    <input type="file" id="photo" hidden="true" accept="image/*" onChange={(e) => { this.selectChangePhoto(e) }} />
                                                    <a className="cursor" onClick={() => { this.selectPhoto() }}><i class="flaticon2-photograph"></i></a>
                                                </div>
                                                <div class="kt_chat__actions">
                                                    <button type="button" class="btn btn-brand btn-md  btn-font-sm btn-upper btn-bold kt-chat__reply" onClick={() => this.submit()}>
                                                        {chatLoading ? "Loading..." : chatPhotoLoading ? "Image Loading..." : "reply"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

const mapToProps = ({ system_data, login, chat, user }) => {

    const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
    const user_token = user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false;
    const adminId = user_data && user_data[USER_DATA] && user_data[USER_DATA]._id ? user_data[USER_DATA]._id : "";

    const system_data_data = system_data && system_data[SYSTEM_DATA_KEY] ? system_data[SYSTEM_DATA_KEY] : undefined;
    const isAuthenticated = system_data_data && system_data_data[SYSTEM_DATA_IS_AUTHENTICATED] ? system_data_data[SYSTEM_DATA_IS_AUTHENTICATED] : false;
    const page_title = system_data_data && system_data_data[SYSTEM_DATA_PAGE_TITLE] ? system_data_data[SYSTEM_DATA_PAGE_TITLE] : false;
    const login_data = login && login[LOGIN_KEY] ? login[LOGIN_KEY] : undefined;
    const loading = login_data && login_data[LOGIN_REQEUST_SESSION_LOADING] ? login_data[LOGIN_REQEUST_SESSION_LOADING] : false;
    const reqeustStatus = login_data && login_data[LOGIN_REQUEST_SESSION_STATUS] ? login_data[LOGIN_REQUEST_SESSION_STATUS] : {};

    const chatData = chat && chat[CHAT_KEY][CHAT_SCHEMA] ? chat[CHAT_KEY][CHAT_SCHEMA] : undefined
    const chatIngData = chatData[CHATING_DATA] ? chatData[CHATING_DATA] : []
    const chatIngDataLoading = chatData[CHAT_LIST_LOADING] ? chatData[CHAT_LIST_LOADING] : false
    const chatPhoto = chatData[CHAT_PHOTO] ? chatData[CHAT_PHOTO] : false
    const chatPhotoLoading = chatData[CHAT_PHOTO_LOADING] ? chatData[CHAT_PHOTO_LOADING] : false
    const isPhotoPresent = chatData[CHAT_IS_PHOTO] ? chatData[CHAT_IS_PHOTO] : false
    const chatMessage = chatData[CHAT_MESSAGE] ? chatData[CHAT_MESSAGE] : ""
    const chatUserId = chatData[CHAT_USER_ID] ? chatData[CHAT_USER_ID] : ""
    const chatUserName = chatData[CHAT_USER_NAME] ? chatData[CHAT_USER_NAME] : ""
    const chatAdminId = chatData[CHAT_ADMIN_ID] ? chatData[CHAT_ADMIN_ID] : ""
    const chatLoading = chatData[CHAT_LOADING] ? chatData[CHAT_LOADING] : false

    if (document.title !== page_title) {
        document.title = page_title ? page_title : "Loading..."
    }

    return ({
        isAuthenticated,
        loading,
        reqeustStatus,
        chatIngData,
        chatMessage,
        chatLoading,
        chatUserId,
        chatAdminId,
        chatUserName,
        adminId,
        chatIngDataLoading,
        chatPhoto,
        chatPhotoLoading,
        isPhotoPresent
    });
}

export default connect(mapToProps, {
    sessionLogin,
    updateChatData,
    resetChatDataState,
    adminChat,
    getChatData,
    ChatPhotoApi
})(Chat);
