const AbstractRentalRepository = require('../abstractRentalRepository');
const RentalNotFoundError = require('../error/RentalNotFoundError');
const RentalIdNotDefinedError = require('../error/RentalIdNotDefinedError');
const { fromModelToEntity } = require('../../mapper/rentalMapper');

module.exports = class CustomerRepository extends AbstractRentalRepository {
    /**
     * @param {typeof import('../../model/rentalModel')} rentalModel
     */
    constructor(rentalModel) {
        super();
        this.rentalModel = rentalModel;
    }

    /**
     * @param {import('../../entity/customer')} rental
     * @returns {import('../../entity/customer')}
     */
    async save(rental) {
        let rentalModel;

        const buildOptions = { isNewRecord: !rental.id };
        rentalModel = this.rentalModel.build(rental, buildOptions);
        rentalModel = await rentalModel.save();
        console.log(rentalModel);
        return fromModelToEntity(rentalModel);
    }

    /**
     * @param {import('../../entity/club')} rental
     * @returns {Boolean} devuelve true si se borró algo, false si no se borró nada.
     */
    async delete(rental) {
        if (!rental || !rental.id) {
            throw new RentalIdNotDefinedError('Undefined rental id');
        }

        return Boolean(
            await this.rentalModel.destroy({ where: { id: rental.id } })
        );
    }

    /**
     * @param {Number} id
     * @returns {import('../../entity/rental')}
     */
    async getById(id) {
        const rentalModel = await this.rentalModel.findOne({
            where: { id },
        });

        if (!rentalModel) {
            throw new RentalNotFoundError(`rental with ${id} not found`);
        }

        return fromModelToEntity(rentalModel);
    }

    /**
     * @return {Array<import('../../entity/rental')>}
     */
    async getAll() {
        const rentals = await this.rentalModel.findAll();
        return rentals.map(fromModelToEntity);
    }
};
