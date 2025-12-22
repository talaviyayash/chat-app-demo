import { useEffect, useState, useCallback } from "react";
import useApi from "@/hooks/useApi";
import { useSelector } from "react-redux";
import { getUserProfile } from "@/store/reduxFunc";
import { useSocket } from "@/hooks/useSocket";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import type { IUser } from "@/types/IUser";

export interface Message {
  _id: string;
  sender: IUser;
  content: string;
  chat: Chat | string;
  createdAt: string;
  updatedAt: string;
}

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
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedChat = useMemo(() => searchParams.get("id"), [searchParams]);

  const setSelectedChat = useCallback((id: string | null) => {
    if (id) {
      setSearchParams({ id });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const { api } = useApi();
  const userProfile = useSelector(getUserProfile);
  const { on, socketRef } = useSocket();

  const getChat = async () => {
    const response = await api<Chat[]>({
      endPoint: "/chat",
      method: "GET",
    });
    if (response.success && response.data) {
      setChats(response.data);
    }
  }

  const handleNewChat = (email: string) => {
    console.log("Creating new chat with:", email);
    getChat(); // Refresh list
  }

  const handleCreateGroup = (groupName: string, emails: string[]) => {
    console.log("Creating group:", groupName, "with members:", emails);
    getChat(); // Refresh list
  }

  const getChatName = useCallback(
    (chat: Chat) => {
      if (chat.isGroupChat) {
        return chat.chatName;
      }
      const otherUser = chat.users.find((u) => u._id !== userProfile?._id);
      return otherUser ? otherUser.name : "Unknown User";
    },
    []
  );

  const getSelectedChatName = useCallback(() => {
    const chat = chats.find((c) => c._id === selectedChat);
    if (!chat) return "";
    return getChatName(chat);
  }, [chats, selectedChat, getChatName]);

  useEffect(() => {
    getChat();
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    console.log("Sending message:", message);
    socketRef.current?.emit("send-message", {
      chatId: selectedChat,
      content: message,

    });
    setMessage("");
  }


  useEffect(() => {
    const removeListener = on("message", (data: any) => {
      console.log("Received message:", data);
      const newMessage = data as Message;
      console.log('newMessage', newMessage)

      const chatId = typeof newMessage.chat === 'string' ? newMessage.chat : newMessage.chat._id;

      if (chatId === selectedChat) {
        setMessages((prev) => [...prev, newMessage]);
      }

      setChats((prev) => {
        return prev.map((chat) => {
          if (chat._id === chatId) {
            return {
              ...chat,
              latestMessage: {
                content: newMessage.content,
                createdAt: newMessage.createdAt,
              },
            };
          }
          return chat;
        });
      });


    });

    return () => {
      removeListener();
    };
  }, [on, selectedChat]);



  const getMessages = async () => {
    const response = await api<Message[]>({
      endPoint: `/chat/${selectedChat}`,
      method: "GET",
    });
    if (response.success && response.data) {
      setMessages(response.data);
    }
  }



  useEffect(() => {
    if (selectedChat) {
      getMessages();
    }
  }, [selectedChat]);


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
    message, setMessage,
    handleSendMessage,
    messages,
    userProfile
  };
};

export default useChat;
