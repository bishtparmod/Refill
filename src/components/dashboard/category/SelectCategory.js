import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './SelectCategory.css'
import { getAuthoriztionToken, getCategoriesWithSearch } from '../../../apis/APIs'
import { connect } from 'react-redux'
import { USER_KEY, USER_DATA, SUB_CATEGORY_FORM_CATEGORY_ID, STATUS, SUCCESS, CATEGORY_KEY, SUB_CATEGORY_REQUEST_STATUS } from '../../../redux/Types'
import { updateSubCategoryFormData } from '../../../redux/category/Action'

class SelectCategory extends PureComponent {
    static propTypes = {
        error_label: PropTypes.string
    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        this.initSelectUI();
    }

    initSelectUI = function () {
        const { user_token } = this.props;
        let that = this;

        if (!window.$) {
            return;
        }

        // loading remote data
        function formatRepo(repo) {
            if (repo.loading) return repo.text;
            var markup = "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__meta'>" +
                "<div class='select2-result-repository__title'>" + repo.name + "</div>";
            return markup;
        }

        function formatRepoSelection(repo) {
            that.onChangeSubCategoryFormText(SUB_CATEGORY_FORM_CATEGORY_ID, repo._id);
            return repo.name || repo.text;
        }

        window.$("#kt_select2_category_list").select2({
            placeholder: "Search for category",
            allowClear: true,
            ajax: {
                url: getCategoriesWithSearch(),
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

        // custom styles
    }

    onChangeSubCategoryFormText = (key, value) => {
        const { updateSubCategoryFormData } = this.props;

        updateSubCategoryFormData({
            [key]: value
        });
    }

    resetCategorySelect = () => {
        window.$("#kt_select2_category_list").val(null).trigger("change");
    }

    componentDidUpdate = (prevProps) => {
        const { subCategoryReqeustStatus } = this.props;

        const prevSubCategoryReqeustStatus = prevProps && prevProps.subCategoryReqeustStatus ? prevProps.subCategoryReqeustStatus : {};
        if (subCategoryReqeustStatus[STATUS] !== prevSubCategoryReqeustStatus[STATUS]) {
            switch (subCategoryReqeustStatus[STATUS]) {
                case SUCCESS:
                    this.resetCategorySelect();
                    break;
            }
        }
    }

    render() {
        const { error_label } = this.props;

        return (
            <div class="form-group row" >
                <label class="col-form-label col-lg-3 col-sm-12">Remote Data</label>
                <div class=" col-lg-9 col-md-9 col-sm-12" id="kt_select2_category_list_container">
                    <select className="form-control kt-select2" id="kt_select2_category_list" name="param">
                        <option></option>
                    </select>
                    {error_label}
                </div>
            </div>
        )
    }
}

const mapToProps = ({ user, category }) => {
    const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
    const user_token = user_data && user_data[USER_DATA] && user_data[USER_DATA].user_token ? user_data[USER_DATA].user_token : false;

    const category_data = category && category[CATEGORY_KEY] ? category[CATEGORY_KEY] : undefined;
    const subCategoryReqeustStatus = category_data && category_data[SUB_CATEGORY_REQUEST_STATUS] ? category_data[SUB_CATEGORY_REQUEST_STATUS] : {};

    return ({
        user_token,
        subCategoryReqeustStatus
    });
}

export default connect(mapToProps, {
    updateSubCategoryFormData
})(SelectCategory);