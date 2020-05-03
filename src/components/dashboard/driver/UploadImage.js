import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateProductUIConstraints, updateAddProductFormData } from '../../../redux/product/Action';
import { ADD_PRODUCT_IMAGES, PRODUCT_KEY, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_FORM, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT } from '../../../redux/Types';
import { refillProductUploadFile } from '../../../apis/APIs';
import Utils from '../../util/Utils';

class UploadImage extends PureComponent {
    static propTypes = {

    }

    state = {
        isCancel: false,
        image: '',
        uploading: false,
        is_success: false,
        is_error: false
    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { image } = this.props;

        this.encodeImageFile(image);
    }

    submit = () => {
        const { image, _id, updateProductUIConstraints, uploadedImages, images, updateAddProductFormData, image_uploading_count } = this.props;
        const { is_success, uploading  } = this.state;

        if (uploading) return;

        if (is_success) {
            return;
        }

        this.setState({ uploading: true, is_success: false, is_error: false });
        refillProductUploadFile(image)
            .then(data => {
                this.setState({ uploading: false, is_success: true, is_error: false });

                let _images = this.props.uploadedImages && this.props.uploadedImages.length ? this.props.uploadedImages : [];
                _images.push({
                    image: data.location
                })

                Utils.log("update on s3 bucket ===> ", _images);
                updateAddProductFormData({
                    [ADD_PRODUCT_FORM_UPLOADED_IMAGES]: _images
                });
               
            })
            .catch(err => {
                Utils.log("s3 upload image ===> error", err);
                this.setState({ uploading: false, is_success: false, is_error: true });
                updateProductUIConstraints({
                    [ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT]: this.props.image_uploading_count + 1
                });
            });
    }

    _handleCancel = () => {
        const { updateProductUIConstraints, images, _id } = this.props;

        this.setState({ isCancel: true });

        let _images = images && images.length ? images : [];
        let index = images.findIndex(ele => ele.index === _id);

        if (index !== -1) _images.splice(index, 1);

        updateProductUIConstraints({
            [ADD_PRODUCT_IMAGES]: images
        })
    }

    encodeImageFile(file) {
        let reader = new FileReader();
        let that = this;
        reader.onloadend = function () {
            that.setState({
                image: reader.result
            })
        }
        reader.readAsDataURL(file);
    }

    componentDidUpdate = (prevProps) => {
        const { image_uploading } = this.props;

        if (image_uploading !== prevProps.image_uploading) {
            if (image_uploading) {
                this.submit();
            }
        }
    }

    render() {
        const { isCancel, image, uploading, is_success, is_error } = this.state;

        if (isCancel) return null;

        // url(/assets/img/plus.png)

        return (
            <div className="kt-avatar kt-avatar--outline m-2" id="kt_contacts_add_avatar">
                <div className="kt-avatar__holder" style={{ backgroundImage: `url("${image}")` }}></div>
                {
                    is_success || uploading ?
                        <div className="refill-sub-container-center">
                            <p style={{ color: "#ffffff", backgroundColor: 'rgba(0, 0, 0, 0.8)', paddingLeft: 10, paddingRight: 10 }}>{uploading ? "Uploading..." : "Uploaded"}</p>
                        </div>
                        : <span className="kt-avatar__cancel" onClick={this._handleCancel.bind(this)} style={{ display: "flex" }} data-toggle="kt-tooltip" title="" data-original-title="Cancel avatar">
                            <i className="fa fa-times"></i>
                        </span>
                }

                {
                    is_error ?
                        <div className="refill-sub-container-center">
                            <p style={{ color: "#ffffff", backgroundColor: 'rgba(0, 0, 0, 0.8)', paddingLeft: 10, paddingRight: 10 }}>{"Try again"}</p>
                        </div>
                        : null
                }
            </div>
        )
    }
}

const mapToProps = ({ product }) => {
    const product_data = product && product[PRODUCT_KEY] ? product[PRODUCT_KEY] : undefined;

    const formData = product_data && product_data[ADD_PRODUCT_FORM] ? product_data[ADD_PRODUCT_FORM] : undefined;
    const uploadedImages = formData && formData[ADD_PRODUCT_FORM_UPLOADED_IMAGES] ? formData[ADD_PRODUCT_FORM_UPLOADED_IMAGES] : [];

    const images = product_data && product_data[ADD_PRODUCT_IMAGES] ? product_data[ADD_PRODUCT_IMAGES] : undefined;
    const image_uploading = product_data && product_data[ADD_PRODUCT_IS_UPLOADING_IMAGES] ? product_data[ADD_PRODUCT_IS_UPLOADING_IMAGES] : false;
    const image_uploading_count = product_data && product_data[ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT] ? product_data[ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT] : 0;


    return ({
        images,
        image_uploading,
        uploadedImages,
        length: images.length,
        image_uploading_count,
        uploadedImagesLength: uploadedImages.length
    });
}

export default connect(mapToProps, {
    updateProductUIConstraints,
    updateAddProductFormData
})(UploadImage);
