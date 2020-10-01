const moment = require('moment');

module.exports = class Rental {
    constructor({
        id,
        carId,
        customerId,
        carPricePerDay,
        startDate,
        endDate,
        totalPrice,
        paymentType,
        isPaid,
        customer,
        car,
    }) {
        this.id = id;
        this.carId = carId;
        this.customerId = customerId;
        this.carPricePerDay = carPricePerDay;
        this.carPricePerDayForInput = this.fromCentsToUsd(carPricePerDay);
        this.startDate = this.convertToDate(startDate);
        this.endDate = this.convertToDate(endDate);
        this.startDateForInput = this.convertDateToString(this.startDate);
        this.endDateForInput = this.convertDateToString(this.endDate);
        this.totalPrice = this.calculateTotalPrice(totalPrice);
        this.totalPriceForInput = this.fromCentsToUsd(this.totalPrice);
        this.paymentType = paymentType;
        this.isPaid = isPaid;
        /**
         * @type {import('../../customer/entity/customer');} this.Customer
         */
        this.Customer = customer;
        /**
         * @type {import('../../car/entity/car');} this.Car
         */
        this.Car = car;
    }

    convertDateToString(date) {
        let month = Number(date.getMonth() + 1);
        month = month < 10 ? '0' + month : month;
        let day = Number(date.getDate() + 1);
        day = day < 10 ? '0' + day : day;
        return `${date.getFullYear()}-${month}-${day}`;
    }

    convertToDate(date) {
        if (typeof date == String) {
            date = date.split('-');
            return new Date(date[0], date[1], date[2]);
        }
        return new Date(date);
    }

    calculateTotalPrice(price) {
        if (price == 0) {
            let start = moment(this.startDate);
            let end = moment(this.endDate);
            let daysRented = end.diff(start, 'days');
            let totalPrice = daysRented * this.carPricePerDay;
            return totalPrice;
        } else {
            return price;
        }
    }

    fromCentsToUsd(price) {
        return price / 100;
    }
};
