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
        if ((message.toLowerCase().includes('place') || message.toLowerCase().includes('spot') || message.toLowerCase().includes('line') || message.toLowerCase().includes('queue')) && (message.toLowerCase().includes('my') || message.toLowerCase().includes(' i ') || message.toLowerCase().includes('mah'))) {
            client.say(channel, `@${tags.username} your request is ` + queue.getPlace(tags.username) + ` places away.`);
        }
        if (message.toLowerCase().includes('init') && message.toLowerCase().includes('list')) {
            queue.initQueue();
            client.say(channel, `@${tags.username} the list is ready!`);
        }
        if (message.toLowerCase().includes('request') && message.toLowerCase().includes('i') && !(message.toLowerCase().includes('@')) && !(message.toLowerCase().includes('edit'))) {
            queue.addRequest(tags.username, message.substring(message.indexOf('request')).substring(message.substring(message.indexOf('request')).indexOf(' ') + 1));
            client.say(channel, `@${tags.username} your request has been added!`);
        }
        if (message.toLowerCase().includes('request') && message.toLowerCase().includes('@') && !(message.toLowerCase().includes('complete')) && !(message.toLowerCase().includes('edit'))) {
            queue.addRequest(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1), message.substring(message.indexOf('request')).substring(message.substring(message.indexOf('request')).indexOf(' ') + 1));
            client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request has been added!`);
        }
        if (message.toLowerCase().includes('show') && message.toLowerCase().includes('rlist')) {
            client.say(channel, `The list is as follows:`);

            for (let i = 0; i < queue.getLength('r'); i++) {
                client.say(channel, queue.getValue(i, 0, 'r') + ` - ` + queue.getValue(i, 1, 'r'));
            }
        }
        if (message.toLowerCase().includes('show') && message.toLowerCase().includes('clist')) {
            client.say(channel, `The clist is as follows:`);

            for (let i = 0; i < queue.getLength('c'); i++) {
                console.log(queue.getValue(i, 0, 'c') + ' - ' + queue.getValue(i, 0, 'c'));
                client.say(channel, queue.getValue(i, 0, 'c') + ` - ` + queue.getValue(i, 1, 'c'));
            }
        }
        if (message.toLowerCase().includes('complete') && message.toLowerCase().includes('request') && message.toLowerCase().includes('@')) {
            queue.markDoneU(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1));
            client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request has been marked as completed!`);
        } else if (message.toLowerCase().includes('complete') && message.toLowerCase().includes('request')) {
            client.say(channel, `The current request has been marked as finished!`);
            queue.markDone();
        }
        if (message.toLowerCase().includes('edit') && message.toLowerCase().includes('request') && message.toLowerCase().includes('my')) {
            queue.editRequest(tags.username, message.substring(message.indexOf('request')).substring(message.substring(message.indexOf('request')).indexOf(' ') + 1));
            client.say(channel, `@${tags.username}, your request has been edited!`);
        } else if (message.toLowerCase().includes('edit') && message.toLowerCase().includes('request') && message.toLowerCase().includes('@')) {
            queue.editRequest(message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1), message.substring(message.indexOf('request')).substring(message.substring(message.indexOf('request')).indexOf(' ') + 1));
            client.say(channel, `@` + message.substring(message.indexOf('@') + 1, message.substring(message.indexOf('@')).indexOf(' ') + 1) + `'s request has been edited!`);
        }
	}
    if (message.toLowerCase() === '*cuddles @gianteeveeparty*' || message.toLowerCase() === '*cuddles @gianteeveeparty *') {
        client.say(channel, `@${tags.username} I appreciate the cuddles.`);
    }
    if (message.toLowerCase().includes('konami code') || message.toLowerCase().includes('upupdowndownleftrightabstart')) {
        client.say(channel, `:eyes:`);
    }
    if (message.toLowerCase().includes('@gianteeveeparty') && message.toLowerCase().includes('upupdowndownleftrightabstart')) {
        client.say(channel, `RIP Kazuhisa Hashimoto`);
    }
});