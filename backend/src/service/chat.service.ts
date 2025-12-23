import ChatModel, { IChat } from '../models/chat.model';
import { IUser } from '../models/user.model';
import mongoose from 'mongoose';

const findExistingChat = async (userId: string, targetUserId: string): Promise<IChat | null> => {
    return ChatModel.findOne({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: targetUserId } } },
        ],
    });
};

const createChat = async (userIds: string[]): Promise<IChat> => {
    return ChatModel.create({
        chatName: 'sender',
        isGroupChat: false,
        users: userIds,
    });
};

const fetchUserChats = async (userId: string): Promise<IChat[]> => {
    const chats = await ChatModel.find({
        users: { $elemMatch: { $eq: userId } },
    })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 });

    return ChatModel.populate(chats, {
        path: 'latestMessage.sender',
        select: 'name email',
    });
};

const createGroupChat = async (data: { chatName: string; users: (IUser | string)[]; groupAdmin: IUser | string }): Promise<IChat> => {
    const groupChat = await ChatModel.create({
        chatName: data.chatName,
        users: data.users,
        isGroupChat: true,
        groupAdmin: data.groupAdmin,
    });

    const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

    if (!fullGroupChat) throw new Error('Failed to fetch created group chat');

    return fullGroupChat;
};

const updateLatestMessage = async (chatId: string, messageId: string) => {
    return ChatModel.findByIdAndUpdate(chatId, {
        latestMessage: new mongoose.Types.ObjectId(messageId),
    });
};

const ChatService = {
    findExistingChat,
    createChat,
    fetchUserChats,
    createGroupChat,
    updateLatestMessage,
};

export default ChatService;
