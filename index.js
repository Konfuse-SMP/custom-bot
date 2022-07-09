// This bot is using index.js of "Bot Thieu Nang", which its source code will be released later. Check it out in https://botthieunang.blogspot.com/

const Discord = require('discord.js');
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_VOICE_STATES"]});
const fs = require('fs');
module.exports = client;
const { readdirSync } = require('fs');
const { join } = require('path')
require('log-timestamp')(function() { return "[" + new Date().toLocaleString(`en-GB`,  { timeZone: 'Asia/Ho_Chi_Minh' }) + "] "});
require("dotenv").config();
const colors = require("colors");
const package = require('./package.json')
client.slash = new Discord.Collection()
client.commands = new Discord.Collection();
const { Routes } = require("discord-api-types/v9")
const { REST } = require("@discordjs/rest")

    console.log(colors.bold(colors.cyan('Preparing and Running...')));

    const jsonString = fs.readFileSync("./config.json");
    const config = JSON.parse(jsonString);

    const prefix = config.prefix; 

    const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));
    
    const cmdcount = fs.readdirSync('./commands').length;
    const slscount = fs.readdirSync('./slash').length;
    
    console.log(colors.bold(colors.yellow(`Starting load Commands...`)))
    var loaded = true; var count = 0;
    for (const file of commandFiles) {
        const command = require(join(__dirname, "commands", `${file}`));
        try {
            client.commands.set(command.name, command) 
            count++;
            let text = colors.yellow(`[Command] `) + colors.green(`[${count}/${cmdcount}] Loaded ${file}`);
            console.log(text);
        } catch {
            let text = colors.yellow(`[Command] `) + colors.red(`[${count}/${cmdcount}] Unloaded ${file}`);
            loaded = false;
            console.log(text);
        }
    }
    loaded ? console.log(colors.bold(colors.green(`Loaded all Commands!`))) : console.log(colors.bold(colors.red(`Load all Commands Falled!`)))
    
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    count = 0;
    console.log(colors.bold(colors.yellow(`Starting load Slash Commands...`)))
    const slashFiles = readdirSync(join(__dirname, "slash")).filter(file => file.endsWith(".js"));
    const arrayOfSlashCommands = [];
    for (const file of slashFiles) {
        const command = require(join(__dirname, "slash", `${file}`));
        try {
            client.slash.set(command.name, command)
            arrayOfSlashCommands.push(command);
            count++
            let text = colors.yellow(`[Slash] `) + colors.green(`[${count}/${slscount}] Loaded ${file}`);
            console.log(text);
        } catch {
            let text = colors.yellow(`[Slash] `) + colors.red(`[${count}/${slscount}] Unloaded ${file}`);
            loaded = false;
            console.log(text);
        }
    }
    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(process.env.clientID),
                    { body: arrayOfSlashCommands }
                )
            console.log(colors.bold(colors.green(`Loaded all Slash Commands!`)))
        } catch (error) {
            console.error(colors.red(error))
            console.log(colors.bold(colors.red(`Load all Slash Commands Falled!`)))
        }
    })();

    client.on ("error", console.error);

    client.on('ready', () => {
        let i = 0;
        setInterval(() => {
            let activities = [`${prefix}help`,`Minecraft`,`${client.channels.cache.size} kênh`,`Minecraft`,`${cmdcount} lệnh chữ`,`Minecraft`, `${slscount} lệnh gạch chéo`,`B***khun`, `${client.users.cache.size} người dùng`,`Minecraft`]
            client.user.setActivity(`${activities[i ++ % activities.length]}`, {
                type: "LISTENING",
            })
        }, 30000)
            //client.user.setActivity({
            //    name: "/>help ; />invite",
            //    type: "STREAMING",
            //    url: "https://www.twitch.tv/thanhgaming5550"
            //})   
        console.log(colors.bold(colors.green(`Logged in as ${client.user.tag}!`)));
        console.log(colors.green(`Online`));
        console.log(`Bot hiện đang theo dõi ${client.channels.cache.size} kênh và phục vụ ${cmdcount} lệnh chữ và ${slscount} lệnh gạch chéo cho ${client.users.cache.size} người dùng`);
        console.log('=========================================================================================================');
    });

    client.on("messageCreate", async (message) => {
        if(message.author.bot) return;
        if(message.channel.type === 'dm') return;
        if(message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            
            if(!client.commands.has(command)) return;

            try {
                client.commands.get(command).run(client, message, args);
                console.log(colors.yellow(`[Command] `) + `${message.author.tag} ${message.author} : ${message}`)
            } catch (error){ 
                console.error(error);
            }
        }
    });

    client.on("interactionCreate", async (interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            if (!interaction.guild) return;
            const command = client.slash.get(interaction.commandName);
            try {
                 //{ name: 'id', type: 'INTEGER', value: 69 }
                const option = [];
                const output = [];
                for (let opt of interaction.options.data) {
                    option.push(opt);
                    if (opt.type !== "SUB_COMMAND") {
                       output.push(opt.name + ":\"" + opt.value + "\"")
                    } else {
                        let string = `${opt.name} `
                        for (let dem = 0; dem < opt.options.length; dem++) {
                            string = string + opt.options[dem].name + `:"` + opt.options[dem].value + `" `
                        }
                        output.push(string)
                    }
                }
                interaction.member = interaction.guild.members.cache.get(interaction.user.id);
                command.run(client, interaction, option);
                console.log(colors.yellow(`[Slash]   `) + `${interaction.user.tag} ${interaction.user} : /${interaction.commandName} ${output.join(" ")}`)
            } catch (error) {
                console.error(colors.red(error))
                await interaction.reply({ content: "Đã xảy ra lỗi! Vui lòng thử lại.", ephemeral: true })
            }
        }
    })

    process.on('uncaughtException', function (err) {
        console.log(colors.red(err));
    });

    console.log(colors.bold(colors.cyan('Logging in...')));

    client.login(process.env.TOKEN).then((token) => {
        client.user.setPresence({
            status: 'online',
        });
    });
