/**
 * create a new user
 */

module.exports = async function(userName, hashedPass)
{
    try {
        let [rows] = await this.connectionPool.execute(
            'INSERT INTO UserAccount(user_name, pwd_hashed) VALUES(? , ?)',
            [userName, hashedPass]
        );
        
        return rows;

    } catch (error) {
        throw error;
    }
}