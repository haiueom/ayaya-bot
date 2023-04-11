const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;
const keepAlive = require('./server');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const { getJsFiles } = require('./utils/getJsFiles');

const jsFiles = getJsFiles();
for (const file of jsFiles) {
	const command = require(`./${file}`);
	client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

keepAlive();
client.login(token);
