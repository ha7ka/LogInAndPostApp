/**
 *  used to retrive Top 10 last created posts
 */

module.exports = async function()
{
    try {
        let [rows] = await this.connectionPool.execute('call read_Post()');
        
        return rows;
    } catch (error) {
      throw error;   
    }
}