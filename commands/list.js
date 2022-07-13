const Discord = require('discord.js');
require("dotenv").config();
const { MessageActionRow, MessageButton, Message, Client } = require('discord.js');

module.exports = {
    name: "list",
    description: "player list",

    /**
    *
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    async run (client, message, args) {
        linker = client.users.fetch(process.env.linker_id);
        var msg;    
        message.reply(`*Vui lòng đợi...*`).then((msge) => {msg = msge;})
        let channel = await client.channels.cache.get(process.env.console_channel.toString());
        channel.send(`list`).then(() => {
            const filter = m => (m.author.id == process.env.linker_id) && m.content.includes(` người chơi trực tuyến.`) && m.content.includes(` trong tối đa `) && m.content.includes(`Có `);
            channel.awaitMessages({filter, max:1, time:15000})
                .then(collected => {
                    content = collected.first().content;
                    let player = content.substring(content.lastIndexOf(`Có `)+`Có `.length, content.lastIndexOf(` trong tối đa `));
                    let max_player = content.substring(content.lastIndexOf(` trong tối đa `)+` trong tối đa `.length, content.lastIndexOf(` người chơi trực tuyến.`));
                    let firstpos = content.indexOf(`] `, content.lastIndexOf(` người chơi trực tuyến.`)+` người chơi trực tuyến.`.length+3)+`] `.length
                    let lastpos = (content.indexOf(`\n`,content.lastIndexOf(` người chơi trực tuyến.`)+` người chơi trực tuyến.`.length+3)!=-1)?(content.indexOf(`\n`,content.lastIndexOf(` người chơi trực tuyến.`)+` người chơi trực tuyến.`.length+3)):(content.indexOf(`\`\`\``,content.lastIndexOf(` người chơi trực tuyến.`)+` người chơi trực tuyến.`.length+3))
                    let list = content.substring(firstpos, lastpos);
                    msg.edit(`**Có ${(player.length <= 1 && player != "0") ? "0"+player : player}/${max_player} người chơi**${Number(player)!=0?`:\n${list}`:``}`)
                })
                .catch(() => {
                    msg.edit(`Không có dữ liệu hoặc đã có lỗi xảy ra. Vui lòng thử lại sau.`)
                })
        });
    }
}