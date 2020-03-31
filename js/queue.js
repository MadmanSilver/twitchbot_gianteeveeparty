const fs = require('fs');
const readline = require('n-readlines');

var limit = 4; //Max number of requests
var rList = new Array(); //Request list
var cList = new Array(); //Completed list
var dList = new Array(); //Deleted list
var liner = new readline('../list.txt');

module.exports = {
    initQueue: function() {
        //Read list from file
        let line = "";
        let uname = "";
        let req = "";
        let i = 0;
        while (line = liner.next()) {
            line = line.toString();
            uname = line.substring(0, line.indexOf("/"));
            req = line.substring(line.indexOf("/") + 1, line.length);
    
            rList.push([uname, req]);
            i++;
        }
    },
    
    slots: function() {
        //Returns the number of slots left
        return limit - (rList.length + cList.length + dList.length);
    },
    
    getLimit: function() {
        //Gets the request limit
        return limit;
    },
    
    setLimit: function(lim) {
        //Sets the request limit
        limit = lim;
    },
    
    markDone: function() {
        //Marks current request as done
        let len = cList.length;
        cList[len] = new Array(2);
        cList[len][0] = rList[0][0];
        cList[len][1] = rList[0][1];
        console.log(cList[len][0] + ' - ' + cList[len][1]);
        rList.shift();
    },
    
    markDoneU: function(user) {
        //Marks specific request as done by username
        let len = cList.length;
        cList[len] = new Array(2);
        for (let i = 0; i < len; i++) {
            if (rList[i][0] == user) {
                cList[len][0] = rList[i][0];
                cList[len][1] = rList[i][1];
                rList.splice(i, 1);
                break;
            }
        }
    },
    
    skip: function() {
        //Skips the current item in the queue, placing it at the end
        let len = rList.length;
        rList.push(new Array(2));
        rList[len][0] = rList[0][0];
        rList[len][1] = rList[0][1];
        rList.shift();
    },
    
    addRequest: function(user, req) {
        //Adds request to queue
        let len = rList.length;
        if (len + dList.length + cList.length < limit) {
            rList[len] = new Array(2);
            rList[len][0] = user;
            rList[len][1] = req;
        }
    },
    
    removeRequest: function() {
        //Removes current request from queue
        let len = rList.length;
        dList[len] = new Array(2);
        dList[len][0] = rList[0][0];
        dList[len][1] = rList[0][1];
        rList.shift();
    },
    
    removeRequestU: function(user) {
        //Removes request from queue by username
        dList[len] = new Array(2);
        for (let i = 0; i < dList.length; i++) {
            if (rList[i][0] == user) {
                dList[len][0] = rList[i][0];
                dList[len][1] = rList[i][1];
                rList.splice(i, 1);
                break;
            }
        }
    },
    
    editRequest: function(user, req) {
        //Changes request by username
        for (let i = 0; i < rList.length; i++) {
            if (rList[i][0] == user) {
                rList[i][1] = req;
                break;
            }
        }
    },
    
    getPlace: function(user) {
        //Get's a requests place in the queue by username
        for (let i = 0; i < rList.length; i++) {
            if (rList[i][0] == user) {
                return i + 1;
            }
        }
        return -1;
    },
    
    getValue: function(place, value, list) {
        //Get's a specific value (uname or req) by place
        if (list === 'r')
            return rList[place][value];
        else if (list === 'c')
            return cList[place][value];
        else if (list === 'd')
            return dList[place][value];
        else
            return -1;
    },
    
    getLength: function(list) {
        //Get's a list's length
        if (list === 'r') {
            return rList.length;
        } else if (list === 'd') {
            return dList.length;
        } else if (list === 'c') {
            return cList.length;
        } else {
            return -1;
        }
    }
};