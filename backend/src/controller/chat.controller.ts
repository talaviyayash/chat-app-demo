import { Request, Response } from 'express';
import ChatModel from '../models/chat.model';
import MessageModel from '../models/message.model';
import UserService from '../service/user.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../utils/AppError';

const createChat = async (req: AuthRequest, res: Response) => {
  const { email } = req.body;

  const user = await UserService.getUserByEmail(email);

  if (!user)
    throw new AppError('User not found with this email', 404);


  const userId = user._id;

  const isChat = await ChatModel.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  });

  if (isChat) throw new AppError('Chat already exists with this user', 400);

  const createdChat = await ChatModel.create({
    chatName: 'sender',
    isGroupChat: false,
    users: [req.user._id, userId],
  });

  const fullChat = await createdChat.populate('users', '-password');
  return res.success(200, 'Chat created successfully', fullChat);
};

const fetchChats = async (req: AuthRequest, res: Response) => {
  const chats = await ChatModel.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });

  const results = await ChatModel.populate(chats, {
    path: 'latestMessage.sender',
    select: 'name email',
  });

  return res.success(200, 'Chats fetched successfully', results);
};

const createGroupChat = async (req: AuthRequest, res: Response) => {
  const emails = req.body.users;

  const users = await UserService.getUsersByEmails(emails);

  if (users.length !== emails.length) {
    throw new AppError('One or more users not found', 404);
  }

  users.push(req.user);

  const groupChat = await ChatModel.create({
    chatName: req.body.name,
    users: users,
    isGroupChat: true,
    groupAdmin: req.user,
  });

  const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  return res.success(200, 'Group Chat Created', fullGroupChat);
};

const allMessages = async (req: AuthRequest, res: Response) => {
  const { chatId } = req.params;

  const messages = await MessageModel.find({ chat: chatId })
    .populate('sender', 'name email')

  return res.success(200, 'Messages fetched successfully', messages);
};

const ChatController = {
  createChat,
  fetchChats,
  createGroupChat,
  allMessages,
};

export default ChatController;
