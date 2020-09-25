module.exports = class Rental {
    constructor({
        id,
        carId,
        customerId,
        carPricePerDay,
        startDate,
        endDate,
        carPriceTotal,
        paymentType,
        isPaid,
    }) {
        this.id = id;
        this.carId = carId;
        this.customerId = customerId;
        this.carPricePerDay = carPricePerDay;
        this.startDate = this.convertToDate(startDate);
        this.endDate = this.convertToDate(endDate);
        this.startDateForInput = this.convertDateToString(this.startDate);
        this.endDateForInput = this.convertDateToString(this.endDate);
        this.carPriceTotal = carPriceTotal;
        this.paymentType = paymentType;
        this.isPaid = isPaid;
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
};
