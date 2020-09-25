const Rental = require('../entity/rental');

/**
 *
 * @param {Object} formData
 * @returns Rental
 */

function fromDataToEntity({
    id,
    'car-id': carId,
    'customer-id': customerId,
    'car-price-per-day': carPricePerDay,
    'start-date': startDate,
    'end-date': endDate,
    'car-price-total': carPriceTotal,
    'payment-type': paymentType,
    'is-paid': isPaid,
}) {
    return new Rental({
        id: Number(id),
        carId: Number(carId),
        customerId: Number(customerId),
        carPricePerDay,
        startDate,
        endDate,
        carPriceTotal,
        paymentType,
        isPaid,
    });
}

/**
 * @param {import('./RentalModel')} model
 * @returns {import('../../entity/Rental')}
 */
function fromModelToEntity(model) {
    return new Rental(model.toJSON());
}

module.exports = {
    fromDataToEntity,
    fromModelToEntity,
};
