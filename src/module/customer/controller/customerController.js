const { fromDataToEntity } = require('../mapper/customerMapper');
const CustomerIdNotDefinedError = require('./error/customerIdNotDefinedError');
const AbstractController = require('../../abstractController');

module.exports = class CustomerController extends AbstractController {
    /**
     * @param {import('../service/customerService')} customerService
     */
    constructor(customerService) {
        super();
        this.ROUTE_BASE = '/customer';
        this.customerService = customerService;
    }

    /**
     * @param {import('express').Application} app
     */
    configureRoutes(app) {
        const ROUTE = this.ROUTE_BASE;
        app.get(`${ROUTE}/create`, this.create.bind(this));
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
        const customers = await this.customerService.getAll();
        const { errors, messages } = req.session;
        res.render('customer/view/index.html', {
            data: { customers },
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
        res.render('customer/view/form.html', { data: {} });
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async view(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new CustomerIdNotDefinedError();
        }

        try {
            const customer = await this.customerService.getById(id);
            res.render('customer/view/form.html', {
                data: { customer },
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
            const customer = fromDataToEntity(req.body);
            const savedCustomer = await this.customerService.save(customer);
            if (customer.id) {
                req.session.messages = [
                    `Customer with id ${customer.id} updated`,
                ];
            } else {
                req.session.messages = [
                    `Added customer with id ${savedCustomer.id} (${savedCustomer.name})`,
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
            const customer = await this.customerService.getById(id);
            await this.customerService.delete(customer);
            req.session.messages = [`Customer deleted with id: ${id}`];
        } catch (e) {
            req.session.errors = [e.message];
        }
        res.redirect(this.ROUTE_BASE);
    }
};
