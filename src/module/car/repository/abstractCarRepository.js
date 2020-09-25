/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const AbstractCarRepositoryError = require('./error/abstractCarRepositoryError');

module.exports = class AbstractCarRepository {
    constructor() {
        if (new.target === AbstractCarRepository) {
            throw new AbstractCarRepository(
                'No se puede instanciar el repositorio de clubes abstracto.'
            );
        }
    }

    /**
     * @param {import('../entity/car')} car
     * @returns {import('../entity/car')}
     */
    async save(car) {}

    /**
     * @param {Number} id
     */
    async delete(id) {}

    /**
     * @param {Number} id
     * @returns {import('../entity/car')}
     */
    async getById(id) {}

    /**
     * @returns {Array<import('../entity/car')>}
     */
    async getAll() {}
};
