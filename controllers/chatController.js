const ChatSession = require('../models/ChatSession');
const User = require('../models/User');

exports.createChatSession = async (req, res) => {
    const userId  = req.user.id;

    try {
        const newChatSession = new ChatSession({ user: userId });
        const chatSession = await newChatSession.save();

        // Update user to include this chat session
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.chatSessions.push(chatSession.id);
        await user.save();

        res.json({ chatSessionId: chatSession._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.addPrompt = async (req, res) => {
    const { sessionId } = req.params;
    const { promptId, prompt } = req.body;

    try {
        const chatSession = await ChatSession.findById(sessionId);
        console.log(chatSession)
        chatSession.prompts.push({ promptId, prompt, responses: [] });
        await chatSession.save();
        res.json({ promptId, prompt });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.addResponse = async (req, res) => {
    const { sessionId, promptId } = req.params;
    const { response } = req.body;

    try {
        const chatSession = await ChatSession.findById(sessionId);
        const prompt = chatSession.prompts.find(p => p.promptId === promptId);
        if (!prompt) {
            return res.status(404).json({ msg: 'Prompt not found' });
        }
        prompt.responses.push(response);
        await chatSession.save();
        res.json({ msg: 'Response added' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.modifyPrompt = async (req, res) => {
    const { sessionId, promptId } = req.params;
    const { prompt } = req.body;

    try {
        const chatSession = await ChatSession.findById(sessionId);
        const promptToModify = chatSession.prompts.find(p => p.promptId === promptId);
        if (!promptToModify) {
            return res.status(404).json({ msg: 'Prompt not found' });
        }
        promptToModify.prompt = prompt;
        await chatSession.save();
        res.json({ msg: 'Prompt modified' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getChatSessionData = async (req, res) => {
    try {
        const chatSessionId = req.params.sessionId;

        // Find the chat session by its ID
        const chatSession = await ChatSession.findById(chatSessionId)
            .populate('prompts.responses') //populates the responses instead of ids
            .populate('prompts');

        if (!chatSession) {
            return res.status(404).json({ msg: 'Chat session not found' });
        }

        res.json(chatSession);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
