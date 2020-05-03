var createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),

  indexRouter = require('./routes/index'),
  usersRouter = require('./routes/users'),
  cors = require('cors');
cron = require('./operations/cron');

var common = require("./operations/common");
var { SUCCESS, BAD_REQUEST, FORBIDDEN, ORDER_STATUS_RECEIVED, ORDER_STATUS_REFILL, PAYMENT_STATUS_PENDING, PAYMENT_STATUS_PAID, PAYMENT_STATUS_FAILED } = require("./operations/constant");
var { getWebHook } = require("./operations/controller/payment");
var { getAllSubscribedOrderViaSubscriptionId, markOrderPaid, processOrder, getUpcomingOrders } = require("./operations/controller/order");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
//   next();
// });

app.use('/', indexRouter);

/* GET users listing. */
app.get('/v0/api/ping', function (req, res) {
  common.httpResponse(req, res, SUCCESS, {
    message: "System is working fine"
  })
});

app.use('/v0/api/payment/webhook/test', (req, res, next) => {

  getUpcomingOrders((status, response) => common.httpResponse(req, res, status, response));
  return;
  getAllSubscribedOrderViaSubscriptionId({
    subscriptionId: "sub_GVC4zoBwyiMuu0"
  }, (status, response) => {
    if (status === SUCCESS) {
      const receivedOrderIndex = response.findIndex(ele => ele.orderStatus === ORDER_STATUS_RECEIVED && ele.paidStatus === PAYMENT_STATUS_PENDING);
      const refillOrderIndex = response.findIndex(ele => ele.orderStatus === ORDER_STATUS_REFILL && ele.paidStatus === PAYMENT_STATUS_PENDING);

      if (receivedOrderIndex !== -1) {
        let { _id, payment_info } = response[receivedOrderIndex];
        // const { } = req.body;
        const invoice = "hello one";

        payment_info.invoiceId = invoice;

        markOrderPaid({
          order_id: _id,
          paidStatus: PAYMENT_STATUS_PAID,
          payment_info: payment_info
        }, (status, response) => {
          common.httpResponse(req, res, status, response);
        });
      } else if (refillOrderIndex !== -1) {
        let { _id, payment_info } = response[refillOrderIndex];
        const invoice = "refill invoice id";

        payment_info.invoiceId = invoice;

        markOrderPaid({
          order_id: _id,
          paidStatus: PAYMENT_STATUS_PAID,
          payment_info: payment_info
        }, (status, response) => {
          if (status === SUCCESS) {
            processOrder({
              order_id: _id
            }, (processOrderStatus, processOrderResponse) => {
              common.httpResponse(req, res, processOrderStatus, processOrderResponse);
            });
          } else common.httpResponse(req, res, status, response);
        });
      } else common.httpResponse(req, res, status, {
        receivedOrderIndex,
        refillOrderIndex
      });
    } else common.httpResponse(req, res, status, response);
  });

});

app.use('/v0/api/payment/webhook', (req, res, next) => {
  const { type } = req.body;

  if (type === "invoice.payment_succeeded") {
    const { data } = req.body;
    const { object = {} } = data;
    const { subscription } = object;

    getAllSubscribedOrderViaSubscriptionId({
      subscriptionId: subscription
    }, (status, response) => {
      if (status === SUCCESS) {
        const receivedOrderIndex = response.findIndex(ele => ele.orderStatus === ORDER_STATUS_RECEIVED && ele.paidStatus === PAYMENT_STATUS_PENDING);
        const refillOrderIndex = response.findIndex(ele => ele.orderStatus === ORDER_STATUS_REFILL && ele.paidStatus === PAYMENT_STATUS_PENDING);

        if (receivedOrderIndex !== -1) {
          let { _id, payment_info } = response[receivedOrderIndex];
          // const { } = req.body;
          const invoice = object;

          payment_info.invoice = invoice;

          markOrderPaid({
            order_id: _id,
            paidStatus: PAYMENT_STATUS_PAID,
            payment_info: payment_info
          }, (status, response) => {
            common.httpResponse(req, res, status, response);
          });
        } else if (refillOrderIndex !== -1) {
          let { _id, payment_info } = response[refillOrderIndex];
          const invoice = "refill invoice id";

          payment_info.invoiceId = invoice;

          markOrderPaid({
            order_id: _id,
            paidStatus: PAYMENT_STATUS_PAID,
            payment_info: payment_info
          }, (status, response) => {
            if (status === SUCCESS) {
              processOrder({
                order_id: _id
              }, (processOrderStatus, processOrderResponse) => {
                common.httpResponse(req, res, processOrderStatus, processOrderResponse);
              });
            } else common.httpResponse(req, res, status, response);
          });
        } else common.httpResponse(req, res, status, {
          receivedOrderIndex,
          refillOrderIndex
        });
      } else common.httpResponse(req, res, status, response);
    });
  } else {
    res.json({
      message: ""
    });
  }

});

app.use('/v0/api', (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    common.httpResponse(req, res, BAD_REQUEST, {
      message: "Authorization token is not found."
    });
    return;
  }

  const app_token = common.getAuthoriztionToken();
  if (token === app_token) {
    next();
  } else common.httpResponse(req, res, FORBIDDEN, {
    message: "Authorization token is not matched.",
    token: app_token
  });
}, usersRouter);

/** Cron jobs */

cron.init();

//--------------

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
