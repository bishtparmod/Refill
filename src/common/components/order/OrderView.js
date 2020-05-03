import React, { PureComponent } from 'react';
import { Image, FlatList } from 'react-native';
import { WView, WText, WRow } from '../../ui';
import { ProductListItem } from '../product';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { orderView, resetOrderViewState } from '../../../redux/orderView/Action';
import { connect } from 'react-redux';
import { ORDER_VIEW_KEY, ORDER_VIEW_REQUEST_DATA, ORDER_VIEW_REQEUST_LOADING, SERVER_ORDER_STATUS_RECEIVED, SERVER_ORDER_STATUS_PROCESSED, SERVER_ORDER_STATUS_SHIPPED, SERVER_ORDER_STATUS_DELIVERED, PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_REQUEST_LOADING, PRODUCT_DETAIL_REQUEST_DATA } from '../../../redux/Types';
import moment from 'moment-timezone';
import { orderDetail, updateProductDetailUIConstraints } from '../../../redux/prodcutDetail/Action';

class OrderView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { orderView } = this.props
        orderView();
    }

    OrderItem = ({ isLine = true, dotNumber, label, date }) => {
        const { dotStyle, horizontalLineStyle } = this.getStyles();

        return (
            <WRow>
                <WView dial={2} padding={[0, Utils.scaleSize(10)]}>
                    <WView style={dotStyle} dial={5} backgroundColor={this.isLineProgressLine(dotNumber) ? Colors.theme_color : Colors.light_color}>
                        <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.white} >
                            {dotNumber}
                        </WText>
                    </WView>
                    {
                        isLine ?
                            <WView style={horizontalLineStyle} backgroundColor={this.isLineProgressLine(dotNumber + 1) ? Colors.theme_color : Colors.light_color} />
                            : null
                    }
                </WView>
                <WView flex>
                    <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_dark} >
                        {label}
                    </WText>
                    <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"500"} color={Colors.text_color_dark} >
                        {date}
                    </WText>
                </WView>
            </WRow>
        );
    }

    componentWillUnmount = () => {
        const { resetOrderViewState } = this.props;

        resetOrderViewState();
    }

    isLineProgressLine = (index) => {
        const { order_status } = this.props;

        console.log("index ===> ", index, order_status);
        switch (order_status) {
            case SERVER_ORDER_STATUS_RECEIVED:
                return 1 >= index;
            case SERVER_ORDER_STATUS_PROCESSED:
                return 2 >= index;
            case SERVER_ORDER_STATUS_SHIPPED:
                return 3 >= index;
            case SERVER_ORDER_STATUS_DELIVERED:
                return 4 >= index;
            default:
                return false;
        }
    }

    reorder = () => {
        const { orderDetail, updateProductDetailUIConstraints, is_reorder_loading, data = {} } = this.props;
        const { productDetail = {} } = data;
        if (is_reorder_loading) return;

        updateProductDetailUIConstraints({
            [PRODUCT_DETAIL_REQUEST_DATA]: productDetail,
        });
        orderDetail();
    }

    _renderLoading = () => {
        const { loading } = this.props;

        if (!loading) return;

        return (
            <WView dial={5} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]}>
                <WSpinner size={"small"} color={Colors.theme_color} />
                <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.theme_color} >
                    please wait...
                    </WText>
            </WView>
        );
    }

    _renderProgressOrderStatus = () => {
        const {
            order_id,
            loading,
            received_order_date,
            processed_order_date,
            shipped_order_date,
            delivered_order_date,
            is_reorder_loading,
            is_delivered,
            onBack
        } = this.props;
        const { reorderBtnStyle } = this.getStyles();

        if (loading) return null;

        if (!order_id) {
            return (
                <WView dial={5} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]}>
                    <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.light_color} >
                        No Data Found
                    </WText>
                </WView>
            );
        }

        return (
            <WView margin={[Utils.scaleSize(20), 0]}>
                <this.OrderItem
                    label={"Order Received"}
                    date={received_order_date}
                    dotNumber={1} />
                <this.OrderItem
                    label={"Order Approved"}
                    date={processed_order_date}
                    dotNumber={2} />
                <this.OrderItem
                    label={"Order Shipped"}
                    date={shipped_order_date}
                    dotNumber={3} />
                <this.OrderItem
                    label={"Order Deliver"}
                    date={delivered_order_date}
                    dotNumber={4}
                    isLine={false} />
                <WButton
                    isLoading={is_reorder_loading}
                    onPress={is_delivered ? this.reorder.bind(this) : onBack}
                    containerStyle={reorderBtnStyle}
                    label={is_delivered ? "Reorder" : "Back"} />
            </WView>
        );
    }

    render() {
        const { container } = this.getStyles();
        const { order_id } = this.props;

        return (
            <WView dial={2} stretch margin={[Utils.scaleSize(10), Utils.scaleSize(20)]} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]} style={container} backgroundColor={Colors.white}>
                <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(10)]} fontSize={Utils.scaleSize(20)} fontWeight={"700"} color={Colors.text_color_dark} >
                    {`Order ${order_id}`}
                </WText>
                {this._renderLoading()}
                {this._renderProgressOrderStatus()}
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
            },
            dotStyle: {
                borderRadius: Utils.scaleSize(15),
                width: Utils.scaleSize(20),
                height: Utils.scaleSize(20)
            },
            horizontalLineStyle: {
                height: Utils.scaleSize(60),
                width: 2
            },
            reorderBtnStyle: {
                backgroundColor: Colors.theme_color,
                flex: 1,
                alignSelf: 'stretch',
                height: Utils.scaleSize(35),
                borderRadius: Utils.scaleSize(18),
                marginTop: Utils.scaleSize(20)
            },
        })
    }
}

