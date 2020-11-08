const tmi = require('tmi.js');
const queue = require("./queue.js");

const client = new tmi.Client({
	options: { debug: true },
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: 'gianteeveeparty',
		password: 'oauth:5esvvxh80joqr8u0mamkioxjdyelpn'
	},
	channels: [ 'madmansilver', 'oakteaparty' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
    if(self) return;

	if(message.toLowerCase().includes('@gianteeveeparty')) {
        message = message.toLowerCase().replace("@gianteeveeparty", "");
        queue.recCom(message);
        if (message.toLowerCase().includes('help')) {
            client.say(channel, `@${tags.username} Hello! I'm Giant Eevee! I manage requests on community day! Just get my attention with @GiantEeveeParty and tell me what you want! For example, '@GiantEeveeParty I request oak & eevee hugs' would tell me to add your request 'oak & eevee hugs' to the queue. I can also tell your place in the queue, edit your request, tell the current request, and give you cuddles! Please keep commands simple as I'm still learning.`);
        }
		if (message.toLowerCase().includes(' hi ') || message.toLowerCase().includes('heya') || message.toLowerCase().includes('hello') || message.toLowerCase().includes('hiya') || message.toLowerCase().includes('hey')) {
            client.say(channel, `@${tags.username} hello.`);
        }
        if ((message.toLowerCase().includes('place') || message.toLowerCase().includes('spot') || message.toLowerCase().includes('line') || message.toLowerCase().includes('queue')) && ((message.toLowerCase().includes('my') || message.toLowerCase().includes(' i ') || message.toLowerCase().includes('mah')))) {
            client.say(channel, `@${tags.username} your request is #` + queue.getPlace(tags.username) + ` in line.`);
        }
        if ((message.toLowerCase().includes('place') || message.toLowerCase().includes('spot') || message.toLowerCase().includes('line') || message.toLowerCase().includes('queue')) && (message.toLowerCase().includes('@')) && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request is #` + queue.getPlace(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1)) + ` in line.`);
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        }
        if (message.toLowerCase().includes('init') && message.toLowerCase().includes('list') && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                queue.initQueue();
                client.say(channel, `@${tags.username} the list is ready!`);
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        }
        if (message.toLowerCase().includes('request') && message.toLowerCase().includes('i') && !(message.toLowerCase().includes('@')) && !(message.toLowerCase().includes('delete')) && !(message.toLowerCase().includes('edit'))) {
            if ((queue.slots() > 0 || tags.subscriber || tags.badges.vip) && !(queue.hasReqd(tags.username))) {
                queue.addRequest(tags.username, message.substring(message.indexOf('request')).substring(message.substring(message.indexOf('request')).indexOf(' ') + 1));
                client.say(channel, `@${tags.username} your request has been added! (@oakteaparty)`);
            } else if (!(queue.hasReqd(tags.username))) {
                client.say(channel, `@${tags.username} Sorry, the request queue is full. Subscribers can request even when the queue is full!`);
            } else {
                client.say(channel, `@${tags.username} Sorry, you have already submitted a request! If you would like to change it, just say '@GiantEeveeParty edit my request ____'.`);
            }
        }
        if (message.toLowerCase().includes('request') && message.toLowerCase().includes('@') && !(message.toLowerCase().includes('complete')) && !(message.toLowerCase().includes('delete')) && !(message.toLowerCase().includes('edit')) && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                queue.addRequest(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1), message.substring(message.indexOf('request')).substring(message.substring(message.indexOf('request')).indexOf(' ') + 1));
                client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request has been added! (@oakteaparty)`);
            } else {
                client.say(channel, `@${tags.username} you do not have permission to add requests for others.`);
            }
        }
        if (message.toLowerCase().includes('complete') && message.toLowerCase().includes('request') && message.toLowerCase().includes('@') && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                queue.markDoneU(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1));
                client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request has been marked as completed!`);
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        } else if (message.toLowerCase().includes('complete') && message.toLowerCase().includes('request') && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                client.say(channel, `The current request has been marked as finished!`);
                queue.markDone();
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        }
        if (message.toLowerCase().includes('show') && message.toLowerCase().includes('current')) {
            client.say(channel, `The current request is: ` + queue.getValue(0, 0, 'r') + ` - ` + queue.getValue(0, 1, 'r'));
        }
        if (message.toLowerCase().includes('show') && message.toLowerCase().includes('rlist') && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                client.say(channel, `The list is as follows:`);
    
                for (let i = 0; i < queue.getLength('r'); i++) {
                    client.say(channel, queue.getValue(i, 0, 'r') + ` - ` + queue.getValue(i, 1, 'r'));
                }
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        }
        if (message.toLowerCase().includes('show') && message.toLowerCase().includes('clist') && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                client.say(channel, `The clist is as follows:`);
    
                for (let i = 0; i < queue.getLength('c'); i++) {
                    client.say(channel, queue.getValue(i, 0, 'c') + ` - ` + queue.getValue(i, 1, 'c'));
                }
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        }
        if (message.toLowerCase().includes('show') && message.toLowerCase().includes('dlist') && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                client.say(channel, `The dlist is as follows:`);
    
                for (let i = 0; i < queue.getLength('d'); i++) {
                    client.say(channel, queue.getValue(i, 0, 'd') + ` - ` + queue.getValue(i, 1, 'd'));
                }
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        }
        if (message.toLowerCase().includes('delete') && message.toLowerCase().includes('request') && message.toLowerCase().includes('@') && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                queue.removeRequest(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1));
                client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request has been deleted!`);
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        } else if (message.toLowerCase().includes('delete') && message.toLowerCase().includes('request') && !(message.toLowerCase().includes('@')) && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                queue.removeRequest(tags.username);
                client.say(channel, `The current request has been deleted!`);
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        }
        if (message.toLowerCase().includes('edit') && message.toLowerCase().includes('request') && message.toLowerCase().includes('my')) {
            queue.editRequest(tags.username, message.substring(message.indexOf('request')).substring(message.substring(message.indexOf('request')).indexOf(' ') + 1));
            client.say(channel, `@${tags.username}, your request has been edited!`);
        } else if (message.toLowerCase().includes('edit') && message.toLowerCase().includes('request') && message.toLowerCase().includes('@') && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                queue.editRequest(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1), message.substring(message.indexOf('request')).substring(message.substring(message.indexOf('request')).indexOf(' ') + 1));
                client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request has been edited!`);
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        }
        if (message.toLowerCase().includes('set') && message.toLowerCase().includes('limit') && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                for (var i = 0; i < message.length; i++) {
                    if (message.charAt(i) >= '0' && message.charAt(i) <= '9') {
                        queue.setLimit(parseInt(message.substring(message.indexOf(message.charAt(i)))));
                        break;
                    }
                }
                if (i != message.length) {
                    client.say(channel, `@${tags.username} the limit has been set to ${queue.getLimit()}!`);
                } else {
                    client.say(channel, `@${tags.username} did you forget to put a number in that message?`);
                }
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        }
        if (!(message.toLowerCase().includes('set')) && message.toLowerCase().includes('limit')) {
            client.say(channel, `@${tags.username} the current limit is ${queue.getLimit()}!`);
        }
        if (message.toLowerCase().includes('slots') && message.toLowerCase().includes('left')) {
            client.say(channel, `@${tags.username} there are ${queue.slots()} slots remaining!`);
        }
        if (message.toLowerCase().includes('add') && message.toLowerCase().includes('slot') && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                queue.setLimit(queue.getLimit() + 1);
                client.say(channel, `@${tags.username} I have added one more slot!`);
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        }
        if (message.toLowerCase().includes('skip') && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                queue.skip();
                client.say(channel, `@${tags.username} I have moved the current request to the end.`);
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        }
        if (message.toLowerCase().includes('save') && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (tags.mod || channel.replace('#', '') == tags.username) {
                queue.saveQueue();
                client.say(channel, `@${tags.username} I have saved the queue.`);
            } else {
                client.say(channel, `@${tags.username} you do not have permission to use this command.`);
            }
        }
	}
    if (message.toLowerCase() === '*cuddles*') {
        client.say(channel, `@${tags.username} I appreciate the cuddles.`);
    }
    if (message.toLowerCase().includes('konami code') || message.toLowerCase().includes('upupdowndownleftrightabstart')) {
        client.say(channel, `:eyes:`);
    }
    if (message.toLowerCase().includes('@gianteeveeparty') && message.toLowerCase().includes('upupdowndownleftrightabstart')) {
        client.say(channel, `RIP Kazuhisa Hashimoto`);
    }
});

var myInt = setInterval(function () {
    queue.saveQueue();
    if (queue.slots() > 0) {
        client.say('oakteaparty', `Hey everyone! It's community day which means Oak is taking drawing requests! If you would like Oak to draw you something, just type '@GiantEeveeParty I request ____' and fill in the blank or ask me for help if you need anything else. There are ${queue.slots()} spot(s) left.`);
    }
}, 60000 * 15);