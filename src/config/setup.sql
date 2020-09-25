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
