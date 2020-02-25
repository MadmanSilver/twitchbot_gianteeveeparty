function addReq() {
    var tblBody = document.getElementById("tbody");
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    var cellText = document.createTextNode(document.getElementById("uname").value);
    var cell2 = document.createElement("td");
    var cellText2 = document.createTextNode(document.getElementById("request").value);

    cell.appendChild(cellText);
    row.appendChild(cell);
    cell2.appendChild(cellText2);
    row.appendChild(cell2);
    tblBody.appendChild(row);
}