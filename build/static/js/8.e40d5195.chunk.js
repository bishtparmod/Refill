(this.webpackJsonprefill_rjs=this.webpackJsonprefill_rjs||[]).push([[8],{117:function(e,a,t){"use strict";var l=t(6),r=t(9),o=t(17),n=t(16),c=t(18),s=t(2),i=t.n(s),d=(t(116),t(27)),m=t(35),u=t(0),g=(t(115),function(e){function a(e){var t;return Object(l.a)(this,a),(t=Object(o.a)(this,Object(n.a)(a).call(this,e))).componentDidMount=function(){t.init(),t.getCategoryData()},t.getCategoryData=function(){var e=t.props,a=e.category_id,l=e.sub_category_id,r=e.type,o=e.user_token,n=t.state.value;"edit"!==r||!o||n&&n.name||Object(d.u)({user_token:o,category_id:a,sub_category_id:l}).then(function(e){console.log("getCategoryData ===> sub category",a,l),e.message===u.Xc&&(t.setState({value:e.data}),t.init())}).catch(function(e){t.init()})},t.init=function(){t.initSelectUI()},t.initSelectUI=function(){var e=this.props,a=e.user_token,t=e.handleOnChangeCategory,l=e._id,r=this;window.$&&window.$("#".concat(l)).select2({placeholder:"Search for category",allowClear:!0,ajax:{url:Object(d.f)(),delay:250,headers:{Authorization:Object(d.a)()},data:function(e){return{search:e.term?e.term:"",page:e.page?e.page:1,page_size:10,user_token:a,category_id:r.props.category_id}},processResults:function(e,a){return a.page=a.page||1,{results:e&&e.data&&e.data.items&&e.data.items.length?e.data.items.map(function(e){return e._id&&(e.id=e._id),e}):[],pagination:{more:!!(e&&e.data&&e.data.hasMore)&&e.data.hasMore}}},cache:!0},escapeMarkup:function(e){return e},minimumInputLength:1,templateResult:function(e){return e.loading?e.text:"<div className='select2-result-repository clearfix'><div className='select2-result-repository__meta'><div className='select2-result-repository__title'>"+e.name+"</div>"},templateSelection:function(e){var a=r.state.value;return e._id&&t&&t(e._id),e.name||a.name||e.text}})},t.resetCategorySelect=function(){var e=t.props._id;window.$("#".concat(e)).val(null).trigger("change")},t.componentDidUpdate=function(e){var a=t.props,l=a.addProductReqeustStatus,r=(a.sub_category_id,e&&e.addProductReqeustStatus?e.addProductReqeustStatus:{});if(l[u.fd]!==r[u.fd])switch(l[u.fd]){case u.md:t.resetCategorySelect()}},t.state={value:{id:void 0,name:void 0}},t}return Object(c.a)(a,e),Object(r.a)(a,[{key:"render",value:function(){var e=this.props,a=e.error_label,t=e.label,l=e._id;return i.a.createElement("div",{className:"form-group row"},i.a.createElement("label",{className:"col-form-label col-lg-3 col-sm-12"},t),i.a.createElement("div",{className:" col-lg-9 col-md-9 col-sm-12",id:"kt_select2_category_list_container"},i.a.createElement("select",{className:"form-control kt-select2",id:l,name:"param"},i.a.createElement("option",null)),a))}}]),a}(s.PureComponent));a.a=Object(m.b)(function(e){var a=e.user,t=e.product,l=a&&a[u.ud]?a[u.ud]:void 0,r=!!(l&&l[u.td]&&l[u.td].user_token)&&l[u.td].user_token,o=t&&t[u.Ec]?t[u.I]:void 0;return{user_token:r,addProductReqeustStatus:o&&o[u.D]?o[u.D]:{}}})(g)},131:function(e,a,t){"use strict";t.r(a);var l=t(1),r=t(6),o=t(9),n=t(17),c=t(16),s=t(18),i=t(2),d=t.n(i),m=t(35),u=t(28),g=t(0),p=t(115),_=t(23),h=t(118),f=(t(27),t(117)),E=t(3),v=t(20),b=function(e){function a(){var e,t;Object(r.a)(this,a);for(var o=arguments.length,s=new Array(o),i=0;i<o;i++)s[i]=arguments[i];return(t=Object(n.a)(this,(e=Object(c.a)(a)).call.apply(e,[this].concat(s)))).componentDidMount=function(){t.init()},t.init=function(){var e,a=t.props.updateSystemData;e=window.KTUtil.isRTL()?{leftArrow:'<i className="la la-angle-right"></i>',rightArrow:'<i className="la la-angle-left"></i>'}:{leftArrow:'<i className="la la-angle-left"></i>',rightArrow:'<i className="la la-angle-right"></i>'},window.$("#product_mfg_date").datepicker({rtl:window.KTUtil.isRTL(),todayHighlight:!0,orientation:"bottom left",templates:e}).on("changeDate",function(e){console.log("data ===> mfg",new Date(e.date))}),window.$("#product_expiry_date").datepicker({rtl:window.KTUtil.isRTL(),todayHighlight:!0,orientation:"bottom left",templates:e}),a(Object(l.a)({},g.pd,"Refill | Add Product"))},t.submit=function(e){e.preventDefault();var a=t.props,r=a.name,o=a.short_description,n=a.long_description,c=a.brand,s=a.distributor,i=a.delivery_time_in_days,d=a.retail_price,m=a.refill_price,u=a.discount,p=a.notes,h=a.alert,f=a.quantity,E=a.weight,v=a.size,b=a.units,N=a.average_life_in_days,y=a.mfg_date,x=a.expiry_date,w=a.code,k=a.pup_gtin_code,C=a.category_id,D=a.sub_category_id,T=a.images,M=a.loading,O=a.image_uploading,j=a.image_uploading_count,P=a.uploaded_images,S=a.updateProductUIConstraints,z=a.createProduct;if(!M&&!O){var U={name:r,short_description:o,long_description:n,brand:c,distributor:s,delivery_time_in_days:i,retail_price:d,refill_price:m,discount:u,notes:p,alert:h,quantity:f,weight:E,size:v,units:b,average_life_in_days:N,mfg_date:y,expiry_date:x,code:w,pup_gtin_code:k,category_id:C,sub_category_id:D,images:T};_.a.validate(Object.keys(U),U).then(function(e){var a=e.status,t=e.response;a?(S(Object(l.a)({},g.b,[])),T&&T.length>0&&j===T.length?P&&P.length===T.length&&(console.log("Create product ===> while all uploaded"),z()):S(Object(l.a)({},g.B,!0))):S(Object(l.a)({},g.b,t&&t.length?t:[]))}).catch(function(e){return console.log(e)})}},t.isError=function(e){var a=t.props.errors;return a&&a.length&&a.findIndex(function(a){return a.fieldName===e})>-1?{status:!0,message:a[a.findIndex(function(a){return a.fieldName===e})].message}:{status:!1,message:""}},t.onChangeText=function(e,a){(0,t.props.updateAddProductFormData)(Object(l.a)({},e,a))},t.componentDidUpdate=function(e){var a=t.props,r=a.reqeustStatus,o=a.images,n=a.uploaded_images,c=a.image_uploading_count,s=a.updateProductUIConstraints,i=a.createProduct,d=(a.image_uploading,a.history),m=e&&e.reqeustStatus?e.reqeustStatus:{};if(r[g.fd]!==m[g.fd])switch(r[g.fd]){case g.md:t.resetProductData(),v.ToastsStore.success("Product has been created successfully"),d.replace("/product/list");break;case g.Tb:var u=r[g.Dc]&&r[g.Dc].status?r[g.Dc].status:500,p=r[g.Dc]&&r[g.Dc].status&&r[g.Dc].emptyKeys&&r[g.Dc].emptyKeys.message?r[g.Dc].emptyKeys.message:[];switch(u){case 422:var _=p&&p.length?p.map(function(e){return{fieldName:e.fieldName,message:"Required data in ".concat(e.type,".")}}):[];s(Object(l.a)({},g.b,_)),v.ToastsStore.error("Validation Error",2e3)}}c!==e.image_uploading_count&&o&&c===o.length&&(E.a.log("Uploading end"),n&&n.length===o.length&&(s(Object(l.a)({},g.B,!1)),console.log("Create product ===> while uploading end"),i()))},t._handleErrorMessage=function(e){var a=t.isError(e);return a&&a.status?d.a.createElement("span",{className:"form-text text-error text-right"},a.message):d.a.createElement("div",null)},t.componentWillUnmount=function(){t.resetProductData()},t.resetProductData=function(){(0,t.props.resetProductState)()},t}return Object(s.a)(a,e),Object(o.a)(a,[{key:"render",value:function(){var e=this,a=this.props,t=a.name,l=a.short_description,r=a.long_description,o=a.brand,n=a.distributor,c=a.delivery_time_in_days,s=a.retail_price,i=a.refill_price,m=a.discount,u=a.notes,p=a.alert,_=a.quantity,E=a.weight,v=a.units,b=a.average_life_in_days,N=a.mfg_date,y=a.expiry_date,x=a.code,w=a.size,k=a.pup_gtin_code,C=a.category_id,D=(a.sub_category_id,a.loading),T=a.image_uploading;return d.a.createElement("div",{className:"kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor",id:"kt_content"},d.a.createElement("div",{className:"kt-subheader   kt-grid__item",id:"kt_subheader"},d.a.createElement("div",{className:"kt-container  kt-container--fluid "},d.a.createElement("div",{className:"kt-subheader__main"},d.a.createElement("h3",{className:"kt-subheader__title"},"Product "),d.a.createElement("span",{className:"kt-subheader__separator kt-hidden"}),d.a.createElement("div",{className:"kt-subheader__breadcrumbs"},d.a.createElement("a",{href:"#",className:"kt-subheader__breadcrumbs-home"},d.a.createElement("i",{className:"flaticon2-shelter"})),d.a.createElement("span",{className:"kt-subheader__breadcrumbs-separator"}),d.a.createElement("a",{href:"",className:"kt-subheader__breadcrumbs-link"},"Add "))))),d.a.createElement("div",{className:"kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid"},d.a.createElement("div",{className:"kt-portlet"},d.a.createElement("div",{className:"kt-portlet__body kt-portlet__body--fit"},d.a.createElement("div",{className:"kt-grid  kt-wizard-v1 kt-wizard-v1--white",id:"kt_contacts_add","data-ktwizard-state":"step-first"},d.a.createElement("div",{className:"kt-grid__item kt-grid__item--fluid kt-wizard-v1__wrapper"},d.a.createElement("form",{className:"kt-form",onSubmit:this.submit.bind(this)},d.a.createElement("div",{className:"kt-wizard-v1__content","data-ktwizard-type":"step-content","data-ktwizard-state":"current"},d.a.createElement("div",{className:"kt-heading kt-heading--md"},"Products Details:"),d.a.createElement("div",{className:"kt-section kt-section--first"},d.a.createElement("div",{className:"kt-wizard-v1__form"},d.a.createElement("div",{className:"row"},d.a.createElement("div",{className:"col-xl-12"},d.a.createElement("div",{className:"kt-section__body"},d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Image"),d.a.createElement(h.i,{error_label:this._handleErrorMessage("images")})),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Name*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter product name",onChange:function(a){return e.onChangeText(g.o,a.target.value)},value:t}),this._handleErrorMessage("name"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Short Description*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("textarea",{className:"form-control",id:"exampleTextarea",rows:"3",placeholder:"Enter short description",onChange:function(a){return e.onChangeText(g.u,a.target.value)},value:l}),this._handleErrorMessage("short_description"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Long Description*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("textarea",{className:"form-control",id:"exampleTextarea",rows:"3",placeholder:"Enter long description",onChange:function(a){return e.onChangeText(g.m,a.target.value)},value:r}),this._handleErrorMessage("long_description"))),d.a.createElement(h.f,{error_label:this._handleErrorMessage("category_id"),handleOnChangeCategory:function(a){return e.onChangeText(g.g,a)},label:"Category",_id:"product_category_list"}),C?d.a.createElement(f.a,{error_label:this._handleErrorMessage("sub_category_id"),handleOnChangeCategory:function(a){return e.onChangeText(g.w,a)},label:"Sub Category",category_id:C,_id:"product_sub_category_list"}):null,d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Brand*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter brand",onChange:function(a){return e.onChangeText(g.f,a.target.value)},value:o}),this._handleErrorMessage("brand"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Distributor*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter distributor",onChange:function(a){return e.onChangeText(g.k,a.target.value)},value:n}),this._handleErrorMessage("distributor"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Delivery Time in Days*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter delivery time in days",onChange:function(a){return e.onChangeText(g.i,a.target.value)},value:c}),this._handleErrorMessage("delivery_time_in_days"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Retail Price*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter retail price",onChange:function(a){return e.onChangeText(g.t,a.target.value)},value:s}),this._handleErrorMessage("retail_price"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Refill Price*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter refill price",onChange:function(a){return e.onChangeText(g.s,a.target.value)},value:i}),this._handleErrorMessage("refill_price"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Discount*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter discount",onChange:function(a){return e.onChangeText(g.j,a.target.value)},value:m}),this._handleErrorMessage("discount"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Notes*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("textarea",{className:"form-control",id:"exampleTextarea",rows:"3",placeholder:"Enter notes",onChange:function(a){return e.onChangeText(g.p,a.target.value)},value:u}),this._handleErrorMessage("notes"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Alert*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("textarea",{className:"form-control",id:"exampleTextarea",rows:"3",placeholder:"Enter alerts",onChange:function(a){return e.onChangeText(g.d,a.target.value)},value:p}),this._handleErrorMessage("alert"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Quantity*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter quantity",onChange:function(a){return e.onChangeText(g.r,a.target.value)},value:_}),this._handleErrorMessage("quantity"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Size*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter size",onChange:function(a){return e.onChangeText(g.v,a.target.value)},value:w}),this._handleErrorMessage("size"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Weight*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter weight",onChange:function(a){return e.onChangeText(g.z,a.target.value)},value:E}),this._handleErrorMessage("weight"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Units*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("select",{className:"form-control","aria-invalid":"false",onChange:function(a){return e.onChangeText(g.x,a.target.value)},value:v},d.a.createElement("option",null,"Select Unit..."),d.a.createElement("option",{value:"ounce"},"ounce"),d.a.createElement("option",{value:"litter"},"litter"),d.a.createElement("option",{value:"gm"},"gm"),d.a.createElement("option",{value:"kg"},"kg")),this._handleErrorMessage("units"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Average Life in Days*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter average life in days",onChange:function(a){return e.onChangeText(g.e,a.target.value)},value:b}),this._handleErrorMessage("average_life_in_days"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Mfg Date*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement(h.e,{_id:"product_mfg_date",placeholder:"Select mfg date",handleOnChange:function(a){return e.onChangeText(g.n,a)},value:N,calendarOptions:{rtl:window.KTUtil.isRTL(),todayHighlight:!0,orientation:"bottom left",endDate:new Date}}),this._handleErrorMessage("mfg_date"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Expiry Date*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement(h.e,{_id:"product_expiry_date",placeholder:"Select expiry date",handleOnChange:function(a){return e.onChangeText(g.l,a)},value:y,calendarOptions:{rtl:window.KTUtil.isRTL(),todayHighlight:!0,orientation:"bottom left",startDate:new Date}}),this._handleErrorMessage("expiry_date"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"Code*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter code",onChange:function(a){return e.onChangeText(g.h,a.target.value)},value:x}),this._handleErrorMessage("code"))),d.a.createElement("div",{className:"form-group row"},d.a.createElement("label",{className:"col-xl-3 col-lg-3 col-form-label"},"PUP/GTIN Code*"),d.a.createElement("div",{className:"col-lg-9 col-xl-9"},d.a.createElement("input",{className:"form-control",type:"text",placeholder:"Enter PUP/GTIN Code",onChange:function(a){return e.onChangeText(g.q,a.target.value)},value:k}),this._handleErrorMessage("pup_gtin_code"))))))))),d.a.createElement("div",{className:"kt-form__actions"},d.a.createElement("button",{type:"submit",className:"btn btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"},T?"Uploading...":D?"Loading...":"Submit")))))))))}}]),a}(i.PureComponent);a.default=Object(m.b)(function(e){var a=e.product,t=a&&a[g.Ec]?a[g.Ec]:void 0,l=t&&t[g.c]?t[g.c]:void 0,r=l&&l[g.o]?l[g.o]:"",o=l&&l[g.u]?l[g.u]:"",n=l&&l[g.m]?l[g.m]:"",c=l&&l[g.f]?l[g.f]:"",s=l&&l[g.k]?l[g.k]:"",i=l&&l[g.i]?l[g.i]:"",d=l&&l[g.t]?l[g.t]:"",m=l&&l[g.s]?l[g.s]:"",u=l&&l[g.j]?l[g.j]:"",p=l&&l[g.p]?l[g.p]:"",_=l&&l[g.d]?l[g.d]:"",h=l&&l[g.r]?l[g.r]:"",f=l&&l[g.z]?l[g.z]:"",E=l&&l[g.v]?l[g.v]:"",v=l&&l[g.x]?l[g.x]:"",b=l&&l[g.e]?l[g.e]:"",N=l&&l[g.n]?l[g.n]:"",y=l&&l[g.l]?l[g.l]:"",x=l&&l[g.h]?l[g.h]:"",w=l&&l[g.q]?l[g.q]:"",k=l&&l[g.g]?l[g.g]:"",C=l&&l[g.w]?l[g.w]:"",D=l&&l[g.y]&&l[g.y].length?l[g.y]:void 0,T=t&&t[g.b]?t[g.b]:[],M=!(!t||!t[g.C])&&t[g.C],O=t&&t[g.D]?t[g.D]:{},j=t&&t[g.A]&&t[g.A].length?t[g.A]:void 0,P=t&&t[g.E]?t[g.E]:0,S=!(!t||!t[g.B])&&t[g.B];return console.log("data ===> ",{loading:M,errors:T}),{name:r,short_description:o,long_description:n,brand:c,distributor:s,delivery_time_in_days:i,retail_price:d,refill_price:m,discount:u,notes:p,alert:_,quantity:h,weight:f,size:E,units:v,average_life_in_days:b,mfg_date:N,expiry_date:y,code:x,pup_gtin_code:w,category_id:k,sub_category_id:C,uploaded_images:D,errors:T,loading:M,reqeustStatus:O,images:j,images_length:j&&j.length?j.length:0,uploaded_images_length:D&&D?D.length:0,image_uploading_count:P,image_uploading:S}},{updateProductUIConstraints:p.i,updateAddProductFormData:p.f,updateSystemData:u.a,resetProductState:p.e,createProduct:p.a})(b)}}]);
//# sourceMappingURL=8.e40d5195.chunk.js.map