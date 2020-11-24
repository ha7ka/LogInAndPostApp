use YinzCamsAssessment;

drop procedure if exists read_Post;
drop procedure if exists read_PostSearch;

/*
	Creates a new message entry for a user on line
*/
DELIMITER //
 CREATE PROCEDURE read_Post()
   BEGIN
		SELECT p.id, p.message, group_concat(ht.tag) as hashtags
        from PostHashTags as pht
        Inner Join
			Post as p on p.id = pht.post_id
		Inner Join 
			HashTag as ht on  ht.id = pht.hashtag_id
        group by p.id
        order by p.createdAt
        LIMIT 10;
			
   END //
DELIMITER ;

/*
	Creates a new message entry for a user on line
*/
DELIMITER //
 CREATE PROCEDURE read_PostSearch(IN tagArray VARCHAR(16383))
   BEGIN
		SELECT fp.id, fp.message, group_concat(ht.tag) as hashtags
        from PostHashTags as pht
        Inner Join (
			SELECT p.id, p.message, p.createdAt
			from PostHashTags as pht
			Inner Join
				Post as p on p.id = pht.post_id
			Inner Join 
				HashTag as ht on  ht.id = pht.hashtag_id
			where FIND_IN_SET(ht.tag, tagArray)
        ) as fp on fp.id = pht.post_id
		Inner Join 
			HashTag as ht on  ht.id = pht.hashtag_id
        group by fp.id
        order by fp.createdAt;

   END //
DELIMITER ;