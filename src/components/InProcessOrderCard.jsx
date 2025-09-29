import React, { useState } from "react";
import "./Card.css"; 
const InProcessOrderCard = ({ order, onRatingChange, onCommentSubmit }) => {
  const [rating, setRating] = useState(order.rating || 0); 
  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(order.id, newRating);
    }
  };
  const processingDuration = order.processingEndTime ?
    Math.floor(Math.random() * 200) + 100 : 201; // in minutes

  const hours = Math.floor(processingDuration / 60);
  const minutes = processingDuration % 60;
  const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  let status = 'Processing';
  let progressClass = 'progress-processing';
  if (order.queueProgress < 30) {
    status = 'Preparing';
    progressClass = 'progress-preparing';
  } else if (order.queueProgress < 70) {
    status = 'Printing';
    progressClass = 'progress-printing';
  }
  return (
    <div className="card"> 
      <div className="card-head"> 
        <span className="order-id">{order.id}</span>
        <span className="status processing">{status} ⏳</span>
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
          <span className="feedback-status">{status}</span>
          <div className="rating">
            {[1,2,3,4,5].map((star) => {
              return (
                <span
                  key={star}
                  className={star <= rating ? "star filled" : "star"}
                  onClick={() => handleRatingChange(star)}
                  style={{ cursor: 'pointer' }}
                >
                  ★
                </span>
              );
            })}
            <span className="rating-value">({rating}/5)</span>
          </div>
        </div>
        <div className="processing-time">
          <span className="durationn">Processing Time {durationText}</span>
          <div className="progress-bar">
            <div 
              className={`progress ${progressClass}`} 
              style={{ width: `${order.queueProgress}%`, height: '100%' }}
            ></div>
          </div>
          <div className="time-lab">
            <span>{order.processingStartTime}</span>
            <span>12:00 PM</span>
            <span>{order.processingEndTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InProcessOrderCard;
