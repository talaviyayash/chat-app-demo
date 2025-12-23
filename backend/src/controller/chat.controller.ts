import { Response } from 'express';
import ChatService from '../service/chat.service';
import MessageService from '../service/message.service';
import UserService from '../service/user.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../utils/AppError';

const createChat = async (req: AuthRequest, res: Response) => {
  const { email } = req.body;

  const user = await UserService.getUserByEmail(email);

  if (!user)
    throw new AppError('User not found with this email', 404);

  const userId = user.id;

  const isChat = await ChatService.findExistingChat(req.user._id, userId);

  if (isChat) throw new AppError('Chat already exists with this user', 400);

  const createdChat = await ChatService.createChat([req.user._id, userId]);

  const fullChat = await createdChat.populate('users', '-password');
  return res.success(200, 'Chat created successfully', fullChat);
};

const fetchChats = async (req: AuthRequest, res: Response) => {
  const results = await ChatService.fetchUserChats(req.user._id);
  return res.success(200, 'Chats fetched successfully', results);
};

const createGroupChat = async (req: AuthRequest, res: Response) => {
  const emails = req.body.users;

  const users = await UserService.getUsersByEmails(emails);

  if (users.length !== emails.length) {
    throw new AppError('One or more users not found', 404);
  }

  const groupChat = await ChatService.createGroupChat({
    chatName: req.body.name,
    users: [...users, req.user],
    groupAdmin: req.user,
  });

  return res.success(200, 'Group Chat Created', groupChat);
};

const allMessages = async (req: AuthRequest, res: Response) => {
  const { chatId } = req.params;
  const messages = await MessageService.getMessagesByChatId(chatId);
  return res.success(200, 'Messages fetched successfully', messages);
};

const ChatController = {
  createChat,
  fetchChats,
  createGroupChat,
  allMessages,
};

export default ChatController;
