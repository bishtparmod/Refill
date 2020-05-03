import React, { PureComponent } from 'react';
import { Header, keyboardAwareFunc } from '../../common/base_components';
import { WView } from '../../common/ui';
import Colors from '../../common/styles/Colors';
import Utils from '../../common/util/Utils';
import { ORDER_LIST_SCREEN, ORDER_VIEW_SCREEN } from '../../redux/Types';
import { OrderViewCard } from '../../common/components/order';

const ScrollViewOrderView = keyboardAwareFunc(OrderViewCard);
class OrderView extends PureComponent {

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
                    screenType={ORDER_VIEW_SCREEN}
                />
                <WView flex stretch backgroundColor={Colors.white} dial={2}>
                    <ScrollViewOrderView
                        onBack={this._onBack.bind(this)}
                        {...this.props} />
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

export default OrderView;