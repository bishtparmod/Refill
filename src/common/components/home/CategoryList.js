import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import CategoryListItem from './CategoryListItem';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { listHomeCategoryData } from '../../../redux/home/Action';
import { connect } from 'react-redux';
import { HOME_KEY, HOME_REQEUST_CATEGORY_DATA, HOME_REQEUST_CATEGORY_LOADING } from '../../../redux/Types';
import { WView, WSpinner } from '../../ui';

class CategoryList extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { listHomeCategoryData } = this.props;

        listHomeCategoryData();
    }

    render() {
        const { container, containerStyle } = this.getStyles();
        const { category_data, loading } = this.props;

        return (
            <FlatList
                contentContainerStyle={container}
                style={containerStyle}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={
                    loading ?
                        <WView dial={5} margin={[0, Utils.scaleSize(0)]}>
                            <WSpinner color={Colors.theme_color} />
                        </WView> : null
                }
                data={category_data}
                keyExtractor={(item, index) => `category-${index}`}
                renderItem={({ item, index }) => <CategoryListItem item={item}/>} />
        );
    }

    getStyles = () => {
        return ({
            container: {
                justifyContent: 'center',
                alignItems: 'center'
            },
            containerStyle: {
                maxHeight: Utils.scaleSize(80)
            }
        });
    }
}

const mapToProps = ({ home }) => {
    const home_info = home && home[HOME_KEY] ? home[HOME_KEY] : {};

    const category_data = home_info && home_info[HOME_REQEUST_CATEGORY_DATA] ? home_info[HOME_REQEUST_CATEGORY_DATA] : [];
    const loading = home_info && home_info[HOME_REQEUST_CATEGORY_LOADING] ? home_info[HOME_REQEUST_CATEGORY_LOADING] : false;

    return ({
        category_data,
        loading
    });
}
export default connect(mapToProps, {
    listHomeCategoryData
})(CategoryList);