CREATE DATABASE bohhy;

CREATE TABLE person (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(250) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
  about TEXT,
  image TEXT
);

CREATE TABLE community (
	id BIGSERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(50) NOT NULL,
  members BIGINT NOT NULL
)

CREATE TABLE post (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(300) NOT NULL,
  text TEXT,
  votes_sum BIGINT NOT NULL,
  comments_sum BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
  person_id BIGINT NOT NULL REFERENCES person (id),
  community_id BIGINT NOT NULL REFERENCES community (id)
);

CREATE TABLE comment (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  text TEXT NOT NULL,
  votes_sum BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
  person_id BIGINT NOT NULL REFERENCES person(id),
  post_id BIGINT NOT NULL REFERENCES post(id)
);

CREATE TABLE vote (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  value VARCHAR(4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
  person_id BIGINT NOT NULL REFERENCES person(id),
  post_id BIGINT REFERENCES post(id),
  comment_id BIGINT REFERENCES comment(id)
);