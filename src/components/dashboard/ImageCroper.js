import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { updateSystemData } from '../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, PRODUCT_KEY, ADD_PRODUCT_FORM, ADD_PRODUCT_REQEUST_LOADING, ADD_PRODUCT_REQUEST_STATUS, ADD_PRODUCT_ERRORS, ADD_PRODUCT_FORM_NAME, ADD_PRODUCT_FORM_SHORT_DESCRIPTION, ADD_PRODUCT_FORM_LONG_DESCRIPTION, ADD_PRODUCT_FORM_BRAND, ADD_PRODUCT_FORM_DISTRIBUTOR, ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, ADD_PRODUCT_FORM_RETAIL_PRICE, ADD_PRODUCT_FORM_REFILL_PRICE, ADD_PRODUCT_FORM_DISCOUNT, ADD_PRODUCT_FORM_NOTES, ADD_PRODUCT_FORM_ALERT, ADD_PRODUCT_FORM_QUANTITY, ADD_PRODUCT_FORM_SIZE, ADD_PRODUCT_FORM_WEIGHT, ADD_PRODUCT_FORM_UNITS, ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, ADD_PRODUCT_FORM_MFG_DATE, ADD_PRODUCT_FORM_EXPIRY_DATE, ADD_PRODUCT_FORM_CODE, ADD_PRODUCT_FORM_PUP_GTIN_CODE, MESSAGE, SUCCESS, ERROR, STATUS, ADD_PRODUCT_FORM_CATEGORY_ID, ADD_PRODUCT_FORM_SUB_CATEGORY_ID, ADD_PRODUCT_IMAGES, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_FORM_PRODUCT_ID, EDIT_PRODUCT_FORM, EDIT_PRODUCT_FORM_NAME, EDIT_PRODUCT_FORM_SHORT_DESCRIPTION, EDIT_PRODUCT_FORM_LONG_DESCRIPTION, EDIT_PRODUCT_FORM_BRAND, EDIT_PRODUCT_FORM_DISTRIBUTOR, EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, EDIT_PRODUCT_FORM_RETAIL_PRICE, EDIT_PRODUCT_FORM_REFILL_PRICE, EDIT_PRODUCT_FORM_DISCOUNT, EDIT_PRODUCT_FORM_NOTES, EDIT_PRODUCT_FORM_ALERT, EDIT_PRODUCT_FORM_QUANTITY, EDIT_PRODUCT_FORM_WEIGHT, EDIT_PRODUCT_FORM_SIZE, EDIT_PRODUCT_FORM_UNITS, EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, EDIT_PRODUCT_FORM_MFG_DATE, EDIT_PRODUCT_FORM_EXPIRY_DATE, EDIT_PRODUCT_FORM_CODE, EDIT_PRODUCT_FORM_PUP_GTIN_CODE, EDIT_PRODUCT_FORM_CATEGORY_ID, EDIT_PRODUCT_FORM_SUB_CATEGORY_ID, EDIT_PRODUCT_FORM_UPLOADED_IMAGES, EDIT_PRODUCT_ERRORS, EDIT_PRODUCT_REQEUST_LOADING, EDIT_PRODUCT_REQUEST_STATUS, EDIT_PRODUCT_IMAGES, EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_IS_UPLOADING_IMAGES, USER_CUSTOMER_NAME, USER_CUSTOMER_EMAIL, USER_CUSTOMER_PHONENO, USER_CUSTOMER_NOTES, USER_CUSTOMER_ADDRESS, USER_CUSTOMER_CITY, USER_CUSTOMER_STATE, USER_CUSTOMER_COUNTRY, USER_CUSTOMER_ZIPCODE, USER_EDIT_FORM, USER_CUSTOMER_ERROR, USER_CUSTOMER_ID, USER_EDIT_REQUEST_STATUS, USER_CUSTOMER_LOADING, SPLASH_TITLE1, SPLASH_CONTENT3, SPLASH_CONTENT1, SPLASH_TITLE2, SPLASH_TITLE3, SPLASH_CONTENT2, SPLASH_KEY, SPLASH_FORM_LOADING3, SPLASH_FORM1, SPLASH_FORM2, SPLASH_FORM3, SPLASH_FORM_LOADING1, SPLASH_FORM_ERROR, SPLASH_FORM_LOADING2, SPLASH_FORM_ERROR1, SPLASH_FORM_ERROR3, SPLASH_FORM_ERROR2, SPLASH_IMAGE1, SPLASH_IMAGE2, SPLASH_IMAGE3, SPLASH_IMAGE1_FILE, SPLASH_IMAGE3_FILE, SPLASH_IMAGE2_FILE } from '../../redux/Types'
import { Helper } from '../../apis'
import { SelectCalendar, SelectCategory, UploadImageContainer, EditUploadImageContainer } from '../../components/dashboard/product'
import { refillAddSubCategory } from '../../apis/APIs'
import SelectSubCategory from '../../components/dashboard/product/SelectSubCategory'
import Utils from '../../components/util/Utils'
import { ToastsStore } from 'react-toasts'
import {} from '../../redux/Types'
import { updateEditSplashForm1Data,updateEditSplashForm2Data,updateEditSplashForm3Data, updateSplashUIConstraints } from '../../redux/splash/Action'
import $ from 'jquery'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
// import{ } from '../../../public/assets/img/plus.png'

