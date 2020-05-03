import React, { PureComponent } from 'react'
import { updateProductUIConstraints, resetProductState, updateEditProductFormData, getProductViaID, editProduct } from '../../../redux/product/Action'
import { connect } from 'react-redux'
import { SYSTEM_DATA_PAGE_TITLE, PRODUCT_KEY, ADD_PRODUCT_FORM, ADD_PRODUCT_REQEUST_LOADING, ADD_PRODUCT_REQUEST_STATUS, ADD_PRODUCT_ERRORS, ADD_PRODUCT_FORM_NAME, ADD_PRODUCT_FORM_SHORT_DESCRIPTION, ADD_PRODUCT_FORM_LONG_DESCRIPTION, ADD_PRODUCT_FORM_BRAND, ADD_PRODUCT_FORM_DISTRIBUTOR, ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, ADD_PRODUCT_FORM_RETAIL_PRICE, ADD_PRODUCT_FORM_REFILL_PRICE, ADD_PRODUCT_FORM_DISCOUNT, ADD_PRODUCT_FORM_NOTES, ADD_PRODUCT_FORM_ALERT, ADD_PRODUCT_FORM_QUANTITY, ADD_PRODUCT_FORM_SIZE, ADD_PRODUCT_FORM_WEIGHT, ADD_PRODUCT_FORM_UNITS, ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, ADD_PRODUCT_FORM_MFG_DATE, ADD_PRODUCT_FORM_EXPIRY_DATE, ADD_PRODUCT_FORM_CODE, ADD_PRODUCT_FORM_PUP_GTIN_CODE, MESSAGE, SUCCESS, ERROR, STATUS, ADD_PRODUCT_FORM_CATEGORY_ID, ADD_PRODUCT_FORM_SUB_CATEGORY_ID, ADD_PRODUCT_IMAGES, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_FORM_PRODUCT_ID, EDIT_PRODUCT_FORM, EDIT_PRODUCT_FORM_NAME, EDIT_PRODUCT_FORM_SHORT_DESCRIPTION, EDIT_PRODUCT_FORM_LONG_DESCRIPTION, EDIT_PRODUCT_FORM_BRAND, EDIT_PRODUCT_FORM_DISTRIBUTOR, EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, EDIT_PRODUCT_FORM_RETAIL_PRICE, EDIT_PRODUCT_FORM_REFILL_PRICE, EDIT_PRODUCT_FORM_DISCOUNT, EDIT_PRODUCT_FORM_NOTES, EDIT_PRODUCT_FORM_ALERT, EDIT_PRODUCT_FORM_QUANTITY, EDIT_PRODUCT_FORM_WEIGHT, EDIT_PRODUCT_FORM_SIZE, EDIT_PRODUCT_FORM_UNITS, EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, EDIT_PRODUCT_FORM_MFG_DATE, EDIT_PRODUCT_FORM_EXPIRY_DATE, EDIT_PRODUCT_FORM_CODE, EDIT_PRODUCT_FORM_PUP_GTIN_CODE, EDIT_PRODUCT_FORM_CATEGORY_ID, EDIT_PRODUCT_FORM_SUB_CATEGORY_ID, EDIT_PRODUCT_FORM_UPLOADED_IMAGES, EDIT_PRODUCT_ERRORS, EDIT_PRODUCT_REQEUST_LOADING, EDIT_PRODUCT_REQUEST_STATUS, EDIT_PRODUCT_IMAGES, EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_IS_UPLOADING_IMAGES } from '../../../redux/Types'
import moment from 'moment';

class View extends PureComponent {

    constructor() {
        super()
        this.state = {
            modelImage: ""
        }
    }
    componentDidMount() {
        this.init()
    }

    changeModelImage(img) {
        this.setState({
            modelImage: img
        })
    }

    init = () => {
        const { updateEditProductFormData, history, getProductViaID } = this.props;
        const location = window.location
        const id = location && location.pathname ? location.pathname.split("view/").length ? location.pathname.split("view/")[1] : "" : "";

        if (!id) {
            history.push('/product/list')
        }
        updateEditProductFormData({
            [EDIT_PRODUCT_FORM_PRODUCT_ID]: id
        });
        getProductViaID();
    }

