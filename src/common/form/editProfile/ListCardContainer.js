import React, { PureComponent } from 'react';
import { FlatList, Image } from 'react-native';
import ListCardContainerItem from './ListCardContainerItem';
import { WRow, WText, WTouchable, WView, WSpinner } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { ADD_CARD_SCREEN, ADD_CARD_KEY, ADD_CARD_REQUEST_LOADING, LIST_CARD_REQUEST_DATA, LIST_CARD_REQUEST_LOADING, SCREEN_TYPE_PAYMENT, PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_ORDERS_PLACE_ORDER_LOADING, PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS, STATUS, SUCCESS } from '../../../redux/Types';
import { listCardAddress, addCardAddress } from '../../../redux/addCard/Action';
import { connect } from 'react-redux';
import { validateCardListForm, placeOrder } from '../../../redux/prodcutDetail/Action';
import { SuccessPlaceOrderAlert } from '../../components/product';

class ListCardContainer extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        const { listCardAddress } = this.props;
        listCardAddress();
    }

    addCard = () => {
        const { navigation } = this.props;

        navigation.navigate(ADD_CARD_SCREEN);
    }

    getTitle = () => {
        const { screen_type } = this.props;

        if (screen_type === SCREEN_TYPE_PAYMENT) return "Payment Options";

        return "Saved Cards";
    }

    componentDidUpdate = (prevProps) => {
        const { place_order_request_status_type } = this.props;

        if (prevProps.place_order_request_status_type !== place_order_request_status_type) {
            if (place_order_request_status_type === SUCCESS) {
                // alert("success");
            }
        }
    }

    submit = () => {
        const {
            placeOrder,
            validateCardListForm
        } = this.props;

        validateCardListForm(status => {
            if (status) {
                placeOrder();
            }
        });
    }

    /** On error */
    isError = (key) => {
        const { errors } = this.props;

        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    render() {
        const plusIcon = require("../../../../assets/img/plus.png");
        const { imageStyle, submitBtnStyle } = this.getStyles();
        const { data, loading, screen_type, place_order_loading } = this.props

        return (
            <FlatList
                style={{ flexGrow: 1 }}
                data={data.data}
                nestedScrollEnabled={true}
                keyExtractor={(key, index) => `card-list-${index}`}
                renderItem={({ item, index }) => {
                    return (<ListCardContainerItem item={item} screen_type={screen_type} />);
                }}
                ListHeaderComponent={
                    <WView dial={5} stretch>
                        <WText fontSize={Utils.scaleSize(22)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>
                            {this.getTitle()}
                        </WText>
                        {
                            loading ?
                                <WView>
                                    <WSpinner color={Colors.theme_color} size={"small"} />
                                    <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Light"} fontWeight={"600"} color={Colors.theme_color} center>
                                        Please wait...
                            </WText>
                                </WView> : null
                        }
                    </WView>
                }
                ListFooterComponent={
                    <WView>
                        <WTouchable dial={4} onPress={this.addCard.bind(this)}>
                            <WRow dial={4} padding={[10, 0]}>
                                <Image source={plusIcon} style={imageStyle} resizeMode={"contain"} />
                                <WText padding={[0, 10]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.theme_color} left>
                                    Add payment Method
                        </WText>
                            </WRow>
                        </WTouchable>

                        {
                            screen_type === SCREEN_TYPE_PAYMENT ?
                                <WButton
                                    containerStyle={submitBtnStyle}
                                    label={"Pay Now"}
                                    isLoading={place_order_loading}
                                    onPress={this.submit.bind(this)}
                                /> : null
                        }
                    </WView>
                }
            />
        );
    }

    getStyles = () => {
        return ({
            imageStyle: {
                width: 20,
                height: 20
            },
            submitBtnStyle: {
                backgroundColor: Colors.theme_color,
                flex: 1,
                alignSelf: 'stretch',
                height: Utils.scaleSize(30),
                borderRadius: Utils.scaleSize(15),
                marginVertical: Utils.scaleSize(20),
                marginHorizontal: Utils.scaleSize(20),
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            },
        });
    }
}

const mapToProps = ({ add_card, product_detail }) => {
    const add_card_info = add_card && add_card[ADD_CARD_KEY] ? add_card[ADD_CARD_KEY] : {};
    const product_detail_info = product_detail && product_detail[PRODUCT_DETAIL_KEY] ? product_detail[PRODUCT_DETAIL_KEY] : {};
    const loading = add_card_info && add_card_info[LIST_CARD_REQUEST_LOADING] ? add_card_info[LIST_CARD_REQUEST_LOADING] : false;
    const data = add_card_info && add_card_info[LIST_CARD_REQUEST_DATA] ? add_card_info[LIST_CARD_REQUEST_DATA] : [];

    const place_order_loading = product_detail_info && product_detail_info[PRODUCT_DETAIL_ORDERS_PLACE_ORDER_LOADING] ? product_detail_info[PRODUCT_DETAIL_ORDERS_PLACE_ORDER_LOADING] : false;
    const place_order_request_status = product_detail_info && product_detail_info[PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS] ? product_detail_info[PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS] : {};
    const place_order_request_status_type = place_order_request_status && place_order_request_status[STATUS] ? place_order_request_status[STATUS] : "";

    return ({
        loading,
        data,
        place_order_loading,
        place_order_request_status_type
    });
}

export default connect(mapToProps, {
    listCardAddress,
    validateCardListForm,
    placeOrder
})(ListCardContainer);