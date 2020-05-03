import React, { PureComponent } from 'react';
import { Toaster } from '../../base_components';
import { connect } from 'react-redux';
import { SUCCESS, EMPTY, STATUS, MESSAGE, PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_REQUEST_STATUS } from '../../../redux/Types';

class Alert extends PureComponent {
    constructor(props) {
        super(props);

        this.toaster_id = undefined;
        this.toaster_ids = [];
    }

    state = {
        isToaster: false
    }

    getRandomId = () => {
        return `${new Date().getTime()}${parseInt(Math.random() * 1000000)}`;
    }

    componentDidUpdate = (propTypes) => {
        const { type } = this.props;

        if (propTypes.type !== type) {
            if (type === SUCCESS) {
                this.setState({
                    isToaster: false
                })
            } else if (type !== EMPTY) {
                this.toaster_id = this.getRandomId();
                this.toaster_ids.push(this.toaster_id);
                this.init();
            }
        }
    }

    init = () => {
        this.setState({ isToaster: true });

        setTimeout(() => {
            const index = this.toaster_ids && this.toaster_ids.length ? this.toaster_ids.findIndex(ele => ele === this.toaster_id) : -1;

            if (index === 0) {
                this.setState({ isToaster: false });
                this.toaster_ids.splice(0, 1);
            } else if (index !== -1 && this.toaster_ids && this.toaster_ids.length) {
                this.toaster_ids.splice(0, 1);
            }
            
        }, 5000);
    }

    render() {
        const { isToaster } = this.state;
        const { type, message } = this.props;

        if (!isToaster) return null;

        return (
            <Toaster
                type={type}
                message={message} />
        );
    }
}

const mapToProps = ({ product_detail }) => {
    const product_detail_key = product_detail && product_detail[PRODUCT_DETAIL_KEY] ? product_detail[PRODUCT_DETAIL_KEY] : {};

    const request_status = product_detail_key && product_detail_key[PRODUCT_DETAIL_REQUEST_STATUS] ? product_detail_key[PRODUCT_DETAIL_REQUEST_STATUS] : {};
    const type = request_status && request_status[STATUS] ? request_status[STATUS] : '';
    const message = request_status && request_status[MESSAGE] ? request_status[MESSAGE] : '';

    return ({
        type,
        message
    });
}

export default connect(mapToProps)(Alert);