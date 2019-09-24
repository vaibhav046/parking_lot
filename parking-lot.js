
var standard_input = process.stdin;
// Set input character encoding.
standard_input.setEncoding('utf-8');

class ParkingLot {

    constructor() {
        this.arr = new Map();
        this.n = 0;
        this.searchForRegNumbers = false;
        this._createParkingLot = this._createParkingLot.bind(this, this.arr);
        this._park = this._park.bind(this);
        this._unpark = this._unpark.bind(this);
        this._searchCars = this._searchCars.bind(this);
        this._returnStatus = this._returnStatus.bind(this);
    }

    /**
     *
     *
     * @param {*} n
     * @memberof ParkingLot
     */
    _createParkingLot(arr) {
        this.arr = arr;
        for (let i = 1; i <= this.n; i++) {
            this.arr.set(i, null);
        }
        console.log(`Created a parking lot with ${this.n} slots`);
    }


    /**
     *
     *
     * @param {*} instruction
     * @memberof ParkingLot
     */
    _park(instruction) {
        let instruct = instruction.split(' ');
        let parkingFull = false;
        if (instruct.length > 0 && instruct[0] === 'park') {
            // let carDetail = instruct.slice(1, instruct.length - 1);
            if (![...this.arr.values()].includes(null)) {
                parkingFull = true;
            }
            if (!parkingFull) {
                for (let [key, value] of this.arr.entries()) {
                    if (value === null) {
                        value = { registration_number: instruct[1], color: instruct[2] };
                        this.arr.set(key, value);
                        console.log(`Allocated slot number: ${key}`);
                        break;
                    }
                }
            } else {
                console.log(`Sorry, parking lot is full`);
            }
        }
    }


    /**
     *
     *
     * @param {*} instruction
     * @memberof ParkingLot
     */
    _unpark(instruction) {
        let instruct = instruction.split(' ');
        let slot = Number(instruct[1]);
        if (!isNaN(slot) && this.arr.get(slot) !== null) {
            this.arr.set(slot, null);
            console.log(`Slot number ${slot} is free`);
        }
    }


    /**
     *
     *
     * @memberof ParkingLot
     */
    _returnStatus() {
        console.log(`Slot No.    Registration No     Color`);
        for (let [key, value] of this.arr.entries()) {
            if (value !== null)
                console.log(`${key}           ${value.registration_number}       ${value.color}`);
        }
    }


    /**
     *
     *
     * @param {*} instruction
     * @memberof ParkingLot
     */
    _searchCars(instruction) {
        let colouredSlots = [];
        let colouredRegNos = [];
        let found = false;
        [...this.arr.entries()].map((x) => {
            if (this.searchForRegNumbers) {
                if (x[1].color === instruction) {
                    colouredRegNos.push(x[1].registration_number);
                    found = true;
                }
            } else {
                if (x[1].registration_number === instruction) {
                    console.log(`slot_number_for_registration_number ${instruction}`);
                    found = true;
                    return;
                }
                else if (x[1].color === instruction) {
                    // console.log(instruction)
                    colouredSlots.push(x[0]);
                    found = true;
                } else {
                    found = false;
                }
            }
        });

        if (colouredSlots.length > 0) {
            found = true;
            console.log(`slot_numbers_for_cars_with_colour ${instruction}`);
            console.log(colouredSlots.join(','));
        }
        if (colouredRegNos.length > 0) {
            found = true;
            console.log(colouredRegNos.join(','));
        }
        if (!found) {
            console.log(`not found`);
        }
    }


    /**
     *
     *
     * @param {*} instruction
     * @param {*} callback
     * @returns
     * @memberof ParkingLot
     */
    aggreagator(instruction, callback) {
        callback(instruction);
    }
}


let parkingLot = new ParkingLot();
standard_input.on('data', (data) => {
    // User input exit.
    if (data === 'exit\n') {
        // Program exit.
        console.log("User input complete, program exit.");
        process.exit();
    } else {
        // console.log(data);
        if (data.includes('create')) {
            let inst = data.split(' ');
            parkingLot.n = Number(inst[inst.length - 1]);
            parkingLot.aggreagator(data, parkingLot._createParkingLot);
        }
        else if (data.includes('park'))
            parkingLot.aggreagator(data, parkingLot._park);

        else if (data.includes('status'))
            parkingLot.aggreagator(data, parkingLot._returnStatus);

        else if (data.includes('leave'))
            parkingLot.aggreagator(data, parkingLot._unpark);

        else {
            if (data.includes('registration_numbers_for_cars_with_colour')) {
                parkingLot.searchForRegNumbers = true
            }
            let inst = data.split(' ');
            parkingLot.aggreagator(inst[inst.length - 1], parkingLot._searchCars);
        }

    }
});