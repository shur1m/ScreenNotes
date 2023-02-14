const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Partials, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// import enmap for per server/channel settings
const Enmap = require('enmap');

// declaring clients
const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel]
});

// getting commands from folder
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// loading commands
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    console.log(`Loading command: ${command.data.name}`);
	client.commands.set(command.data.name, command);
}

// loading togglecommands
console.log('Loading toggle commands...');
const toggles = require(path.join(commandsPath, 'toggles.json'));

let defaultSettings = {
    mod_role: "Moderator",
    admin_role: "Administrator",
    channel_settings: null,
}

// generate toggle commands
for (const toggle of toggles){
    defaultSettings[toggle.varName] = toggle.defaultValue;
}

// attaching settings to client
client.settings = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',

    // all variables must be lowercase
    autoEnsure: defaultSettings,
});

// getting events from folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

//loading events
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
    console.log(`Registering event: ${event.name}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

client.login(token);