import React from "react";

const MessageBubble = React.memo(({ message, currentEmail, activeChat }) => {
  const isSelf = message.user?._id === currentEmail;
  const time = new Date(message.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const isGift = message.image && !message.text;

  return (
    <div className={`flex mb-3 ${isSelf ? "justify-end" : "justify-start"}`}>
      {!isSelf && (
        <img
          src={
            activeChat?.users?.find((u) => u.email !== currentEmail)?.avatar ||
            "https://i.pravatar.cc/300"
          }
          className="w-8 h-8 rounded-full object-cover mr-2 self-end"
          alt="Sender"
          onError={(e) => {
            e.target.src = "https://i.pravatar.cc/300";
          }}
        />
      )}

      <div
        className={`flex flex-col max-w-[75%] rounded-xl p-3 shadow-lg ${
          isSelf
            ? "bg-red-500 rounded-br-none text-white"
            : "bg-[#FFFAF5] rounded-tl-none text-gray-800"
        }`}
      >
        {message.image && (
          <div className="relative mb-2">
            <img
              src={message.image}
              className="max-w-full rounded-lg object-cover max-h-60"
              alt={isGift ? "Gift" : "Shared image"}
              loading="lazy"
            />
            {isGift && (
              <div className="absolute top-2 right-2 bg-green-800/80 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                🎁 Gift
              </div>
            )}
          </div>
        )}

        {message.text && (
          <p className="text-sm break-words whitespace-pre-wrap">
            {message.text}
          </p>
        )}

        {message.video && (
          <video
            src={message.video}
            controls
            className="max-w-full rounded-lg object-cover max-h-60"
          />
        )}

        <div
          className={`mt-1 text-xs ${
            isSelf ? "text-white/70" : "text-gray-500"
          } flex items-center justify-end`}
        >
          <span>{time}</span>
          {isSelf && (
            <span
              className={`ml-1 ${
                message.status === "failed"
                  ? "text-yellow-300"
                  : "text-green-300"
              }`}
            >
              {message.status === "sending" ? "•" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default MessageBubble;