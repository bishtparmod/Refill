import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { UploadImage } from '.'
import { connect } from 'react-redux'
import {  } from '../../../redux/Types'
import { updateDriverUIConstraints } from '../../../redux/driver/Action'
import Utils from '../../util/Utils'

class SelectUploadFile extends PureComponent {
    static propTypes = {
        _id: PropTypes.string,
        onChangeFile: PropTypes.func,
        addImage: PropTypes.func
    }

    render() {
        const { uploading_image, onChangeFile, _id, addImage } = this.props;

        if (uploading_image) return null;

        return (
            <div className="kt-avatar kt-avatar--outline m-2" onClick={addImage} id={_id}>
                <div className="kt-avatar__holder">
                    <input type="file" hidden={true} accept="image/*" id="select_product_image" onChange={onChangeFile} />
                </div>
                <div className="refill-sub-container-center">
                    <img src="/assets/img/plus.png" height="40" />
                </div>
            </div>
        )
    }
}

const mapToProps = ({ product,driver }) => {
    Utils.log("driver data ==  >",driver)
    const product_data = product && product[PRODUCT_KEY] ? product[PRODUCT_KEY] : undefined;

    const uploading_image = product_data && product_data[ADD_PRODUCT_IS_UPLOADING_IMAGES] ? product_data[ADD_PRODUCT_IS_UPLOADING_IMAGES] : false;

    return ({
        uploading_image
    });
}

export default connect(mapToProps, {
    updateDriverUIConstraints
})(SelectUploadFile);
