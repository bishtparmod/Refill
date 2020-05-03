import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateProductUIConstraints, updateEditProductFormData } from '../../../redux/product/Action';
import { ADD_PRODUCT_IMAGES, PRODUCT_KEY, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_FORM, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_FORM, EDIT_PRODUCT_FORM_UPLOADED_IMAGES, EDIT_PRODUCT_IMAGES, EDIT_PRODUCT_IS_UPLOADING_IMAGES, EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT } from '../../../redux/Types';
import { refillProductUploadFile } from '../../../apis/APIs';
import Utils from '../../util/Utils';

class EditUploadImage extends PureComponent {
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
        const { image, uploaded } = this.props;
console.log("ghfjfgjhdfjhjd",uploaded)
        if (uploaded) {
            this.setState({
                image
            });

            return;
        }
        this.encodeImageFile(image);
    }

    submit = () => {
        const { image, uploaded, _id, updateProductUIConstraints, uploadedImages, images, image_uploading_count, updateEditProductFormData } = this.props;
        const { is_success, uploading } = this.state;
        
        console.log("uploading = >",uploading)
        if (uploading) return;
        console.log("is_success = >",is_success)
        if (is_success) {
            return;
        }
        console.log("uploaded = >",uploaded)
        if (uploaded) {
            this.setState({ uploading: false, is_success: true, is_error: false });
            console.log("update on s3 bucket ===> ", uploadedImages)
          
            let _images = this.props.uploadedImages && this.props.uploadedImages.length ? this.props.uploadedImages : []
            _images.push({
                image
            })
            console.log("update on s3 bucket ===> ", _images);
            updateEditProductFormData({
                [EDIT_PRODUCT_FORM_UPLOADED_IMAGES]: _images
            });
            updateProductUIConstraints({
                [EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT]: _images.length
            });
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

                console.log("update on s3 bucket ===> ", _images);
                updateEditProductFormData({
                    [EDIT_PRODUCT_FORM_UPLOADED_IMAGES]: _images
                });
                updateProductUIConstraints({
                    [EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT]: this.props.image_uploading_count + 1
                });

            })
            .catch(err => {
                Utils.log("s3 upload image ===> error", err);
                this.setState({ uploading: false, is_success: false, is_error: true });
                updateProductUIConstraints({
                    [EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT]: this.props.image_uploading_count + 1
                });
            });
    }

    _handleCancel = () => {
        const { updateProductUIConstraints, images, _id } = this.props;

        this.setState({ isCancel: true});

        let _images = images && images.length ? images : [];
        let index = images.findIndex(ele => ele.index === _id);

        if (index !== -1) _images.splice(index, 1);

        // updateEditProductFormData({
        //     [EDIT_PRODUCT_FORM_UPLOADED_IMAGES]: []
        // });
        updateProductUIConstraints({
            [EDIT_PRODUCT_IMAGES]: images,
            // [EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT]: images.length
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
                setTimeout(()=>{
                    this.submit();
                },500)  
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
                    <div>
                        <div className="refill-sub-container-center">
                            <p style={{ color: "#ffffff", backgroundColor: 'rgba(0, 0, 0, 0.8)', paddingLeft: 10, paddingRight: 10 }}>{uploading ? "Uploading..." : ""}</p>
                        </div>
                        <span className="kt-avatar__cancel" onClick={this._handleCancel.bind(this)} style={{ display: "flex" }} data-toggle="kt-tooltip" title="" data-original-title="Cancel avatar">
                            <i className="fa fa-times"></i>
                        </span>
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

    const formData = product_data && product_data[EDIT_PRODUCT_FORM] ? product_data[EDIT_PRODUCT_FORM] : undefined;
    const uploadedImages = formData && formData[EDIT_PRODUCT_FORM_UPLOADED_IMAGES] ? formData[EDIT_PRODUCT_FORM_UPLOADED_IMAGES] : [];

    const images = product_data && product_data[EDIT_PRODUCT_IMAGES] ? product_data[EDIT_PRODUCT_IMAGES] : undefined;
    const image_uploading = product_data && product_data[EDIT_PRODUCT_IS_UPLOADING_IMAGES] ? product_data[EDIT_PRODUCT_IS_UPLOADING_IMAGES] : false;
    const image_uploading_count = product_data && product_data[EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT] ? product_data[EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT] : 0;


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
    updateEditProductFormData
})(EditUploadImage);