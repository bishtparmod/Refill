import React, { PureComponent } from 'react';
import { Modal, Image } from 'react-native';
import { WView, WText, WRow, WTouchable } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { connect } from 'react-redux';
import { PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_REFILL_ORDER_IS_GET_NOW_VISIBLE, PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_VISIBLE, PRODUCT_DETAIL_REFILL_ORDER_IS_CANCEL_VISIBLE, PRODUCT_DETAIL_REFILL_ORDER_CANCEL_LOADING, PRODUCT_DETAIL_REFILL_ORDER_SKIP_LOADING, PRODUCT_DETAIL_REFILL_ORDER_GET_NOW_LOADING, STATUS, PRODUCT_DETAIL_REQUEST_STATUS, EMPTY, SUCCESS, ORDER_LIST_TYPE, CURRENT_ORDER, CANCELLED_ORDER, PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_UPCOMING_ORDER } from '../../../redux/Types';
import { updateProductDetailUIConstraints, cancelOrder, skipOrder, getOrderNow } from '../../../redux/prodcutDetail/Action';
import { orderList, updateOrderListUIConstraints } from '../../../redux/orderList/Action';

class ActionOrderAlert extends PureComponent {
    constructor(props) {
        super(props);
    }

    init = () => {

    }

    onClose = () => {
        const { updateProductDetailUIConstraints } = this.props;

        updateProductDetailUIConstraints({
            [PRODUCT_DETAIL_REFILL_ORDER_IS_CANCEL_VISIBLE]: false,
            [PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_VISIBLE]: false,
            [PRODUCT_DETAIL_REFILL_ORDER_IS_GET_NOW_VISIBLE]: false
        })
    }

    onSubmit = () => {
        const { is_cancel_visible, is_skip_visible, cancelOrder, skipOrder, navigation, getOrderNow, is_get_now_visible } = this.props;

        if (is_cancel_visible) {
            cancelOrder();
        }

        if (is_skip_visible) {
            skipOrder()
        }

        if (is_get_now_visible) {
            getOrderNow();
        }
    }

    getTitle = () => {
        const { is_cancel_visible, is_get_now_visible, is_skip_visible } = this.props;

        if (is_cancel_visible) return "Are you sure you want to cancel your order";
        if (is_get_now_visible) return "Are you want to get this order now";
        if (is_skip_visible) return "Are you sure you want to skip your order";
    }

