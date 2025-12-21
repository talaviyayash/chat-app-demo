import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import ChatController from '../controller/chat.controller';
import { validateRequest } from '../utils/validateRequest';
import chatValidation from '../validators/chat.validator';

const chatRouter = Router();

chatRouter.post(
    '/',
    protect,
    validateRequest(chatValidation.createChatSchema),
    ChatController.createChat
);
chatRouter.get('/', protect, ChatController.fetchChats);
chatRouter.post(
    '/group',
    protect,
    validateRequest(chatValidation.createGroupChatSchema),
    ChatController.createGroupChat
);

export default chatRouter;
