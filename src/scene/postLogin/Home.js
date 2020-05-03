import React, { PureComponent } from 'react';
import { SectionList, PanResponder, View, Animated, RefreshControl } from 'react-native';
import ProductListItem from '../../common/components/product/ProductListItem';
import Colors from '../../common/styles/Colors';
import Utils from '../../common/util/Utils';
import { WText, WView, WRow, WSpinner } from '../../common/ui';
import { Header } from '../../common/base_components';
import { HOME_SCREEN, HOME_KEY, HOME_REQEUST_CATEGORY_DATA, HOME_REQEUST_CATEGORY_LOADING, HOME_REQEUST_SUB_CATEGORY_DATA_LOADING, HOME_REQEUST_SUB_CATEGORY_DATA, PRODUCT_LIST_SCREEN, HOME_REQEUST_VIEW_ALL_SELECTED_CATEGORY_ID, HOME_REQEUST_VIEW_ALL_SELECTED_SUB_CATEGORY_ID, HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA, HOME_REQUEST_SUB_CATEGORY_NAME, NOTIFICATIONS_SCREEN, HOME_REQEUST_CATEGORY_REFRESH_LOADING } from '../../redux/Types';
import CategoryList from '../../common/components/home/CategoryList';
import { SearchList } from '../../common/components/home';
import { connect } from 'react-redux';
import { updateHomeUIConstraints, listSubCategoryProductsListData, listHomeCategoryData } from '../../redux/home/Action';

class Home extends PureComponent {
    constructor(props) {
        super(props);

        this.scrollY = new Animated.Value(0);
    }

    _toggleDrawer = () => {
        const { navigation } = this.props;

        navigation.toggleDrawer();
    }

    _onNotificationPress = () => {
        this.openScreen(NOTIFICATIONS_SCREEN);
    }

    openScreen = (screen, param) => {
        const { navigation } = this.props;

        if (!navigation || !screen) return;

        navigation.navigate(screen, param);
    }

    onRefresh = () => {
        const { listHomeCategoryData } = this.props;

        listHomeCategoryData(true);
    }

    viewAll = (category_id, sub_category_id, name) => {
        const { updateHomeUIConstraints, listSubCategoryProductsListData } = this.props;

        updateHomeUIConstraints({
            [HOME_REQEUST_VIEW_ALL_SELECTED_CATEGORY_ID]: category_id,
            [HOME_REQEUST_VIEW_ALL_SELECTED_SUB_CATEGORY_ID]: sub_category_id,
            [HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA]: []
        });
        listSubCategoryProductsListData();
        this.openScreen(PRODUCT_LIST_SCREEN, {
            [HOME_REQUEST_SUB_CATEGORY_NAME]: name
        });
    }

    render() {
        const { navigation, sub_category_loading, category_loading, sub_category_data, refreshing } = this.props;
        const { categoryContainer } = this.getStyles();

        return (
            <WView stretch flex dial={5}>
                <Header
                    onNotificationPress={this._onNotificationPress.bind(this)}
                    onDrawerPress={this._toggleDrawer.bind(this)}
                    screenType={HOME_SCREEN}
                />
                <WView flex stretch backgroundColor={Colors.white} margin={[Utils.scaleSize(10), 0, 0, 0]} dial={2}>
                    <SectionList
                        sections={sub_category_data}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh.bind(this)} />
                        }
                        ListHeaderComponent={
                            <View>
                                <Animated.View style={categoryContainer}>
                                    <CategoryList />
                                </Animated.View>
                                {
                                    (sub_category_loading || category_loading) ?
                                        <WView>
                                            <WSpinner color={Colors.theme_color} size={"small"} />
                                            <WText padding={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.theme_color} center>please wait...</WText>
                                        </WView>
                                        : null
                                }
                            </View>
                        }
                        ListEmptyComponent={
                            (sub_category_loading || category_loading) ?
                                null
                                :
                                <WView>
                                    <WText padding={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_dark} center>No Sub-Category Available.</WText>
                                </WView>
                        }
                        keyExtractor={(item, index) => item + index}
                        scrollEventThrottle={16}
                        onScroll={(event) => {
                            const { nativeEvent: { contentOffset: { y } } } = event;

                            // this.scrollY.setValue(y);
                        }}
                        renderItem={({ item, index }) => {

                            return (
                                <WView padding={[0, Utils.scaleSize(10)]}>
                                    <ProductListItem index={index} item={item} navigation={navigation} />
                                </WView>
                            );
                        }}
                        renderSectionHeader={({ section: { name, categoryId, _id } }) => (
                            <WRow padding={[0, Utils.scaleSize(20)]} dial={5} spaceBetween backgroundColor={Colors.white}>
                                <WText padding={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(18)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>{name}</WText>
                                <WText padding={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} left onPress={this.viewAll.bind(this, categoryId, _id, name)}>View All</WText>
                            </WRow>
                        )}
                    />
                    <SearchList
                        navigation={navigation} />
                </WView>
            </WView>
        );
    }

    getStyles = () => {
        const headerHeight = this.scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [100, 0],
            extrapolate: 'clamp'
        });

        const opacity = this.scrollY.interpolate({
            inputRange: [0, 30, 50, 70, 90, 100],
            outputRange: [1, 0.6, 0.4, 0, 0, 0],
            extrapolate: 'clamp'
        });

        return ({
            categoryContainer: {
                height: headerHeight,
                opacity: opacity
            }
        });
    }
}

const mapToProps = ({ home }) => {
    const home_info = home && home[HOME_KEY] ? home[HOME_KEY] : {};

    const sub_category_data = home_info && home_info[HOME_REQEUST_SUB_CATEGORY_DATA] ? home_info[HOME_REQEUST_SUB_CATEGORY_DATA] : [];
    const category_loading = home_info && home_info[HOME_REQEUST_CATEGORY_LOADING] ? home_info[HOME_REQEUST_CATEGORY_LOADING] : false;
    const sub_category_loading = home_info && home_info[HOME_REQEUST_SUB_CATEGORY_DATA_LOADING] ? home_info[HOME_REQEUST_SUB_CATEGORY_DATA_LOADING] : false;

    const refreshing = home_info && home_info[HOME_REQEUST_CATEGORY_REFRESH_LOADING] ? home_info[HOME_REQEUST_CATEGORY_REFRESH_LOADING] : false;

    console.log("refreshing ===> ", refreshing);

    return ({
        category_loading,
        sub_category_loading,
        sub_category_data: sub_category_data && sub_category_data.length ? sub_category_data.map(({ products, ...rest }) => Object.assign({ ...rest }, { data: products })) : [],
        refreshing
    });
}
export default connect(mapToProps, {
    updateHomeUIConstraints,
    listSubCategoryProductsListData,
    listHomeCategoryData
})(Home);