module.exports = evaluateToggle

function evaluateToggle(varName, settings, message){
    let guildid = message.guild.id;
    let channelid = message.channel.id;

    let channelVarPath = `channel_settings.${channelid}.${varName}`
    
    // return channel toggle var if exists
    if (settings.has(guildid, channelVarPath))
        return settings.get(guildid, channelVarPath);

    // return guild toggle otherwise
    let guildToggle = settings.get(guildid, varName);
    return guildToggle;
}