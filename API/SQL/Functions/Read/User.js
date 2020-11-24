/**
 * used to pull a user entry from the db
 * 
 */

module.exports = async function(userName)
{
    try {
        let [rows] = await this.connectionPool.execute(
            'SELECT id, user_name, pwd_hashed FROM UserAccount where user_name = ?',
            [userName]
        );
        
        return rows;
        
    } catch (error) {
        throw error;
    }
}