class ImageCroper extends PureComponent {

  constructor(){
    super()
    this.state = {
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
  }

  componentDidMount(){
    const { imageUrl ,imageFile1,imageFile2, imageFile3 } = this.props
    if(imageUrl && (imageFile1 === "" && imageFile2 === "" && imageFile3 === "") ){
      this.setState({
        croppedImageUrl:imageUrl
      })
    }
  }

  componentDidUpdate(preProps){
    const { imageUrl ,imageFile1,imageFile2, imageFile3 } = this.props
    
    if(imageUrl && (imageFile1 === "" && imageFile2 === "" && imageFile3 === "") ){
      this.setState({
        croppedImageUrl:imageUrl
      })
    }
    
  }


      onSelectFile = e => {
        Utils.log("test === == ?>",e)
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
          if(id === "image1"){
            this.onChangeText1(SPLASH_IMAGE1_FILE,croppedImage)
          }else if(id === "image2"){
            this.onChangeText2(SPLASH_IMAGE2_FILE,croppedImage)
          }else{
            this.onChangeText3(SPLASH_IMAGE3_FILE,croppedImage)
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
    

    onChangeText1 = (key, value) => {
        const { updateEditSplashForm1Data } = this.props;

        updateEditSplashForm1Data({
            [key]: value
        });
    }

    onChangeText2 = (key, value) => {
      const { updateEditSplashForm2Data } = this.props;

      updateEditSplashForm2Data({
          [key]: value
      });
  }

  onChangeText3 = (key, value) => {
    const { updateEditSplashForm3Data } = this.props;

    updateEditSplashForm3Data({
        [key]: value
    });
  }

 
  isError1 = (key) => {
    const { errors1 } = this.props;
    console.log(errors1)
    if (errors1 && errors1.length) {
        return errors1.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors1[errors1.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
    } else return { status: false, message: "" }
}

_handleErrorMessage1 = (key) => {
    const data = this.isError1(key);

    if (data && data.status) return <span className="form-text text-error text-right">{data.message}</span>;

    return <div />
}

isError2 = (key) => {
    const { errors2 } = this.props;
    console.log(errors2)
    if (errors2 && errors2.length) {
        return errors2.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors2[errors2.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
    } else return { status: false, message: "" }
}

_handleErrorMessage2 = (key) => {
    const data = this.isError2(key);

    if (data && data.status) return <span className="form-text text-error text-right">{data.message}</span>;

    return <div />
}

isError3 = (key) => {
    const { errors3 } = this.props;
    console.log(errors3)
    if (errors3 && errors3.length) {
        return errors3.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors3[errors3.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
    } else return { status: false, message: "" }
}

_handleErrorMessage3 = (key) => {
    const data = this.isError3(key);

    if (data && data.status) return <span className="form-text text-error text-right">{data.message}</span>;

    return <div />
}

clear(){
  const { imageUrl, modelId ,imageFile1,imageFile2, imageFile3,image1, image2,image3 } = this.props
  if(imageFile1){
    this.setState({
      croppedImageUrl:image1
    })
  }
   if(imageFile2){
    this.setState({
      croppedImageUrl:image2
    })
  }
   if(imageFile3){
    this.setState({
      croppedImageUrl:image3
    })
  }
  // if(){
  //   this.setState({
  //     croppedImageUrl:"/assets/img/plus.png"
  //   })
  // }
  
}

    openFile(id){
        document.getElementById(id).click()
    }

    render() {
        const { crop, croppedImageUrl, src } = this.state;
        const {id, modelId ,title1, imageFile1, title2, title3, content1, content2, content3, image1, image2, image3, loading1, loading2, loading3} = this.props
        
        return (
            <div className="form-group mx-auto">
                <input type="file" hidden id={id} onChange={this.onSelectFile} accept="image/png, image/jpeg" />
                <div className="alert alert-secondary" role="alert" onClick={()=>{this.openFile(id)}}>
                    <div className="alert-text " > 
                    {croppedImageUrl && (
                <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
                )}
                    </div>
                </div>
                {/* {this._handleErrorMessage1(id)} */}
                {/* {this._handleErrorMessage2(id)}
                {this._handleErrorMessage3(id)} */}
                <div class="modal" id={modelId}>
                                        <div class="modal-dialog">
                                            <div class="modal-content">

                                            {/* <!-- Modal Header --> */}
                                            <div class="modal-header">
                                                <h4 class="modal-title">Image cropper</h4>
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
                                                <button type="button" class="btn btn-danger" data-dismiss="modal" onClick={()=>this.clear()} >Close</button>
                                                <button type="button" class="btn btn-danger" data-dismiss="modal">ok</button>
                                            </div>

                                            </div>
                                        </div>
                                        </div>
            </div>
        )
    }
}
export default connect(({splash})=>{

    const splash_data = splash && splash[SPLASH_KEY]
    const splash_form1_data = splash && splash[SPLASH_KEY][SPLASH_FORM1]
    const splash_form2_data = splash && splash[SPLASH_KEY][SPLASH_FORM2]
    const splash_form3_data = splash && splash[SPLASH_KEY][SPLASH_FORM3]

    return({
        
      id1:splash_form1_data.splash_id1,
      title1:splash_form1_data.splash_title1,
      content1:splash_form1_data.splash_content1,
      image1:splash_form1_data.splash_image1,
      imageFile1:splash_form1_data.splash_image1_file,
      imageLoading1:splash_form1_data.splash_image1_loading,
      loading1:splash_form1_data.splash_form_loading1,
    
      id2:splash_form2_data.splash_id2,
      title2:splash_form2_data.splash_title2,
      content2:splash_form2_data.splash_content2,
      image2:splash_form2_data.splash_image2,
      imageFile2:splash_form2_data.splash_image2_file,
      imageLoading2:splash_form2_data.splash_image2_loading,
      loading2:splash_form2_data.splash_form_loading2,

      id3:splash_form3_data.splash_id3,
      title3:splash_form3_data.splash_title3,
      content3:splash_form3_data.splash_content3,
      image3:splash_form3_data.splash_image3,
      imageFile3:splash_form3_data.splash_image3_file,
      imageLoading3:splash_form3_data.splash_image3_loading,
      loading3:splash_form3_data.splash_form_loading3,

      errors1:splash_data.splash_form_error1,
      errors2:splash_data.splash_form_error2,
      errors3:splash_data.splash_form_error3
    })
},{
    updateEditSplashForm1Data,
    updateEditSplashForm2Data,
    updateEditSplashForm3Data,
    updateSplashUIConstraints
}) (ImageCroper)
