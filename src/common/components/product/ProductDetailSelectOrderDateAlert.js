import React, { PureComponent } from 'react';
import { Modal, View, Animated, Image, PanResponder } from 'react-native';
import { WView, WText, WRow, WTouchable } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { Calendar } from '../../base_components';
import { connect } from 'react-redux';
import { PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_FORM, PRODUCT_DETAIL_IS_ORDER_CALENDAR_ALERT, PRODUCT_DETAIL_FORM_ORDER_TYPE, CUSTOM_ORDER, PRODUCT_DETAIL_FORM_ORDER_START_DATE, PRODUCT_DETAIL_FORM_ORDER_END_DATE, WEEKLY_ORDER, PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES, PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST } from '../../../redux/Types';
import { updateProductDetailUIConstraints, updateProductDetailFormData, orderEstimateData } from '../../../redux/prodcutDetail/Action';
import moment from 'moment-timezone';

class ProductDetailSelectOrderDateAlert extends PureComponent {
    constructor(props) {
        super(props);

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                const { dy, vy } = gestureState;

                if (dy > 0) {
                    this.containerAnim.setValue(dy);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                const { dy, vy } = gestureState;
                const { updateProductDetailUIConstraints, updateProductDetailFormData } = this.props;

                if (dy > 150) {
                    Animated.spring(this.containerAnim, {
                        toValue: Utils.getDeviceDimentions().height
                    }).start();

                    updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_IS_ORDER_CALENDAR_ALERT]: false
                    });
                    updateProductDetailFormData({
                        [PRODUCT_DETAIL_FORM_ORDER_START_DATE]: "",
                        [PRODUCT_DETAIL_FORM_ORDER_END_DATE]: "",
                        [PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES]: []
                    });
                    return;
                }
                Animated.spring(this.containerAnim, {
                    toValue: 0
                }).start();
            }
        });

        this.containerAnim = new Animated.Value(0);
    }

    componentDidUpdate = (prevProps) => {
        const { is_visible, updateProductDetailFormData, order_type } = this.props;

        if (is_visible !== prevProps.is_visible) {
            if (is_visible) {
                this.init();
            }

            if (order_type !== CUSTOM_ORDER) {
                updateProductDetailFormData({
                    [PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES]: ""
                });
            }
        }
    }

    init = () => {
        Animated.spring(this.containerAnim, {
            toValue: 0,
            tension: 1
        }).start();
    }

    onClose = () => {
        const { updateProductDetailUIConstraints, orderEstimateData } = this.props;

        orderEstimateData();
        updateProductDetailUIConstraints({
            [PRODUCT_DETAIL_IS_ORDER_CALENDAR_ALERT]: false
        })
    }

    onDateChange = (date) => {
        const { order_type, order_start_date, order_end_date, order_custom_dates, updateProductDetailFormData } = this.props;

        switch (order_type) {
            case CUSTOM_ORDER:
                let dates = order_custom_dates && order_custom_dates.length ? order_custom_dates : [];
                const index = dates.indexOf(date.toISOString());
                this.selected_date_index = index;

                if (index === -1) {
                    dates.push(date.toISOString());
                } else {
                    dates.splice(index, 1);
                    this.calendar_ref.resetSelections();
                }

                dates.sort(function (x, y) {
                    if (new Date(x) < new Date(y)) {
                        return -1;
                    }
                    if (new Date(x) > new Date(y)) {
                        return 1;
                    }
                    return 0;
                });
                updateProductDetailFormData({
                    [PRODUCT_DETAIL_FORM_ORDER_START_DATE]: "",
                    [PRODUCT_DETAIL_FORM_ORDER_END_DATE]: "",
                    [PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES]: dates
                });
                break;
            default:
                if (!order_start_date || (order_start_date && order_end_date) || (order_start_date && new Date(order_start_date) > new Date(date.toISOString()))) {
                    updateProductDetailFormData({
                        [PRODUCT_DETAIL_FORM_ORDER_START_DATE]: date.toISOString(),
                        [PRODUCT_DETAIL_FORM_ORDER_END_DATE]: ""
                    });
                } else {
                    updateProductDetailFormData({
                        [PRODUCT_DETAIL_FORM_ORDER_END_DATE]: date.toISOString()
                    });
                }
        }
    }

    OrderDateItem = ({ dotBackgroundColor, label, date }) => {
        const { iconContainerStyle, iconStyle, orderItemContainerStyle, dotStyle } = this.getStyles();
        const iconPath = require("../../../../assets/img/right_arrow.png");

        return (
            <WRow dial={4} style={orderItemContainerStyle}>
                <WView style={dotStyle} margin={[0, Utils.scaleSize(10)]} backgroundColor={dotBackgroundColor} />
                <WView flex>
                    <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>{label}</WText>
                    <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_light_dark} left>{date ? moment(date).format('MMMM DD, YYYY') : "Select Date"}</WText>
                </WView>
                <WView>
                    <WView dial={5} stretch style={iconContainerStyle} padding={[Utils.scaleSize(5), Utils.scaleSize(5)]}>
                        <Image source={iconPath} style={iconStyle} resizeMode={"contain"} />
                    </WView>
                </WView>
            </WRow>
        );
    }

    render() {
        const { container, topNotchStyle, submitBtnStyle } = this.getStyles();
        const { is_visible, allowRangeSelection, order_start_date, order_end_date, order_type, order_custom_dates } = this.props;
        console.log("order_custom_dates ===> ", this.selected_date_index);

        return (
            <Modal
                visible={is_visible}
                transparent={true}
                onRequestClose={() => {

                }}
            >
                <WView dial={8} flex backgroundColor={"rgba(0, 0, 0, 0.5)"}>
                    <Animated.View style={container} {...this._panResponder.panHandlers}>
                        <Animated.View >
                            <WView style={topNotchStyle} />
                        </Animated.View>
                        <WText margin={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(18)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} center>Choose Date</WText>
                        <Calendar
                            getRef={ref => this.calendar_ref = ref}
                            allowRangeSelection={allowRangeSelection}
                            customDatesStyles={order_custom_dates.map(ele => {
                                return ({
                                    date: ele,
                                    style: { backgroundColor: Colors.theme_color },
                                    textStyle: { color: Colors.white }
                                });
                            })}
                            todayBackgroundColor={'transparent'}
                            selectedStartDate={order_start_date}
                            selectedEndDate={order_end_date}
                            onDateChange={this.onDateChange.bind(this)} />
                        <WView dial={4} stretch>
                            {
                                order_type !== CUSTOM_ORDER ?
                                    <WView>
                                        <WText margin={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_dark} left>Start Date & End Date</WText>
                                        <this.OrderDateItem
                                            dotBackgroundColor={Colors.start_date}
                                            label={"Start Date"}
                                            date={order_start_date} />
                                        <this.OrderDateItem
                                            dotBackgroundColor={Colors.end_date}
                                            label={"End Date"}
                                            date={order_end_date} />
                                    </WView>
                                    : null
                            }
                            <WButton
                                onPress={this.onClose.bind(this)}
                                containerStyle={submitBtnStyle}
                                label={"Done"} />
                        </WView>
                    </Animated.View>
                </WView>
            </Modal>
        );
    }

    getStyles = () => {

        return ({
            container: {
                backgroundColor: Colors.white,
                borderTopLeftRadius: Utils.scaleSize(30),
                borderTopRightRadius: Utils.scaleSize(30),
                justifyContent: 'center',
                alignSelf: 'stretch',
                alignItems: 'stretch',
                transform: [{
                    translateY: this.containerAnim
                }],
                paddingHorizontal: Utils.scaleSize(10)
            },
            iconContainerStyle: {
                width: Utils.scaleSize(30),
                height: Utils.scaleSize(30),
                borderRadius: Utils.scaleSize(5),
                backgroundColor: Colors.text_color_dark,
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            },
            iconStyle: {
                width: null,
                height: null,
                flex: 1,
                tintColor: Colors.white
            },
            topNotchStyle: {
                width: Utils.scaleSize(100),
                minHeight: Utils.scaleSize(5),
                borderRadius: Utils.scaleSize(3),
                backgroundColor: Colors.light_color,
                marginVertical: Utils.scaleSize(10),
                alignSelf: 'center'
            },
            orderItemContainerStyle: {
                borderBottomWidth: 1,
                borderColor: Colors.light_color,
                borderStyle: 'solid'
            },
            dotStyle: {
                width: Utils.scaleSize(10),
                minHeight: Utils.scaleSize(10),
                borderRadius: Utils.scaleSize(5)
            },
            submitBtnStyle: {
                backgroundColor: Colors.theme_color,
                flex: 1,
                alignSelf: 'stretch',
                minHeight: Utils.scaleSize(30),
                borderRadius: Utils.scaleSize(15),
                marginVertical: Utils.scaleSize(20)
            }
        });
    }
}

