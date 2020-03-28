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
	channels: [ 'madmansilver' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	if(message.toLowerCase().includes('@gianteeveeparty')) {
        message = message.toLowerCase().replace("@gianteeveeparty", "");
        let other = message.substring(message.indexOf('@'), message.substring(message.indexOf('@')).indexOf(' '));
		if (message.toLowerCase().includes('hi') || message.toLowerCase().includes('heya') || message.toLowerCase().includes('hello') || message.toLowerCase().includes('hiya') || message.toLowerCase().includes('hey')) {
            client.say(channel, `@${tags.username} hello.`);
        }
        if ((message.toLowerCase().includes('place') || message.toLowerCase().includes('spot') || message.toLowerCase().includes('line') || message.toLowerCase().includes('queue')) && ((message.toLowerCase().includes('my') || message.toLowerCase().includes(' i ') || message.toLowerCase().includes('mah')))) {
            client.say(channel, `@${tags.username} your request is #` + queue.getPlace(tags.username) + ` in line.`);
        }
        if ((message.toLowerCase().includes('place') || message.toLowerCase().includes('spot') || message.toLowerCase().includes('line') || message.toLowerCase().includes('queue')) && (message.toLowerCase().includes('@')) && (tags.mod || channel.replace('#', '') == tags.username)) {
            client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request is #` + queue.getPlace(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1)) + ` in line.`);
        }
        if (message.toLowerCase().includes('init') && message.toLowerCase().includes('list') && (tags.mod || channel.replace('#', '') == tags.username)) {
            queue.initQueue();
            client.say(channel, `@${tags.username} the list is ready!`);
        }
        if (message.toLowerCase().includes('request') && message.toLowerCase().includes('i') && !(message.toLowerCase().includes('@')) && !(message.toLowerCase().includes('edit'))) {
            if (queue.slots() > 0) {
                queue.addRequest(tags.username, message.substring(message.indexOf('request')).substring(message.substring(message.indexOf('request')).indexOf(' ') + 1));
                client.say(channel, `@${tags.username} your request has been added!`);
            } else {
                client.say(channel, `@${tags.username} Sorry, the request queue is full!`);
            }
        }
        if (message.toLowerCase().includes('request') && message.toLowerCase().includes('@') && !(message.toLowerCase().includes('complete')) && !(message.toLowerCase().includes('edit')) && (tags.mod || channel.replace('#', '') == tags.username)) {
            if (queue.slots() > 0) {
                queue.addRequest(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1), message.substring(message.indexOf('request')).substring(message.substring(message.indexOf('request')).indexOf(' ') + 1));
                client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request has been added!`);
            } else {
                client.say(channel, `@${tags.username} Sorry, the request queue is full!`);
            }
        }
        if (message.toLowerCase().includes('show') && message.toLowerCase().includes('current')) {
            client.say(channel, `The current request is: ` + queue.getValue(0, 0, 'r') + ` - ` + queue.getValue(0, 1, 'r'));
        }
        if (message.toLowerCase().includes('show') && message.toLowerCase().includes('rlist') && (tags.mod || channel.replace('#', '') == tags.username)) {
            client.say(channel, `The list is as follows:`);

            for (let i = 0; i < queue.getLength('r'); i++) {
                client.say(channel, queue.getValue(i, 0, 'r') + ` - ` + queue.getValue(i, 1, 'r'));
            }
        }
        if (message.toLowerCase().includes('show') && message.toLowerCase().includes('clist') && (tags.mod || channel.replace('#', '') == tags.username)) {
            client.say(channel, `The clist is as follows:`);

            for (let i = 0; i < queue.getLength('c'); i++) {
                client.say(channel, queue.getValue(i, 0, 'c') + ` - ` + queue.getValue(i, 1, 'c'));
            }
        }
        if (message.toLowerCase().includes('show') && message.toLowerCase().includes('dlist') && (tags.mod || channel.replace('#', '') == tags.username)) {
            client.say(channel, `The dlist is as follows:`);

            for (let i = 0; i < queue.getLength('d'); i++) {
                client.say(channel, queue.getValue(i, 0, 'd') + ` - ` + queue.getValue(i, 1, 'd'));
            }
        }
        if (message.toLowerCase().includes('complete') && message.toLowerCase().includes('request') && message.toLowerCase().includes('@') && (tags.mod || channel.replace('#', '') == tags.username)) {
            queue.markDoneU(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1));
            client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request has been marked as completed!`);
        } else if (message.toLowerCase().includes('complete') && message.toLowerCase().includes('request') && (tags.mod || channel.replace('#', '') == tags.username)) {
            client.say(channel, `The current request has been marked as finished!`);
            queue.markDone();
        }
        if (message.toLowerCase().includes('delete') && message.toLowerCase().includes('request') && message.toLowerCase().includes('@') && (tags.mod || channel.replace('#', '') == tags.username)) {
            queue.removeRequestU(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1));
            client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request has been deleted!`);
        } else if (message.toLowerCase().includes('delete') && message.toLowerCase().includes('request') && !(message.toLowerCase().includes('@')) && (tags.mod || channel.replace('#', '') == tags.username)) {
            client.say(channel, `The current request has been deleted!`);
            queue.removeRequest();
        }
        if (message.toLowerCase().includes('edit') && message.toLowerCase().includes('request') && message.toLowerCase().includes('my')) {
            queue.editRequest(tags.username, message.substring(message.indexOf('request')).substring(message.substring(message.indexOf('request')).indexOf(' ') + 1));
            client.say(channel, `@${tags.username}, your request has been edited!`);
        } else if (message.toLowerCase().includes('edit') && message.toLowerCase().includes('request') && message.toLowerCase().includes('@') && (tags.mod || channel.replace('#', '') == tags.username)) {
            queue.editRequest(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1), message.substring(message.indexOf('request')).substring(message.substring(message.indexOf('request')).indexOf(' ') + 1));
            client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request has been edited!`);
        }
        if (message.toLowerCase().includes('set') && message.toLowerCase().includes('limit') && (tags.mod || channel.replace('#', '') == tags.username)) {
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
        }
        if (!(message.toLowerCase().includes('set')) && message.toLowerCase().includes('limit')) {
            client.say(channel, `@${tags.username} the current limit is ${queue.getLimit()}!`);
        }
        if (message.toLowerCase().includes('slots') && message.toLowerCase().includes('left')) {
            client.say(channel, `@${tags.username} there are ${queue.slots()} remaining!`);
        }
        if (message.toLowerCase().includes('add') && message.toLowerCase().includes('slot') && (tags.mod || channel.replace('#', '') == tags.username)) {
            queue.setLimit(queue.getLimit() + 1);
            client.say(channel, `@${tags.username} I have added one more slot!`);
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