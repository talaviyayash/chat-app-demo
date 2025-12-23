import MessageModel, { IMessage } from '../models/message.model';
import { Types } from 'mongoose';

const createMessage = async (data: { sender: string; content: string; chatId: string }): Promise<IMessage> => {
    let message = await MessageModel.create({
        sender: new Types.ObjectId(data.sender),
        chat: new Types.ObjectId(data.chatId),
        content: data.content,
    });

    message = await message.populate([
        { path: 'sender', select: 'name email' },
        { path: 'chat' },
    ]);

    return message;
};

const getMessagesByChatId = async (chatId: string): Promise<IMessage[]> => {
    return MessageModel.find({ chat: chatId }).populate('sender', 'name email');
};

const markMessagesAsRead = async (chatId: string, userId: string) => {
    return MessageModel.updateMany(
        { chat: chatId },
        { $addToSet: { readBy: new Types.ObjectId(userId) } }
    );
};

const MessageService = {
    createMessage,
    getMessagesByChatId,
    markMessagesAsRead,
};

export default MessageService;
