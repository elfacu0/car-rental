const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = class RentalModel extends Model {
    /**
     * @param {import('sequelize').Sequelize} sequelizeInstance
     * @returns {typeof RentalModel}
     */
    static setup(sequelizeInstance) {
        RentalModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                },
                carId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: {
                            tableName: 'cars',
                        },
                        key: 'id',
                    },
                },
                customerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: {
                            tableName: 'customers',
                        },
                        key: 'id',
                    },
                },
                carPricePerDay: {
                    type: DataTypes.NUMBER,
                },
                startDate: {
                    type: DataTypes.DATE,
                },
                endDate: {
                    type: DataTypes.DATE,
                },
                totalPrice: {
                    type: DataTypes.NUMBER,
                },
                paymentType: {
                    type: DataTypes.STRING,
                },
                isPaid: {
                    type: DataTypes.BOOLEAN,
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
                modelName: 'Rentals',
                tableName: 'rentals',
                timestamps: false,
            }
        );

        return RentalModel;
    }

    /**
     *
     * @param {import('../../customer/model/CustomerModel')} customerModel
     * @param {import('../../car/model/CarModel')} carModel
     */
    static setupAssociations(customerModel, carModel) {
        RentalModel.belongsTo(customerModel, { as: 'customer' });
        RentalModel.belongsTo(carModel, { as: 'car' });
    }
};