const mapToProps = ({ product_detail }) => {
    const product_detail_info = product_detail && product_detail[PRODUCT_DETAIL_KEY] ? product_detail[PRODUCT_DETAIL_KEY] : {};
    const form_data = product_detail_info && product_detail_info[PRODUCT_DETAIL_FORM] ? product_detail_info[PRODUCT_DETAIL_FORM] : {};

    const is_visible = product_detail_info && product_detail_info[PRODUCT_DETAIL_IS_ORDER_CALENDAR_ALERT] ? product_detail_info[PRODUCT_DETAIL_IS_ORDER_CALENDAR_ALERT] : false;
    const order_type = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_TYPE] ? form_data[PRODUCT_DETAIL_FORM_ORDER_TYPE] : "";
    const order_start_date = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_START_DATE] ? form_data[PRODUCT_DETAIL_FORM_ORDER_START_DATE] : "";
    const order_end_date = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_END_DATE] ? form_data[PRODUCT_DETAIL_FORM_ORDER_END_DATE] : "";
    const order_custom_dates = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES] ? form_data[PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES] : [];
    const allowRangeSelection = order_type === CUSTOM_ORDER ? false : true;

    return ({
        is_visible,
        order_type,
        allowRangeSelection,
        order_start_date,
        order_end_date,
        order_custom_dates,
        length: order_custom_dates.length
    });
}
export default connect(mapToProps, {
    updateProductDetailUIConstraints,
    updateProductDetailFormData,
    orderEstimateData
})(ProductDetailSelectOrderDateAlert);