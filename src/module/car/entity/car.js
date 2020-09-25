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
    }
    centsToDolars(price) {
        return price / 100;
    }
};
