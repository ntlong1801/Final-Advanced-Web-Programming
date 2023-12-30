CREATE TABLE IF NOT EXISTS users
(
    id character varying(255),
    email character varying(255),
    password character varying(255),
    full_name character varying(255),
    address character varying(255),
    phone_number character varying(255),
    role character varying(255),
    activation character varying(255),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
)

CREATE TABLE IF NOT EXISTS classes
(
    id character varying(255) NOT NULL,
    name character varying(255),
    description character varying(255),
    invitation character varying(255) NOT NULL,
    owner_id character varying(255),
    CONSTRAINT classes_pkey PRIMARY KEY (id),
    CONSTRAINT classes_invitation_key UNIQUE (invitation)
)

CREATE TABLE IF NOT EXISTS class_user
(
    id_class character varying(255) NOT NULL,
    id_user character varying(255) NOT NULL,
    role character varying(255),
    CONSTRAINT class_user_pkey PRIMARY KEY (id_class, id_user)
)