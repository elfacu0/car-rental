const { fromModelToEntity, fromDataToEntity } = require('../rentalMapper');
const RentalEntity = require('../../entity/rental');
const CarEntity = require('../../../car/entity/car');
const CustomerEntity = require('../../../customer/entity/customer');

test('Convierte un modelo a una entidad', () => {
    expect(
        fromModelToEntity({
            toJSON() {
                return {};
            },
        })
    ).toBeInstanceOf(RentalEntity);
});

test('Convierte data a una entidad, sin customer ni car definidos', () => {
    expect(
        fromDataToEntity({
            id: 1,
            'car-id': 1,
            'customer-id': 1,
            'car-price-per-day': 100,
            'start-date': '2020-10-10',
            'end-date': '2020-10-10',
            'payment-type': 'Debit',
            'is-paid': true,
        })
    ).toBeInstanceOf(RentalEntity);
});

test('Convierte data a una entidad, con customer y car definidos', () => {
    const rentalMapped = fromDataToEntity({
        id: 1,
        'car-id': 1,
        'customer-id': 1,
        'car-price-per-day': 100,
        'start-date': '2020-10-10',
        'end-date': '2020-10-10',
        'payment-type': 'Debit',
        'is-paid': true,
        customer: { id: 1 },
        car: { id: 2 },
    });
    expect(rentalMapped).toBeInstanceOf(RentalEntity);
    expect(rentalMapped.customer).toBeInstanceOf(CustomerEntity);
    expect(rentalMapped.car).toBeInstanceOf(CarEntity);
});
