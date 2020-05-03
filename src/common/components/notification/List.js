import React, { PureComponent } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { WView, WText, WSpinner } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { NotificationListItem } from '.';
import { notificationList, resetNotificationListState, updateNotificationListUIConstraints } from '../../../redux/notification/Action';
import { connect } from 'react-redux';
import { NOTIFICATION_KEY, NOTIFICATION_REQEUST_LOADING, NOTIFICATION_REQUEST_DATA, NOTIFICATION_REQEUST_REFRESH_LOADING, NOTIFICATION_REQEUST_ON_END_REACHED_LOADING, NOTIFICATION_REQEUST_ON_END_REACHED_DONE, NOTIFICATION_REQUEST_PAGE } from '../../../redux/Types';

class OrderListView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { notificationList } = this.props;

        notificationList();
    }

    componentWillUnmount = () => {
        const { resetNotificationListState } = this.props;

        resetNotificationListState();
    }

    onRefresh = () => {
        const { notificationList } = this.props;

        notificationList(true);
    }

    render() {
        const { container, listContainer } = this.getStyles();
        const { loading, data, navigation, is_refreshing, updateNotificationListUIConstraints, is_end_reached_loading, is_end_reached_done, page, notificationList } = this.props;
        console.log("data ===> ", data);
        
        return (
            <WView dial={2} stretch margin={[0, Utils.scaleSize(20), Utils.scaleSize(20), Utils.scaleSize(20)]} padding={[0, 0, Utils.scaleSize(20), 0]} backgroundColor={Colors.white}>
                <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(20)} fontWeight={"700"} color={Colors.text_color_dark} >
                    Notification
                </WText>
                <FlatList
                    data={data}
                    nestedScrollEnabled={true}
                    refreshControl={
                        <RefreshControl refreshing={is_refreshing} onRefresh={this.onRefresh.bind(this)} />
                    }
                    ListEmptyComponent={
                        loading ?
                            null
                            :
                            <WText fontFamily={"Poppins-Bold"} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_light_dark} center>
                                Empty Notification List
                        </WText>
                    }
                    ListHeaderComponent={
                        loading ?
                            <WView dial={5} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]}>
                                <WSpinner size={"small"} color={Colors.theme_color} />
                                <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.theme_color} >
                                    please wait...
                            </WText>
                            </WView> : null
                    }
                    ListFooterComponent={
                        is_end_reached_loading ?
                            <WView dial={5} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]}>
                                <WSpinner size={"small"} color={Colors.theme_color} />
                                <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.theme_color} >
                                    please wait...
                            </WText>
                            </WView> : null
                    }
                    keyExtractor={(ele, index) => `order-list-${index}`}
                    renderItem={({ item, index }) => {
                        return (
                            <NotificationListItem item={item} navigation={navigation} />
                        );
                    }}
                    onEndReached={
                        () => {
                            console.log("loading ===> ", is_end_reached_done);

                            if (is_end_reached_loading || is_end_reached_done) return;

                            console.log("loading ===> loaded", is_end_reached_done);

                            updateNotificationListUIConstraints({
                                [NOTIFICATION_REQUEST_PAGE]: page + 1
                            });
                            notificationList(false, true);
                        }
                    }
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
                borderRadius: Utils.scaleSize(20)
            }
        })
    }
}

const mapToProps = ({ notification_list }) => {
    const notification_list_info = notification_list && notification_list[NOTIFICATION_KEY] ? notification_list[NOTIFICATION_KEY] : {};

    const loading = notification_list_info && notification_list_info[NOTIFICATION_REQEUST_LOADING] ? notification_list_info[NOTIFICATION_REQEUST_LOADING] : false;
    const data = notification_list_info && notification_list_info[NOTIFICATION_REQUEST_DATA] ? notification_list_info[NOTIFICATION_REQUEST_DATA] : false;

    const is_refreshing = notification_list_info && notification_list_info[NOTIFICATION_REQEUST_REFRESH_LOADING] ? notification_list_info[NOTIFICATION_REQEUST_REFRESH_LOADING] : false;
    const is_end_reached_loading = notification_list_info && notification_list_info[NOTIFICATION_REQEUST_ON_END_REACHED_LOADING] ? notification_list_info[NOTIFICATION_REQEUST_ON_END_REACHED_LOADING] : false;
    const is_end_reached_done = notification_list_info && notification_list_info[NOTIFICATION_REQEUST_ON_END_REACHED_DONE] ? notification_list_info[NOTIFICATION_REQEUST_ON_END_REACHED_DONE] : false;
    const page = notification_list_info && notification_list_info[NOTIFICATION_REQUEST_PAGE] ? notification_list_info[NOTIFICATION_REQUEST_PAGE] : 1;

    return ({
        loading,
        data,
        is_refreshing,
        is_end_reached_loading,
        is_end_reached_done,
        page
    });
}
export default connect(mapToProps, {
    notificationList,
    resetNotificationListState,
    updateNotificationListUIConstraints
})(OrderListView);