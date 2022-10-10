let dimentionsContainer = document.getElementById("dimentionsContainer");

if (document.cookie !== "") {
    if ((noRecordsInfo = document.getElementById("noRecordsInfo"))) {
        noRecordsInfo.remove();
    }
    let cookies = document.cookie.replace(/ /g, "").split(/[;]/);
    let map = new Map();

    cookies.forEach((cookie) => {
        let dimention = cookie.split("=");
        let times = dimention[1].split(",");
        map.set(dimention[0], times);
    });

    Array.from(map).forEach((dimentionAndRecords) => {
        let div = document.createElement("div");
        div.classList.add("dimention");
        let p = document.createElement("p");
        p.innerText = dimentionAndRecords[0];
        let ol = document.createElement("ol");
        dimentionAndRecords[1].sort((a, b) => {
            let splitted_a = a.split("~");
            let splitted_b = b.split("~");
            if (parseInt(splitted_a[1]) > parseInt(splitted_b[1])) {
                return 1;
            } else {
                return -1;
            }
        });
        for (let i = 0; i < 10; i++) {
            if (i < dimentionAndRecords[1].length) {
                let record = dimentionAndRecords[1][i].split("~");
                let li = document.createElement("li");

                let miliseconds = parseInt(record[1]) % 1000;
                let milisecondsString = miliseconds;
                if (miliseconds < 100 && miliseconds > 10) {
                    milisecondsString = "00" + miliseconds;
                } else if (miliseconds < 10) {
                    milisecondsString = "00" + miliseconds;
                }
                let seconds = Math.floor(parseInt(record[1]) / 1000);
                let minutes = Math.floor(seconds / 60);
                seconds = seconds % 60;
                minutes = minutes % 60;

                li.innerText =
                    record[0] +
                    " " +
                    minutes +
                    ":" +
                    (seconds < 10 ? "0" : "") +
                    seconds +
                    ":" +
                    milisecondsString;
                ol.appendChild(li);
            } else {
                break;
            }
        }
        div.appendChild(p);
        div.appendChild(ol);
        dimentionsContainer.appendChild(div);
    });
} else {
    let info = document.createElement("p");
    info.setAttribute("id", "noRecordsInfo");
    info.innerText = "No records";
    dimentionsContainer.appendChild(info);
}
