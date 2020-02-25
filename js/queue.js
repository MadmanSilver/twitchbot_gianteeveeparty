const fs = require('fs');
const readline = require('n-readlines');

var limit = 20; //Max number of requests
var rList = new Array(limit); //Request list
var cList = new Array(limit); //Completed list
var dList = new Array(limit); //Deleted list
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
    
            rList[i] = new Array(2);
            rList[i][0] = uname;
            rList[i][1] = req;
            i++;
        }
    },
    
    slots: function() {
        //Returns the number of slots left
        return limit - this.getLength('r');
    },
    
    setLimit: function(lim) {
        //Sets the request limit
        limit = lim;
    },
    
    markDone: function() {
        //Marks current request as done
        let len = this.getLength('c');
        cList[len] = new Array(2);
        cList[len][0] = rList[0][0];
        cList[len][1] = rList[0][1];
    },
    
    markDone: function(user) {
        //Marks specific request as done by username
        let len = this.getLength('c');
        cList[len] = new Array(2);
        for (let i = 0; i < len; i++) {
            if (rList[i][0] == user)
                break;
        }
        cList[len][0] = rList[i][0];
        cList[len][1] = rList[i][1];
    },
    
    next: function() {
        //Skips to next item in the queue
    },
    
    prev: function() {
        //Skips to previous item in the queue
    },
    
    jump: function(user) {
        //Jumps to a specific request in the queue by username
    },
    
    addRequest: function(user, req) {
        //Adds request to queue
    },
    
    removeRequest: function() {
        //Removes current request from queue
        let len = this.getLength('d');
        dList[len] = new Array(2);
        dList[len][0] = rList[0][0];
        dList[len][1] = rList[0][1];
    },
    
    removeRequest: function(user) {
        //Removes request from queue by username
    },
    
    editRequest: function(user, req) {
        //Changes request by username
    },
    
    getPlace: function(user) {
        //Get's a requests place in the queue by username
    },
    
    getValue: function(place, value) {
        //Get's a specific value (uname or req) by place
        return rList[place][value];
    },
    
    getLength: function(list) {
        //Get's a list's length
        let length = 0;
        if (list === 'r') {
            while (rList[length] != null)
                length++;
            return length;
        } else if (list === 'd') {
            while (dList[length] != null)
                length++;
            return length;
        } else if (list === 'c') {
            while (cList[length] != null)
                length++;
            return length;
        } else {
            return -1;
        }
    }
};