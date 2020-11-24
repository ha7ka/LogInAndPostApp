drop schema if exists YinzCamsAssessment;
create schema YinzCamsAssessment;

use YinzCamsAssessment;

create table UserAccount(
	id INT auto_increment,
    user_name varchar(40) not null unique, -- makes sure usernames are unique and indexed
    pwd_hashed varchar(255) not null,
	createdAt datetime default current_timestamp,
	updatedAt datetime default current_timestamp,
	primary Key(id)
)ENGINE = InnoDB;

create table HashTag(
	id INT auto_increment,
    tag varchar(255) not null unique, -- make sure we dont have dupe tags, and tags are indexed
	createdAt datetime default current_timestamp,
	updatedAt datetime default current_timestamp,
	primary Key(id)
)ENGINE = InnoDB;

create table Post(
	id INT auto_increment,
    user_account_id int,
    message varchar(1024),
	createdAt datetime default current_timestamp,
	updatedAt datetime default current_timestamp,
	primary Key(id),
	CONSTRAINT FK_Post_UserAccount FOREIGN KEY(user_account_id) REFERENCES UserAccount(id)
)ENGINE = InnoDB;

create table PostHashTags(
	id int auto_increment,
    hashtag_id int,
    post_id int,
	createdAt datetime default current_timestamp,
	updatedAt datetime default current_timestamp,
	primary Key(id),
	CONSTRAINT FK_PostHashTags_HashTag FOREIGN KEY(hashtag_id) REFERENCES HashTag(id),
	CONSTRAINT FK_PostHashTags_Post FOREIGN KEY(post_id) REFERENCES Post(id) 
)ENGINE = InnoDB;