    componentDidUpdate = (prevProps) => {
        const { type, updateProductDetailUIConstraints, orderList, navigation, is_get_now_visible, updateOrderListUIConstraints } = this.props;

        if (type !== prevProps.type) {
            if (type === SUCCESS) {
                updateOrderListUIConstraints({
                    [ORDER_LIST_TYPE]: is_get_now_visible ? CURRENT_ORDER : CANCELLED_ORDER
                })
                if (navigation) {
                    navigation.pop();
                }

                orderList();
            }

            if (type != EMPTY) {
                updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REFILL_ORDER_IS_CANCEL_VISIBLE]: false,
                    [PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_VISIBLE]: false,
                    [PRODUCT_DETAIL_REFILL_ORDER_IS_GET_NOW_VISIBLE]: false
                })
            }
        }
    }

    _onSkipUpcomingOrder = () => {
        const { updateProductDetailUIConstraints, skip_upcoming_order } = this.props;

        updateProductDetailUIConstraints({
            [PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_UPCOMING_ORDER]: !skip_upcoming_order
        });
    }

    _renderSkipUpcommingOrder = () => {
        const { is_get_now_visible, skip_upcoming_order } = this.props;
        const { dotContainer, dotStyle } = this.getStyles();

        if (!is_get_now_visible) return null;

        return (
            <WTouchable onPress={this._onSkipUpcomingOrder.bind(this)}>
                <WRow dial={4} padding={[10, 0]}>
                    <WView dial={5} padding={[2, 2]} stretch style={dotContainer}>
                        <WView style={dotStyle} backgroundColor={skip_upcoming_order ? Colors.theme_color : Colors.white} />
                    </WView>
                    <WView dial={4} padding={[0, 10]}>
                        <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_dark} center lines={4}>
                            Skip Upcoming Order
                    </WText>
                    </WView>
                </WRow>
            </WTouchable>
        );
    }

    render() {
        const { coatainer, imgStyle, submitBtnStyle, cancelBtnStyle } = this.getStyles();
        const { is_get_now_visible, is_skip_visible, is_cancel_visible, cancel_loading, skip_loading, get_now_loading } = this.props;
        const skipIcon = require("../../../../assets/img/skip.png");
        const getNowIcon = require("../../../../assets/img/getNow.png");
        console.log("order_custom_dates ===> ");

        return (
            <Modal
                visible={is_cancel_visible || is_get_now_visible || is_skip_visible}
                animationType={"fade"}
                transparent={true}
                onRequestClose={() => {

                }}
            >
                <WView dial={5} flex backgroundColor={"rgba(255, 255, 255, 0.5)"}>
                    <WView dial={5} stretch backgroundColor={Colors.white} margin={[Utils.scaleSize(20), Utils.scaleSize(15)]} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]} style={coatainer}>
                        <WView dial={5}>
                            <Image source={is_skip_visible ? skipIcon : getNowIcon} style={imgStyle} resizeMode={"contain"} />
                        </WView>
                        <WText margin={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(18)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} center lines={4}>
                            {this.getTitle()}
                        </WText>
                        {this._renderSkipUpcommingOrder()}
                        <WRow dial={5} spaceBetween>
                            <WButton
                                isLoading={skip_loading | cancel_loading | get_now_loading}
                                onPress={this.onSubmit.bind(this)}
                                containerStyle={submitBtnStyle}
                                label={"Yes"} />

                            <WButton
                                containerStyle={cancelBtnStyle}
                                onPress={this.onClose.bind(this)}
                                label={"No"} />
                        </WRow>
                    </WView>
                </WView>
            </Modal>
        );
    }

    getStyles = () => {

        return ({
            coatainer: {
                borderRadius: Utils.scaleSize(10),
                backgroundColor: Colors.white,
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            },
            imgStyle: {
                width: Utils.scaleSize(100),
                height: Utils.scaleSize(100)
            },
            submitBtnStyle: {
                backgroundColor: Colors.theme_color,
                flex: 1,
                alignSelf: 'stretch',
                maxWidth: Utils.scaleSize(100),
                height: Utils.scaleSize(30),
                borderRadius: Utils.scaleSize(18)
            },
            cancelBtnStyle: {
                backgroundColor: Colors.cancel_tile_color,
                flex: 1,
                alignSelf: 'stretch',
                maxWidth: Utils.scaleSize(100),
                height: Utils.scaleSize(30),
                borderRadius: Utils.scaleSize(18)
            },
            dotContainer: {
                width: Utils.scaleSize(20),
                height: Utils.scaleSize(20),
                borderRadius: Utils.scaleSize(10),
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: Colors.theme_color
            },
            dotStyle: {
                flex: 1,
                borderRadius: Utils.scaleSize(10)
            }
        });
    }
}

const mapToProps = ({ product_detail }) => {
    const product_detail_info = product_detail && product_detail[PRODUCT_DETAIL_KEY] ? product_detail[PRODUCT_DETAIL_KEY] : {};

    const is_get_now_visible = product_detail_info && product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_IS_GET_NOW_VISIBLE] ? product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_IS_GET_NOW_VISIBLE] : false;
    const is_skip_visible = product_detail_info && product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_VISIBLE] ? product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_VISIBLE] : false;
    const is_cancel_visible = product_detail_info && product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_IS_CANCEL_VISIBLE] ? product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_IS_CANCEL_VISIBLE] : false;

    const skip_upcoming_order = product_detail_info && product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_UPCOMING_ORDER] ? product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_UPCOMING_ORDER] : false;

    const cancel_loading = product_detail_info && product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_CANCEL_LOADING] ? product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_CANCEL_LOADING] : false;
    const skip_loading = product_detail_info && product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_SKIP_LOADING] ? product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_SKIP_LOADING] : false;
    const get_now_loading = product_detail_info && product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_GET_NOW_LOADING] ? product_detail_info[PRODUCT_DETAIL_REFILL_ORDER_GET_NOW_LOADING] : false;

    const request_status = product_detail_info && product_detail_info[PRODUCT_DETAIL_REQUEST_STATUS] ? product_detail_info[PRODUCT_DETAIL_REQUEST_STATUS] : {};
    const type = request_status && request_status[STATUS] ? request_status[STATUS] : '';

    return ({
        is_get_now_visible,
        is_skip_visible,
        is_cancel_visible,
        cancel_loading,
        skip_loading,
        get_now_loading,
        type,
        skip_upcoming_order
    });
}
export default connect(mapToProps, {
    updateProductDetailUIConstraints,
    updateOrderListUIConstraints,
    skipOrder,
    cancelOrder,
    orderList,
    getOrderNow
})(ActionOrderAlert);