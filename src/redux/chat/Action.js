import Utils from '../../components/util/Utils';
import { CHAT_ROOT, CHAT_KEY, CHAT_UPDATE, CHAT_REQUEST_STATUS, EMPTY, MESSAGE, STATUS, CHAT_LOADING, CHAT_MESSAGE, CHAT_ADMIN_ID, CHAT_USER_ID, SUCCESS, CHAT_SCHEMA, CHAT_RESET, CHATING_DATA, LOAD, CHAT_IS_PHOTO, CHAT_PHOTO, CHAT_LIST_LOADING, CHAT_PHOTO_LOADING } from '../Types';
import firebase from '../../firebase'
import { refillChatUploadFile } from '../../apis/APIs'

/** Manage Chat Data */
const updateChatDataState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CHAT_ROOT][CHAT_KEY];

            dispatch({
                type: CHAT_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Login State ===> error ", error);
        }
    }
}

/** Update chat data state */
export const updateChatData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CHAT_ROOT][CHAT_KEY]
            const data = Object.assign(formData[CHAT_SCHEMA], obj);

            dispatch(updateChatDataState(Object.assign(formData, {
                [CHAT_SCHEMA]: data
            })));
        } catch (error) {
            Utils.log("Update Form Data ===> error ", error);
        }
    }
}


/** Get Chat data state */
export const getChatData = () => {
    return (dispatch, getState) => {
        try {
            const data = getState()[CHAT_ROOT][CHAT_KEY][CHAT_SCHEMA];
            const chatArray = getState()[CHAT_ROOT][CHAT_KEY][CHAT_SCHEMA].chating_data;
            dispatch(updateChatData({
                [CHAT_LIST_LOADING]: true
            }))
            var db = firebase.firestore();

            db.collection("users").where("userId", "==", data[CHAT_USER_ID])
                .onSnapshot(function (querySnapshot) {
                    var array1 = [];

                    querySnapshot.forEach((doc) => {
                        console.log("Current cities in CA: ", `${doc.id} => ${JSON.stringify(doc.data())}`);
                        array1.push(doc.data())
                    });
                    array1.sort(function (a, b) {
                        return new Date(a.createdDate) - new Date(b.createdDate);
                    });

                    dispatch(updateChatData({
                        [CHATING_DATA]: array1,
                        [CHAT_LIST_LOADING]: false
                    }));

                });

        } catch (error) {
            Utils.log("Update User Data ===> error ", error);
        }
    }
}

/** Chat data state */
export const adminChat = (obj) => {
    return (dispatch, getState) => {
        try {
            const data = getState()[CHAT_ROOT][CHAT_KEY][CHAT_SCHEMA];

            dispatch(updateChatDataState({
                [CHAT_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
            }));
            dispatch(updateChatData({
                [CHAT_LOADING]: true
            }))

            var db = firebase.firestore();
            db.collection("users").add({
                message: data[CHAT_MESSAGE],
                adminId: data[CHAT_ADMIN_ID],
                userId: data[CHAT_USER_ID],
                photo: data[CHAT_PHOTO],
                isPhoto: data[CHAT_IS_PHOTO],
                userType: "admin",
                createdDate: new Date().getTime()
            })
                .then(function (docRef) {
                    dispatch(updateChatDataState({
                        [CHAT_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: ""
                        }
                    }));
                    dispatch(updateChatData({
                        [CHAT_MESSAGE]: "",
                        [CHAT_LOADING]: false
                    }))
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });
        } catch (error) {
            Utils.log("Update User Data ===> error ", error);
        }
    }
}


export const ChatPhotoApi = () => {
    return (dispatch, getState) => {
        try {

            const data = getState()[CHAT_ROOT][CHAT_KEY][CHAT_SCHEMA];

            dispatch(updateChatDataState({
                [CHAT_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
            }));

            dispatch(updateChatData({
                [CHAT_PHOTO_LOADING]: true
            }))

            const image = data[CHAT_PHOTO]
            refillChatUploadFile(image).then((res) => {
                var db = firebase.firestore();
                db.collection("users").add({
                    message: "",
                    adminId: data[CHAT_ADMIN_ID],
                    userId: data[CHAT_USER_ID],
                    photo: res.location,
                    isPhoto: data[CHAT_IS_PHOTO],
                    userType: "admin",
                    createdDate: new Date().getTime()
                }).then(function (docRef) {
                    dispatch(updateChatDataState({
                        [CHAT_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: ""
                        }
                    }));
                    dispatch(updateChatData({
                        [CHAT_PHOTO_LOADING]: false,
                        [CHAT_PHOTO]: "",
                        [CHAT_IS_PHOTO]: false,
                        [CHAT_MESSAGE]: ""
                    }))
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });
            }).catch((err) => {
                console.log(err)
            })




        } catch (error) {
            Utils.log("Update User Data ===> error ", error);
        }
    }
}


/** Reset Offer data state */
export const resetChatDataState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: CHAT_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Reset Offer Data State ===> error ", error);
        }
    }
}