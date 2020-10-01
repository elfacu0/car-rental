/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const AbstractRentalRepositoryError = require('./error/abstractRentalRepositoryError');

module.exports = class AbstractRentalRepository {
    constructor() {
        if (new.target === AbstractRentalRepository) {
            throw new AbstractRentalRepositoryError(
                'Cant initialize abstract Rental.'
            );
        }
    }

    /**
     * @param {import('../entity/rental')} rental
     * @returns {import('../entity/rental')}
     */
    async save(rental) {}

    /**
     * @param {Number} id
     */
    async delete(id) {}

    /**
     * @param {Number} id
     * @returns {import('../entity/rental')}
     */
    async getById(id) {}

    /**
     * @returns {Array<import('../entity/rental')>}
     */
    async getAll() {}
};
