import React, { PureComponent } from 'react';
import { AddCardForm, AddCardAlert } from '../../../common/form/editProfile';
import { WView } from '../../../common/ui';
import { Header } from '../../../common/base_components';
import { ADD_CARD_SCREEN } from '../../../redux/Types';
import Utils from '../../../common/util/Utils';
import Colors from '../../../common/styles/Colors';

class AddCard extends PureComponent {
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
                    screenType={ADD_CARD_SCREEN}
                />
                <WView flex stretch backgroundColor={Colors.white} margin={[0, Utils.scaleSize(10)]} dial={2}>
                    <AddCardForm
                        onBack={this._onBack.bind(this)}
                        navigation={navigation} />
                </WView>
                <AddCardAlert />
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

export default AddCard;