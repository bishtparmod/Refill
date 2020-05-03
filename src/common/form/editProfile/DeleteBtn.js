import React, { PureComponent } from 'react';
import { WTouchable, WText } from '../../ui';
import Utils from '../../util/Utils';
import { connect } from 'react-redux';
import { USER_KEY, USER_DATA, SERVER_SUCCESS } from '../../../redux/Types';
import { listCardAddress } from '../../../redux/addCard/Action';
import Colors from '../../styles/Colors';
import { refillDeleteCard } from '../../../apis/APIs';

class DeleteBtn extends PureComponent {
    constructor(props) {
        super(props);

        this._isMount = true;
    }

    state = {
        loading: false
    }

    _setState = (value, cb) => {
        if (!this._isMount) return;

        if (cb) this.setState(value, cb);
        else this.setState(value);
    }

    componentDidMount = () => {

    }

    deleteCard = async () => {
        const { card_id, user_token, listCardAddress } = this.props;
        const { loading } = this.state;

        if (loading) return;

        try {
            const body = {
                user_token,
                card_id
            };

            this._setState({ loading: true });
            const res = await refillDeleteCard(body);

            Utils.log("Delete card response ===> ", res, body);

            this._setState({ loading: false });
            if (res && res.message === SERVER_SUCCESS) {
                listCardAddress();
            }
        } catch (error) {
            Utils.log("Delete card response ===> error", error);
            this._setState({ loading: false });
        }
    }

    componentWillUnmount = () => {
        this._isMount = false;
    }

    render() {
        const { container } = this.getStyles();
        const { loading } = this.state;

        return (
            <WTouchable flex dial={5} onPress={this.deleteCard.bind(this)} style={container}>
                {
                    loading ?
                        <WSpinner size={"small"} color={Colors.white} />
                        :
                        <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Light"} fontWeight={"500"} >Delete</WText>
                }
            </WTouchable>
        );
    }

    getStyles = () => {

        return ({
            container: {
                alignSelf: 'stretch'
            }
        });
    }
}

const mapToProps = ({ user }) => {
    const user_info = user && user[USER_KEY] ? user[USER_KEY] : {}
    const user_data = user_info && user_info[USER_DATA] ? user_info[USER_DATA] : {};

    const user_token = user_data && user_data.user_token ? user_data.user_token : "";

    return ({
        user_token
    })
}

export default connect(mapToProps, {
    listCardAddress
})(DeleteBtn);