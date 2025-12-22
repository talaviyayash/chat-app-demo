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
      />

      <ChatWindow
        selectedChat={selectedChat}
        getSelectedChatName={getSelectedChatName}
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
