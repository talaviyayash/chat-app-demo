import { useEffect, useState, useCallback } from "react";
import useApi from "@/hooks/useApi";
import { useSelector } from "react-redux";
import { getUserProfile } from "@/store/reduxFunc";
import { useSocket } from "@/hooks/useSocket";
import type { IUser } from "@/types/IUser";

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: IUser[];
  groupAdmin?: IUser;
  createdAt: string;
  updatedAt: string;
  latestMessage?: {
    content: string;
    createdAt: string;
  };
}

export const useChat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const { api } = useApi();
  const userProfile = useSelector(getUserProfile);
  const { on } = useSocket();

  const getChat = useCallback(async () => {
    const response = await api<Chat[]>({
      endPoint: "/chat",
      method: "GET",
    });
    if (response.success && response.data) {
      setChats(response.data);
    }
  }, [api]);

  const handleNewChat = useCallback(
    (email: string) => {
      console.log("Creating new chat with:", email);
      getChat(); // Refresh list
    },
    [getChat]
  );

  const handleCreateGroup = useCallback(
    (groupName: string, emails: string[]) => {
      console.log("Creating group:", groupName, "with members:", emails);
      getChat(); // Refresh list
    },
    [getChat]
  );

  const getChatName = useCallback(
    (chat: Chat) => {
      if (chat.isGroupChat) {
        return chat.chatName;
      }
      const otherUser = chat.users.find((u) => u._id !== userProfile?._id);
      return otherUser ? otherUser.name : "Unknown User";
    },
    [userProfile?._id]
  );

  const getSelectedChatName = useCallback(() => {
    const chat = chats.find((c) => c._id === selectedChat);
    if (!chat) return "";
    return getChatName(chat);
  }, [chats, selectedChat, getChatName]);

  useEffect(() => {
    getChat();
  }, []);

  useEffect(() => {
    // const removeListener = on("message", (msg) => {
    //   console.log("New message received in hook:", msg);
    //   getChat(); // Refresh list on new message to update latestMessage
    // });
    // return () => {
    //   removeListener();
    // };
  }, [on, getChat]);

  return {
    chats,
    selectedChat,
    setSelectedChat,
    isNewChatOpen,
    setIsNewChatOpen,
    isCreateGroupOpen,
    setIsCreateGroupOpen,
    handleNewChat,
    handleCreateGroup,
    getChatName,
    getSelectedChatName,
    refreshChats: getChat,
  };
};

export default useChat;
