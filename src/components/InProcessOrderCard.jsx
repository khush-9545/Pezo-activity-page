import React, { useState } from "react";
import "./Card.css";

const InProcessOrderCard = ({ order, onRatingChange }) => {
  const [rating, setRating] = useState(order.rating || 0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (onRatingChange) onRatingChange(order.id, newRating);
  };

  const status = order.status || "Processing";

  const statusBg = {
    Processing: "bg-white",
    Waiting: "bg-white",
    Ready: "bg-gray-50",
    Completed: "bg-green-50",
  };

  const badgeBg = {
    Processing: "bg-blue-100 text-blue-700",
    Waiting: "bg-yellow-100 text-yellow-700",
    Ready: "bg-green-400 text-white",
    Completed: "bg-green-100 text-green-700",
  };

  const progressBarColor = {
    Processing: "bg-blue-500",
    Waiting: "bg-yellow-400",
    Ready: "bg-green-500",
    Completed: "bg-green-500",
  };

  const queueBoxColor = {
    Processing: "bg-blue-100/40 border border-blue-200",
    Waiting: "bg-yellow-100/40 border border-yellow-200",
    Ready: "bg-green-100/40 border border-green-200",
    Completed: "bg-green-100/40 border border-green-200",
  };

  const statusTextColor = {
    Processing: "text-blue-600",
    Waiting: "text-yellow-600",
    Ready: "text-green-600",
    Completed: "text-green-600",
  };

  const currentTime =
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "Now";

  return (
    <div
      className={`card ${statusBg[status] || "bg-blue-50"} ${
        status === "Ready" ? "border-2 border-green-500" : ""
      } mt-0`} // remove extra top margin
    >
      {/* Header */}
      <div className="card-head mb-1"> {/* reduce margin-bottom */}
        <div className="order-id">#{order.id}</div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            badgeBg[status] || "bg-blue-100 text-blue-700"
          }`}
        >
          {status}
        </div>
        <div className="time">{order.timeAgo || currentTime}</div>
      </div>

      {/* Body */}
      <div className="card-body pt-1 pb-2"> {/* reduce padding-top */}
        <div className="file-info flex items-start gap-2">
          <div className="file-icon">📄</div>
          <div className="file-details flex flex-col">
            <span className="file-name font-medium">{order.fileName}</span>

            {/* Document details below file name */}
            {(order.pages || order.type || order.size) && (
              <div className="document-details text-sm text-gray-600 mt-1 flex flex-row gap-1 items-center">
                {order.pages && <span>{order.pages} pages</span>}
                {order.type && order.pages && <span>&#8226;</span>}
                {order.type && <span>{order.type}</span>}
                {order.size && (order.pages || order.type) && <span>&#8226;</span>}
                {order.size && <span>{order.size}</span>}
              </div>
            )}
          </div>
        </div>

        {/* OTP for Ready status */}
        {status === "Ready" && order.otp && (
          <div className="mb-4 w-full flex justify-center">
            <div className="rounded-md border-2 border-dashed border-green-500 bg-green-100 text-gray-800 text-center font-light px-4 py-2 max-w-xs flex flex-col items-center">
              <div>
                OTP: <br />
                <span className="text-2xl font-bold text-green-700">{order.otp}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <i className="bi bi-info-circle-fill text-green-500 text-lg"></i>
                <span className="text-gray-600">show OTP to collect your order</span>
              </div>
            </div>
          </div>
        )}

        {/* Queue Progress */}
        <div
          className={`queue-progress-section mt-2 p-2 rounded-md ${
            queueBoxColor[status] || "bg-gray-100/40 border border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <div className="queue-progress-label font-medium">Queue Progress</div>
            {status !== "Ready" && (
              <div className={`text-sm ${statusTextColor[status] || "text-gray-700"}`}>
                Position: {order.position || "N/A"}
              </div>
            )}
          </div>

          <div className="relative w-full h-1 bg-gray-300 rounded-full overflow-visible">
            <div
              className={`${progressBarColor[status]} h-1 rounded-full`}
              style={{ width: `${order.queueProgress || 0}%` }}
            ></div>

            <span
              className={`absolute left-0 top-1/2 w-3 h-3 rounded-full transform -translate-y-1/2 ${
                (order.queueProgress || 0) >= 0 ? progressBarColor[status] : "bg-gray-400"
              }`}
            ></span>
            <span
              className={`absolute left-1/2 top-1/2 w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                (order.queueProgress || 0) >= 50 ? progressBarColor[status] : "bg-gray-400"
              }`}
            ></span>
            <span
              className={`absolute right-0 top-1/2 w-3 h-3 rounded-full transform -translate-y-1/2 ${
                (order.queueProgress || 0) >= 100 ? progressBarColor[status] : "bg-gray-400"
              }`}
            ></span>
          </div>

          <div className={`text-center text-sm mt-1 ${statusTextColor[status] || "text-gray-700"}`}>
            ~{order.remainingTime || "5 Min"} remaining
          </div>
        </div>
      </div>

      {/* Footer Timeline */}
      <div className="time-lab mt-2 flex justify-between">
        <span>{order.processingStartTime || "Start"}</span>
        <span>{currentTime}</span>
        <span>{order.processingEndTime || "End"}</span>
      </div>
    </div>
  );
};

export default InProcessOrderCard;
