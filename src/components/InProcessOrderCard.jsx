import React, { useState } from "react";

const InProcessOrderCard = ({ order, onRatingChange, onCommentSubmit }) => {
  const [rating, setRating] = useState(order.rating || 0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(order.id, newRating);
    }
  };

  // Determine status and corresponding Tailwind classes
  const status = order.status || "Processing"; // default to Processing if not provided

  const statusBg = {
    Processing: "bg-white",
    Waiting: "bg-white",
    Ready: "bg-gray-50",
    Completed: "bg-green-50",
  };

  const sectionBg = {
    Processing: "bg-blue-50",
    Waiting: "bg-yellow-50",
    Ready: "bg-gray-50",
    Completed: "bg-green-50",
  };

  const symbolBg = {
    Processing: "bg-blue-100",
    Waiting: "bg-yellow-100",
    Ready: "bg-gray-100",
    Completed: "bg-green-100",
  };

  const badgeBg = {
    Processing: "bg-blue-100 text-blue-700",
    Waiting: "bg-yellow-100 text-yellow-700",
    Ready: "bg-gray-100 text-gray-700",
    Completed: "bg-green-100 text-green-700",
  };

  const progressBarColor = {
    Processing: "bg-blue-500",
    Waiting: "bg-yellow-400",
    Ready: "bg-gray-400",
    Completed: "bg-green-500",
  };

  // Format times
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || "Now";

  return (
    <div className={`rounded-2xl shadow-md p-4 w-full max-w-md mx-auto ${statusBg[status] || "bg-blue-50"} ${status === "Ready" ? "border-2 border-green-500" : ""}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-lg truncate">#{order.id}</div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeBg[status] || "bg-blue-100 text-blue-700"}`}>
          {status}
        </div>
        <div className="text-gray-500 text-sm">{order.timeAgo || currentTime}</div>
      </div>

      {/* Body */}
      <div className="flex items-center mb-4 space-x-4">
        <div className={`text-3xl flex-shrink-0 p-1 rounded ${symbolBg[status] || "bg-blue-100"}`}>📄</div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-semibold truncate">{order.fileName}</div>
          <div className="text-gray-500 text-sm truncate">{order.price}</div>
        </div>
      </div>

      {/* OTP for Ready status */}
      {status === "Ready" && order.otp && (
        <div className="mb-2 p-2 bg-green-100 text-green-800 rounded text-center font-semibold">
          OTP: {order.otp}
        </div>
      )}

      {/* Queue Progress */}
      <div className={`mb-2 p-2 rounded ${sectionBg[status] || "bg-blue-50"}`}>
        <div className="text-sm font-semibold text-gray-700 mb-1">Queue Progress</div>
        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
          <div
            className={`${progressBarColor[status] || "bg-blue-500"} h-3 rounded-full`}
            style={{ width: `${order.queueProgress || 0}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-gray-500 text-sm mt-1">
          <div>Position: {order.position || "N/A"}</div>
          <div>~{order.remainingTime || "5 Min"} remaining</div>
        </div>
      </div>

      {/* Footer Timeline */}
      <div className="flex justify-between text-gray-500 text-sm mt-4">
        <div>{order.processingStartTime || "Start"}</div>
        <div>{currentTime}</div>
        <div>{order.processingEndTime || "End"}</div>
      </div>

      {/* Optional Rating */}
      {false && (
        <div className="flex justify-end mt-4 space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingChange(star)}
              className={`text-xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              aria-label={`Rate ${star} star`}
            >
              ★
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InProcessOrderCard;
