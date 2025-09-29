import React, { useState, useEffect } from "react";
import "./Card.css"; 
const CompletedOrderCard = ({ order, onCommentSubmit }) => {
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const rating = order.rating || 0;
  const processingDuration = order.processingEndTime ?
    Math.floor(Math.random() * 200) + 100 : 201; // in minutes

  const hours = Math.floor(processingDuration / 60);
  const minutes = processingDuration % 60;
  const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  const handleSubmit = () => {
    if (comment.trim()) {
      onCommentSubmit(order.id, comment);
      setComment("");
      setSubmitted(true);
    }
  };
  return (
    <div className="card">
      <div className="card-head">
        <span className="order-id">{order.id}</span>
        <span className="status done">Done ✓</span>
        <span className="time">{order.timeAgo}</span>
      </div>
      <div className="card-body">
        <div className="file-info">
          <div className="file-icon">📄</div>
          <div className="file-details">
            <span className="file-name">{order.fileName}</span>
            <span className="file-price">{order.price}</span>
          </div>
        </div>
        <div className="feedback">
          <span className="feedback-status">Done</span>
          <div className="rating">
            {[1,2,3,4,5].map((star) => {
              return (
                <span
                  key={star}
                  className={star <= rating ? "star filled" : "star"}
                >
                  ★
                </span>
              );
            })}
            <span className="rating-value">({rating}/5)</span>
          </div>
          <textarea
            placeholder="Share your feedback"
            className="feedback-text"
            value={comment}
            onChange={(e) => !submitted && setComment(e.target.value)}
            readOnly={submitted}
          ></textarea>
          <button
            className="submit-btn"
            disabled={submitted || !comment.trim()}
            onClick={handleSubmit}
          >
            {submitted ? "Submitted" : "Submit"}
          </button>
          <button className="reorder-btn">Reorder</button>
        </div>
        <div className="processing-time">
          <span className="durationn">Processing Time {durationText}</span>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: '100%', height: '100%' }}
            ></div>
          </div>
          <div className="time-lab">
            <span>{order.processingStartTime}</span>
            <span>{}12:00 PM</span>
            <span>{order.processingEndTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompletedOrderCard;
