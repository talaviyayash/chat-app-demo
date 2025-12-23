import { Server } from "socket.io";
import { Types } from "mongoose";
import { AuthenticatedSocket } from "../middlewares/socketAuth.middleware";
import MessageService from "../service/message.service";
import ChatService from "../service/chat.service";

interface SendMessagePayload {
    chatId: string;
    content: string;
}

export const messageSocket = (io: Server, socket: AuthenticatedSocket): void => {
    socket.on("join-chat", (chatId: string) => {
        socket.join(chatId);
        console.log(`User ${socket.user?.id} joined room: ${chatId}`);
    });

    socket.on("send-message", async (data: SendMessagePayload): Promise<void> => {
        try {
            const { chatId, content } = data;

            if (!content || !chatId) return;

            const message = await MessageService.createMessage({
                sender: socket.user?.id as string,
                chatId,
                content,
            });

            await ChatService.updateLatestMessage(chatId, message.id);

            const chat = message.chat as any;
            if (chat && chat.users) {
                chat.users.forEach((user: any) => {
                    const userId = user.toString();
                    console.log('user-${userId}', `user-${userId}`)
                    io.to(`user-${userId}`).emit("message", message);
                });
            }

        } catch (error) {
            console.error("Message send error:", error);
            socket.emit("error", { message: "Failed to send message" });
        }
    });

    socket.on("message-read", async (data: any): Promise<void> => {
        const { chatId } = data;
        console.log('chatId', chatId)
        if (socket.user?.id) {
            await MessageService.markMessagesAsRead(chatId, socket.user.id);
        }
    });
};

