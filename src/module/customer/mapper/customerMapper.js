const Customer = require('../entity/customer');

/**
 *
 * @param {Object} formData
 * @returns Customer
 */

function fromDataToEntity({
    id,
    'fist-names': firstNames,
    'last-names': lastNames,
    'document-type': documentType,
    'document-number': documentNumber,
    nationality,
    address,
    phone,
    email,
    'birth-date': birthDate,
}) {
    return new Customer({
        id: Number(id),
        firstNames,
        lastNames,
        documentType,
        documentNumber,
        nationality,
        address,
        phone,
        email,
        birthDate,
    });
}

/**
 * @param {import('./CustomerModel')} model
 * @returns {import('../../entity/Customer')}
 */
function fromModelToEntity(model) {
    return new Customer(model.toJSON());
}

module.exports = {
    fromDataToEntity,
    fromModelToEntity,
};
