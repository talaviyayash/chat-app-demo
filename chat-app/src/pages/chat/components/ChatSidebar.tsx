import { MessageSquare, Plus, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Chat } from "@/hooks/useChat";

interface ChatSidebarProps {
  chats: Chat[];
  selectedChat: string | null;
  setSelectedChat: (id: string) => void;
  setIsNewChatOpen: (open: boolean) => void;
  setIsCreateGroupOpen: (open: boolean) => void;
  getChatName: (chat: Chat) => string;
  userProfile?: any;
}

export const ChatSidebar = ({
  chats,
  selectedChat,
  setSelectedChat,
  setIsNewChatOpen,
  setIsCreateGroupOpen,
  getChatName,
  userProfile,
}: ChatSidebarProps) => {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chats</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <Plus className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsNewChatOpen(true)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>New Chat</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsCreateGroupOpen(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Create Group</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Messages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat._id}>
                  <SidebarMenuButton
                    onClick={() => setSelectedChat(chat._id)}
                    isActive={selectedChat === chat._id}
                    className="h-auto py-3"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {chat.isGroupChat ? (
                          <Users className="h-5 w-5" />
                        ) : (
                          <MessageSquare className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm truncate">
                            {getChatName(chat)}
                          </span>
                          {chat.latestMessage && !chat.latestMessage.readBy.includes(userProfile?._id || "") && (
                            <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                              New
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          "text-xs truncate",
                          chat.latestMessage && !chat.latestMessage.readBy.includes(userProfile?._id || "")
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        )}>
                          {chat.latestMessage?.content || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
