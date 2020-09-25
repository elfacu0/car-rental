const CustomerController = require('./controller/customerController');
const CustomerRepository = require('./repository/sqlite/customerRepository');
const CustomerService = require('./service/customerService');
const CustomerModel = require('./model/customerModel');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').IDIContainer} container
 */
function init(app, container) {
    /**
     * @type {CustomerController} controller;
     */
    const controller = container.get('CustomerController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    CustomerController,
    CustomerService,
    CustomerRepository,
    CustomerModel,
};
