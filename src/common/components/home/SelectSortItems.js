import React, { PureComponent } from 'react';
import { Modal, View, Animated, Image, PanResponder } from 'react-native';
import { WView, WText, WRow, WTouchable } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { connect } from 'react-redux';
import { PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_IS_ORDER_TYPE_ALERT, PRODUCT_DETAIL_FORM_ORDER_TYPE, PRODUCT_DETAIL_FORM, WEEKLY_ORDER, TWO_WEEKLY_ORDER, THREE_WEEKLY_ORDER, FOUR_WEEKLY_ORDER, EIGHT_WEEKLY_ORDER, CUSTOM_ORDER, PRODUCT_DETAIL_ERRORS, PRODUCT_DETAIL_FORM_ORDER_START_DATE, PRODUCT_DETAIL_FORM_ORDER_END_DATE, PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES, PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST, SORT_NAME_A_TO_Z, SORT_NAME_Z_TO_A, SORT_PRICE_LOW_TO_HIGH, SORT_PRICE_HIGH_TO_LOW, HOME_REQUEST_SUB_CATEGORY_IS_VISIBLE_SORT_ALERT, HOME_REQUEST_SUB_CATEGORY_SELECTED_SORT, HOME_KEY } from '../../../redux/Types';
import { updateHomeUIConstraints, listSubCategoryProductsListData } from '../../../redux/home/Action';

class SelectSortItems extends PureComponent {
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
                const { updateHomeUIConstraints } = this.props;

                if (dy > 100) {
                    Animated.spring(this.containerAnim, {
                        toValue: Utils.getDeviceDimentions().height
                    }).start();
                    updateHomeUIConstraints({
                        [HOME_REQUEST_SUB_CATEGORY_IS_VISIBLE_SORT_ALERT]: false
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
        const { is_visible } = this.props;

        if (prevProps.is_visible !== is_visible) {
            if (is_visible) {
                this.init();
            }
        }
    }

    init = () => {
        Animated.spring(this.containerAnim, {
            toValue: 0,
            tension: 1
        }).start();
    }

    selecteOrderType = (type) => {
        const { updateHomeUIConstraints, listSubCategoryProductsListData } = this.props;

        updateHomeUIConstraints({
            [HOME_REQUEST_SUB_CATEGORY_SELECTED_SORT]: type
        });
        listSubCategoryProductsListData();
    }

    OrderTypeItem = ({ label, type }) => {
        const { iconContainerStyle, iconStyle, orderItemContainerStyle } = this.getStyles();
        const { selected_sort } = this.props;
        const checked = require("../../../../assets/img/checked_checkbox.png");
        const unchecked = require("../../../../assets/img/unchecked_checkbox.png");
        const is_checked = selected_sort === type ? true : false;

        return (
            <WRow dial={4} padding={[Utils.scaleSize(5), 0]} style={orderItemContainerStyle}>
                <WView flex>
                    <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_light_dark} left>{label}</WText>
                </WView>
                <WView>
                    <WTouchable dial={5} stretch style={iconContainerStyle} padding={[Utils.scaleSize(5), Utils.scaleSize(5)]} onPress={this.selecteOrderType.bind(this, type)}>
                        <Image source={is_checked ? checked : unchecked} style={iconStyle} resizeMode={"contain"} />
                    </WTouchable>
                </WView>
            </WRow>
        );
    }

    render() {
        const { container, topNotchStyle } = this.getStyles();
        const { is_visible } = this.props;

        return (
            <Modal
                visible={is_visible}
                transparent={true}
                onRequestClose={() => {

                }}
            >
                <WView dial={8} flex backgroundColor={"rgba(0, 0, 0, 0.5)"}>
                    <Animated.View style={container} {...this._panResponder.panHandlers}>
                        <Animated.View>
                            <WView style={topNotchStyle} />
                        </Animated.View>
                        <WText margin={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(18)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} center>Sort List</WText>
                        <WView dial={4}>
                            <this.OrderTypeItem
                                type={SORT_NAME_A_TO_Z}
                                label={"Name A-Z"} />
                            <this.OrderTypeItem
                                type={SORT_NAME_Z_TO_A}
                                label={"Name Z-A"} />
                            <this.OrderTypeItem
                                type={SORT_PRICE_LOW_TO_HIGH}
                                label={"Price Low to High"} />
                            <this.OrderTypeItem
                                type={SORT_PRICE_HIGH_TO_LOW}
                                label={"Price High to Low"} />
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
                height: Utils.scaleSize(30)
            },
            iconStyle: {
                width: null,
                height: null,
                flex: 1,
                tintColor: Colors.text_color_dark
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
            }
        });
    }
}


const mapToProps = ({ home }) => {
    const home_info = home && home[HOME_KEY] ? home[HOME_KEY] : {};

    const is_visible = home_info && home_info[HOME_REQUEST_SUB_CATEGORY_IS_VISIBLE_SORT_ALERT] ? home_info[HOME_REQUEST_SUB_CATEGORY_IS_VISIBLE_SORT_ALERT] : false;
    const selected_sort = home_info && home_info[HOME_REQUEST_SUB_CATEGORY_SELECTED_SORT] ? home_info[HOME_REQUEST_SUB_CATEGORY_SELECTED_SORT] : "";

    return ({
        is_visible,
        selected_sort
    });
}
export default connect(mapToProps, {
    updateHomeUIConstraints,
    listSubCategoryProductsListData
})(SelectSortItems);