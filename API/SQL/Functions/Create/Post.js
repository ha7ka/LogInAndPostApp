/**
 * create a new post
 *
 */

const SQLService = require("../../SQLService");

module.exports = async function(message, hastagList, userId)
{
    let conn;
    let tagIdList = [];

    try {


        conn = await this.connectionPool.getConnection();

        conn.beginTransaction();

        //get a list of tags
        
        for(tag of hastagList)
        {
            /**read if exists */
            let [rows] = await conn.execute(
                'SELECT tag, id FROM HashTag where tag = ?',
                [tag]
            );

            if(!rows.length > 0)
            {
                let [data] = await conn.execute(
                    'INSERT INTO HashTag(tag) VALUES(?)',
                    [tag]
                );

                tagIdList.push(data.insertId);
            }
            else tagIdList.push(rows[0].id);

            //update the datetime for last the was used we will use the updatedAt column for this            
            await conn.execute(
                'UPDATE HashTag SET updatedAt = current_timestamp WHERE id=?',
                [tagIdList[tagIdList.length - 1]]
            );

        }

        //create a new post
        let [data] = await conn.execute(
            'INSERT INTO Post(user_account_id, message) VALUES(?, ?)',
            [userId, message]
        );
        
        let postId = data.insertId;
        
        //link the hash tags to the message
        for(tagId of tagIdList)
        {
            await conn.execute(
                'INSERT INTO PostHashTags(hashtag_id, post_id) VALUES(?, ?)',
                [tagId, postId]
            );
        }
        
        //commit the transaction
        conn.commit();
        conn.release();

        return true;

    } catch (error) {
        conn.rollback();
        conn.release();
        throw error;
    }
}