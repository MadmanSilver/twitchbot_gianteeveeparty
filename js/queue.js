const readline = require('n-readlines');
const fs = require('fs');

var limit = 20; //Max number of requests
var rList = new Array(); //Request list
var cList = new Array(); //Completed list
var dList = new Array(); //Deleted list

module.exports = {
    initQueue: function() {
        //Read list from file
        let line;
        let liner = new readline('../list.txt');
        rList = new Array();
        while (line = liner.next()) {
            line = line.toString();
            rList.push([line.substring(0, line.indexOf("/")), line.substring(line.indexOf("/") + 1, line.length)]);
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
        cList.push(rList.shift());
    },
    
    markDoneU: function(user) {
        //Marks specific request as done by username
        let len = rList.length;
        for (let i = 0; i < len; i++) {
            if (rList[i][0] == user) {
                cList.push(rList.splice(i, 1)[0]);
                break;
            }
        }
    },
    
    skip: function() {
        //Skips the current item in the queue, placing it at the end
        rList.push(rList.shift());
    },
    
    addRequest: function(user, req) {
        //Adds request to queue
        if (rList.length + dList.length + cList.length < limit) {
            rList.push([user, req]);
        }
    },
    
    removeRequest: function(user) {
        //Removes request from queue by username
        for (let i = 0; i < rList.length; i++) {
            if (rList[i][0] == user) {
                dList.push(rList.splice(i, 1)[0]);
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
    },

    hasReqd: function(user) {
        let i;

        for (i = 0; i < rList.length; i++) {
            if (rList[i][0] == user) {
                return 1;
            }
        }
        for (i = 0; i < cList.length; i++) {
            if (cList[i][0] == user) {
                return 1;
            }
        }
        return 0;
    },

    saveQueue: function() {
        let str = "";

        for (let i = 0; i < rList.length; i++) {
            str += rList[i][0] + '/' + rList[i][1] + '\n';
        }

        fs.writeFile('../list.txt', str, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    },

    recCom: function(msg) {
        let str = "";
        fs.readFile('../log.txt', (err, data) => {
            if (err) throw err;
            
            fs.writeFile('../log.txt', data + '\n' + msg, (err) => {
                if (err) throw err;
                console.log('The command has been saved!');
            });
        });
    }
};