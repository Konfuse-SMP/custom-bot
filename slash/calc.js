const Discord = require('discord.js');
const fs = require('fs')
const { MessageActionRow, MessageButton, Message, Client } = require('discord.js');
const math = require('advanced-calculator');
const config = JSON.parse(fs.readFileSync("./config.json"));
module.exports = {
    name: "calc",
    description: "Tính phép toán",
    options: [
        // https://discord-api-types.dev/api/discord-api-types-v10/enum/ApplicationCommandOptionType
        {
            name: "data",
            type: 3,
            description: "Phép toán (Có các phép tính sin, cos, tan, ln, log, sqrt, +, -, *, /, %, ^, max, min)",
            required: true,
        }
    ],

    /**
    *
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {Object[]} option //{ name: 'id', type: 'INTEGER', value: 69 }
    */
    async run (client, interaction, option) {
        await interaction.reply("*Đang tính...*")
        try {
            var kq = math.evaluate(option[0].value);
        } catch {
            return interaction.editReply(`Đã xảy ra lỗi khi tính toán. Kiểm tra lại cú pháp phép tính.`)
        }
        try {
            return interaction.editReply(`\`${option[0].value}\` = **${kq}**`);
        } catch {
            return interaction.editReply(`Kết quả : **${kq}**`)
        }
    }
}