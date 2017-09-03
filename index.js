/**
 * Created by tadashiono on 03/09/2017.
 */
var app = require('./config/custom-express')();

app.listen(3000, function () {
   console.log('====> Servidor ligado <====');
});
