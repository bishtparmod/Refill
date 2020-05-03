import React, { PureComponent } from 'react';
import { FlatList, Animated, RefreshControl } from 'react-native';
import ProductListItem from '../../common/components/product/ProductListItem';
import Colors from '../../common/styles/Colors';
import Utils from '../../common/util/Utils';
import { WText, WView, WRow, WSpinner } from '../../common/ui';
import { Header } from '../../common/base_components';
import { HOME_KEY, HOME_REQUEST_SUB_CATEGORY_NAME, HOME_REQEUST_SUB_CATEGORY_DATA, PRODUCT_LIST_SCREEN, HOME_REQEUST_SEARCH_TEXT, HOME_REQEUST_SEARCH_DATA, HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA, HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_LOADING, HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_REFRESH_LOADING, HOME_REQUEST_SUB_CATEGORY_IS_VISIBLE_SORT_ALERT } from '../../redux/Types';
import CategoryList from '../../common/components/home/CategoryList';
import { SearchList, SelectSortItem } from '../../common/components/home';
import { connect } from 'react-redux';
import { updateHomeUIConstraints, listSubCategoryProductsListData } from '../../redux/home/Action';

class ProductList extends PureComponent {
    constructor(props) {
        super(props);

        this.scrollY = new Animated.Value(0);
    }

    onBack = () => {
        const { navigation } = this.props;

        navigation.pop();
    }

    componentWillUnmount = () => {
        const { updateHomeUIConstraints } = this.props;

        updateHomeUIConstraints({
            [HOME_REQEUST_SEARCH_TEXT]: "",
            [HOME_REQEUST_SEARCH_DATA]: []
        })
    }

    onRefresh = () => {
        const { listSubCategoryProductsListData } = this.props;

        listSubCategoryProductsListData(true);
    }

    onSort = () => {
        const { updateHomeUIConstraints } = this.props;

        updateHomeUIConstraints({
            [HOME_REQUEST_SUB_CATEGORY_IS_VISIBLE_SORT_ALERT]: true
        })
    }

    render() {
        const { navigation, loading, data, refreshing } = this.props;
        const { categoryContainer } = this.getStyles();
        const sub_category_name = navigation.getParam(HOME_REQUEST_SUB_CATEGORY_NAME);

        return (
            <WView stretch flex dial={5}>
                <Header
                    onBack={this.onBack.bind(this)}
                    onSort={this.onSort.bind(this)}
                    screenType={PRODUCT_LIST_SCREEN}
                />
                <WView flex stretch backgroundColor={Colors.white} margin={[Utils.scaleSize(10), 0, 0, 0]} dial={2}>
                    <FlatList
                        data={data}
                        style={{ paddingHorizontal: Utils.scaleSize(10) }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh.bind(this)} />
                        }
                        ListHeaderComponent={
                            <WView dial={4} stretch>
                                <WText padding={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_dark} left>{sub_category_name}</WText>
                                {
                                    (loading) ?
                                        <WView dial={5}>
                                            <WSpinner color={Colors.theme_color} size={"small"} />
                                            <WText padding={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.theme_color} center>please wait...</WText>
                                        </WView>
                                        : null
                                }
                            </WView>
                        }
                        ListEmptyComponent={
                            (loading) ?
                                null
                                :
                                <WView>
                                    <WText padding={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_dark} center>No Products Available.</WText>
                                </WView>
                        }
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item, index }) => <ProductListItem index={index} item={item} navigation={navigation} />}
                    />
                    <SearchList
                        navigation={navigation} />
                    <SelectSortItem />
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
    const loading = home_info && home_info[HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_LOADING] ? home_info[HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_LOADING] : false;
    const data = home_info && home_info[HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA] ? home_info[HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA] : [];

    const refreshing = home_info && home_info[HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_REFRESH_LOADING] ? home_info[HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_REFRESH_LOADING] : false;

    return ({
        loading,
        data,
        refreshing
    });
}
export default connect(mapToProps, {
    updateHomeUIConstraints,
    listSubCategoryProductsListData
})(ProductList);