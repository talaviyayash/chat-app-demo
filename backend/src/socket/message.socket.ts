import { Server } from "socket.io";
import { Types } from "mongoose";
import MessageModel from "../models/message.model";
import ChatModel from "../models/chat.model";
import { AuthenticatedSocket } from "../middlewares/socketAuth.middleware";

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

            let message = await MessageModel.create({
                sender: socket.user?.id,
                chat: new Types.ObjectId(chatId),
                content,
            });

            message = await message.populate([
                { path: "sender", select: "name email" },
                { path: "chat" },
            ]);

            await ChatModel.findByIdAndUpdate(chatId, {
                latestMessage: message._id,
            });

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
};

