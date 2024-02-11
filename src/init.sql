CREATE TABLE
    IF NOT EXISTS Category (
        id integer primary key autoincrement,
        title varchar(255) not null,
        user_id integer
    );

CREATE TABLE
    IF NOT EXISTS Product (
        id integer primary key autoincrement,
        title varchar(255) not null,
        category_id integer,
        user_id integer,
        foreign key (category_id) references Category (id)
    );

CREATE TABLE
    IF NOT EXISTS Meta (
        id integer primary key autoincrement,
        title varchar(255),
        date_ timestamp not null,
        user_id integer
    );

CREATE TABLE
    IF NOT EXISTS Expense (
        id integer primary key autoincrement,
        amount float default 1,
        price money not null,
        product_id integer,
        meta_id integer not null,
        foreign key (product_id) references Product (id),
        foreign key (meta_id) references Meta (id)
    );

CREATE TABLE
    IF NOT EXISTS Alias (
        id integer primary key autoincrement,
        product_id integer,
        alias varchar(255),
        foreign key (product_id) references Product (id)
    );
