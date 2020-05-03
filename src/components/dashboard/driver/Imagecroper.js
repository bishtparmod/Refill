import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, PRODUCT_KEY, ADD_PRODUCT_FORM, ADD_PRODUCT_REQEUST_LOADING, ADD_PRODUCT_REQUEST_STATUS, ADD_PRODUCT_ERRORS, ADD_PRODUCT_FORM_NAME, ADD_PRODUCT_FORM_SHORT_DESCRIPTION, ADD_PRODUCT_FORM_LONG_DESCRIPTION, ADD_PRODUCT_FORM_BRAND, ADD_PRODUCT_FORM_DISTRIBUTOR, ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, ADD_PRODUCT_FORM_RETAIL_PRICE, ADD_PRODUCT_FORM_REFILL_PRICE, ADD_PRODUCT_FORM_DISCOUNT, ADD_PRODUCT_FORM_NOTES, ADD_PRODUCT_FORM_ALERT, ADD_PRODUCT_FORM_QUANTITY, ADD_PRODUCT_FORM_SIZE, ADD_PRODUCT_FORM_WEIGHT, ADD_PRODUCT_FORM_UNITS, ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, ADD_PRODUCT_FORM_MFG_DATE, ADD_PRODUCT_FORM_EXPIRY_DATE, ADD_PRODUCT_FORM_CODE, ADD_PRODUCT_FORM_PUP_GTIN_CODE, MESSAGE, SUCCESS, ERROR, STATUS, ADD_PRODUCT_FORM_CATEGORY_ID, ADD_PRODUCT_FORM_SUB_CATEGORY_ID, ADD_PRODUCT_IMAGES, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_FORM_PRODUCT_ID, EDIT_PRODUCT_FORM, EDIT_PRODUCT_FORM_NAME, EDIT_PRODUCT_FORM_SHORT_DESCRIPTION, EDIT_PRODUCT_FORM_LONG_DESCRIPTION, EDIT_PRODUCT_FORM_BRAND, EDIT_PRODUCT_FORM_DISTRIBUTOR, EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, EDIT_PRODUCT_FORM_RETAIL_PRICE, EDIT_PRODUCT_FORM_REFILL_PRICE, EDIT_PRODUCT_FORM_DISCOUNT, EDIT_PRODUCT_FORM_NOTES, EDIT_PRODUCT_FORM_ALERT, EDIT_PRODUCT_FORM_QUANTITY, EDIT_PRODUCT_FORM_WEIGHT, EDIT_PRODUCT_FORM_SIZE, EDIT_PRODUCT_FORM_UNITS, EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, EDIT_PRODUCT_FORM_MFG_DATE, EDIT_PRODUCT_FORM_EXPIRY_DATE, EDIT_PRODUCT_FORM_CODE, EDIT_PRODUCT_FORM_PUP_GTIN_CODE, EDIT_PRODUCT_FORM_CATEGORY_ID, EDIT_PRODUCT_FORM_SUB_CATEGORY_ID, EDIT_PRODUCT_FORM_UPLOADED_IMAGES, EDIT_PRODUCT_ERRORS, EDIT_PRODUCT_REQEUST_LOADING, EDIT_PRODUCT_REQUEST_STATUS, EDIT_PRODUCT_IMAGES, EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_IS_UPLOADING_IMAGES, USER_CUSTOMER_NAME, USER_CUSTOMER_EMAIL, USER_CUSTOMER_PHONENO, USER_CUSTOMER_NOTES, USER_CUSTOMER_ADDRESS, USER_CUSTOMER_CITY, USER_CUSTOMER_STATE, USER_CUSTOMER_COUNTRY, USER_CUSTOMER_ZIPCODE, USER_EDIT_FORM, USER_CUSTOMER_ERROR, USER_CUSTOMER_ID, USER_EDIT_REQUEST_STATUS, USER_CUSTOMER_LOADING, SPLASH_TITLE1, SPLASH_CONTENT3, SPLASH_CONTENT1, SPLASH_TITLE2, SPLASH_TITLE3, SPLASH_CONTENT2, SPLASH_KEY, SPLASH_FORM_LOADING3, SPLASH_FORM1, SPLASH_FORM2, SPLASH_FORM3, SPLASH_FORM_LOADING1, SPLASH_FORM_ERROR, SPLASH_FORM_LOADING2, SPLASH_FORM_ERROR1, SPLASH_FORM_ERROR3, SPLASH_FORM_ERROR2, SPLASH_IMAGE1, SPLASH_IMAGE2, SPLASH_IMAGE3, DRIVER_KEY, DRIVER_FORM, DRIVER_FORM_UPLOADED_IMAGES, DRIVER_FORM_ERROR, DRIVER_EDIT_FORM_UPLOADED_IMAGES, DRIVER_EDIT_IMAGE_UPLOADED_FILE, DRIVER_EDIT_FORM } from '../../../redux/Types'
import { updateEditDriverFormData,updateEdit1DriverFormData, updateDriverUIConstraints } from '../../../redux/driver/Action'
import $ from 'jquery'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Utils from '../../util/Utils'
// import{ } from '../../../public/assets/img/plus.png'

