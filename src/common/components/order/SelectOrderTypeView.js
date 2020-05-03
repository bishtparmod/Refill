import React, { PureComponent } from 'react';
import { Image, FlatList } from 'react-native';
import { WView, WText } from '../../ui';
import { ProductListItem } from '../product';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { OrderTypeItem } from '.';
import { CURRENT_ORDER, FUTURE_ORDER, PAST_ORDER, CANCELLED_ORDER } from '../../../redux/Types';

class SelectOrderTypeView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { container } = this.getStyles();
        const data = [
            { backgroundColor: Colors.current_tile_color, type: CURRENT_ORDER, label: "Current" },
            { backgroundColor: Colors.future_tile_color, type: FUTURE_ORDER, label: "Future" },
            { backgroundColor: Colors.past_tile_color, type: PAST_ORDER, label: "Past" },
            { backgroundColor: Colors.cancel_tile_color, type: CANCELLED_ORDER, label: "Cancel" }
        ];

        return (
            <WView dial={2} margin={[0, 0, Utils.scaleSize(10), 0]}>
                <FlatList
                    data={data}
                    horizontal={true}
                    alwaysBounceHorizontal={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(ele, index) => `order-type-${index}`}
                    renderItem={({ item, index }) => {
                        return (
                            <OrderTypeItem
                                {...item}
                            />
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
                borderRadius: Utils.scaleSize(20)
            }
        })
    }
}

export default SelectOrderTypeView;