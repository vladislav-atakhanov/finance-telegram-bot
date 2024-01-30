CREATE TABLE
    IF NOT EXISTS Category (
        id integer primary key autoincrement,
        title varchar(255) not null,
        user_id int
    );

CREATE TABLE
    IF NOT EXISTS Product (
        id integer primary key autoincrement,
        title varchar(255) not null,
        category_id int,
        user_id int
    );

CREATE TABLE
    IF NOT EXISTS Meta (
        id integer primary key autoincrement,
        title varchar(255),
        date_ timestamp not null,
        user_id int
    );

CREATE TABLE
    IF NOT EXISTS Expense (
        id integer primary key autoincrement,
        amount float default 1,
        price money not null,
        product_id int,
        meta_id int not null,
        foreign key (product_id) references Product (id),
        foreign key (meta_id) references Meta (id)
    );