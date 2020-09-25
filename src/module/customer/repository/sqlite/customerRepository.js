const AbstractCustomerRepository = require('../abstractCustomerRepository');
const CustomerNotFoundError = require('../error/CustomerNotFoundError');
const CustomerIdNotDefinedError = require('../error/CustomerIdNotDefinedError');
const { fromModelToEntity } = require('../../mapper/customerMapper');

module.exports = class CustomerRepository extends AbstractCustomerRepository {
    /**
     * @param {typeof import('../../model/customerModel')} customerModel
     */
    constructor(customerModel) {
        super();
        this.customerModel = customerModel;
    }

    /**
     * @param {import('../../entity/customer')} customer
     * @returns {import('../../entity/customer')}
     */
    async save(customer) {
        let customerModel;

        const buildOptions = { isNewRecord: !customer.id };
        customerModel = this.customerModel.build(customer, buildOptions);
        customerModel = await customerModel.save();
        return fromModelToEntity(customerModel);
    }

    /**
     * @param {import('../../entity/club')} customer
     * @returns {Boolean} devuelve true si se borró algo, false si no se borró nada.
     */
    async delete(customer) {
        if (!customer || !customer.id) {
            throw new CustomerIdNotDefinedError('Undefined customer id');
        }

        let customerModel;

        const buildOptions = { isNewRecord: !customer.id };
        customer.isDeleted = 1;
        customerModel = this.customerModel.build(customer, buildOptions);
        customerModel = await customerModel.save();
        return Boolean(fromModelToEntity(customerModel).id);
    }

    /**
     * @param {Number} id
     * @returns {import('../../entity/customer')}
     */
    async getById(id) {
        const customerModel = await this.customerModel.findOne({
            where: { id },
        });

        if (!customerModel) {
            throw new CustomerNotFoundError(`customer with ${id} not found`);
        }

        return fromModelToEntity(customerModel);
    }

    /**
     * @return {Array<import('../../entity/customer')>}
     */
    async getAll() {
        const customers = await this.customerModel.findAll({
            where: { is_deleted: 0 },
        });
        return customers.map(fromModelToEntity);
    }
};