    render() {
        const { name, notes, image, brand, longdescription, expiryDate, manufactureDate, shortdescription, Retailprice, quantity, productWeight, refillprice, discount, distributor } = this.props
        const productimage = image && image.length ? image[0].image : ""
        const { modelImage } = this.state
        return (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

                <div className="kt-subheader kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid pl-5">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Product </h3>
                            <span className="kt-subheader__separator kt-hidden"></span>
                            <div className="kt-subheader__breadcrumbs">
                                <a className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a className="kt-subheader__breadcrumbs-link">
                                    View </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row pl-5 pr-5">
                    <div className="col-8 kt-portlet kt-portlet--height-fluid">
                        <div className="kt-portlet__head">
                            <div className="kt-portlet__head-label">
                                <h3 className="kt-portlet__head-title">
                                    {brand}
                                </h3>
                            </div>
                        </div>
                        <div className="kt-portlet__body">
                            <div className="tab-content">
                                <div className="tab-pane active" id="kt_widget5_tab1_content" aria-expanded="true">
                                    <div className="kt-widget5">
                                        <div className="kt-widget5__item">
                                            <div className="kt-widget5__content align-items-start">
                                                <div id="carouselExampleInterval" class="carousel slide" data-ride="carousel">
                                                {/* <ol class="carousel-indicators">
                                                <li data-target="#carouselExampleCaptions" data-slide-to="0" class="active"></li>
                                                        {image.slice(1).map((ele, index) =>
                                                             <li data-target="#carouselExampleCaptions" data-slide-to={index+1}></li>
                                                        )}
                                                </ol> */}
                                                    <div class="carousel-inner" style={{ "width": "300px", "height": "200px", "backgroundColor": "white" }}>
                                                        <div class="carousel-item active" data-interval="2000">
                                                            <img src={productimage} class="d-block w-100" alt="..." onClick={() => { this.changeModelImage(productimage) }} data-toggle="modal" data-target="#myModal" />
                                                        </div>

                                                        {image.slice(1).map((ele, index) => 
                                                            <div class="carousel-item" data-interval="2000" key={index}>
                                                                <img src={ele.image} class="d-block w-100" alt="..." onClick={() => { this.changeModelImage(ele.image) }} data-toggle="modal" data-target="#myModal" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <a class="carousel-control-prev" href="#carouselExampleInterval" role="button" data-slide="prev">
                                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                        <span class="sr-only">Previous</span>
                                                    </a>
                                                    <a class="carousel-control-next" href="#carouselExampleInterval" role="button" data-slide="next">
                                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                        <span class="sr-only">Next</span>
                                                    </a>
                                                </div>

                                                <div className="kt-widget5__pic">


                                                    {/* <img className="kt-widget7__img" src={productimage} alt="" style={{ maxWidth: "20rem" }} />
                                                    {image && image.length > 1 
                                                    ?
                                                    <p className="kt-font-info mt-3" >
                                                      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
                                                      See more image
                                                    </button>  
                                                        </p>
                                                    :
                                                    ""
                                                    } */}

                                                </div>
                                                <div className="kt-widget5__section text-left">
                                                    <a href="#" className="kt-widget5__title">
                                                        <h3 className="kt-font-info">{name}</h3>
                                                    </a>
                                                    <p className="kt-widget5__desc">
                                                        <b>{longdescription}</b>
                                                    </p>
                                                    <p className="kt-widget5__desc">
                                                        {shortdescription}
                                                    </p>
                                                    <div className="kt-widget5__info mt-2">
                                                        <span><b>Retail Price:</b></span>
                                                        <span className="kt-font-info">{Retailprice}</span>
                                                        <span><b>Refill Price:</b></span>
                                                        <span className="kt-font-info">{refillprice}</span>
                                                        <span><b>Discount:</b></span>
                                                        <span className="kt-font-info">{discount.value}%</span>

                                                    </div>
                                                    <div className="kt-widget5__info mt-2">
                                                        <span><b>Distributor :</b> </span>
                                                        <span className="kt-font-info">{distributor}</span>
                                                        <span><b>Quatity:</b></span>
                                                        <span className="kt-font-info">{quantity}</span>
                                                        <span><b>Weight:</b></span>
                                                        <span className="kt-font-info">{productWeight}</span>
                                                    </div>

                                                    <div className="kt-widget5__info mt-2">
                                                        <span><b>Expiry Date:</b> </span>
                                                        <span className="kt-font-info">{moment(expiryDate).format('MMMM Do YYYY')}</span>
                                                        <span><b>Manufacture Date: </b></span>
                                                        <span className="kt-font-info">{moment(manufactureDate).format('MMMM Do YYYY')}</span>
                                                    </div>
                                                    <div className="kt-widget5__info mt-4">
                                                        <span><b>Notes:</b></span>
                                                        <span className="kt-font-info">{notes}</span>
                                                    </div>

                                                </div>
                                            </div>
                                            {/* <div className="kt-widget5__content ">
                                        <div className="kt-widget5__stats ">
                                            <span className="kt-widget5__number">{discount}%</span>
                                            <span className="kt-widget5__sales"><b>Discount</b></span>
                                        </div>
                                    </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="kt_widget5_tab2_content">
                                    <div className="kt-widget5">
                                        <div className="kt-widget5__item">
                                            <div className="kt-widget5__content">
                                                <div className="kt-widget5__pic">
                                                    <img className="kt-widget7__img" src="assets/media//products/product10.jpg" alt="" />
                                                </div>
                                                <div className="kt-widget5__section">
                                                    <a href="#" className="kt-widget5__title">
                                                        Branding Mockup
                                            </a>
                                                    <p className="kt-widget5__desc">
                                                        Metronic bootstrap themes.
                                            </p>
                                                    <div className="kt-widget5__info">
                                                        <span>Author:</span>
                                                        <span className="kt-font-info">Fly themes</span>
                                                        <span>Released:</span>
                                                        <span className="kt-font-info">23.08.17</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="kt-widget5__content">
                                                <div className="kt-widget5__stats">
                                                    <span className="kt-widget5__number">24,583</span>
                                                    <span className="kt-widget5__sales">sales</span>
                                                </div>
                                                <div className="kt-widget5__stats">
                                                    <span className="kt-widget5__number">3809</span>
                                                    <span className="kt-widget5__votes">votes</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="kt-widget5__item">
                                            <div className="kt-widget5__content">
                                                <div className="kt-widget5__pic">
                                                    <img className="kt-widget7__img" src="assets/media//products/product11.jpg" alt="" />
                                                </div>
                                                <div className="kt-widget5__section">
                                                    <a href="#" className="kt-widget5__title">
                                                        Awesome Mobile App
                                            </a>
                                                    <p className="kt-widget5__desc">
                                                        Metronic admin themes.Lorem Ipsum Amet
                                            </p>
                                                    <div className="kt-widget5__info">
                                                        <span>Author:</span>
                                                        <span className="kt-font-info">Fly themes</span>
                                                        <span>Released:</span>
                                                        <span className="kt-font-info">23.08.17</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="kt-widget5__content">
                                                <div className="kt-widget5__stats">
                                                    <span className="kt-widget5__number">210,054</span>
                                                    <span className="kt-widget5__sales">sales</span>
                                                </div>
                                                <div className="kt-widget5__stats">
                                                    <span className="kt-widget5__number">1103</span>
                                                    <span className="kt-widget5__votes">votes</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="kt-widget5__item">
                                            <div className="kt-widget5__content">
                                                <div className="kt-widget5__pic">
                                                    <img className="kt-widget7__img" src="assets/media//products/product6.jpg" alt="" />
                                                </div>
                                                <div className="kt-widget5__section">
                                                    <a href="#" className="kt-widget5__title">
                                                        Great Logo Designn
                                            </a>
                                                    <p className="kt-widget5__desc">
                                                        Metronic admin themes.
                                            </p>
                                                    <div className="kt-widget5__info">
                                                        <span>Author:</span>
                                                        <span className="kt-font-info">Keenthemes</span>
                                                        <span>Released:</span>
                                                        <span className="kt-font-info">23.08.17</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="kt-widget5__content">
                                                <div className="kt-widget5__stats">
                                                    <span className="kt-widget5__number">19,200</span>
                                                    <span className="kt-widget5__sales">sales</span>
                                                </div>
                                                <div className="kt-widget5__stats">
                                                    <span className="kt-widget5__number">1046</span>
                                                    <span className="kt-widget5__votes">votes</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="kt_widget5_tab3_content">
                                    <div className="kt-widget5">
                                        <div className="kt-widget5__item">
                                            <div className="kt-widget5__content">
                                                <div className="kt-widget5__pic">
                                                    <img className="kt-widget7__img" src="assets/media//products/product11.jpg" alt="" />
                                                </div>
                                                <div className="kt-widget5__section">
                                                    <a href="#" className="kt-widget5__title">
                                                        Awesome Mobile App
                                            </a>
                                                    <p className="kt-widget5__desc">
                                                        Metronic admin themes.Lorem Ipsum Amet
                                            </p>
                                                    <div className="kt-widget5__info">
                                                        <span>Author:</span>
                                                        <span className="kt-font-info">Fly themes</span>
                                                        <span>Released:</span>
                                                        <span className="kt-font-info">23.08.17</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="kt-widget5__content">
                                                <div className="kt-widget5__stats">
                                                    <span className="kt-widget5__number">210,054</span>
                                                    <span className="kt-widget5__sales">sales</span>
                                                </div>
                                                <div className="kt-widget5__stats">
                                                    <span className="kt-widget5__number">1103</span>
                                                    <span className="kt-widget5__votes">votes</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="kt-widget5__item">
                                            <div className="kt-widget5__content">
                                                <div className="kt-widget5__pic">
                                                    <img className="kt-widget7__img" src="assets/media//products/product6.jpg" alt="" />
                                                </div>
                                                <div className="kt-widget5__section">
                                                    <a href="#" className="kt-widget5__title">
                                                        Great Logo Designn
                                            </a>
                                                    <p className="kt-widget5__desc">
                                                        Metronic admin themes.
                                            </p>
                                                    <div className="kt-widget5__info">
                                                        <span>Author:</span>
                                                        <span className="kt-font-info">Keenthemes</span>
                                                        <span>Released:</span>
                                                        <span className="kt-font-info">23.08.17</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="kt-widget5__content">
                                                <div className="kt-widget5__stats">
                                                    <span className="kt-widget5__number">19,200</span>
                                                    <span className="kt-widget5__sales">sales</span>
                                                </div>
                                                <div className="kt-widget5__stats">
                                                    <span className="kt-widget5__number">1046</span>
                                                    <span className="kt-widget5__votes">votes</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="kt-widget5__item">
                                            <div className="kt-widget5__content">
                                                <div className="kt-widget5__pic">
                                                    <img className="kt-widget7__img" src="assets/media//products/product10.jpg" alt="" />
                                                </div>
                                                <div className="kt-widget5__section">
                                                    <a href="#" className="kt-widget5__title">
                                                        Branding Mockup
                                            </a>
                                                    <p className="kt-widget5__desc">
                                                        Metronic bootstrap themes.
                                            </p>
                                                    <div className="kt-widget5__info">
                                                        <span>Author:</span>
                                                        <span className="kt-font-info">Fly themes</span>
                                                        <span>Released:</span>
                                                        <span className="kt-font-info">23.08.17</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="kt-widget5__content">
                                                <div className="kt-widget5__stats">
                                                    <span className="kt-widget5__number">24,583</span>
                                                    <span className="kt-widget5__sales">sales</span>
                                                </div>
                                                <div className="kt-widget5__stats">
                                                    <span className="kt-widget5__number">3809</span>
                                                    <span className="kt-widget5__votes">votes</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Product image modal */}
                <div class="modal" id="myModal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Product Image</h4>
                                <button type="button" class="close" data-dismiss="modal"></button>
                            </div>
                            <div class="modal-body row">
                                <img className="kt-widget7__img mx-auto" src={modelImage} alt="" style={{ maxWidth: "20rem" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default connect(({ product }) => {
    const product_data = product && product[PRODUCT_KEY] ? product[PRODUCT_KEY] : undefined;
    const ProductFormImage = product_data && product_data[EDIT_PRODUCT_IMAGES] ? product_data[EDIT_PRODUCT_IMAGES] : undefined;
    const ProductFormData = product_data && product_data[EDIT_PRODUCT_FORM] ? product_data[EDIT_PRODUCT_FORM] : undefined;
    return ({
        name: ProductFormData[EDIT_PRODUCT_FORM_NAME],
        notes: ProductFormData[EDIT_PRODUCT_FORM_NOTES],
        brand: ProductFormData[EDIT_PRODUCT_FORM_BRAND],
        image: ProductFormImage ? ProductFormImage : "",
        quantity: ProductFormData[EDIT_PRODUCT_FORM_QUANTITY],
        distributor: ProductFormData[EDIT_PRODUCT_FORM_DISTRIBUTOR],
        discount: ProductFormData[EDIT_PRODUCT_FORM_DISCOUNT],
        Retailprice: ProductFormData[EDIT_PRODUCT_FORM_RETAIL_PRICE],
        deliverInDay: ProductFormData[EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS],
        productWeight: ProductFormData[EDIT_PRODUCT_FORM_WEIGHT],
        refillprice: ProductFormData[EDIT_PRODUCT_FORM_REFILL_PRICE],
        longdescription: ProductFormData[EDIT_PRODUCT_FORM_LONG_DESCRIPTION],
        shortdescription: ProductFormData[EDIT_PRODUCT_FORM_SHORT_DESCRIPTION],
        manufactureDate: ProductFormData[EDIT_PRODUCT_FORM_MFG_DATE],
        expiryDate: ProductFormData[EDIT_PRODUCT_FORM_EXPIRY_DATE]
    })
}, {
    getProductViaID,
    updateEditProductFormData
})(View)