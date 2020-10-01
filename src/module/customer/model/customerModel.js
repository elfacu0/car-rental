const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = class CustomerModel extends Model {
    /**
     * @param {import('sequelize').Sequelize} sequelizeInstance
     * @returns {typeof CustomerModel}
     */
    static setup(sequelizeInstance) {
        CustomerModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                },
                firstNames: {
                    type: DataTypes.STRING,
                },
                lastNames: {
                    type: DataTypes.STRING,
                },
                documentType: {
                    type: DataTypes.STRING,
                },
                documentNumber: {
                    type: DataTypes.INTEGER,
                },
                nationality: {
                    type: DataTypes.STRING,
                },
                address: {
                    type: DataTypes.STRING,
                },
                phone: {
                    type: DataTypes.STRING,
                },
                email: {
                    type: DataTypes.STRING,
                },
                birthDate: {
                    type: DataTypes.STRING,
                },
                isDeleted: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: 0,
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
                modelName: 'Customers',
                tableName: 'customers',
                timestamps: false,
            }
        );

        return CustomerModel;
    }
};
