-- NOTE: this is only to be run when the team1 db is empty and list index == 1

-- insering the default test users
INSERT INTO user (username, password, first, last)
VALUES ('user1', 'ok', 'Don', 'Clay');
INSERT INTO user (username, password, first, last)
VALUES ('user2', 'ok', 'Anna', 'Lowry');
INSERT INTO user (username, password, first, last)
VALUES ('user3', 'ok', 'Gladys', 'Cooper');
INSERT INTO user (username, password, first, last)
VALUES ('user4', 'ok', 'Susan', 'Duran');

-- inserting the default movie list for default users
INSERT INTO list (username, list_name)
VALUES ('user2', 'Movie Night');
INSERT INTO list (username, list_name)
VALUES ('user3', 'Personal Favorites');
INSERT INTO list (username, list_name)
VALUES ('user3', 'Family Time');
INSERT INTO list (username, list_name)
VALUES ('user4', 'Some Day');
INSERT INTO list (username, list_name)
VALUES ('user4', 'Scary');
INSERT INTO list (username, list_name)
VALUES ('user4', 'Scifi favs');

-- entries for user lists
INSERT INTO list_entry(list_id, title_id)
VALUES (1, 'movie/64690');
INSERT INTO list_entry(list_id, title_id)
VALUES (1, 'movie/805320');
INSERT INTO list_entry(list_id, title_id)
VALUES (1, 'movie/198663');
INSERT INTO list_entry(list_id, title_id)
VALUES (1, 'movie/70160');
INSERT INTO list_entry(list_id, title_id)
VALUES (1, 'movie/76600');
INSERT INTO list_entry(list_id, title_id)
VALUES (2, 'movie/597');
INSERT INTO list_entry(list_id, title_id)
VALUES (2, 'movie/872585');
INSERT INTO list_entry(list_id, title_id)
VALUES (3, 'movie/360920');
INSERT INTO list_entry(list_id, title_id)
VALUES (4, 'movie/346698');
INSERT INTO list_entry(list_id, title_id)
VALUES (5, 'movie/250546');
INSERT INTO list_entry(list_id, title_id)
VALUES (6, 'movie/335984');
INSERT INTO list_entry(list_id, title_id)
VALUES (6, 'tv/42009');
INSERT INTO list_entry(list_id, title_id)
VALUES (6, 'movie/157336');

