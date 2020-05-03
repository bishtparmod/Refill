import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Utils from '../../../common/util/Utils';
import Colors from '../../../common/styles/Colors';
import { Header } from '../../../common/base_components';
import { WView } from '../../../common/ui';
import { ListCardContainer } from '../../../common/form/editProfile';
import { LIST_CARD_SCREEN, SCREEN_TYPE_ADD_CARD, SCREEN_TYPE_PAYMENT } from '../../../redux/Types';
import { connect } from 'react-redux';
import { ProductDetailAlert, SuccessPlaceOrderAlert } from '../../../common/components/product';

class ListCard extends PureComponent {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        screen_type: PropTypes.oneOf([SCREEN_TYPE_ADD_CARD, SCREEN_TYPE_PAYMENT])
    }

    _onBack = () => {
        const { navigation } = this.props;
        const from = navigation.getParam('from');

        if (from) {
            navigation.dismiss();
            return;
        }

        navigation.pop();
    }

    render() {
        const { container } = this.getStyles();
        const { navigation } = this.props;
        const screen_type = navigation.getParam('screen_type');

        return (
            <WView flex stretch dial={2} style={container}>
                <Header
                    onBack={this._onBack.bind(this)}
                    screenType={LIST_CARD_SCREEN}
                />
                <WView flex stretch backgroundColor={Colors.white} margin={[0, Utils.scaleSize(10)]} dial={2}>
                    <ListCardContainer
                        navigation={navigation}
                        screen_type={screen_type} />
                </WView>
                <ProductDetailAlert />
                <SuccessPlaceOrderAlert
                    navigation={navigation} />
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

const mapToProps = ({ }) => {

    return ({});
}
export default connect(mapToProps)(ListCard)