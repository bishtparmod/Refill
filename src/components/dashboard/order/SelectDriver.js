import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import '../category/SelectCategory.css'
import { getAuthoriztionToken, getDriverWithSearch, refillGetCategoryViaId, refillGetDriverViaId, refillOrderShip } from '../../../apis/APIs'
import { connect } from 'react-redux'
import { USER_KEY, USER_DATA, SUB_CATEGORY_FORM_CATEGORY_ID, STATUS, SUCCESS, CATEGORY_KEY, SUB_CATEGORY_REQUEST_STATUS, PRODUCT_KEY, ADD_PRODUCT_REQUEST_STATUS, SERVER_SUCCESS, DRIVER_KEY, ASSIGN_DRIVER_KEY, DRIVER_REQUEST_STATUS } from '../../../redux/Types'
import { updateAddProductFormData } from '../../../redux/product/Action'

class SelectDriver extends PureComponent {
    static propTypes = {
        _id: PropTypes.string.isRequired,
        error_label: PropTypes.any,
        label: PropTypes.string,
        handleOnChangeCategory: PropTypes.func
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
    }

    getDriverData = () => {
        const { Order_id, type, user_token, driver_id } = this.props;
        const { value } = this.state;
        alert(Order_id)
        if (type !== "edit" || !user_token || (value && value.name)) return;

        refillOrderShip({
            user_token,
            order_id: Order_id,
            driver_id:driver_id
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
        const { user_token, handleOnChangeCategory, _id } = this.props;
        let that = this;

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

        function formatRepoSelection(repo) {
            const { value } = that.state;

            repo._id && handleOnChangeCategory && handleOnChangeCategory(repo._id);
            return repo.name || value.name || repo.text;
        }

        window.$(`#${_id}`).select2({
            placeholder: "Search for Driver",
            allowClear: true,
            ajax: {
                url: getDriverWithSearch(),
                delay: 250,
                headers: {
                    "Authorization": getAuthoriztionToken()
                },
                data: function (params) {

                    return {
                        search: params.term ? params.term : '', // search term
                        page: params.page ? params.page : 1,
                        page_size: 10,
                        user_token
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
            templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
        });
    }

    resetDriverSelect = () => {
        const { _id } = this.props;
        window.$(`#${_id}`).val(null).trigger("change");
    }

    componentDidUpdate = (prevProps) => {
        const { addDriverReqeustStatus, Order_id } = this.props;

        const prevaddDriverReqeustStatus = prevProps && prevProps.addDriverReqeustStatus ? prevProps.addDriverReqeustStatus : {};
        if (addDriverReqeustStatus[STATUS] !== prevaddDriverReqeustStatus[STATUS]) {
            switch (addDriverReqeustStatus[STATUS]) {
                case SUCCESS:
                    this.resetDriverSelect();
                    break;
            }
        }

        if (Order_id !== prevProps.Order_id) {
            this.getDriverData();
        }
    }

    render() {
        const { error_label, label, _id } = this.props;

        return (
            <div className="form-group row" >
                <label className="col-form-label col-lg-2 col-sm-12">{label}</label>
                <div className=" col-lg-12 col-md-12 col-sm-12" id="kt_select2_category_list_container">
                    <select className="form-control kt-select2" id={_id} name="param">
                        <option></option>
                    </select>
                    {error_label}
                </div>
            </div>
        )
    }
}

const mapToProps = ({ user, product, driver }) => {
    const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
    const user_token = user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false;

    const product_data = product && product[PRODUCT_KEY] ? product[CATEGORY_KEY] : undefined;
    const addProductReqeustStatus = product_data && product_data[ADD_PRODUCT_REQUEST_STATUS] ? product_data[ADD_PRODUCT_REQUEST_STATUS] : {};

    const driver_data = driver && driver[DRIVER_KEY] ? driver[DRIVER_KEY] : ""
    const driver_id = driver_data && driver_data.assign_driver_key.assign_driver_id ? driver_data.assign_driver_key.assign_driver_id : ""

    const addDriverReqeustStatus = driver_data && driver_data[DRIVER_REQUEST_STATUS] ? driver_data[DRIVER_REQUEST_STATUS] : {};

    return ({
        user_token,
        addProductReqeustStatus,
        addDriverReqeustStatus,
        driver_id
    });
}

export default connect(mapToProps)(SelectDriver);