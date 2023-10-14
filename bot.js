const { ActivityHandler, MessageFactory, BotFrameworkAdapter } = require('botbuilder');
const restify = require('restify');
const dotenv = require('dotenv');

dotenv.config();

class MyBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            // Handle user messages
            const userMessage = context.activity.text;

            if (userMessage.toLowerCase().includes('hello')) {
                await context.sendActivity("Hello! How can I assist you today?");
            } else if (userMessage.toLowerCase().includes('help')) {
                await context.sendActivity("I'm here to help. Please let me know what you need assistance with.");
            } else {
                await context.sendActivity("I'm sorry, I didn't understand your message.");
            }

            await next();
        });
    }
}

const server = restify.createServer();
server.listen(process.env.PORT || 3978, () => {
    console.log(`Bot is listening at http://localhost:${process.env.PORT}`);
});

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
});

const bot = new MyBot();

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});

// Start the server
server.on('error', (err) => {
    console.error(err);
});

server.on('listening', () => {
    console.log(`Server is listening on ${server.url}`);
});
