const Rental = require('../entity/rental');
const Customer = require('../../customer/entity/customer');
const Car = require('../../car/entity/car');

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
    'payment-type': paymentType,
    'is-paid': isPaid,
    customer,
    car,
}) {
    const totalPrice = 0;
    return new Rental({
        id: Number(id),
        carId: Number(carId),
        customerId: Number(customerId),
        carPricePerDay: Number(carPricePerDay),
        startDate,
        endDate,
        totalPrice,
        paymentType,
        isPaid,
        customer: new Customer(customer),
        car: new Car(car),
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
