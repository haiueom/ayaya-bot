const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const { getJsFiles } = require('./utils/getJsFiles');

const commands = [];
const jsFiles = getJsFiles();
jsFiles.forEach((file) => {
	const command = require(`./${file}`);
	commands.push(command.data.toJSON());
});

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(
			`[✓] Started refreshing ${commands.length} application (/) commands.`,
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{
				body: commands,
			},
		);

		console.log(
			`[✓] Successfully reloaded ${data.length} application (/) commands.`,
		);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
