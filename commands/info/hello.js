const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Replies with hello!'),
	async execute(interaction) {
		const locales = {
			id: 'Halo!',
			sp: 'Hola!',
			fr: 'Bonjour!',
			de: 'Hallo!',
			ru: 'Привет!',
			ja: 'こんにちは！',
			zh: '你好！',
			ko: '안녕하세요!',
			pt: 'Olá!',
			tr: 'Merhaba!',
			ar: 'مرحبا!',
			it: 'Ciao!',
			pl: 'Cześć!',
			hi: 'नमस्ते!',
			he: 'שלום!',
			uk: 'Привіт!',
			ro: 'Salut!',
		};
		await interaction.reply(locales[interaction.locale] ?? 'Hello!');
	},
};
