const Rental = require('../../rental/entity/rental');
module.exports = class Car {
    constructor({
        id,
        imageSrc,
        brand,
        model,
        year,
        kms,
        color,
        hasAirConditioning,
        seats,
        hasAutomaticTransmission,
        priceInCents,
        rentals,
    }) {
        this.id = id;
        this.imageSrc = imageSrc;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.kms = kms;
        this.color = color;
        this.hasAirConditioning = hasAirConditioning;
        this.seats = seats;
        this.hasAutomaticTransmission = hasAutomaticTransmission;
        this.priceInCents = priceInCents;
        this.price = this.centsToDolars(priceInCents);
        this.rentals = this.mapRentals(rentals);
    }
    centsToDolars(price) {
        return price / 100;
    }
    mapRentals(rentals) {
        let mappedRentals = [];
        if (rentals) {
            mappedRentals = rentals.map((rental) => new Rental(rental));
        }
        return mappedRentals;
    }
};
