import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    content: string;
    chat: mongoose.Types.ObjectId;
    readBy: mongoose.Types.ObjectId[];
}

const MessageSchema: Schema<IMessage> = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
        ],

    },
    { timestamps: true },
);

const MessageModel: Model<IMessage> = mongoose.model<IMessage>(
    'Message',
    MessageSchema,
);

export default MessageModel;
