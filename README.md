# Note: didnt code all functions just enough to give make sure stuff would work as I indeded and give you an idea of codeing ability

# Client 

for this basic application I would design a client with a Log In page and post page.

## Log In Page
- Option to register
- Option to log In
- On login will receive a JWT token and should store this token in local storage or cookie

## Posts Page
- Option to create a new post
(pull all posts for current search from db)
- Option to search posts by tags
- display of returned posts
- some sort of polling to keep latests polls up to date

# Server
Three main parts to this application 
- SQLService
- Routers
- Main Application

## SQLService

- this is there all the data retrival/storage is handled.

- uses the mysql2 nodejs package(simple light weight package).
- notable function _initlize.

- this class only has one instnace. 

-  since we are using pools there no need to have multiple instances with multiple conntions to the db.

- class is a singleton instance. (it only have one active instance in the app.)
-mainly used to organize values requried by the crud functions and the functions themselves into one file allowing the routes to use these functions to perform the required actions with the datastore.

## SQL funtions
<br>

### Create 

- <b>User</b> : to create a new user used to store the userName and a hashed password into the BE so we can use this entry for auth.

- <b>Post</b> : to create a new post is a transaction (since we are adding adding to multiple tables/entries and want to rollback if there are any conflicting values)

    - first get ids of all the hastags that are associated with this post.

    -if hastag doesnt exist create it

    - second create an entry for the post (post entry has fk to user)

    - third link the post with all the hash tag ids

    - change the updatedAt date for the tag entry to current time stamp

### Read

- Post when there is no search pram just get the latest 10 posts. (just so we dont have an empy posts page).

    - uses a stored procedure as we will be performing joins (not a simple query).

- Posts when we have a Search Value

    - also uses a stored procedure(same reason as above)

- User
    - to retrive the user entry so we can compare the hashes and auth the user for login

### Update

- Nothing wasnt really in the scope but we can add functions to here when we decide to allow a user to edit there own posts

### Delete
- function to delete tags that have not been used for a while and are lined to no posts(cleanup if a delted tag needs to be used again we can just add it again). assuming we will also be allowing users to delete the (this is a scheduled task. running it once a day.)

- function to delete posts from DB (tag clean up happens in the job)

# Main Application (YinzCam.js)
- runs on express(REST) nodeJS stack along with other helper modules including mysql2, dotenv, jsonwebtoken

- uses json as the representation

- mainly useing POST's with GET's for simple queries to the api

- this app has a HTTP protcal but in prod we should use HTTPS as we will be sending auth data across this connection. and we want that to be enrypted.

- this is centralhub with there server and other helper classes are initlized.

- db class is inti

- error midleware

- routers are added

# Routers

### Users

- <b>'/register' </b> : used bcrypt to salt and hash the password as we dont want anyone who has acess to the db see the password of a user. after hashing is done we try to add the data to the DB. this should not fail if there are proper checks in FE but just in case the most common reason for a failure should be if the userName alreadt exists in DB, we catch that error and return a special messaged to the user. 

- <b>'/authenticate' </b>: hashes the pass word and then pull the hassed pass for the user from the db. then compares the hashed passes.

    - if auth is scuess we create a jwt token and send it to the FE for it to store and add to the headder of future requests so we can auth the post/get commands that require the user to be logged in to exe.

- <b> '/exists' </b>: this is a get as it is to be used by the FE to check if the userName its about to send for registration exists or not. make it harder for the registration to fail.

### Posts

- <b> extractHashTags </b>:  helper function to seprate and clean hashtag strings that are sent to the api

- <b> middleware </b> :  as the routes in this router will be proteced with will use the jwt toked to make sure the  cliend is  sigined in on the client side. also will add the userId to the req so we can link these requests to a user.

- <b> '/create-new-post' </b> : extracts the hastags using the extractHashTags function. the function allows for hashtags to have spaces. 


- <b> '/retrive-posts' </b> : if not search string is passed returns the last 10 created posts. else returns posts that are have a power Set of hastags that also exists in the passed power Set

### ENV file

- a file with sensitive data with the following feilds. not neceassary but useful data can be exported or set durring server launch
    - PORT
    - SQL_HOST
    - SQL_USER
    - SQL_PASS
    - SQL_DB
    - JWT_SECRE

# DataStore

## Type
- MySQL
- Reason: with every post have multiple tags have a realtional db should allow for faster lookup based on hash tags and minimize redundancy

## high level diagram
![high level db](DataBase/diagram.png)]

# Tables
    - See DataBase folder for Defenitions
## Reasons for structue
    - Every table has a createAt and updatedAt column to help keep track of when rows are created or updated, helpful for debugging, and provideing support for users, ourdering entries by time.

    - every table has a id column. this is the Primary Key and it will help us identify enries on the table.


## UserAccounts Table

- user_name is unique, with this constrant we make sure for every  user we have there is only one enrty in the db. it also indexs the user names makeing there easier to search.

- pwd_hashed this is a hash created using bcrypt in the API

## HashTag Table 

- this is a table to have an entrt to each possiable unique tag for any posts.

## Post Table

- this table contains all the posts posted by our users. also contains a ref to the user who made the post.

- PostHashTags this table marks a many to many realation ship. as it allows a single hash tags entry to be associated with multiple lines. and one post to be associated with multiplule hashtags.




