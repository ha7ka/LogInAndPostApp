const router = require('express').Router();
const SQLFun = require('../SQL/SQLService');
const jwt = require('jsonwebtoken');


/**
 * these function should be in diff file but considering the 
 * scope of the functions im going to leave them here
 * 
 */
const extractHashTags =  (list) => {
    let wordList = list.split(' ');
    let hashtagList = [];

    //allow for spaces in hashtags
    for(word of wordList)
    {
        //new hash tag
        if(word.indexOf('#') === 0) hashtagList.push(word.substring(1));
        //part of prev hash tag
        else hashtagList[hashtagList.length - 1] = hashtagList[hashtagList.length - 1] + ' ' +word;
    }

    return hashtagList;
}

router.use(function(req, res, next){
    const authHeader = req.headers.authorization;

    if(authHeader){
        jwt.verify(authHeader, process.env.JWT_SECRET, (error, data)=>{
            if(error) return res.sendStatus(401); // someting wen wrong extracting the info

            req.userId = data.userId;

        });
    }
    else return res.sendStatus(401);

    next();
})


router.post('/create-new-post', async function(req, res){
    let {postMessage, hashtags} = req.body;
    let {userId} = req;

    let hashtagList = extractHashTags(hashtags);

    await SQLFun._createPost(postMessage, hashtagList, userId);


    return res.status(200).json({
        postCreated: true,
    });
});


router.post('/retrive-posts', async function(req, res){
    let {hashtags} = req.body;

    let posts;

    if(hashtags)
        posts = await SQLFun._readSearchedPosts(extractHashTags(hashtags));
    else
        posts = await SQLFun._readPosts();

    return res.status(200).json({
        posts : posts[0]
    });

});



module.exports = router;