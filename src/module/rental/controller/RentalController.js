const { fromDataToEntity } = require('../mapper/rentalMapper');
const RentalIdNotDefinedError = require('./error/rentalIdNotDefinedError');
const AbstractController = require('../../abstractController');

module.exports = class RentalController extends AbstractController {
    /**
     * @param {import('../service/rentalService')} rentalService
     */
    constructor(rentalService, customerService, carService) {
        super();
        this.ROUTE_BASE = '/rental';
        this.rentalService = rentalService;
        this.customerService = customerService;
        this.carService = carService;
    }

    /**
     * @param {import('express').Application} app
     */
    configureRoutes(app) {
        const ROUTE = this.ROUTE_BASE;
        app.get(`${ROUTE}/create/:id?`, this.create.bind(this));
        app.get(`${ROUTE}`, this.index.bind(this));
        app.get(`${ROUTE}/view/:id`, this.view.bind(this));
        app.post(`${ROUTE}/save`, this.save.bind(this));
        app.get(`${ROUTE}/delete/:id`, this.delete.bind(this));
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async index(req, res) {
        const rentals = await this.rentalService.getAll();
        const { errors, messages } = req.session;
        res.render('rental/view/index.html', {
            data: { rentals },
            admin: true,
            messages,
            errors,
        });
        req.session.errors = [];
        req.session.messages = [];
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async create(req, res) {
        const { id } = req.params;
        let Car = {};
        let rental = {};
        if (id) {
            Car = await this.carService.getById(id);
            rental.carId = id;
            rental.carPricePerDayForInput = Car.price;
            rental.carPricePerDay = Car.priceInCents;
        }
        rental.car = Car;
        const customers = await this.customerService.getAll();
        res.render('rental/view/form.html', {
            data: { rental, customers },
        });
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async view(req, res) {
        const { id } = req.params;

        if (!id) {
            throw new RentalIdNotDefinedError();
        }

        try {
            const rental = await this.rentalService.getById(id);
            console.log(rental);
            res.render('rental/view/form.html', {
                data: { rental },
            });
        } catch (e) {
            req.session.errors = [e.message];
            res.redirect(this.ROUTE_BASE);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async save(req, res) {
        try {
            const rental = fromDataToEntity(req.body);
            const savedRental = await this.rentalService.save(rental);
            if (rental.id) {
                req.session.messages = [`rental with id ${rental.id} updated`];
            } else {
                req.session.messages = [
                    `Added rental with id ${savedRental.id} `,
                ];
            }
            res.redirect(this.ROUTE_BASE);
        } catch (e) {
            req.session.errors = [e.message, e.stack];
            res.redirect(this.ROUTE_BASE);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const rental = await this.rentalService.getById(id);
            await this.rentalService.delete(rental);
            req.session.messages = [`Rental deleted with id: ${id}`];
        } catch (e) {
            req.session.errors = [e.message];
        }
        res.redirect(this.ROUTE_BASE);
    }
};
