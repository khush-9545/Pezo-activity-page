import React from 'react';
import { FileText, Check, Loader2 } from 'lucide-react';
import StarRating from './StarRating';
import TimeRangeEditor from './TimeRangeEditor';
import InProcessOrderCard from './InProcessOrderCard';
import CompletedOrderCard from './CompletedOrderCard';

const OrderCard = ({ order, onRatingChange, onCommentSubmit }) => {
  if (order.status === 'In Process') {
    return <InProcessOrderCard order={order} onRatingChange={onRatingChange} onCommentSubmit={onCommentSubmit} />;
  }

  if (order.status === 'Completed') {
    return <CompletedOrderCard order={order} />;
  }

  return (
  <div className="bg-white">
    {/* Order Header */}
    <div className="flex items-center justify-between px-2 sm:px-4 pt-4 pb-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm sm:text-base font-medium text-gray-900">{order.id}</span>
        <span className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium ${
          order.status === 'Completed'
            ? 'bg-green-50 text-green-600'
            : 'bg-orange-50 text-orange-600'
        }`}>
          {order.status === 'Completed' ? (
            <>
              Done
              <Check size={12} />
            </>
          ) : (
            <>
              Processing
              <Loader2 size={12} className="animate-spin" />
            </>
          )}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-gray-500">{order.timeAgo}</span>
    </div>




    

    {/* File Info */}
    <div className="flex items-center justify-between px-2 sm:px-4 pb-3">
      <div className="flex items-center space-x-3">
        <div className="bg-gray-100 p-2 rounded-lg">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </div>
        <span className="text-sm sm:text-base text-gray-900">{order.fileName}</span>
      </div>
      <span className="text-sm sm:text-base font-semibold text-gray-900">{order.price}</span>
    </div>

    {/* Queue Progress - only for in-process */}
    {order.status === 'In Process' && (
      <div className="px-2 sm:px-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-gray-600">Queue Progress</span>
          <span className="text-xs sm:text-sm text-gray-500">{order.queueProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all bg-orange-400"
            style={{ width: `${order.queueProgress}%` }}
          ></div>
        </div>
      </div>
    )}

    {/* Status */}
    {order.status === 'Completed' ? (
      <div className="px-2 sm:px-4 pb-3 bg-green-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-green-600">Done</span>
        </div>
      </div>
    ) : order.status === 'In Process' ? (
      order.queueProgress === 100 ? (
        <div className="px-2 sm:px-4 pb-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-green-600">Ready</span>
          </div>
        </div>
      ) : (
        <div className="px-2 sm:px-4 pb-3 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-orange-600">Processing</span>
          </div>
        </div>
      )
    ) : null}

    {/* Rating */}
    <div className="px-2 sm:px-4 pb-3">
      <span className="block text-xs sm:text-sm text-gray-600 mb-2">Rate Experience</span>
      <StarRating
        rating={order.rating}
        orderId={order.id}
        order={order}
        editable={true}
        onRatingChange={onRatingChange}
        onCommentSubmit={onCommentSubmit}
      />
    </div>

    {/* Reorder Button */}
    <div className="px-2 sm:px-4 pb-3">
      <button className="w-full bg-blue-500 text-white py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-600 transition-colors">
        Reorder
      </button>
    </div>

    {/* Processing Time - Editable */}
    <TimeRangeEditor order={order} />

    {/* Divider */}
    <div className="border-b border-gray-100 mx-2 sm:mx-4"></div>
  </div>
);
};

export default OrderCard;
