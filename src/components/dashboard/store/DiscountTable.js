import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import '../category/SelectCategory.css'
import { connect } from 'react-redux'
import { USER_KEY, USER_DATA, SUB_CATEGORY_FORM_CATEGORY_ID, STATUS, SUCCESS, CATEGORY_KEY, SUB_CATEGORY_REQUEST_STATUS, PRODUCT_KEY, ADD_PRODUCT_REQUEST_STATUS, SERVER_SUCCESS, DISCOUNT_KEY, DISCOUNT_FORM, DISCOUNT_REQUEST_STATUS, DISCOUNT_PRODUCT_ID } from '../../../redux/Types'
import { updateAddProductFormData } from '../../../redux/product/Action'
import { updateEditDiscountFormData, updateDiscountUIConstraints, updateDiscountState, makeOffer, resetOfferDataState } from '../../../redux/discount/Action'
import { getProductsDataTables, getAuthoriztionToken, refillExportAllProducts } from '../../../apis/APIs'
import Utils from '../../util/Utils'
import moment from 'moment'

class DiscountTable extends PureComponent {

    componentDidMount = () => {
        this.product_list();
    }



    product_list = function () {
        const { user_token, updateDeleteProductFormData, category_id, sub_category_id } = this.props;
        const that = this;

        var table = window.$('#product_list');

        // begin first table
        table.DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            ajax: {
                url: getProductsDataTables(),
                type: 'POST',
                data: {
                    user_token,
                    category_id,
                    sub_category_id
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", getAuthoriztionToken());
                }
            },
            columns: [
                { data: '_id' },
                { data: 'name' },
                { data: 'category.name' },
                { data: 'subCategory.name' },
                { data: 'createdAt' },
                { data: 'Actions' },
            ],
            columnDefs: [
                {
                    targets: -1,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        Utils.log("product", full)
                        return `
						<script>
							function checkedProduct(id){
								$("#custom_product").data("data-view", id);
								$("#custom_product").click();
							}
						</script>
                       
                        <input type="checkbox" id="${full._id}" name="product${full._id}" onClick="checkedProduct(this.id)"/>
                        <span></span>
                   
                    `;
                    },
                },
                {
                    targets: -2,
                    render: function (data, type, full, meta) {

                        return '<span class="kt-font-bold">' + moment(data).format('DD/MM/YYYY') + '</span>';
                    },
                },
                {
                    targets: -6,
                    render: function (data, type, full, meta) {

                        return '<span class="kt-font-bold">' + data ? `...${data.substring(data.length - 8, data.length)}` : 'No ID Found' + '</span>';
                    },
                }
            ],
        });
    };

    redraw = function () {
        var table = window.$('#product_list').DataTable();
        table.draw();
    }

    onChangeText = (key, value) => {
        const { updateEditDiscountFormData } = this.props;
        updateEditDiscountFormData({
            [key]: value
        });
    }


    openEditScreen = () => {
        const { history, discountProductId } = this.props;
        const id = window.$("#custom_product").data("data-view");
        if (document.getElementById(`${id}`).checked) {
            const array = []
            discountProductId.push(id)
            array.concat(array)
            this.onChangeText(DISCOUNT_PRODUCT_ID, discountProductId)
        } else {
            let index = discountProductId.findIndex(ele => ele === id);
            if (index !== -1) discountProductId.splice(index, 1);
            this.onChangeText(DISCOUNT_PRODUCT_ID, discountProductId)
        }

    }

    render() {
        const { discountCategory, discountSubcategory, discountProductId } = this.props

        return (
            <div>
                <div class="row row-full-height">
                    <div class="col-12">
                        <div class="rounded kt-portlet--height-fluid-full">
                            <h5 class="">Product List</h5>
                        </div>
                    </div>
                </div>
                <div class="row row-full-height">
                    <div class="col-sm-12 col-md-12 col-lg-12">
                        <div class="border mb-2 rounded kt-portlet--height-fluid-full kt-portlet--border-bottom-brand">
                            <div class="kt-portlet__body kt-portlet__body--fluid">
                                <div class="kt-widget26">
                                    <div class="kt-widget26__content">
                                        <div class="table-responsive">
                                            <table class="table table-bordered" id="product_list">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Categories</th>
                                                        <th>Subcategories</th>
                                                        <th>Created Date</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            <button type="button" id="custom_product" className="d-none" onClick={this.openEditScreen.bind(this)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default connect(({ discount, user }) => {
    const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
    const user_token = user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false;

    const discount_data = discount[DISCOUNT_KEY]
    const discount_form = discount[DISCOUNT_KEY][DISCOUNT_FORM]
    return ({
        discountDescription: discount_form.discount_discription,
        discountDescription: discount_form.discount_discription,
        discountType: discount_form.discount_type,
        discountPercentage: discount_form.discount_percentage,
        discountStartdate: discount_form.discount_start_date,
        discountEnddate: discount_form.discount_end_date,

        category_id: discount_form.discount_category,
        sub_category_id: discount_form.discount_subcategory,
        discountProductId: discount_form.discount_product_id ? discount_form.discount_product_id : [],

        loading: discount_data.discount_form_loading,
        errors: discount_data.discount_form_error,
        requestStatus: discount_data[DISCOUNT_REQUEST_STATUS],

        user_token: user_token
    })
}, {
    updateEditDiscountFormData,
    updateDiscountUIConstraints,
    updateDiscountState,
    makeOffer,
    resetOfferDataState
})(DiscountTable);