/**
 * @typedef {import('../repository/abstractRentalRepository')} AbstractRentalRepository
 */

const RentalNotDefinedError = require('./error/rentalNotDefinedError');
const RentalIdNotDefinedError = require('./error/rentalIdNotDefinedError');
const Rental = require('../entity/rental');

module.exports = class Service {
    /**
     *
     * @param {AbstractCustomerRepository} rentalRepository
     */
    constructor(rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    /**
     * @param {Rental} rental
     */
    async save(rental) {
        if (rental === undefined) {
            throw new RentalNotDefinedError();
        }

        return this.rentalRepository.save(rental);
    }

    /**
     * @param {Rental} rental
     */
    async delete(rental) {
        if (!(rental instanceof Rental)) {
            throw new RentalNotDefinedError();
        }

        return this.rentalRepository.delete(rental);
    }

    async getById(id) {
        if (id === undefined) {
            throw new RentalIdNotDefinedError();
        }

        return this.rentalRepository.getById(id);
    }

    async getAll() {
        return this.rentalRepository.getAll();
    }
};
