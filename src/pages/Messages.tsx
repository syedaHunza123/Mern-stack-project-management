import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { mockUsers } from "../lib/mockData";
import { Conversation } from "../types";
import { CallModal } from "../components/messages/CallModal";
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Users,
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  type: "text" | "file" | "image";
}

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >("1");
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState<"voice" | "video">("voice");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversations
  useEffect(() => {
    const initialConversations: Conversation[] = [
      {
        id: "1",
        name: "Project Team",
        lastMessage: "Great progress on the frontend!",
        lastMessageTime: "2 min ago",
        unreadCount: 3,
        isOnline: true,
        type: "group",
        participants: ["1", "2", "3"],
      },
      {
        id: "2",
        name: "Sarah Admin",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
        lastMessage: "Can we schedule a meeting for tomorrow?",
        lastMessageTime: "1 hour ago",
        unreadCount: 1,
        isOnline: true,
        type: "direct",
      },
      {
        id: "3",
        name: "Jane Smith",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
        lastMessage: "The API documentation is ready for review",
        lastMessageTime: "3 hours ago",
        unreadCount: 0,
        isOnline: false,
        type: "direct",
      },
      {
        id: "4",
        name: "Development Team",
        lastMessage: "New deployment is live!",
        lastMessageTime: "Yesterday",
        unreadCount: 0,
        isOnline: true,
        type: "group",
        participants: ["1", "3"],
      },
    ];
    setConversations(initialConversations);
  }, []);

  // Initialize messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const initialMessages: Message[] = [
        {
          id: "1",
          senderId: "2",
          senderName: "Sarah Admin",
          senderAvatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
          content: "Hey team! How's the progress on the e-commerce project?",
          timestamp: new Date(Date.now() - 30 * 60000).toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            },
          ),
          type: "text",
        },
        {
          id: "2",
          senderId: user?.id || "1",
          senderName: user?.name || "You",
          senderAvatar: user?.avatar,
          content:
            "Great! We've completed the user authentication and now working on the product catalog.",
          timestamp: new Date(Date.now() - 25 * 60000).toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            },
          ),
          type: "text",
        },
        {
          id: "3",
          senderId: "3",
          senderName: "Jane Smith",
          senderAvatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
          content:
            "I've also finished the API documentation. Should I share it?",
          timestamp: new Date(Date.now() - 20 * 60000).toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            },
          ),
          type: "text",
        },
        {
          id: "4",
          senderId: "2",
          senderName: "Sarah Admin",
          senderAvatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
          content: "Yes please! That would be very helpful.",
          timestamp: new Date(Date.now() - 18 * 60000).toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            },
          ),
          type: "text",
        },
        {
          id: "5",
          senderId: user?.id || "1",
          senderName: user?.name || "You",
          senderAvatar: user?.avatar,
          content: "Perfect! Let's also schedule a quick review meeting.",
          timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            },
          ),
          type: "text",
        },
      ];
      setMessages(initialMessages);
    }
  }, [selectedConversation, user]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        senderId: user?.id || "1",
        senderName: user?.name || "You",
        senderAvatar: user?.avatar,
        content: messageText.trim(),
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        type: "text",
      };

      // Add message to messages list
      setMessages((prev) => [...prev, newMessage]);

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation
            ? {
                ...conv,
                lastMessage: messageText.trim(),
                lastMessageTime: "now",
              }
            : conv,
        ),
      );

      setMessageText("");

      // Simulate a response after 2-3 seconds
      setTimeout(
        () => {
          const responses = [
            "Thanks for the update!",
            "Sounds good to me 👍",
            "Great work everyone!",
            "Let me know if you need any help.",
            "Perfect timing!",
            "I'll review this shortly.",
          ];

          const randomResponse =
            responses[Math.floor(Math.random() * responses.length)];
          const responseMessage: Message = {
            id: `msg_${Date.now()}_response`,
            senderId: "2",
            senderName: "Sarah Admin",
            senderAvatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
            content: randomResponse,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            type: "text",
          };

          setMessages((prev) => [...prev, responseMessage]);
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === selectedConversation
                ? {
                    ...conv,
                    lastMessage: randomResponse,
                    lastMessageTime: "now",
                  }
                : conv,
            ),
          );
        },
        2000 + Math.random() * 2000,
      ); // Random delay between 2-4 seconds
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);

    // Mark conversation as read
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
      ),
    );
  };

  const handleNewConversation = () => {
    const newConvName = prompt("Enter name for new conversation:");
    if (newConvName) {
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        name: newConvName,
        lastMessage: "Conversation started",
        lastMessageTime: "now",
        unreadCount: 0,
        isOnline: true,
        type: "direct",
      };

      setConversations((prev) => [newConv, ...prev]);
      setSelectedConversation(newConv.id);
    }
  };

  const handleVoiceCall = () => {
    setCallType("voice");
    setShowCallModal(true);
  };

  const handleVideoCall = () => {
    setCallType("video");
    setShowCallModal(true);
  };

  const handleCloseCall = () => {
    setShowCallModal(false);
  };

  if (!user) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Please log in to access messages
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white border-r border-secondary-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-secondary-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Messages
            </h2>
            <button
              onClick={handleNewConversation}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              title="New conversation"
            >
              <Plus className="h-4 w-4 text-secondary-600" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation.id)}
                className={`p-4 border-b border-secondary-100 cursor-pointer hover:bg-secondary-50 transition-colors ${
                  selectedConversation === conversation.id
                    ? "bg-primary-50 border-primary-200"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {conversation.avatar ? (
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : conversation.type === "group" ? (
                      <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-secondary-500 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {conversation.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-secondary-900 truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-secondary-500">
                        {conversation.lastMessageTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-secondary-600 truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <div className="ml-2 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-secondary-600">
              No conversations found
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {selectedConv.avatar ? (
                      <img
                        src={selectedConv.avatar}
                        alt={selectedConv.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : selectedConv.type === "group" ? (
                      <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary-500 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {selectedConv.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {selectedConv.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-secondary-900">
                      {selectedConv.name}
                    </h3>
                    <p className="text-xs text-secondary-600">
                      {selectedConv.type === "group"
                        ? `${selectedConv.participants?.length || 0} members`
                        : selectedConv.isOnline
                          ? "Online"
                          : "Last seen 2 hours ago"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleVoiceCall}
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                    title="Voice call"
                  >
                    <Phone className="h-4 w-4 text-secondary-600" />
                  </button>
                  <button
                    onClick={handleVideoCall}
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                    title="Video call"
                  >
                    <Video className="h-4 w-4 text-secondary-600" />
                  </button>
                  <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4 text-secondary-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary-50">
              {messages.map((message) => {
                const isOwnMessage = message.senderId === user?.id;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex space-x-2 max-w-xs lg:max-w-md`}>
                      {!isOwnMessage && (
                        <div className="flex-shrink-0">
                          {message.senderAvatar ? (
                            <img
                              src={message.senderAvatar}
                              alt={message.senderName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {message.senderName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        {!isOwnMessage && (
                          <div className="text-xs text-secondary-600 mb-1">
                            {message.senderName}
                          </div>
                        )}
                        <div
                          className={`rounded-lg px-3 py-2 ${
                            isOwnMessage
                              ? "bg-primary-500 text-white"
                              : "bg-white text-secondary-900 shadow-sm"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            isOwnMessage
                              ? "text-right text-secondary-500"
                              : "text-secondary-500"
                          }`}
                        >
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-secondary-200">
              <div className="flex items-end space-x-2">
                <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                  <Paperclip className="h-4 w-4 text-secondary-600" />
                </button>

                <div className="flex-1">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>

                <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                  <Smile className="h-4 w-4 text-secondary-600" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="btn-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-secondary-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-secondary-400" />
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-secondary-600">
                Choose a conversation from the sidebar to start messaging.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Call Modal */}
      <CallModal
        isOpen={showCallModal}
        onClose={handleCloseCall}
        conversation={selectedConv || null}
        callType={callType}
      />
    </div>
  );
}
