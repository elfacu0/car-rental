// configure DI container
require('dotenv').config();
const path = require('path');
const { default: DIContainer, object, get, factory } = require('rsdi');
const { Sequelize } = require('sequelize');
const multer = require('multer');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const {
    CarController,
    CarService,
    CarRepository,
    CarModel,
} = require('../module/car/module');

const {
    CustomerController,
    CustomerService,
    CustomerRepository,
    CustomerModel,
} = require('../module/customer/module');

const {
    RentalController,
    RentalService,
    RentalRepository,
    RentalModel,
} = require('../module/rental/module');

function configureMainSequelizeDatabase() {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DB_PATH,
    });
    return sequelize;
}

function configureSessionSequelizeDatabase() {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.SESSION_DB_PATH,
    });
    return sequelize;
}

function configureMulter() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, process.env.IMAGE_UPLOAD_DIR);
        },
        filename(req, file, cb) {
            // https://stackoverflow.com/questions/31592726/how-to-store-a-file-with-file-extension-with-multer
            // al tener una extensión, el navegador lo sirve en vez de descargarlo
            cb(null, Date.now() + path.extname(file.originalname));
        },
    });

    return multer({ storage });
}

/**
 * @param {DIContainer} container
 */
function configureSession(container) {
    const ONE_WEEK_IN_SECONDS = 604800000;

    const sequelize = container.get('SessionSequelize');
    const sessionOptions = {
        store: new SequelizeStore({ db: sequelize }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: ONE_WEEK_IN_SECONDS },
    };
    return session(sessionOptions);
}

/**
 * @param {DIContainer} container
 */
function configureCarModel(container) {
    return CarModel.setup(container.get('Sequelize'));
}

/**
 * @param {DIContainer} container
 */
function configureCustomerModel(container) {
    return CustomerModel.setup(container.get('Sequelize'));
}

/**
 * @param {DIContainer} container
 */
function configureRentalModel(container) {
    RentalModel.setup(container.get('Sequelize'));
    RentalModel.setupAssociations(
        container.get('CustomerModel'),
        container.get('CarModel')
    );
    return RentalModel;
}

/**
 * @param {DIContainer} container
 */
function addCommonDefinitions(container) {
    container.addDefinitions({
        Sequelize: factory(configureMainSequelizeDatabase),
        SessionSequelize: factory(configureSessionSequelizeDatabase),
        Session: factory(configureSession),
        Multer: factory(configureMulter),
    });
}

/**
 * @param {DIContainer} container
 */
function addCarModuleDefinitions(container) {
    container.addDefinitions({
        CarController: object(CarController).construct(
            get('Multer'),
            get('CarService')
        ),
        CarService: object(CarService).construct(get('CarRepository')),
        CarRepository: object(CarRepository).construct(get('CarModel')),
        CarModel: factory(configureCarModel),
    });
}

/**
 * @param {DIContainer} container
 */
function addCustomerModuleDefinitions(container) {
    container.addDefinitions({
        CustomerController: object(CustomerController).construct(
            get('CustomerService')
        ),
        CustomerService: object(CustomerService).construct(
            get('CustomerRepository')
        ),
        CustomerRepository: object(CustomerRepository).construct(
            get('CustomerModel')
        ),
        CustomerModel: factory(configureCustomerModel),
    });
}

/**
 * @param {DIContainer} container
 */
function addRentalModuleDefinitions(container) {
    container.addDefinitions({
        RentalController: object(RentalController).construct(
            get('RentalService'),
            get('CustomerService'),
            get('CarService')
        ),
        RentalService: object(RentalService).construct(get('RentalRepository')),
        RentalRepository: object(RentalRepository).construct(
            get('RentalModel')
        ),
        RentalModel: factory(configureRentalModel),
    });
}

module.exports = function configureDI() {
    const container = new DIContainer();
    addCommonDefinitions(container);
    addCarModuleDefinitions(container);
    addCustomerModuleDefinitions(container);
    addRentalModuleDefinitions(container);
    return container;
};
