import React, { PureComponent } from 'react';
import { FlatList, View, Animated } from 'react-native';
import CategoryListItem from './CategoryListItem';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import ProductListItem from '../product/ProductListItem';
import { HOME_KEY, HOME_REQEUST_SEARCH_TEXT, HOME_REQEUST_SEARCH_DATA, HOME_REQEUST_SEARCH_DATA_LOADING } from '../../../redux/Types';
import { connect } from 'react-redux';
import { WView, WSpinner, WText } from '../../ui';

class SearchList extends PureComponent {
    constructor(props) {
        super(props);

        this.containerTop = new Animated.Value(Utils.scaleSize(200));
    }

    componentDidUpdate = (prevProps) => {
        const { search_text } = this.props;

        if (search_text !== prevProps.search_text) {
            this.init();
        }

        if (!search_text) {
            this.containerTop.setValue(Utils.scaleSize(200));
        }
    }

    init = () => {
        Animated.spring(this.containerTop, {
            toValue: 0,
            tension: 1
        }).start();
    }
    render() {
        const { container } = this.getStyles();
        const { navigation, search_text, search_data, loading } = this.props;

        if (!search_text) return null;

        return (
            <Animated.View style={container}>
                <FlatList
                    ListHeaderComponent={
                        (loading) ?
                            <WView margin={[Utils.scaleSize(10), 0]}>
                                <WSpinner color={Colors.theme_color} size={"small"} />
                                <WText padding={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.theme_color} center>please wait...</WText>
                            </WView>
                            : null
                    }
                    ListEmptyComponent={
                        (loading) ?
                            null
                            :
                            <WView>
                                <WText padding={[Utils.scaleSize(10), 0]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_dark} center>No Product Available.</WText>
                            </WView>
                    }
                    showsVerticalScrollIndicator={false}
                    data={search_data}
                    keyExtractor={(item, index) => `category-${index}`}
                    renderItem={({ item, index }) => <ProductListItem navigation={navigation} item={item} />} />
            </Animated.View>
        );
    }

    getStyles = () => {
        return ({
            container: {
                position: 'absolute',
                top: this.containerTop,
                bottom: 0,
                right: 0,
                left: 0,
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                backgroundColor: Colors.white
            }
        });
    }
}

const mapToProps = ({ home }) => {
    const home_info = home && home[HOME_KEY] ? home[HOME_KEY] : {};

    const search_text = home_info && home_info[HOME_REQEUST_SEARCH_TEXT] ? home_info[HOME_REQEUST_SEARCH_TEXT] : "";
    const search_data = home_info && home_info[HOME_REQEUST_SEARCH_DATA] ? home_info[HOME_REQEUST_SEARCH_DATA] : "";
    const loading = home_info && home_info[HOME_REQEUST_SEARCH_DATA_LOADING] ? home_info[HOME_REQEUST_SEARCH_DATA_LOADING] : false;

    return ({
        search_text,
        search_data,
        loading
    });
}
export default connect(mapToProps)(SearchList);