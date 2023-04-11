const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

async function getImg(type) {
	const { body } = await request(`https://api.waifu.pics/sfw/${type}`);
	return await body.json();
}

class Interact {
	constructor(interaction) {
		this.interaction = interaction;
		this.from = this.interaction.user;
		this.target = this.interaction.options.getUser('user');
		this.type = this.interaction.options.getSubcommand();
		this.footer = this.type.charAt(0).toUpperCase() + this.type.slice(1);

		this.verbs = {
			bite: 'bitten',
			hug: 'hugged',
			punch: 'punched',
		};

		this.embed = new EmbedBuilder()
			.setColor(0xefff00)
			.setTimestamp()
			.setFooter({ text: this.footer })
			.setDescription(
				`${this.target}, you're getting ${this.verbs[this.type]} by ${
					this.from
				}.`,
			);
	}

	async execute() {
		const data = await getImg(this.type);
		this.embed.setImage(data.url);
		return await this.interaction.reply({
			embeds: [this.embed],
		});
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('interact')
		.setDescription('Interact with people')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('bite')
				.setDescription('Bite someone')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('The user to bite')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('punch')
				.setDescription('Punch someone')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('The user to punch')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('hug')
				.setDescription('Hug someone')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('The user to hug')
						.setRequired(true),
				),
		),

	async execute(interaction) {
		const interact = new Interact(interaction);
		return interact.execute();
	},
};
