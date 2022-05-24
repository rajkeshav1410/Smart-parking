import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

var npark = 4;
var timeData = {};
var url = 'localhost:3';

var loadURL = function() {
    const firebaseConfig = {
        apiKey: "AIzaSyDr_W2TH9vNJG0XKANkfEkI0MZyxExMsug",
        authDomain: "iot-ssh.firebaseapp.com",
        databaseURL: "https://iot-ssh-default-rtdb.firebaseio.com",
        projectId: "iot-ssh",
        storageBucket: "iot-ssh.appspot.com",
        messagingSenderId: "249538182307",
        appId: "1:249538182307:web:033c3123275da03128d316",
        measurementId: "G-KGBCC432RD"
    };
    const app = initializeApp(firebaseConfig);

    const db = getDatabase(app);
    const dbRef = ref(getDatabase());
    get(child(dbRef, `link/ssh`)).then((snapshot) => {
        if (snapshot.exists()) {
            url = snapshot.val();
            var socket = io(url);
            socket.on('sensor', function(data) {
                parking(data);
                checkGate(data);
                // console.log(data);
            });
            console.log(url);
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

var getElapsedTime = function(start) {
    let timeDiff = new Date().getTime() - start.getTime();
    timeDiff = timeDiff / 1000;
    let seconds = Math.round(timeDiff % 60);
    timeDiff = Math.floor(timeDiff / 60);
    let minutes = timeDiff % 60;
    timeDiff = Math.floor(timeDiff / 60);
    let hours = timeDiff % 24;
    timeDiff = Math.floor(timeDiff / 24);
    hours = hours + timeDiff * 24;
    if (hours == 0) {
        if (minutes == 0)
            return seconds + "sec"
        return minutes + "min " + seconds + "sec";
    }
    return hours + "hr " + minutes + "min " + seconds + "sec";
};

var getTimer = function(start, elem) {
    return function() {
        elem.text(getElapsedTime(start));
    };
};

var checkGate = function(data) {
    try {
        var gateData = data.gate;
    } catch (e) {}

    if (gateData == 1) {
        $("#gate").text("OPEN");
        $("#gate").parent().removeClass("closed");
        $("#gate").parent().addClass("open");
    } else if (gateData == 0) {
        $("#gate").text("CLOSED");
        $("#gate").parent().removeClass("open");
        $("#gate").parent().addClass("closed");
    }
};

var parking = function(data) {
    var filled = 0;
    for (let i = 1; i <= npark; i++) {
        let irsensor = `ir${i}`

        try {
            var ir = data[irsensor];
        } catch (e) {}

        let park = $(`#park${i}`);
        let parkState = $(`#parkState${i}`);
        let entryTime = $(`#entryTime${i}`);
        let elapTime = $(`#elapTime${i}`);
        let timedata = timeData[irsensor];

        if (ir == 1 && timedata.entryTime == 0) {
            parkState.text("Occupied");
            park.removeClass("vacant");
            park.addClass("occupied");

            timedata.entryTime = new Date();
            entryTime.text(timedata.entryTime.toLocaleTimeString());
            timedata.elapTime = setInterval(
                getTimer(timedata.entryTime, elapTime),
                1000
            );
        } else if (ir == 0 && timedata.entryTime != 0) {
            parkState.text("Vacant");
            park.addClass("vacant");
            park.removeClass("occupied");

            clearInterval(timedata.elapTime);
            timedata.elapTime = 0;
            timedata.entryTime = 0;
            entryTime.text("");
            elapTime.text("");
        }
        filled += parseInt(ir);
    }
    $("#slot").text(npark - filled);
};

window.onload = function() {
    for (let i = 1; i <= npark; i++) {
        timeData[`ir${i}`] = {
            "entryTime": 0,
            "elapTime": 0
        };
    }
    loadURL();
};