import React, { PureComponent } from 'react';
import { Header, keyboardAwareFunc } from '../../common/base_components';
import { WView } from '../../common/ui';
import Colors from '../../common/styles/Colors';
import Utils from '../../common/util/Utils';
import { ORDER_SUMMARY_SCREEN, ORDER_LIST_SCREEN } from '../../redux/Types';
import { OrderSummaryCard, ProductDetailAlert } from '../../common/components/product';
import { OrderInitListView } from '../../common/components/order';

const ScrollViewOrderView = keyboardAwareFunc(OrderInitListView);
class OrderSummary extends PureComponent {

    constructor(props) {
        super(props);
    }

    _onBack = () => {
        const { navigation } = this.props;

        navigation.pop();
    }

    render() {
        const { container } = this.getStyles();
        const { navigation } = this.props;

        return (
            <WView flex stretch dial={2} style={container}>
                <Header
                    onBack={this._onBack.bind(this)}
                    screenType={ORDER_LIST_SCREEN}
                />
                <WView flex stretch backgroundColor={Colors.white} dial={2}>
                    <ScrollViewOrderView {...this.props} />
                </WView>
            </WView>
        );
    }

    getStyles = () => {

        return ({
            container: {
                maxHeight: Utils.getHeightInPortraitMode,
                backgroundColor: Colors.white
            }
        });
    }
}

export default OrderSummary;