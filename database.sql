CREATE TABLE users (
    users_id SERIAL PRIMARY KEY,
    username VARCHAR,
    email VARCHAR,
    password VARCHAR,
    bio VARCHAR,
    last_login TIMESTAMP,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content (
    content_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    size INTEGER,
    original_name VARCHAR,
    name VARCHAR,
    mime VARCHAR,
    location VARCHAR,
    upload_ip VARCHAR,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    tags_id SERIAL PRIMARY KEY,
    name VARCHAR
);

CREATE TABLE content_tags (
    content_tags_id SERIAL PRIMARY KEY,
    tags_id INTEGER REFERENCES tags(tags_id) ON DELETE CASCADE,
    content_id INTEGER REFERENCES content(content_id)
);

CREATE TABLE comments (
  comments_id SERIAL PRIMARY KEY,
  users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
  content_id INTEGER REFERENCES content(content_id) ON DELETE CASCADE,
  comment VARCHAR
);

CREATE TABLE users_followers (
    users_followers_id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    follow_users_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE
);

CREATE TABLE messages (
    messages_id SERIAL PRIMARY KEY,
    message VARCHAR,
    sender_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(users_id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT FALSE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
