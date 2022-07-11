const { MessageEmbed } = require('discord.js')
const fs = require('fs');
const dir = './commands';
const slashdir = '../slash';
const config = require('../config.json')
const package = require('../package.json')
const os = require('os');
const totalRAM = os.totalmem();

module.exports = {
    name: "info",
    description: "bot info",

    async run(client, message, args) {
    

    fs.readdir(dir, (err, files) => {
        var cmdcount = files.length;

        fs.readdir(slashdir, (err, files) => {
          var slscount = files.length;

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor({
        name: `Thông tin về ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        {
          name: 'Tên đầy đủ',
          value: client.user.tag,
          inline: true
        },
        {
          name: "Prefix",
          value: config.prefix,
          inline: true 
        },
        {
          name: 'Lần khởi động gần nhất',
          value: `${(Math.round(process.uptime().toFixed(2) / 3600 * 1000)/1000).toString()}h trước`,
          inline: true 
        },
        {
          name: 'Phiên bản',
          value: package.version,
          inline: true 
        },
        {
          name: 'Số kênh Bot phục vụ',
          value: client.channels.cache.size.toString(),
          inline: true
        },
        {
            name: 'Số lệnh chữ',
            value: cmdcount.toString(),
            inline: true 
        },
        {
          name: 'Số lệnh Slash',
          value: slscount.toString(),
          inline: true 
        },
        {
            name: 'Người tạo ra',
            value: "<@384282911479693313>",
            inline: true  
        },
        {
            name: 'Hệ điều hành',
            value: os.platform(),
            inline: true  
        },
        {
            name: 'Bộ nhớ RAM',
            value: `${(Math.round(totalRAM / 1024 / 1024 / 1024 * 100) / 100).toString()} GB`,
            inline: true 
        },
        {
            name: 'Máy hoạt động được',
            value: `${(Math.round(os.uptime() / 3600 * 1000)/1000).toString()}h`,
            inline: true  
        },
      )
      .setTimestamp()
      .setFooter({text: `Cảm ơn MiniHamster đã hỗ trợ duy trì bot luôn online!`})
      message.reply({embeds : [embed]})
      })
    })
  }
}