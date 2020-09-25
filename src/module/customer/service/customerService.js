/**
 * @typedef {import('../repository/abstractCustomerRepository')} AbstractCustomerRepository
 */

const CustomerNotDefinedError = require('./error/customerNotDefinedError');
const CustomerIdNotDefinedError = require('./error/customerIdNotDefinedError');
const Customer = require('../entity/customer');

module.exports = class Service {
    /**
     *
     * @param {AbstractCustomerRepository} customerRepository
     */
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }

    /**
     * @param {Customer} customer
     */
    async save(customer) {
        if (customer === undefined) {
            throw new CustomerNotDefinedError();
        }

        return this.customerRepository.save(customer);
    }

    /**
     * @param {Customer} customer
     */
    async delete(customer) {
        if (!(customer instanceof Customer)) {
            throw new CustomerNotDefinedError();
        }

        return this.customerRepository.delete(customer);
    }

    async getById(id) {
        if (id === undefined) {
            throw new CustomerIdNotDefinedError();
        }

        return this.customerRepository.getById(id);
    }

    async getAll() {
        return this.customerRepository.getAll();
    }
};
