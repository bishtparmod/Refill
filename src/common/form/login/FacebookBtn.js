import React, { PureComponent } from 'react';
import BtnWithIcon from './BtnWithIcon';
import Colors from '../../styles/Colors';
import Utils from '../../util/Utils';
import { facebookLogin } from '../../../redux/login/Action';
import { connect } from 'react-redux';
import { LOGIN_KEY, LOGIN_REQEUST_FACEBOOK_LOADING, LOGIN_REQUEST_STATUS, STATUS, LOGIN_REQEUST_LOADING, LOGIN_REQEUST_GOOGLE_LOADING } from '../../../redux/Types';

class FacebookBtn extends PureComponent {
    constructor(props) {
        super(props);
    }

    submit = () => {
        const { facebookLogin, isLoading } = this.props;

        if(isLoading) return;
        
        facebookLogin();
    }

    render() {
        const facebookIcon = require("../../../../assets/img/facebook.png");
        const { container } = this.getStyles();
        const { loading } = this.props

        return (
            <WButton
                onPress={this.submit.bind(this)}
                component={() => <BtnWithIcon
                    label={loading ? "Loading..." : "Facebook"}
                    color={Colors.white}
                    iconPath={facebookIcon}
                    style={container}
                />}
            />
        );
    }

    getStyles = () => {
        return ({
            container: {
                backgroundColor: Colors.facebookColor,
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                marginRight: Utils.scaleSize(20)
            }
        });
    }
}

const mapToProps = ({ login }) => {
    const login_key = login && login[LOGIN_KEY] ? login[LOGIN_KEY] : {};

    const loading = login_key && login_key[LOGIN_REQEUST_FACEBOOK_LOADING] ? login_key[LOGIN_REQEUST_FACEBOOK_LOADING] : false;
    const google_loading = login_key && login_key[LOGIN_REQEUST_GOOGLE_LOADING] ? login_key[LOGIN_REQEUST_GOOGLE_LOADING] : false;
    const manual_loading = login_key && login_key[LOGIN_REQEUST_LOADING] ? login_key[LOGIN_REQEUST_LOADING] : false;

    const request_status = login_key && login_key[LOGIN_REQUEST_STATUS] ? login_key[LOGIN_REQUEST_STATUS] : {};
    const type = login_key && login_key[STATUS] ? login_key[STATUS] : '';

    return ({
        loading,
        isLoading: loading || google_loading || manual_loading,
        type
    });
}

export default connect(mapToProps, {
    facebookLogin
})(FacebookBtn);