DROP TABLE IF EXISTS cars;
CREATE TABLE cars(
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    image_src TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    kms INTEGER NOT NULL,
    color TEXT NOT NULL,
    has_air_conditioning BOOLEAN NOT NULL,
    seats INTEGER NOT NULL,
    has_automatic_transmission BOOLEAN NOT NULL,
    price_in_cents INTEGER NULL,
	created_at DATE DEFAULT (datetime('now')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now')) NOT NULL
);

INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_white.png","Kia","Rio","2002","1224","Blue","1","5","1");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_red.png","Toyota","Yaris","2008","1538","Gray","1","5","1");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_white.png","Suzuki","Swift","2008","1774","Gray","1","5","1");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_white.png","Kia","Rio","2016","314","Red","1","5","0");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_white.png","Hyundai","i30","2019","605","Red","1","5","1");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_red.png","Toyota","Yaris","2005","1981","Blue","1","5","1");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_coolgrey.png","Hyundai","Accent","2014","208","Gray","1","5","0");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_red.png","Toyota","Yaris","2011","1171","Gray","1","4","1");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_white.png","Kia","Rio","2001","1240","Blue","1","4","1");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_white.png","Hyundai","Getz","2004","209","Blue","1","4","1");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_white.png","Kia","Forte","2003","581","Red","1","5","1");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_white.png","Toyota","Auris","2008","1121","Blue","1","5","1");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_white.png","Toyota","Auris","2000","35","Red","1","5","1");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/03_standard_white.png","Class","Full-size","2018","430","White","1","5","1");
INSERT INTO cars (image_src,brand,model,year,kms,color,has_air_conditioning,seats,has_automatic_transmission)  VALUES ("https://www.kayak.com/h/run/api/image?caller=Cars&height=196&crop=true&url=/carimages/generic/02_economy_red.png","Toyota","Yaris","2010","1218","Gray","1","5","1");

/*Adds random prices*/
UPDATE cars SET price_in_cents = (ABS(RANDOM()) % (4000 - 2000) + 2000);


DROP TABLE IF EXISTS customers;
CREATE TABLE customers(
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    first_names TEXT NOT NULL,
    last_names TEXT NOT NULL,
    document_type TEXT NOT NULL,
    document_number INTEGER NOT NULL,
    nationality INTEGER NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    birth_date DATE NOT NULL,
	created_at DATE DEFAULT (datetime('now')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now')) NOT NULL
);

DROP TABLE IF EXISTS reservations;
CREATE TABLE reservations(
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    customer_id INTEGER NOT NULL,
    car_id INTEGER NOT NULL,
    car_price_in_cents INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    payment_type TEXT NOT NULL,
    is_paid BOOLEAN NOT NULL,
	created_at DATE DEFAULT (datetime('now')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now')) NOT NULL
);

DROP TABLE IF EXISTS historical_reservations;
CREATE TABLE historical_reservations(
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    customer_id INTEGER NOT NULL,
    car_id INTEGER NOT NULL,
    car_price_in_cents INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    payment_type TEXT NOT NULL,
    is_paid BOOLEAN NOT NULL,
	created_at DATE DEFAULT (datetime('now')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now')) NOT NULL
);

