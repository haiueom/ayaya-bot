const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
	EmbedBuilder,
} = require('discord.js');
const { request } = require('undici');

async function getQuote() {
	const { body } = await request('https://api.quotable.io/random');
	let data = await body.json();
	return (data = data.content.length >= 200 ? await getQuote() : data);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tes')
		.setDescription('Create a button'),

	async execute(interaction) {
		const data = await getQuote();
		const embed = new EmbedBuilder()
			.setColor('Random')
			.setTitle(data.content)
			.setDescription(data.author);
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('newQuote')
				.setLabel('New Quote')
				.setStyle(ButtonStyle.Primary)
				.setEmoji('🔄'),
		);
		await interaction.reply({
			embeds: [embed],
			components: [row],
		});

		const filter = (i) =>
			i.customId === 'newQuote' && i.user.id === interaction.user.id;

		const collector = interaction.channel.createMessageComponentCollector({
			filter,
		});

		collector.on('collect', async (i) => {
			await i.deferUpdate();
			await i.deleteReply();
			const newData = await getQuote();
			embed.setTitle(newData.content).setDescription(newData.author);
			await i.channel.send({ embeds: [embed], components: [row] });
		});

		// tambahkan event handler untuk event 'end'
		collector.on('end', (collected) => {
			// cek jika tombol tidak dikumpulkan sama sekali
			if (collected.size === 0) {
				interaction.editReply({
					content: 'Waktu habis. Tidak ada aksi yang diambil.',
					components: [],
				});
			}
		});
	},
};
