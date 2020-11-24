const mysql = require('mysql2');

class SQLService
{
    constructor(){}

    async _initialize(host, user, password, database)
    {
        try {
            this.connectionPool = mysql.createPool({
                host, 
                user, 
                password, 
                database,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            }).promise();

            return Promise.resolve(true);

        } catch (err) {
            console.log(err);
            Promise.reject(false);
        }
    }
    
}

/**
 * Create
 */
SQLService.prototype._createNewUser = require('./Functions/Create/User');
SQLService.prototype._createPost = require('./Functions/Create/Post');

/**
 * Read
 */
SQLService.prototype._readUserEntry = require('./Functions/Read/User');
SQLService.prototype._readPosts = require('./Functions/Read/Post');
SQLService.prototype._readSearchedPosts = require('./Functions/Read/PostSearch');


module.exports = new SQLService();