class Imagecroper extends PureComponent {
  constructor(props){
    super(props)
    this. state = {
      croppedImageUrl:"/assets/img/plus.png",
      src: null,
      crop: {
        unit: '%',
        width: 30,
        aspect: 16 / 9,
        maxWidth:"414px",
        maxHeight:"523px"
      },
    };

   this.init()
  }

  init = () =>{
      this.setState({
        croppedImageUrl:"/assets/img/plus.png"
      })
  }

  componentDidUpdate(preProps){
    const { imageUrl ,imageFile } = this.props
    if(imageUrl && imageFile === ""){
      this.setState({
        croppedImageUrl:imageUrl
      })
    }
  }


      onSelectFile = e => {
          const {modelId} = this.props
          window.$(`#${modelId}`).modal('show')
        if (e.target.files && e.target.files.length > 0) {
          const reader = new FileReader();
          reader.addEventListener('load', () =>
            this.setState({ src: reader.result })
            
          );
          reader.readAsDataURL(e.target.files[0]);
          window.$(`#${modelId}`).modal('show')
        }
      };
    
      // If you setState the crop in here you should return false.
      onImageLoaded = image => {
        this.imageRef = image;
      };
    
      onCropComplete = crop => {
        this.makeClientCrop(crop);
      };
    
      onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
      };

      getRandomFileName = () => {
          const test= parseInt(`${new Date().getTime()}${Math.random() * 1000}`)
        return test+".jpg";
     }

    
      async makeClientCrop(crop) {
          const {id} = this.props
        if (this.imageRef && crop.width && crop.height) {
          const croppedImage = await this.getCroppedImg(
            this.imageRef,
            crop,
            this.getRandomFileName()
          );
          if(id === "image"){
            this.onChangeText(DRIVER_FORM_UPLOADED_IMAGES,croppedImage)
          }else{
            this.editonChangeText(DRIVER_EDIT_IMAGE_UPLOADED_FILE,croppedImage)
          }
        
          window.URL.revokeObjectURL(this.fileUrl);
          this.fileUrl = window.URL.createObjectURL(croppedImage);
          this.setState({ croppedImageUrl:this.fileUrl });
        }
      }
    
      getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
    
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );
    
        return new Promise((resolve, reject) => {
          canvas.toBlob(blob => {
            if (!blob) {
              //reject(new Error('Canvas is empty'));
              console.error('Canvas is empty');
              return;
            }
            blob.name = fileName;
            window.URL.revokeObjectURL(this.fileUrl);
            this.fileUrl = window.URL.createObjectURL(blob);
            resolve(blob);
          }, 'image/jpeg');
        });
      }
    
      editonChangeText = (key, value) => {
        const { updateEdit1DriverFormData } = this.props;

        updateEdit1DriverFormData({
            [key]: value
        });
    }

    onChangeText = (key, value) => {
        const { updateEditDriverFormData } = this.props;

        updateEditDriverFormData({
            [key]: value
        });
    }

    isError = (key) => {
        const { errors } = this.props;
        console.log(errors)
        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    _handleErrorMessage = (key) => {
        const data = this.isError(key);

        if (data && data.status) return <span className="form-text text-error text-right">{data.message}</span>;

        return <div />
    }

    openFile(id){
        document.getElementById(id).click()
    }

    clear(){
      const { image ,imageFile } = this.props
      if(image){
        if(imageFile){
          this.setState({
            croppedImageUrl:image
          })
        }
      }else{
      this.setState({
        croppedImageUrl:"/assets/img/plus.png"
      })
      }
      
    }

    render() {
        const { crop, croppedImageUrl, src } = this.state;
        const {id, modelId ,title1, title2, title3, content1, content2, content3, image1, image2, image3, loading1, loading2, loading3} = this.props
        return (
            <div className="form-group mx-auto">
                <input type="file" hidden id={id} onChange={this.onSelectFile} accept="image/png, image/jpeg" />
                
                <div className="alert alert-secondary" role="alert" onClick={()=>{this.openFile(id)}}>
                  <div class="col-lg-12 col-md-12 col-sm-12">
                          <div class="dropzone dropzone-default" id="kt_dropzone_1">
                                  {croppedImageUrl && (
                          <img  alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
                          )}
                          </div>
                  </div>
                </div>
                {this._handleErrorMessage(id)}
                <div class="modal" id={modelId}>
                                        <div class="modal-dialog">
                                            <div class="modal-content">

                                            {/* <!-- Modal Header --> */}
                                            <div class="modal-header">
                                                <h4 class="modal-title">Modal Heading</h4>
                                                <button type="button" class="close" data-dismiss="modal"></button>
                                            </div>

                                            {/* <!-- Modal body --> */}
                                            <div class="modal-body">
                                            {src && (
                                                    <ReactCrop
                                                        src={src}
                                                        crop={crop}
                                                        ruleOfThirds
                                                        onImageLoaded={this.onImageLoaded}
                                                        onComplete={this.onCropComplete}
                                                        onChange={this.onCropChange}
                                                    />
                                                    )}
                                                    
                                            </div>

                                            {/* <!-- Modal footer --> */}
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-danger" data-dismiss="modal" onClick={()=>this.clear()}>Close</button>
                                                <button type="button" class="btn btn-danger" data-dismiss="modal">ok</button>
                                            </div>

                                            </div>
                                        </div>
                                        </div>
            </div>
        )
    }
}
export default connect(({splash,driver})=>{
    const driver_data = driver && driver[DRIVER_KEY] ? driver[DRIVER_KEY] : undefined;
    const addDriverFormData = driver_data && driver_data[DRIVER_EDIT_FORM] ? driver_data[DRIVER_EDIT_FORM] : undefined;
    
    return({
        errors : driver_data && driver_data[DRIVER_FORM_ERROR] ? driver_data[DRIVER_FORM_ERROR] : [],
        imageFile: addDriverFormData && addDriverFormData[DRIVER_EDIT_IMAGE_UPLOADED_FILE] ? addDriverFormData[DRIVER_EDIT_IMAGE_UPLOADED_FILE] : "",
        image : addDriverFormData && addDriverFormData[DRIVER_EDIT_FORM_UPLOADED_IMAGES] ? addDriverFormData[DRIVER_EDIT_FORM_UPLOADED_IMAGES] : ""
    })
},{
    updateEditDriverFormData, 
    updateDriverUIConstraints,
    updateEdit1DriverFormData
}) (Imagecroper)
