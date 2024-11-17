
const handleRankAlerts = (message,channel) => {
    if(!message && !channel)
    {
        console.error("Missing parameters for handleRankAlerts function.");
        return;
    }else 
    {
        channel.send(message);
    }
};

module.exports = handleRankAlerts;