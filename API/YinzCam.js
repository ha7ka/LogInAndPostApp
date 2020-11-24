require('dotenv').config()
const express = require('express'); 
const app = express(); 
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const SQLService = require('./SQL/SQLService');
const {PORT, SQL_HOST, SQL_USER, SQL_PASS, SQL_DB} = process.env;
const jwt = require('jsonwebtoken');


/**Middle ware */
app.use(bodyParser.json({limit: '5mb'}));


/**
 * for a health check
 */
app.get('/', async function(req, res){
    res.status(200).json({
      'message' : 'server is working',
    });

});


/**
 * Routers
 */
app.use('/user', require('./Routers/User'));
app.use('/post', require('./Routers/Post'));




app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    console.error(err.stack);  
    res.status(err.status || 500);  
    res.json({'errors': {
        message: err.message
    }});
});



/**
 * Init the DB connection and then start the server
 * Start the server
 */

SQLService._initialize(SQL_HOST, SQL_USER, SQL_PASS, SQL_DB)
.then( res =>
    server.listen(PORT, function(){
        console.info(`Listening on port *:${PORT}`);
    })
)
.catch(
    err => console.error(err)
)