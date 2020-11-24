/**
 * uses a stored procedure as this Query is a bit more complicatted.
 */

module.exports = async function(hastagList)
{
    try {
        let [rows] = await this.connectionPool.execute('call read_PostSearch(?)', [hastagList.join()]);
        
        return rows;
    } catch (error) {
        
    }
}

