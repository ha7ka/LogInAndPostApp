const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const SQLFun = require('../SQL/SQLService');
const jwt = require('jsonwebtoken');

router.post('/register', async function(req, res){
    let {userName, password} = req.body;

    try {
        let hashedPass = await bcrypt.hashSync(password, saltRounds);

        await SQLFun._createNewUser(userName, hashedPass);

        return res.status(200).json({
            userAdded: true,
            message : 'User Created',
        });
    } catch (error) {
        //incase FE forgets to check if username exits
        if(error.errno === 1062) return res.status(400).json({userAdded: false , message : 'user already exists'});

        return res.status(400).json({userAdded: false , message : 'Unexpected error creating the user'});
    } 
});


router.get('/exists', async function(req, res){
    const { userName } = req.query;
    
    try {
        let userEntry = await SQLFun._readUserEntry(userName);

        return res.status(200).json({
            userExists: userEntry.length > 0,
        });

    } catch (error) {
        return res.status(400).json({message : 'Unexpected error'});
    }
});

router.post('/authenticate', async function(req, res){
    const { userName, password } = req.body;
    
    try {
        let userEntry = await SQLFun._readUserEntry(userName);

        /**user doesnt exist */
        if(!userEntry[0]) return res.status(400).json({aunthicated: false, message: 'user doesnt exist'});

        let auth = await bcrypt.compareSync(password, userEntry[0].pwd_hashed);

        if(auth) 
        {
            //create a session token
            const accessToken = jwt.sign({userName : userEntry[0].user_name, userId : userEntry[0].id}, process.env.JWT_SECRET);

            res.status(200).json({aunthicated: true, accessToken, userName: userName});
        }
        else return res.status(400).json({aunthicated: false, message: 'password did not match' });

    } catch (error) {
        return res.status(400).json({message : 'Unexpected error'});
    }
});

module.exports = router;