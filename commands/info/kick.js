const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Select a member and kick them (but not really).')
		.addUserOption((option) =>
			option.setName('target').setDescription('The member to kick'),
		)
		.setDefaultMemberPermissions('0'),
	async execute(interaction) {
		if (!interaction.member.permissions.has('KICK_MEMBERS')) {
			return interaction.reply({
				content: 'You do not have permission to use this command.',
				ephemeral: true,
			});
		}
		const member = interaction.options.getMember('target');
		return interaction.reply({
			content: `You wanted to kick: ${member.user.username}`,
			ephemeral: true,
		});
	},
};
