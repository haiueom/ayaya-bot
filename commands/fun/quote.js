/* eslint-disable no-unused-vars */
const { request } = require('undici');
const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
	EmbedBuilder,
} = require('discord.js');

async function getQuoteGeneral() {
	const { body } = await request('https://api.quotable.io/random');
	let data = await body.json();
	return (data = data.content.length > 200 ? await getQuoteGeneral() : data);
}

async function getQuoteAnime() {
	const { body } = await request('https://animechan.vercel.app/api/random');
	let data = await body.json();
	return (data = data.quote.length > 200 ? await getQuoteAnime() : data);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Get a random quote from the internet.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('general')
				.setDescription('Get a random general quote from the internet.'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('anime')
				.setDescription('Get a random anime quote from the internet.'),
		),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		const subcommand = interaction.options.getSubcommand();

		const embed = new EmbedBuilder().setColor(0xefff00);
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel('New Quote')
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('🔄'),
		);

		if (subcommand === 'general') {
			const data = await getQuoteGeneral();
			embed.setTitle(data.content).setDescription(`~ ${data.author}`);
			row.components[0].setCustomId('qgb');
		}
		if (subcommand === 'anime') {
			let data = await getQuoteAnime();
			row.components[0].setCustomId('qab');
			embed
				.setTitle(data.quote)
				.setDescription(`~ ${data.character} from ${data.anime}`);
		}

		await interaction.reply({
			embeds: [embed],
			components: [row],
		});

		const filter1 = (i) =>
			i.customId === 'qgb' && i.user.id === interaction.user.id;

		const collector1 = interaction.channel.createMessageComponentCollector({
			filter: filter1,
		});

		collector1.on('collect', async (i) => {
			await i.deferUpdate();
			await i.deleteReply();
			const newData = await getQuoteGeneral();
			embed
				.setTitle(newData.content)
				.setDescription(`~ ${newData.author}`);
			row.components[0].setCustomId('qgb');
			await i.channel.send({ embeds: [embed], components: [row] });
		});

		const filter2 = (i) =>
			i.customId === 'qab' && i.user.id === interaction.user.id;
		const collector2 = interaction.channel.createMessageComponentCollector({
			filter: filter2,
		});

		collector2.on('collect', async (i) => {
			await i.deferUpdate();
			await i.deleteReply();
			const newData = await getQuoteAnime();
			embed
				.setTitle(newData.quote)
				.setDescription(`~ ${newData.character} from ${newData.anime}`);
			row.components[0].setCustomId('qab');
			await i.channel.send({ embeds: [embed], components: [row] });
		});
	},
};
