import React, { PureComponent } from 'react';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';

class OrderCardItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <WView>
                <WText fontFamily={"Poppins-Bold"} padding={[Utils.scaleSize(10), 0, 0, 0]} fontSize={Utils.scaleSize(18)} fontWeight={"500"} color={Colors.text_color_dark} >Quantity</WText>
                <WRow dial={4}>
                    <WTouchable style={quantityBtnStyle} dial={5}>
                        <WText fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} >-</WText>
                    </WTouchable>
                    <WText padding={[Utils.scaleSize(10), Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} >2</WText>
                    <WTouchable style={quantityBtnStyle} dial={5}>
                        <WText fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_dark} >+</WText>
                    </WTouchable>
                </WRow>
            </WView>
        );
    }

    getStyles = () => {
        return ({
            dotContainer: {
                width: Utils.scaleSize(10),
                height: Utils.scaleSize(10),
                borderRadius: Utils.scaleSize(5),
                backgroundColor: Colors.theme_color
            },

        });
    }
}

export default OrderCardItem;