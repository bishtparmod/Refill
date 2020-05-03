import React, { PureComponent } from 'react';
import { Image, FlatList } from 'react-native';
import { WView, WText, WSpinner } from '../../ui';
import { ProductListItem } from '../product';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { OrderListView } from '.';
import OrderTypeItem from './OrderTypeItem';
import SelectOrderTypeView from './SelectOrderTypeView';
import { connect } from 'react-redux';
import { orderList, resetOrderListState } from '../../../redux/orderList/Action';
import { ORDER_LIST_KEY, ORDER_LIST_REQEUST_LOADING, ORDER_LIST_REQUEST_DATA, CURRENT_ORDER, FUTURE_ORDER, PAST_ORDER, CANCELLED_ORDER, ORDER_LIST_TYPE, ALL_ORDER } from '../../../redux/Types';

class OrderInitListView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { orderList } = this.props;

        orderList();
    }

    componentDidUpdate = (prevProps) => {
        const { order_type } = this.props;

        if (order_type !== prevProps.order_type) {
            this.init();
        }
    }

    componentWillUnmount = () => {
        const { resetOrderListState } = this.props;

        resetOrderListState();
    }

    _renderOrderList = () => {
        const { loading, order_type, navigation } = this.props;

        if (loading)
            return (
                <WView dial={5} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]}>
                    <WSpinner size={"small"} color={Colors.theme_color} />
                    <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.theme_color} >
                        please wait...
                    </WText>
                </WView>
            );

        if (order_type !== ALL_ORDER)
            return (
                <WView>
                    <OrderListView
                        navigation={navigation} />
                </WView>
            );

        return (
            <WView>
                <OrderListView
                    listType={CURRENT_ORDER}
                    navigation={navigation}
                    showViewMore={true} />
                <OrderListView
                    listType={FUTURE_ORDER}
                    navigation={navigation}
                    showViewMore={true} />
                <OrderListView
                    listType={PAST_ORDER}
                    navigation={navigation}
                    showViewMore={true} />
                <OrderListView
                    listType={CANCELLED_ORDER}
                    navigation={navigation}
                    showViewMore={true} />
            </WView>
        )
    }

    render() {
        const { container, current, future, past, cancel, loading } = this.getStyles();

        return (
            <WView dial={2} stretch backgroundColor={Colors.white}>
                <SelectOrderTypeView />
                {this._renderOrderList()}
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
                borderRadius: Utils.scaleSize(20)
            }
        })
    }
}

const mapToProps = ({ order_list }) => {
    const order_list_info = order_list && order_list[ORDER_LIST_KEY] ? order_list[ORDER_LIST_KEY] : {};

    const loading = order_list_info && order_list_info[ORDER_LIST_REQEUST_LOADING] ? order_list_info[ORDER_LIST_REQEUST_LOADING] : false;
    const order_type = order_list_info && order_list_info[ORDER_LIST_TYPE] ? order_list_info[ORDER_LIST_TYPE] : "";

    return ({
        loading: loading,
        order_type
    });
}
export default connect(mapToProps, {
    orderList,
    resetOrderListState
})(OrderInitListView);