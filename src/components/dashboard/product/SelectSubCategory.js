import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import '../category/SelectCategory.css'
import { getAuthoriztionToken, getCategoriesWithSearch, getSubCategoriesWithSearch, refillGetSubCategoryViaId } from '../../../apis/APIs'
import { connect } from 'react-redux'
import { updateProductUIConstraints, resetProductState, updateEditProductFormData, getProductViaID, editProduct } from '../../../redux/product/Action'
import { USER_KEY, USER_DATA, SUB_CATEGORY_FORM_CATEGORY_ID, STATUS, SUCCESS, CATEGORY_KEY, SUB_CATEGORY_REQUEST_STATUS, PRODUCT_KEY, ADD_PRODUCT_REQUEST_STATUS, SERVER_SUCCESS, EDIT_PRODUCT_FORM, EDIT_PRODUCT_FORM_CATEGORY_ID, EDIT_PRODUCT_FORM_SUB_CATEGORY_ID } from '../../../redux/Types'
import { updateAddProductFormData } from '../../../redux/product/Action'

class SelectCategory extends PureComponent {
    static propTypes = {
        _id: PropTypes.string.isRequired,
        error_label: PropTypes.any,
        label: PropTypes.string,
        handleOnChangeSubCategory: PropTypes.func,
        value: PropTypes.object,
        category_id: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            value: {
                id: undefined,
                name: undefined
            }
        }
    }

    componentDidMount = () => {
        this.init();
        this.getCategoryData();
    }

    getCategoryData = () => {
        const { category_id, sub_category_id, type, user_token } = this.props;
        const { value } = this.state;

        if (type !== "edit" || !user_token || (value && value.name)) return;

        refillGetSubCategoryViaId({
            user_token,
            category_id: category_id,
            sub_category_id
        })
            .then((res) => {
                if (res.message === SERVER_SUCCESS) {
                    this.setState({
                        value: res.data
                    });
                    this.init();
                }
            })
            .catch((err) => {
                this.init();
            });
    }


    init = () => {
        this.initSelectUI();
    }

    initSelectUI = function () {
        const { user_token, handleOnChangeSubCategory, _id } = this.props;
        var that = this;
        const { value } = this.state;
       
        if (!window.$) {
            return;
        }
       
       
        // loading remote data
        function formatRepo(repo) {
            if (repo.loading) return repo.text;
            var markup = "<div className='select2-result-repository clearfix'>" +
                "<div className='select2-result-repository__meta'>" +
                "<div className='select2-result-repository__title'>" + repo.name + "</div>";
            return markup;
        }

        function formatRepoSelectionWithValue(repo) {
            repo._id && handleOnChangeSubCategory && handleOnChangeSubCategory(repo._id);
            return repo.name || value.name || repo.text;
        }

        function formatRepoSelection(repo) {
            repo._id && handleOnChangeSubCategory && handleOnChangeSubCategory(repo._id);
            return repo.name || repo.text;
        }

        window.$(`#${_id}`).select2({
            placeholder: "Search for Subcategory",
            allowClear: true,
            ajax: {
                url: getSubCategoriesWithSearch(),
                delay: 250,
                headers: {
                    "Authorization": getAuthoriztionToken()
                },
                data: function (params) {
                    return {
                        search: params.term ? params.term : '', // search term
                        page: params.page ? params.page : 1,
                        page_size: 10,
                        user_token,
                        category_id: that.props.category_id
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;

                    return {
                        results: data && data.data && data.data.items && data.data.items.length ? data.data.items.map(ele => {
                            if (ele._id) {
                                ele.id = ele._id;
                            }

                            return ele;
                        }) : [],
                        pagination: {
                            more: data && data.data && data.data.hasMore ? data.data.hasMore : false
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) {
                return markup;
            }, // let our custom formatter work
            minimumInputLength: 1,
            templateResult: formatRepo, // omitted for brevity, see the source of this page
            templateSelection: value && value.name  ? formatRepoSelectionWithValue : formatRepoSelection // omitted for brevity, see the source of this page
        });
    }

    
    resetCategorySelect = () => {
        const { _id } = this.props;
        window.$(`#${_id}`).val(null).trigger("change");
    }

    onChangeText = (key, value) => {
        const { updateEditProductFormData, _id } = this.props;
      
        updateEditProductFormData({
            [key]: value
        });
        this.setState({
            value: {}
        })
        window.$(`#${_id}`).select2({})
        setTimeout(() => {
            this.init();
        }, 500);
    }

    componentDidUpdate = (prevProps) => {
        const { addProductReqeustStatus,category_id, sub_category_id } = this.props;

        const prevAddProductReqeustStatus = prevProps && prevProps.addProductReqeustStatus ? prevProps.addProductReqeustStatus : {};
        if (addProductReqeustStatus[STATUS] !== prevAddProductReqeustStatus[STATUS]) {
            switch (addProductReqeustStatus[STATUS]) {
                case SUCCESS:
                    this.resetCategorySelect();
                    break;
            }
        }

        const prevcategory = prevProps && prevProps.category_id ? prevProps.category_id : {};
        if(category_id !== prevcategory){
            this.onChangeText(EDIT_PRODUCT_FORM_SUB_CATEGORY_ID,"")
        }
    }

    render() {
        const { error_label, label, _id } = this.props;

        return (
            <div className="form-group row" >
                <label className="col-xl-3 col-lg-3 col-form-label">{label}*</label>
                <div className="col-lg-9 col-xl-9" id="kt_select2_category_list_container">
                    <select className="form-control kt-select2" id={_id} name="param">
                        <option></option>
                    </select>
                    {error_label}
                </div>
            </div>
        )
    }
}

const mapToProps = ({ user, product }) => {
    const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
    const user_token = user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false;

    const product_data = product && product[PRODUCT_KEY] ? product[CATEGORY_KEY] : undefined;
    const addProductReqeustStatus = product_data && product_data[ADD_PRODUCT_REQUEST_STATUS] ? product_data[ADD_PRODUCT_REQUEST_STATUS] : {};

    const editProductFormData = product_data && product_data[EDIT_PRODUCT_FORM] ? product_data[EDIT_PRODUCT_FORM] : undefined;
    const category_id = editProductFormData && editProductFormData[EDIT_PRODUCT_FORM_CATEGORY_ID] ? editProductFormData[EDIT_PRODUCT_FORM_CATEGORY_ID] : "";

    return ({
        user_token,
        addProductReqeustStatus
    });
}

export default connect(mapToProps,{
    updateEditProductFormData
})(SelectCategory);