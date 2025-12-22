import { MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { useState } from "react";

interface ChatWindowProps {
  selectedChat: string | null;
  getSelectedChatName: () => string;
}

export const ChatWindow = ({
  selectedChat,
  getSelectedChatName,
}: ChatWindowProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log("Sending message:", message);
    setMessage("");
  };

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
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-center text-muted-foreground py-8">
              Chat messages will appear here
            </div>
          </div>

          {/* Message Input - Bottom */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <MessageSquare className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">
            Select a chat to start messaging
          </p>
        </div>
      )}
    </SidebarInset>
  );
};
