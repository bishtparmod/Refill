import React, { PureComponent } from 'react';
import { Header, keyboardAwareFunc } from '../../common/base_components';
import { PRODUCT_DETAIL_SCREEN, HOME_SCREEN, PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_REQUEST_DATA } from '../../redux/Types';
import { WView } from '../../common/ui';
import Colors from '../../common/styles/Colors';
import Utils from '../../common/util/Utils';
import ProductDetailCard from '../../common/components/product/ProductDetailCard';
import { ProductDetailAlert } from '../../common/components/product';
import { resetProductDetailState } from '../../redux/prodcutDetail/Action';
import { connect } from 'react-redux';

const ScrollViewProductDetailCard = keyboardAwareFunc(ProductDetailCard);
class ProductDetail extends PureComponent {

    constructor(props) {
        super(props);
    }

    _onBack = () => {
        const { navigation } = this.props;

        navigation.pop();
    }

    componentWillUnmount = () => {
        const { resetProductDetailState } = this.props;

        resetProductDetailState();
    }

    render() {
        const { container } = this.getStyles();
        const { navigation } = this.props;

        return (
            <WView flex stretch dial={2} style={container}>
                <Header
                    onBack={this._onBack.bind(this)}
                    screenType={PRODUCT_DETAIL_SCREEN}
                />
                <WView flex stretch backgroundColor={Colors.white} dial={2}>
                    <ScrollViewProductDetailCard {...this.props} />
                </WView>
                <ProductDetailAlert />
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
export default connect(null, {
    resetProductDetailState
})(ProductDetail);