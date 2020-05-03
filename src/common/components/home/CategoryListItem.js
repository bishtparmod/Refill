import React, { PureComponent } from 'react';
import { WView, WText, WTouchable } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { HOME_REQEUST_SELECTED_CATEGORY_ID, HOME_KEY } from '../../../redux/Types';
import { connect } from 'react-redux';
import { selectCategoryId } from '../../../redux/home/Action';

class CategoryListItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    onSelectCategoryId = (id) => {
        const { selectCategoryId } = this.props;

        if (!id) return;

        selectCategoryId(id);
    }

    render() {
        const { container, selected } = this.getStyles();
        const { item: { name, _id } } = this.props;

        return (
            <WTouchable dial={5} margin={[Utils.scaleSize(10), Utils.scaleSize(10)]} padding={[0, Utils.scaleSize(5)]} style={[container, selected]} onPress={this.onSelectCategoryId.bind(this, _id)}>
                <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.white} left lines={2}>{name}</WText>
            </WTouchable>
        );
    }

    getStyles = () => {
        const { item: { _id }, category_id } = this.props;

        return ({
            container: {
                width: Utils.scaleSize(70),
                height: Utils.scaleSize(70),
                borderRadius: Utils.scaleSize(5),
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                backgroundColor: Colors.theme_color
            },
            selected: {
                borderWidth: 4,
                borderColor: category_id === _id ? Colors.white : Colors.theme_color,
                borderStyle: "solid"
            }
        });
    }
}

const mapToProps = ({ home }) => {
    const home_info = home && home[HOME_KEY] ? home[HOME_KEY] : {};

    const category_id = home_info && home_info[HOME_REQEUST_SELECTED_CATEGORY_ID] ? home_info[HOME_REQEUST_SELECTED_CATEGORY_ID] : "";

    return ({
        category_id
    });
}
export default connect(mapToProps, {
    selectCategoryId
})(CategoryListItem);