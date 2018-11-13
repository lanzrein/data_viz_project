/**
 * this function returns an Object with the information about
 * the task to be fed in the Task class
 * @param {Number} time_needed Duration in seconds or ticks it takes to 'carry out' the task.
 * @param {Number} how_often how often the task needs to be carried out every day
 * @param {String} name name of the task
 * @returns Object
 */
function makeTask(time_needed, how_often, name) {
    return {
        amount_of_time: time_needed,
        executions_per_day: how_often,
        type: name
    }
}



/**
 * clamps a value between a maximum and a minimum
 * @param {Number} val the value
 * @param {Number} min floor clamp
 * @param {Number} max ceil clamp
 * @returns the clamped value
 */
function clamp(val, min, max) {
    return Math.min(Math.max(min, val), max);
}

function randomMinMAx() {
    return MINIMUM + Math.floor(Math.random() * MAXIMUM);
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * @param {Array} array
*/
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function sumArray(arr1, arr2){
    for(let i = 0; i < arr2.length; i++){
        if(arr1[i] === undefined || arr1[i] === null)arr1[i] = 0;
        arr1[i] += arr2[i]
    }
}
function timeUpdate() {
    // return (1 / frameRate()) * TIME_SCALE;
    return 1;
}


function WIDTH() {
    const info = document.getElementById('info-window');
    const w = info.getBoundingClientRect().width;
    return innerWidth - w;
  };

  function HEIGHT(){
    const footer = document.getElementById('footer');
    const h = footer.getBoundingClientRect().height;
    return innerHeight - h;
  }

function roundPrecision(value, precision) {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function saveRAWData(agents, id) {
    let json = {};
    agents.sort(function (a, b) {
        return a.ID - b.ID;
    });
    console.log(agents);
    for (const agent of agents) {
        json['AGENT_ID_' + agent.ID] = agent.data;
    }
    saveJSON(json, 'RAW_DATA_' + nf(id, 4) + '.json');
}

function modelTime() {
    return TS_FRACTION * TIME_SCALE;
}
/**
 * compute the linear regression of a line
 * @param {Array} y positions on the y axis
 * @param {Array} x positions on the x axis
 * @returns Object containing slope, intercept and r2
 */
function linearRegression(y, x) {
    let lr = {};
    let n = y.length;
    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_xx = 0;
    let sum_yy = 0;

    for (let i = 0; i < n; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i] * y[i]);
        sum_xx += (x[i] * x[i]);
        sum_yy += (y[i] * y[i]);
    }

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
    lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

    return lr;
}


/** This method compares two arrays ... taken from
https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript */
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
