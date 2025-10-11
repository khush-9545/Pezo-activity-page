import React, { useState, useEffect } from "react";

/* ----------------------------- Small helpers ---------------------------- */
function formatDuration(minutes) {
  if (!minutes && minutes !== 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/* ------------------------------ StarRating ------------------------------ */
function StarRating({ value = 0, editable = false, onChange }) {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(value);

  useEffect(() => setRating(value), [value]);

  const handleClick = (i) => {
    if (!editable) return;
    setRating(i);
    onChange && onChange(i);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center select-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            onMouseEnter={() => editable && setHover(i)}
            onMouseLeave={() => editable && setHover(0)}
            aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
            className="w-5 h-5 inline-flex items-center justify-center focus:outline-none"
            type="button"
          >
            <svg
              viewBox="0 0 24 24"
              fill={(hover || rating) >= i ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              className={`w-5 h-5 ${
                (hover || rating) >= i ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118L12 15.347l-3.952 2.726c-.784.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L3.094 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------- CompletedOrderCard --------------------------- */
function CompletedOrderCard({ order, onRatingChange, onCommentSubmit }) {
  const [comment, setComment] = useState(order.comment || "");
  const [submitted, setSubmitted] = useState(!!order.submitted);

  const minutes = order.processingMinutes ?? 0;
  const durationText = formatDuration(minutes);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onCommentSubmit && onCommentSubmit(order.id, comment);
    setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-800">#{order.id}</span>
          <span className="inline-flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
            Done ✓
          </span>
        </div>
        <div className="text-xs text-gray-500">{order.timeAgo}</div>
      </div>

      {/* file info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-500">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">
              {order.fileName}
            </div>
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-800">{order.price}</div>
      </div>

      {/* done green strip */}
      <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-md mb-3">
        Done
      </div>

      {/* rating & feedback */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">Rate Experience</div>
          <StarRating
            value={order.rating}
            editable
            onChange={(r) => onRatingChange && onRatingChange(order.id, r)}
          />
        </div>

        <textarea
          className="w-full border border-gray-200 rounded-md p-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-300 resize-none"
          placeholder="Share your feedback..."
          value={comment}
          onChange={(e) => !submitted && setComment(e.target.value)}
          readOnly={submitted}
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handleSubmit}
            disabled={submitted || !comment.trim()}
            className={`px-4 py-2 rounded-md font-medium text-sm transition ${
              submitted || !comment.trim()
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {submitted ? "Submitted" : "Submit"}
          </button>
        </div>
      </div>

      {/* Processing Time */}
<div className="mt-auto">
  {/* Top Row */}
  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
    <div>Processing Time</div>
    <div className="text-xs text-blue-500">{order.duration}</div>
  </div>

  {/* Timeline Box */}
  <div className="bg-blue-50 rounded-md p-3">
    {/* Progress bar */}
    <div className="relative h-2 bg-white rounded-full overflow-hidden">
      {/* Fill bar */}
      <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: "100%" }} />

            {/* Markers */}
            <span
              className="absolute top-2 left-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"
            />
            <span
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"
            />
            <span
              className="absolute top-2 right-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"
            />
    </div>

    {/* Times */}
  <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
    <div>{order.processingStartTime || "Start"}</div>
    <div>{order.processingMidTime || computeMidTime(order.processingStartTime, order.processingEndTime)}</div>
    <div className="flex items-center gap-1">
      <div>{order.processingEndTime || "End"}</div>
      <svg
        className="w-4 h-4 text-blue-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
  </div>
  </div>
</div>

      </div>
    
  );
}

function computeMidTime(start, end) {
  if (!start || !end) return "";
  // Parse times in HH:MM AM/PM format
  const parseTime = (t) => {
    const [time, modifier] = t.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const startTime = parseTime(start);
  const endTime = parseTime(end);

  let midHours = Math.floor((startTime.hours + endTime.hours) / 2);
  let midMinutes = Math.floor((startTime.minutes + endTime.minutes) / 2);

  // Adjust minutes and hours if minutes >= 60
  if (midMinutes >= 60) {
    midHours += 1;
    midMinutes -= 60;
  }

  // Convert back to 12-hour format
  const modifier = midHours >= 12 ? "PM" : "AM";
  midHours = midHours % 12 || 12;
  const midMinutesStr = midMinutes.toString().padStart(2, "0");

  return `${midHours}:${midMinutesStr} ${modifier}`;
}

export default CompletedOrderCard;
