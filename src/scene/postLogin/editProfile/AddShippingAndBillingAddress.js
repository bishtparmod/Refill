import React, { PureComponent } from 'react';
import Header from '../../../common/base_components/Header';
import { AddShippingAndBillingAddressContainer, AddBillingAndShippingAlert } from '../../../common/form/editProfile';
import { WView } from '../../../common/ui';
import Utils from '../../../common/util/Utils';
import Colors from '../../../common/styles/Colors';
import { ADD_SHIPPING_AND_BILLING_ADDRESS_SCREEN } from '../../../redux/Types';

class AddShippingAndBillingAddress extends PureComponent {
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
                    screenType={ADD_SHIPPING_AND_BILLING_ADDRESS_SCREEN}
                />
                <WView flex stretch backgroundColor={Colors.white} margin={[0, Utils.scaleSize(10)]} dial={2}>
                    <AddShippingAndBillingAddressContainer
                        navigation={navigation}
                        onBack={this._onBack.bind(this)} />
                    <AddBillingAndShippingAlert />
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

export default AddShippingAndBillingAddress;