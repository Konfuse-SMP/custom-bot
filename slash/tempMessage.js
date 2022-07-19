const Discord = require('discord.js')
const { MessageActionRow, MessageButton, Client, CommandInteraction } = require("discord.js");
module.exports = {
    name: "tempmessage",
    description: "Tự động xóa tin nhắn tiếp theo bạn sẽ gửi (trong kênh này) sau số giây quy định",
    options: [
        // https://discord-api-types.dev/api/discord-api-types-v10/enum/ApplicationCommandOptionType
        {
            name: "time",
            type: 4,
            description: "Số giây tin nhắn tiếp theo tồn tại",
            required: true
        }
    ],

    /**
    *
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {Object[]} option //{ name: 'id', type: 'INTEGER', value: 69 }
    */
    async run (client, interaction, option) {
        if (isNaN(Number(option[0].value)) || (Number(option[0].value)<3) || (Number(option[0].value)>3600)) {return interaction.reply({content:`Vui lòng nhập giá trị không nhỏ hơn 3 và không quá 3600`, ephemeral: true})}
        const time = option[0].value;
        await interaction.reply({content:`*Vui lòng gửi 1 tin nhắn bạn muốn xóa sau **${time}s***.\nTự động hủy sau 30s không nhận được tin nhắn.`, ephemeral: true})
        let filter = (e) => (e.author.id == interaction.user.id)
        interaction.channel.awaitMessages({filter, max:1, time:30000})
        .then((message) => {
            interaction.editReply({content: `**Tin nhắn của bạn sẽ được xóa sau ${time}s!**`, ephemeral: true})
            setTimeout(async () => {
                try {
                 const msg = await message.first().delete();
                    console.log(`Đã xóa tin nhắn ${msg.content} của ${msg.author.tag} theo ý của người đấy (${time}s)`)
                    interaction.editReply({content: `Đã xóa tin nhắn của bạn!`, ephemeral: true})
                }
                catch {
                    interaction.editReply({content: `Đã có lỗi xảy ra khi xóa của bạn!`, ephemeral: true})
                    console.error(error);
                };
            }, time*1000);
        })
        .catch(() => {
            interaction.editReply({content: `Bạn đã không gửi tin nhắn trong 30s trước đó trong kênh này`, ephemeral: true})
        })
    }
}