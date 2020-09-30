const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = class rentalModel extends Model {
    /**
     * @param {import('sequelize').Sequelize} sequelizeInstance
     * @returns {typeof rentalModel}
     */
    static setup(sequelizeInstance) {
        rentalModel.init(
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

        return rentalModel;
    }

    /**
     *
     * @param {import('../../customer/model/customerModel')} customerModel
     * @param {import('../../car/model/carModel')} carModel
     */
    static setupAssociations(customerModel, carModel) {
        rentalModel.belongsTo(customerModel, { as: 'customer' });
        rentalModel.belongsTo(carModel, { as: 'car' });
    }
};
