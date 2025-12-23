import { SidebarProvider } from "@/components/ui/sidebar";
import { NewChatModal } from "@/components/NewChatModal";
import { CreateGroupModal } from "@/components/CreateGroupModal";
import { useChat } from "@/hooks/useChat";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatWindow } from "./components/ChatWindow";

const Chat = () => {
  const {
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
    message,
    setMessage,
    handleSendMessage,
    messages,
    userProfile
  } = useChat();

  return (
    <SidebarProvider>
      <ChatSidebar
        chats={chats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        setIsNewChatOpen={setIsNewChatOpen}
        setIsCreateGroupOpen={setIsCreateGroupOpen}
        getChatName={getChatName}
        userProfile={userProfile}
      />

      <ChatWindow
        selectedChat={selectedChat}
        getSelectedChatName={getSelectedChatName}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        messages={messages}
        userProfile={userProfile}
      />

      <NewChatModal
        open={isNewChatOpen}
        onOpenChange={setIsNewChatOpen}
        onCreateChat={handleNewChat}
      />

      <CreateGroupModal
        open={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
        onCreateGroup={handleCreateGroup}
      />
    </SidebarProvider>
  );
};

export default Chat;
