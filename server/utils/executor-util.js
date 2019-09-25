const instructions = require('../constants/constants');

const executor = (data, parkingLot) => {
    if (data.includes(instructions.create)) {
        let inst = data.split(' ');
        parkingLot.n = Number(inst[inst.length - 1]);
        parkingLot.aggreagator(data, parkingLot._createParkingLot);
    }
    else if (data.includes(instructions.park))
        parkingLot.aggreagator(data, parkingLot._park);

    else if (data.includes(instructions.status))
        parkingLot.aggreagator(data, parkingLot._returnStatus);

    else if (data.includes(instructions.leave))
        parkingLot.aggreagator(data, parkingLot._unpark);

    else {
        if (data.includes('registration_numbers_for_cars_with_colour')) {
            parkingLot.searchForRegNumbers = true
        } else {
            parkingLot.searchForRegNumbers = false;
        }
        let inst = data.split(' ');
        parkingLot.aggreagator(inst[inst.length - 1], parkingLot._searchCars);
    }
}

module.exports = executor;