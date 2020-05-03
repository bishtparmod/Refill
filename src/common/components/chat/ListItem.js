import React, { PureComponent } from 'react';
import { Image, FlatList } from 'react-native';
import { WView, WText, WRow, WTouchable } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { SERVER_ORDER_STATUS_RECEIVED, SERVER_ORDER_STATUS_PROCESSED, SERVER_ORDER_STATUS_SHIPPED, SERVER_ORDER_STATUS_CANCELLED, SERVER_ORDER_STATUS_SKIPPED, ORDER_VIEW_SCREEN, ORDER_VIEW_REQUEST_ID, USER_KEY, USER_DATA, USER_TYPE } from '../../../redux/Types';
import moment from 'moment-timezone';
import { updateOrderViewUIConstraints } from '../../../redux/orderView/Action';
import { connect } from 'react-redux';

class ListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _renderLeft = () => {
        const { container, imageStyle, imgContainerStyle, imgRightContainerStyle, subContainer, cardView } = this.getStyles();
        const { item = {}, name, email, image } = this.props;
        const { message } = item;
        const user1 = require("../../../../assets/img/user1.png");
        const _image = { uri: image };

        return (
            <WView dial={5} margin={[Utils.scaleSize(10), Utils.scaleSize(5)]} style={container} stretch>
                <WView flex dial={4} style={[subContainer, cardView]} margin={[0, Utils.scaleSize(5), 0, Utils.scaleSize(20)]} backgroundColor={Colors.white}>
                    <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(30)]} fontSize={Utils.scaleSize(14)} fontWeight={"700"} color={Colors.text_color_light_dark}>
                        {name ? name : email}
                    </WText>
                    <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(30)]} fontSize={Utils.scaleSize(12)} fontWeight={"400"} color={Colors.text_color_light_dark} lines={0}>
                        {message}
                    </WText>
                </WView>
                <WView style={[imgContainerStyle, cardView]} stretch dial={5} backgroundColor={Colors.light_color}>
                    <Image source={_image ? _image : user1} style={imageStyle} resizeMode={"contain"} />
                </WView>
            </WView>
        );
    }

    _renderRight = () => {
        const { container, imageStyle, imgRightContainerStyle, subContainer, cardView } = this.getStyles();
        const { item = {} } = this.props;
        const { message } = item;
        const user1 = require("../../../../assets/img/user1.png");

        return (
            <WView dial={5} margin={[Utils.scaleSize(10), Utils.scaleSize(5)]} style={container} stretch>
                <WView flex dial={4} style={[subContainer, cardView]} margin={[0, Utils.scaleSize(20), 0, Utils.scaleSize(5)]} backgroundColor={Colors.white}>
                    <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(30)]} fontSize={Utils.scaleSize(14)} fontWeight={"700"} color={Colors.text_color_light_dark}>
                        {`Admin`}
                    </WText>
                    <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(30)]} fontSize={Utils.scaleSize(12)} fontWeight={"400"} color={Colors.text_color_light_dark} lines={0}>
                        {message}
                    </WText>
                    <WView style={[imgRightContainerStyle, cardView]} stretch dial={5} backgroundColor={Colors.light_color}>
                        <Image source={user1} style={imageStyle} resizeMode={"contain"} />
                    </WView>
                </WView>
            </WView>
        );
    }

    render() {
        const { item = {}, user_id } = this.props;
        const { userId, message } = item;

        if (user_id === item.userId && item.userType === USER_TYPE) return this._renderLeft();

        return this._renderRight();
    }

    getStyles = () => {
        return ({
            container: {
                minHeight: Utils.scaleSize(60)
            },
            subContainer: {
                borderRadius: Utils.scaleSize(5)
            },
            cardView: {
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            },
            imgContainerStyle: {
                position: 'absolute',
                left: 0,
                width: Utils.scaleSize(40),
                height: Utils.scaleSize(40),
                borderRadius: Utils.scaleSize(20),
                overflow: 'hidden'
            },
            imgRightContainerStyle: {
                position: 'absolute',
                right: -Utils.scaleSize(20),
                width: Utils.scaleSize(40),
                height: Utils.scaleSize(40),
                borderRadius: Utils.scaleSize(20)
            },
            imageStyle: {
                flex: 1,
                width: null,
                height: null
            }
        })
    }
}

const mapToProps = ({ user }) => {
    const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
    const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};
    const user_id = user_data && user_data._id ? user_data._id : "";
    const name = user_data && user_data.name ? user_data.name : "";
    const email = user_data && user_data.email ? user_data.email : "";
    const image = user_data && user_data.image ? user_data.image : "";

    return ({
        user_id: user_id,
        name,
        email,
        image
    });
}
export default connect(mapToProps, {
})(ListItem);