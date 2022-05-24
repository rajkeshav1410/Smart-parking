/*
 * This code act as a virtual sensor, generating random potential difference and
 * button state data. Also, the data is generated at random timings to depict a
 * actual sensor. This code is executed by a worker thread otherthan the node thread.
 */
const { parentPort } = require('worker_threads');

var data = {
    "ir1": 0,
    "ir2": 0,
    "ir3": 0,
    "ir4": 0,
    "gate": 0
};
const sleep = async function() {
    return new Promise(resolve => {
        setTimeout(resolve, Math.floor(Math.random() * 8000) + 100);
    });
};
(async() => {
    while (true) {
        await sleep();
        data.ir1 = Math.round(Math.random());
        data.ir2 = Math.round(Math.random());
        data.ir3 = Math.round(Math.random());
        data.ir4 = Math.round(Math.random());
        data.gate = Math.round(Math.random());
        parentPort.postMessage(data);
    }
})();