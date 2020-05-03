import React, { PureComponent } from 'react';
import Colors from '../../styles/Colors';
import { WButton } from '../../ui';
import { BtnWithIcon } from '.';
import { connect } from 'react-redux';
import { googleLogin } from '../../../redux/login/Action';
import { LOGIN_KEY, LOGIN_REQEUST_GOOGLE_LOADING, LOGIN_REQUEST_STATUS, STATUS, LOGIN_REQEUST_LOADING, LOGIN_REQEUST_FACEBOOK_LOADING } from '../../../redux/Types';

class GoogleBtn extends PureComponent {
    constructor(props) {
        super(props);
    }

    submit = () => {
        const { googleLogin, isLoading } = this.props;

        if(isLoading) return;
        
        googleLogin();
    }

    render() {
        const googleIcon = require("../../../../assets/img/google.png");
        const { container } = this.getStyles();
        const { loading } = this.props;

        return (
            <WButton
                onPress={this.submit.bind(this)}
                component={() => <BtnWithIcon
                    label={loading ? "Loading..." : "Google"}
                    color={Colors.black}
                    iconPath={googleIcon}
                    style={container}
                />}
            />
        );
    }

    getStyles = () => {
        return ({
            container: {
                backgroundColor: Colors.white,
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            }
        });
    }
}

const mapToProps = ({ login }) => {
    const login_key = login && login[LOGIN_KEY] ? login[LOGIN_KEY] : {};

    const loading = login_key && login_key[LOGIN_REQEUST_GOOGLE_LOADING] ? login_key[LOGIN_REQEUST_GOOGLE_LOADING] : false;
    const facebook_loading = login_key && login_key[LOGIN_REQEUST_FACEBOOK_LOADING] ? login_key[LOGIN_REQEUST_FACEBOOK_LOADING] : false;
    const manual_loading = login_key && login_key[LOGIN_REQEUST_LOADING] ? login_key[LOGIN_REQEUST_LOADING] : false;
    
    const request_status = login_key && login_key[LOGIN_REQUEST_STATUS] ? login_key[LOGIN_REQUEST_STATUS] : {};
    const type = login_key && login_key[STATUS] ? login_key[STATUS] : '';

    return ({
        loading,
        isLoading: loading || facebook_loading || manual_loading,
        type
    });
}

export default connect(mapToProps, {
    googleLogin
})(GoogleBtn);