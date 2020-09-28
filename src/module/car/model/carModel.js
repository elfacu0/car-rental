const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = class CarModel extends Model {
    /**
     * @param {import('sequelize').Sequelize} sequelizeInstance
     * @returns {typeof CarModel}
     */
    static setup(sequelizeInstance) {
        CarModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                },
                imageSrc: {
                    type: DataTypes.STRING,
                },
                brand: {
                    type: DataTypes.STRING,
                },
                model: {
                    type: DataTypes.STRING,
                },
                year: {
                    type: DataTypes.INTEGER,
                },
                kms: {
                    type: DataTypes.INTEGER,
                },
                color: {
                    type: DataTypes.STRING,
                },
                hasAirConditioning: {
                    type: DataTypes.BOOLEAN,
                },
                seats: {
                    type: DataTypes.INTEGER,
                },
                hasAutomaticTransmission: {
                    type: DataTypes.BOOLEAN,
                },
                priceInCents: {
                    type: DataTypes.INTEGER,
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    defaultValue: Sequelize.NOW,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: Sequelize.NOW,
                },
            },
            {
                sequelize: sequelizeInstance,
                underscored: true,
                modelName: 'Car',
                tableName: 'cars',
                timestamps: false,
            }
        );

        return CarModel;
    }
    /**
     *
     * @param {import('../../rental/model/rentalModel')} rentalModel
     */
    static setupAssociations(rentalModel) {
        CarModel.hasOne(rentalModel, { foreignKey: 'car_id' });
    }
};
