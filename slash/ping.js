const Discord = require('discord.js')

module.exports = {
    name: "ping",
    description: "Kiểm tra Ping",

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    async run (client, interaction, args) {
        const ping = new Discord.MessageEmbed()
            .setTitle('**🏓 PING PONG! 🏓**')
            .setColor("RANDOM")
            .addFields(
                { name: 'Độ trễ của Bot', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true  },
                { name: 'Độ trễ của API', value: `${Math.round(client.ws.ping)}ms`, inline: true },
            )
            .setTimestamp()   
        interaction.reply({embeds : [ping], ephemeral: true});
    }
}