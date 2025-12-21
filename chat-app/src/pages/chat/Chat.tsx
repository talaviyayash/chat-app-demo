import { useEffect, useState } from 'react'
import { MessageSquare, Plus, Search, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
    SidebarProvider,
    SidebarInset,
} from '@/components/ui/sidebar'
import { NewChatModal } from '@/components/NewChatModal'
import { CreateGroupModal } from '@/components/CreateGroupModal'
import useApi from '@/hooks/useApi'
import type { IUser } from '@/types/IUser'
import { useSelector } from 'react-redux'
import { getUserProfile } from '@/store/reduxFunc'
import { io, Socket } from 'socket.io-client'

interface Chat {
    _id: string
    chatName: string
    isGroupChat: boolean
    users: IUser[]
    groupAdmin?: IUser
    createdAt: string
    updatedAt: string
    latestMessage?: {
        content: string
        createdAt: string
    }
}

interface ChatResponse {
    success: boolean
    message: string
    data: Chat[]
}

const ENDPOINT = import.meta.env.VITE_API_URL

const Chat = () => {
    const [selectedChat, setSelectedChat] = useState<string | null>(null)
    const [isNewChatOpen, setIsNewChatOpen] = useState(false)
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
    const [chats, setChats] = useState<Chat[]>([])
    const { api } = useApi()
    const userProfile = useSelector(getUserProfile)
    const [socketConnected, setSocketConnected] = useState(false)
    const [socket, setSocket] = useState<Socket | null>(null)

    const handleNewChat = (email: string) => {
        console.log('Creating new chat with:', email)
        getChat() // Refresh list
    }

    const handleCreateGroup = (groupName: string, emails: string[]) => {
        console.log('Creating group:', groupName, 'with members:', emails)
        getChat() // Refresh list
    }

    const getChat = async () => {
        const response = await api<Chat[]>({
            endPoint: "/chat",
            method: "GET"
        })
        if (response.success && response.data) {
            setChats(response.data)
        }
    }

    useEffect(() => {
        getChat()
    }, [])

    useEffect(() => {
        if (userProfile) {
            const newSocket = io(ENDPOINT)
            setSocket(newSocket)
            newSocket.emit("setup", userProfile)
            newSocket.on("connected", () => setSocketConnected(true))
            newSocket.on("typing", () => setIsTyping(true))
            newSocket.on("stop typing", () => setIsTyping(false))

            return () => {
                newSocket.disconnect()
            }
        }
    }, [userProfile])

    useEffect(() => {
        if (socket) {
            socket.on("message received", () => {
                getChat()
            })
        }
    }, [socket])


    const getChatName = (chat: Chat) => {
        if (chat.isGroupChat) {
            return chat.chatName
        }
        const otherUser = chat.users.find(u => u._id !== userProfile?._id)
        return otherUser ? otherUser.name : "Unknown User"
    }

    const getSelectedChatName = () => {
        const chat = chats.find(c => c._id === selectedChat)
        if (!chat) return ""
        return getChatName(chat)
    }

    const [isTyping, setIsTyping] = useState(false)

    return (
        <SidebarProvider>
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
                    <div className="relative mt-2">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search chats..."
                            className="pl-8"
                        />
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            Messages {socketConnected ? <span className="text-green-500 text-xs ml-2">●</span> : <span className="text-red-500 text-xs ml-2">●</span>}
                        </SidebarGroupLabel>
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
                                                        <span className="font-medium text-sm truncate">{getChatName(chat)}</span>
                                                        {/* Timestamp logic would go here if available */}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate">
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

            <SidebarInset>
                <div className="flex h-screen items-center justify-center">
                    {selectedChat ? (
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2">
                                Chat with {getSelectedChatName()}
                            </h3>
                            <p className="text-muted-foreground">Chat messages will appear here</p>
                            {isTyping && <p className="text-xs text-muted-foreground animate-pulse">Typing...</p>}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <MessageSquare className="h-16 w-16 text-muted-foreground" />
                            <p className="text-muted-foreground">Select a chat to start messaging</p>
                        </div>
                    )}
                </div>
            </SidebarInset>

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
    )
}

export default Chat