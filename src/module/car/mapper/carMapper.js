const Car = require('../entity/car');

/**
 *
 * @param {Object} formData
 * @returns Car
 */

function fromUsdToCents(price) {
    return price * 100;
}

function fromDataToEntity({
    id,
    'image-src': imageSrc,
    brand,
    model,
    year,
    kms,
    color,
    'has-air-conditioning': hasAirConditioning,
    seats,
    'has-automatic-transmission': hasAutomaticTransmission,
    price,
}) {
    hasAirConditioning = Boolean(hasAirConditioning);
    hasAutomaticTransmission = Boolean(hasAutomaticTransmission);
    const priceInCents = fromUsdToCents(price);
    return new Car({
        id: Number(id),
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
    });
}

/**
 * @param {import('./carModel')} model
 * @returns {import('../../entity/car')}
 */
function fromModelToEntity(model) {
    return new Car(model.toJSON());
}

module.exports = {
    fromDataToEntity,
    fromModelToEntity,
};
