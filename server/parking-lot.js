
const fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, '/functional_spec/fixtures/file_input.txt');

const standard_input = process.stdin;
// Set input character encoding.
standard_input.setEncoding('utf-8');

const executor = require('./utils/executor-util');


/**
 * Parking lot Class
 *
 * @class ParkingLot
 */
class ParkingLot {

    /**
     *Creates an instance of ParkingLot.
     * @memberof ParkingLot
     */
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
     * Creates the parking spaces.
     *
     * @param {*} arr --> bound parameter for the parking lot array.
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
     * Parks a car to the first available slot.
     *
     * @param {*} instruction --> park <car-details>
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
     * Remove the cark from parking lot.
     *
     * @param {*} instruction --> leave <slot_number>
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
     * Gets the current status for the parking lot.
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
     * @param {*} instruction --> <registration_numbers/slot_numbers for cars with color/registration_number>
     * @memberof ParkingLot
     */
    _searchCars(instruction) {
        let colouredSlots = [];
        let colouredRegNos = [];
        let found;
        [...this.arr.entries()].map((x) => {
            if (!this.searchForRegNumbers) {
                if (x[1].registration_number === instruction) {
                    console.log(x[0]);
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
            if (this.searchForRegNumbers) {
                if (x[1].color === instruction) {
                    colouredRegNos.push(x[1].registration_number);
                    found = true;
                }
            }

        });
        if (colouredSlots.length > 0) {
            found = true;
            // console.log(`slot_numbers_for_cars_with_colour ${instruction}`);
            console.log(colouredSlots.join(','));
        }
        if (colouredRegNos.length > 0) {
            found = true;
            console.log(colouredRegNos.join(','));
        }
        if (found == false) {
            console.log(`not found`);
        }
    }


    /**
     * Callback higher order function.
     *
     * @param {*} instruction --> any of the above instructions
     * @param {*} callback --> callback function 
     * @returns
     * @memberof ParkingLot
     */
    aggreagator(instruction, callback) {
        callback(instruction);
    }
}


let parkingLot = new ParkingLot();
//Asks use to switch between interactive/file read mode.
console.log("Please enter the following options for readModes(--file/default is interactive)")
standard_input.on('data', (data) => {
    // User input exit.
    if (data === 'exit\n') {
        // Program exit.
        console.log("User input complete, program exit.");
        process.exit();
    } else if (data === '--file\n') {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            if (err) throw err;
            console.log(data);
            let dataArray = data.split('\n');
            dataArray.forEach((res) => {
                executor(res, parkingLot);
            })
        });
    }
    else {
        executor(data, parkingLot);
    }
});

