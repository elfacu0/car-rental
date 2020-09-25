const RentalController = require('./controller/rentalController');
const RentalRepository = require('./repository/sqlite/rentalRepository');
const RentalService = require('./service/rentalService');
const RentalModel = require('./model/RentalModel');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').IDIContainer} container
 */
function init(app, container) {
    /**
     * @type {RentalController} controller;
     */
    const controller = container.get('RentalController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    RentalController,
    RentalService,
    RentalRepository,
    RentalModel,
};
