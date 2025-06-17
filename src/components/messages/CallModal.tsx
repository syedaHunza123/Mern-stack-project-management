import React, { useState, useEffect } from "react";
import { Conversation } from "../../types";
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  X,
  Users,
} from "lucide-react";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
  callType: "voice" | "video";
}

type CallStatus = "connecting" | "ringing" | "connected" | "ended";

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  conversation,
  callType,
}) => {
  const [callStatus, setCallStatus] = useState<CallStatus>("connecting");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === "video");

  useEffect(() => {
    if (isOpen) {
      setCallStatus("connecting");
      setDuration(0);
      setIsMuted(false);
      setIsVideoEnabled(callType === "video");

      // Simulate call progression
      const timer1 = setTimeout(() => {
        setCallStatus("ringing");
      }, 1000);

      const timer2 = setTimeout(() => {
        setCallStatus("connected");
      }, 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen, callType]);

  // Duration counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === "connected") {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    setCallStatus("ended");
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const getStatusText = () => {
    switch (callStatus) {
      case "connecting":
        return "Connecting...";
      case "ringing":
        return "Ringing...";
      case "connected":
        return formatDuration(duration);
      case "ended":
        return "Call ended";
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case "connecting":
        return "text-warning-600";
      case "ringing":
        return "text-primary-600";
      case "connected":
        return "text-success-600";
      case "ended":
        return "text-secondary-600";
      default:
        return "text-secondary-600";
    }
  };

  if (!isOpen || !conversation) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-75" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="relative">
            {/* Background for video call */}
            {callType === "video" && isVideoEnabled && (
              <div className="h-96 bg-gradient-to-br from-primary-500 to-primary-700 relative">
                {/* Simulated video feed */}
                <div className="absolute inset-4 bg-secondary-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    {conversation.avatar ? (
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : conversation.type === "group" ? (
                      <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center mx-auto mb-4">
                        <Users className="h-12 w-12 text-white" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-secondary-500 flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-3xl font-bold">
                          {conversation.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <p className="text-secondary-600 text-sm">Video Preview</p>
                  </div>
                </div>

                {/* Self video preview */}
                <div className="absolute top-4 right-4 w-20 h-28 bg-secondary-800 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">You</span>
                </div>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Call Info */}
          <div className="p-6">
            <div className="text-center mb-6">
              {/* Avatar for voice call or when video is disabled */}
              {(callType === "voice" || !isVideoEnabled) && (
                <div className="mb-4">
                  {conversation.avatar ? (
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover"
                    />
                  ) : conversation.type === "group" ? (
                    <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center mx-auto">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-secondary-500 flex items-center justify-center mx-auto">
                      <span className="text-white text-2xl font-bold">
                        {conversation.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                {conversation.name}
              </h3>

              <p className={`text-sm ${getStatusColor()}`}>{getStatusText()}</p>

              <div className="flex items-center justify-center mt-2">
                <div className="flex items-center space-x-1">
                  {callType === "video" ? (
                    <Video className="h-4 w-4 text-secondary-600" />
                  ) : (
                    <Phone className="h-4 w-4 text-secondary-600" />
                  )}
                  <span className="text-sm text-secondary-600 capitalize">
                    {callType} Call
                  </span>
                </div>
              </div>
            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center space-x-4">
              {/* Mute/Unmute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-all ${
                  isMuted
                    ? "bg-destructive-500 text-white"
                    : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                }`}
                disabled={callStatus !== "connected"}
              >
                {isMuted ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>

              {/* Video Toggle (only for video calls) */}
              {callType === "video" && (
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`p-3 rounded-full transition-all ${
                    !isVideoEnabled
                      ? "bg-destructive-500 text-white"
                      : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                  }`}
                  disabled={callStatus !== "connected"}
                >
                  {isVideoEnabled ? (
                    <Video className="h-5 w-5" />
                  ) : (
                    <VideoOff className="h-5 w-5" />
                  )}
                </button>
              )}

              {/* Speaker */}
              <button
                className="p-3 rounded-full bg-secondary-100 text-secondary-700 hover:bg-secondary-200 transition-all"
                disabled={callStatus !== "connected"}
              >
                <Volume2 className="h-5 w-5" />
              </button>

              {/* End Call */}
              <button
                onClick={handleEndCall}
                className="p-3 rounded-full bg-destructive-500 text-white hover:bg-destructive-600 transition-all"
                disabled={callStatus === "ended"}
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>

            {/* Call Status Indicators */}
            <div className="mt-6 flex justify-center space-x-4 text-xs text-secondary-600">
              {callStatus === "connected" && (
                <>
                  {isMuted && (
                    <div className="flex items-center space-x-1">
                      <MicOff className="h-3 w-3" />
                      <span>Muted</span>
                    </div>
                  )}
                  {callType === "video" && !isVideoEnabled && (
                    <div className="flex items-center space-x-1">
                      <VideoOff className="h-3 w-3" />
                      <span>Video Off</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
