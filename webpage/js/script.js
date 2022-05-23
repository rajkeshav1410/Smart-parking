var npark = 4;
var timeData = {};
var url = 'https://rajkeshav1410.github.io/Smart-parking/';

var parking = function(data) {
    var filled = 0;
    for (i = 1; i <= npark; i++) {
        irsensor = `ir${i}`

        try {
            var ir = data[irsensor];
        } catch (e) {}

        park = $(`#park${i}`);
        parkState = $(`#parkState${i}`);
        entryTime = $(`#entryTime${i}`);
        elapTime = $(`#elapTime${i}`);
        timedata = timeData[irsensor];

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

getTimer = function(start, elem) {
    return function() {
        elem.text(getElapsedTime(start));
    };
};

getElapsedTime = function(start) {
    timeDiff = new Date().getTime() - start.getTime();
    timeDiff = timeDiff / 1000;
    seconds = Math.round(timeDiff % 60);
    timeDiff = Math.floor(timeDiff / 60);
    minutes = timeDiff % 60;
    timeDiff = Math.floor(timeDiff / 60);
    hours = timeDiff % 24;
    timeDiff = Math.floor(timeDiff / 24);
    hours = hours + timeDiff * 24;
    if (hours == 0) {
        if (minutes == 0)
            return seconds + "sec"
        return minutes + "min " + seconds + "sec";
    }
    return hours + "hr " + minutes + "min " + seconds + "sec";
};

checkGate = function(data) {
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

var socket = io(url);

socket.on('sensor', function(data) {
    parking(data);
    checkGate(data);
    // console.log(data);
});

window.onload = function() {
    for (i = 1; i <= npark; i++) {
        timeData[`ir${i}`] = {
            "entryTime": 0,
            "elapTime": 0
        };
    }
};