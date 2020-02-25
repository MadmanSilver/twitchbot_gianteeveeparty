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
	channels: [ 'oakteaparty' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	if(message.toLowerCase().includes('@gianteeveeparty')) {
		if(message.toLowerCase().includes('hi') || message.toLowerCase().includes('heya') || message.toLowerCase().includes('hello') || message.toLowerCase().includes('hiya') || message.toLowerCase().includes('hey')) {
            client.say(channel, `@${tags.username} hello.`);
        }
        if((message.toLowerCase().includes('place') || message.toLowerCase().includes('spot') || message.toLowerCase().includes('line') || message.toLowerCase().includes('queue')) && (message.toLowerCase().includes('my') || message.toLowerCase().includes(' i ') || message.toLowerCase().includes('mah'))) {
            client.say(channel, `@${tags.username} your request is ` + getPlace(tags.username) + ` places away.`);
        }
        if (message.toLowerCase().includes('init') && message.toLowerCase().includes('list')) {
            queue.initQueue();
            client.say(channel, `@${tags.username} the list is ready!`);
        }
        if (message.toLowerCase().includes('show') && message.toLowerCase().includes('list')) {
            client.say(channel, `The list is as follows:`);

            for (let i = 0; i < queue.getLength('r'); i++) {
                client.say(channel, queue.getValue(i, 0) + ` - ` + queue.getValue(i, 1));
            }
        }
	}
    if(message.toLowerCase() === '*cuddles @gianteeveeparty*' || message.toLowerCase() === '*cuddles @gianteeveeparty *') {
        client.say(channel, `@${tags.username} I appreciate the cuddles.`);
    }
});