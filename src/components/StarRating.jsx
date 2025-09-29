import React, { useState } from 'react';
const StarRating = ({ rating, editable = true, onRatingChange, orderId }) => {
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (editable && onRatingChange) {
      onRatingChange(orderId, value);
    }
  };
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            className="text-2xl focus:outline-none"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => editable && setHover(starValue)}
            onMouseLeave={() => editable && setHover(0)}
            disabled={!editable}
          >
            {starValue <= (hover || rating) ? (
              <span className="text-yellow-400">★</span>
            ) : (
              <span className="text-gray-300">☆</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
export default StarRating;
