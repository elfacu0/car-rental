/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const AbstractCustomerRepositoryError = require('./error/abstractCustomerRepositoryError');

module.exports = class AbstractCustomerRepository {
    constructor() {
        if (new.target === AbstractCustomerRepository) {
            throw new AbstractCustomerRepositoryError(
                'Cant initialize abstract customer.'
            );
        }
    }

    /**
     * @param {import('../entity/customer')} customer
     * @returns {import('../entity/customer')}
     */
    async save(customer) {}

    /**
     * @param {Number} id
     */
    async delete(id) {}

    /**
     * @param {Number} id
     * @returns {import('../entity/customer')}
     */
    async getById(id) {}

    /**
     * @returns {Array<import('../entity/customer')>}
     */
    async getAll() {}
};
