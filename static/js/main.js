var stationObj;

function moveListBox(sourceID, destID, moveAll = false) {
    var src = document.getElementById(sourceID);
    var dest = document.getElementById(destID);
    for (var count = 0; count < src.options.length; count++) {
        if ((src.options[count].selected == true) || (moveAll == true)) {
            var option = src.options[count];
            var newOption = option.cloneNode(true);
            dest.appendChild(newOption);
            src.removeChild(option);
            count--;
        }
    }
    renderTable();
}

function renderTable() {

    var stationTbody = document.getElementById('station_tbody');
    var newTbody = document.createElement('tbody');
    newTbody.id = 'station_tbody';
    stationTbody.parentNode.replaceChild(newTbody, stationTbody);

    var listBox = document.getElementById("righthand_listbox");
    for (var i = 0; i < listBox.options.length; i++) {
        var row = newTbody.insertRow(i);
        var stId = listBox.options[i].value;
        row.insertCell(0).innerHTML = stId;
        row.insertCell(1).innerHTML = stationObj[stId]['station_name'];
        row.insertCell(2).innerHTML = stationObj[stId]['s_lat'];
        row.insertCell(3).innerHTML = stationObj[stId]['s_lon'];
    }
}

function loadStations() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/stations", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
        if ((this.readyState == 4) && (this.status == 200)) {
            stationObj = JSON.parse(this.responseText);
            for (var stId in stationObj) {
                var stName = stationObj[stId]["station_name"];
                var listBox = document.getElementById("lefthand_listbox");
                var optionElm = document.createElement("option");
                optionElm.value = stId;
                optionElm.text = stName;
                listBox.appendChild(optionElm);
            }
        }
    };
    xhttp.send();
}

function showMap() {
    var stationTbody = document.getElementById('station_tbody');
    var num_row = stationTbody.rows.length;
    if (num_row != 0) {
        var lastRow = stationTbody.rows[num_row - 1];
        var stId = lastRow.cells[0].innerText;
        var stName = lastRow.cells[1].innerText;
        var sLat = lastRow.cells[2].innerText;
        var sLon = lastRow.cells[3].innerText;

        var iframeElm = document.createElement("iframe");
        iframeElm.src = "https://maps.google.com/maps?q=" + sLat + ", " + sLon + "&z=15&output=embed"
        iframeElm.width = "450";
        iframeElm.height = "270";
        iframeElm.frameborder = "0";
        
        var oldIframe = document.getElementById('iframeMap');
        if( oldIframe) oldIframe.parentNode.removeChild(oldIframe);
        iframeElm.id = "iframeMap";
        document.getElementById("map").appendChild(iframeElm);
    }
}

window.addEventListener("load", function () {
    loadStations()

    document.getElementById("move_left_btn").addEventListener("click", function () {
        moveListBox('righthand_listbox', 'lefthand_listbox');
    });
    document.getElementById("move_right_btn").addEventListener("click", function () {
        moveListBox('lefthand_listbox', 'righthand_listbox');
    });
    document.getElementById("move_all_left_btn").addEventListener("click", function () {
        moveListBox('righthand_listbox', 'lefthand_listbox', true);
    });
    document.getElementById("move_all_right_btn").addEventListener("click", function () {
        moveListBox('lefthand_listbox', 'righthand_listbox', true);
    });
    document.getElementById("show_staion_btn").addEventListener("click", function () {
        showMap();
    });
});