const mapToProps = ({ product_detail, order_view }) => {
    const product_detail_info = product_detail && product_detail[PRODUCT_DETAIL_KEY] ? product_detail[PRODUCT_DETAIL_KEY] : {};
    const order_view_info = order_view && order_view[ORDER_VIEW_KEY] ? order_view[ORDER_VIEW_KEY] : {};

    const data = order_view_info && order_view_info[ORDER_VIEW_REQUEST_DATA] ? order_view_info[ORDER_VIEW_REQUEST_DATA] : {};
    const order_status = data && data.orderStatus ? data.orderStatus : "";
    const order_id = data && data._id ? `...${data._id.substr(20, 24)}` : "";
    const received_order_date = data && data.receivedOrderDate ? moment(data.receivedOrderDate).format("DD-MMM-YYYY") : "NA";
    const processed_order_date = data && data.processedOrderDate ? moment(data.processedOrderDate).format("DD-MMM-YYYY") : "NA";
    const shipped_order_date = data && data.shippedOrderDate ? moment(data.shippedOrderDate).format("DD-MMM-YYYY") : "NA";
    const delivered_order_date = data && data.deliveredOrderDate ? moment(data.deliveredOrderDate).format("DD-MMM-YYYY") : "NA";
    const loading = order_view_info && order_view_info[ORDER_VIEW_REQEUST_LOADING] ? order_view_info[ORDER_VIEW_REQEUST_LOADING] : false;

    const is_delivered = data && data.orderStatus === SERVER_ORDER_STATUS_DELIVERED ? true : false;

    const is_reorder_loading = product_detail_info && product_detail_info[PRODUCT_DETAIL_REQUEST_LOADING] ? product_detail_info[PRODUCT_DETAIL_REQUEST_LOADING] : false;

    console.log("order_id ===> ", order_id, data.orderStatus);

    return ({
        loading,
        data,
        order_id,
        order_status,
        received_order_date,
        processed_order_date,
        shipped_order_date,
        delivered_order_date,
        is_reorder_loading,
        is_delivered
    });
}
export default connect(mapToProps, {
    orderView,
    resetOrderViewState,
    orderDetail,
    updateProductDetailUIConstraints
})(OrderView);