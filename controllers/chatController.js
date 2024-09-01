const ChatSession = require('../models/ChatSession');
const User = require('../models/User');
const { promptResponse } = require('../services/chatService');

exports.createChatSession = async (req, res) => {
    const userId  = req.user.id;
    const { name, image } = req.body;

    try {
        const newChatSession = new ChatSession({ name:name ,user: userId,image:image });
        const chatSession = await newChatSession.save();

        // Update user to include this chat session
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.chatSessions.push({name,image,sessionId:chatSession.id});
        await user.save();

        res.json({ chatSessionId: chatSession._id,name,image });
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
    
        // Check if the prompt already exists in the session
        const existingPrompt = chatSession.prompts.find(p => p.promptId === promptId);
    
        const responsesOut = await addResponse(sessionId, promptId, prompt);
    
        if (existingPrompt) {
            // If the prompt exists, just push the response
            existingPrompt.responses.push(...responsesOut);
        } else {
            // If the prompt doesn't exist, create a new prompt with the response
            chatSession.prompts.push({ promptId, prompt, responses: [...responsesOut] });
        }
    
        await chatSession.save();
    
        res.json({ responses: responsesOut });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const addResponse = async (sessionId, promptId,prompt) => {

    try {

        const msgData={
            _id: sessionId,
            prompt_details: {
                promptId: promptId,
                prompt: prompt,
            },
        }
        let responses= await promptResponse(msgData)
        return responses;
    } catch (err) {
        console.error(err.message);

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
