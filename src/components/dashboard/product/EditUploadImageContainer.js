import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { UploadImage, SelectUploadFile, EditSelectUploadFile, EditUploadImage } from '.'
import { connect } from 'react-redux'
import { PRODUCT_KEY, ADD_PRODUCT_FORM, ADD_PRODUCT_IMAGES, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_IS_UPLOADING_IMAGES, EDIT_PRODUCT_IMAGES } from '../../../redux/Types'
import { updateProductUIConstraints } from '../../../redux/product/Action'
import Utils from '../../util/Utils'

class EditUploadImageContainer extends PureComponent {
    static propTypes = {
        error_label: PropTypes.any
    }

    addImage = () => {

        let selectImage = document.getElementById('select_product_image');
        selectImage.click();

        return;
    }

    getRandomFileName = () => {
        const test= parseInt(`${new Date().getTime()}${Math.random() * 1000}`)
      return test+".jpg";
   }

    onChangeFile = (e) => {
        const { images, updateProductUIConstraints } = this.props;
        
        let _images = images;
        const file=e.target.files[0]
        let reader = new FileReader();
        reader.readAsText(file);
        const chnageImage= new File([file],this.getRandomFileName())
              
        _images.push({
            index: images && images.length ? images[images.length - 1].index + 1 : 0,
            image: chnageImage
        });
        updateProductUIConstraints({
            [EDIT_PRODUCT_IMAGES]: _images
        });
    }

    render() {
        const { images, error_label } = this.props;
        Utils.log("images ===> container", images);

        return (
            <div className="col-lg-9 col-xl-6">
                <EditSelectUploadFile
                    _id={"kt_contacts_edit_avatar"}
                    addImage={this.addImage.bind(this)}
                    onChangeFile={this.onChangeFile.bind(this)}
                />
                {
                    images && images.length ?
                        images.map(ele => {
                            return <EditUploadImage _id={ele.index} key={ele.index} image={ele.image} uploaded={ele.uploaded} />;
                        })
                        : < div />
                }
                {error_label}
            </div>
        )
    }
}

const mapToProps = ({ product }) => {
    const product_data = product && product[PRODUCT_KEY] ? product[PRODUCT_KEY] : undefined;

    const images = product_data && product_data[EDIT_PRODUCT_IMAGES] ? product_data[EDIT_PRODUCT_IMAGES] : [];

    return ({
        images,
        length: images.length
    });
}

export default connect(mapToProps, {
    updateProductUIConstraints
})(EditUploadImageContainer);