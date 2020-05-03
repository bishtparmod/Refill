import React, { PureComponent } from 'react';
import { Image, FlatList, RefreshControl } from 'react-native';
import { WView, WText, WTouchable } from '../../ui';
import { ProductListItem } from '../product';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { ORDER_LIST_KEY, ORDER_LIST_REQEUST_LOADING, ORDER_LIST_REQUEST_DATA, CURRENT_ORDER, FUTURE_ORDER, PAST_ORDER, CANCELLED_ORDER, ALL_ORDER, ORDER_LIST_TYPE, ORDER_LIST_REQUEST_PAGE_SIZE, ORDER_LIST_REQEUST_ON_END_REACHED_LOADING, ORDER_LIST_REQEUST_REFRESH_LOADING, ORDER_LIST_REQUEST_PAGE, ORDER_LIST_REQEUST_ON_END_REACHED_DONE } from '../../../redux/Types';
import { connect } from 'react-redux';
import { OrderProductItem } from '.';
import { orderList, updateOrderListUIConstraints } from '../../../redux/orderList/Action';

class OrderListView extends PureComponent {
    constructor(props) {
        super(props);
    }

    getData = () => {
        const { listType, current, future, past, cancel, data, order_type } = this.props;

        if (order_type !== ALL_ORDER) return data;

        switch (listType) {
            case CURRENT_ORDER:
                return current;
            case FUTURE_ORDER:
                return future;
            case PAST_ORDER:
                return past;
            case CANCELLED_ORDER:
                return cancel;
        }
    }

    getTitle = () => {
        const { listType, order_type } = this.props;

        if (order_type === ALL_ORDER)
            switch (listType) {
                case CURRENT_ORDER:
                    return "Current Order";
                case FUTURE_ORDER:
                    return "Future Order";
                case PAST_ORDER:
                    return "Past Order";
                case CANCELLED_ORDER:
                    return "Cancel Order";
            }

        switch (order_type) {
            case CURRENT_ORDER:
                return "Current Order";
            case FUTURE_ORDER:
                return "Future Order";
            case PAST_ORDER:
                return "Past Order";
            case CANCELLED_ORDER:
                return "Cancel Order";
        }
    }

    onRefresh = () => {
        const { orderList } = this.props;

        orderList(true);
    }

    pressOrderType = () => {
        const { listType, updateOrderListUIConstraints, order_type } = this.props;

        if (listType === order_type) return;

        updateOrderListUIConstraints({
            [ORDER_LIST_TYPE]: listType,
            [ORDER_LIST_REQUEST_DATA]: [],
            [ORDER_LIST_REQUEST_PAGE]: 1
        });
    }

    render() {
        const { container, subContainer } = this.getStyles();
        const { navigation, page, on_end_reached_loading, loading, refresh_loading, orderList, updateOrderListUIConstraints, showViewMore, on_end_reached_done } = this.props;
        
        return (
            <WView dial={2} stretch margin={[Utils.scaleSize(10), Utils.scaleSize(10)]} padding={[Utils.scaleSize(20), 0]} style={container} backgroundColor={Colors.white}>
                <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(10)]} fontSize={Utils.scaleSize(20)} fontWeight={"700"} color={Colors.text_color_dark} >
                    {this.getTitle()}
                </WText>
                <FlatList
                    data={this.getData().length ? this.getData() : []}
                    style={subContainer}
                    refreshControl={
                        <RefreshControl refreshing={refresh_loading} onRefresh={this.onRefresh.bind(this)} />
                    }
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <WText fontFamily={"Poppins-Bold"} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_light_dark} center>
                            Empty Order List
                        </WText>
                    }
                    ListFooterComponent={
                        showViewMore && this.getData().length >= 4 ?
                            <WTouchable dial={5} onPress={this.pressOrderType.bind(this)} padding={[0, Utils.scaleSize(10)]}>
                                <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.theme_color} >
                                    View More
                                </WText>
                            </WTouchable>
                            :
                            on_end_reached_loading ?
                                <WView dial={5} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]}>
                                    <WSpinner size={"small"} color={Colors.theme_color} />
                                </WView> : null
                    }
                    keyExtractor={(ele, index) => `order-list-${index}`}
                    onEndReachedThreshold={1}
                    onEndReached={() => {
                        if (showViewMore || on_end_reached_done) return;

                        if (!on_end_reached_loading) {
                            console.log("loading");
                            updateOrderListUIConstraints({
                                [ORDER_LIST_REQUEST_PAGE]: page + 1
                            });
                            orderList(false, true);
                        }
                    }}
                    renderItem={({ item, index }) => {

                        return (
                            <OrderProductItem item={item} navigation={navigation} />
                        );
                    }}
                />
            </WView>
        );
    }

    getStyles = () => {
        return ({
            container: {
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                borderRadius: Utils.scaleSize(20),
                minHeight: Utils.scaleSize(200)
            },
            subContainer: {
                maxHeight: Utils.getDeviceDimentions().height
            }
        })
    }
}

const mapToProps = ({ order_list }) => {
    const order_list_info = order_list && order_list[ORDER_LIST_KEY] ? order_list[ORDER_LIST_KEY] : {};

    const loading = order_list_info && order_list_info[ORDER_LIST_REQEUST_LOADING] ? order_list_info[ORDER_LIST_REQEUST_LOADING] : false;
    const refresh_loading = order_list_info && order_list_info[ORDER_LIST_REQEUST_REFRESH_LOADING] ? order_list_info[ORDER_LIST_REQEUST_REFRESH_LOADING] : false;
    const on_end_reached_loading = order_list_info && order_list_info[ORDER_LIST_REQEUST_ON_END_REACHED_LOADING] ? order_list_info[ORDER_LIST_REQEUST_ON_END_REACHED_LOADING] : false;
    const on_end_reached_done = order_list_info && order_list_info[ORDER_LIST_REQEUST_ON_END_REACHED_DONE] ? order_list_info[ORDER_LIST_REQEUST_ON_END_REACHED_DONE] : false;
    const order_type = order_list_info && order_list_info[ORDER_LIST_TYPE] ? order_list_info[ORDER_LIST_TYPE] : "";
    const data = order_list_info && order_list_info[ORDER_LIST_REQUEST_DATA] ? order_list_info[ORDER_LIST_REQUEST_DATA] : {};
    const current = data && data.current ? data.current : [];
    const future = data && data.future ? data.future : [];
    const past = data && data.past ? data.past : [];
    const cancel = data && data.cancel ? data.cancel : [];

    const page = order_list_info && order_list_info[ORDER_LIST_REQUEST_PAGE] ? order_list_info[ORDER_LIST_REQUEST_PAGE] : undefined;
    const page_size = order_list_info && order_list_info[ORDER_LIST_REQUEST_PAGE_SIZE] ? order_list_info[ORDER_LIST_REQUEST_PAGE_SIZE] : undefined;

    return ({
        loading,
        refresh_loading,
        on_end_reached_loading,
        current,
        future,
        past,
        cancel,
        data,
        order_type,
        on_end_reached_done,

        page,
        page_size
    });
}
export default connect(mapToProps, {
    orderList,
    updateOrderListUIConstraints
})(OrderListView);