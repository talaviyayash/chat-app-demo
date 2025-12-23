import { MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { useEffect, useRef } from "react";
import type { Message } from "@/hooks/useChat";
import type { IUser } from "@/types/IUser";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  selectedChat: string | null;
  getSelectedChatName: () => string;
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  messages: Message[];
  userProfile?: IUser;
}

export const ChatWindow = ({
  selectedChat,
  getSelectedChatName,
  message,
  setMessage,
  handleSendMessage,
  messages,
  userProfile,
}: ChatWindowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <SidebarInset className="flex flex-col h-screen">
      {selectedChat ? (
        <>
          {/* Chat Header */}
          <div className="border-b p-4">
            <h3 className="text-xl font-semibold">
              Chat with {getSelectedChatName()}
            </h3>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isOwn = msg.sender._id === userProfile?._id;
                return (
                  <div
                    key={msg._id}
                    className={cn(
                      "flex flex-col max-w-[80%] gap-1",
                      isOwn ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2 text-sm shadow-sm",
                        isOwn
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted text-muted-foreground rounded-tl-none border"
                      )}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1">
                      {isOwn ? "You" : msg.sender.name} • {new Date(msg.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                <MessageSquare className="h-8 w-8 opacity-20" />
                <p>No messages yet. Say hi!</p>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Message Input - Bottom */}
          <div className="border-t p-4">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 h-11"
              />
              <Button size="icon" type="submit" className="h-11 w-11 shrink-0">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4 bg-muted/30">
          <div className="p-6 rounded-full bg-background border shadow-sm">
            <MessageSquare className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium">Your Messages</h3>
            <p className="text-muted-foreground">
              Select a chat to start messaging
            </p>
          </div>
        </div>
      )}
    </SidebarInset>
  );
};
