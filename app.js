
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

const app = express();
app.use('/uploads',express.static('uploads'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


const db = "mongodb+srv://shop-rest:rahul499@shop-rest-api.j5lif.mongodb.net/<dbname>?retryWrites=true&w=majority"
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));
mongoose.Promise = global.Promise;


app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
   const error = new Error('Not Found');
   error.statusv = 404;
   next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

module.exports = app;