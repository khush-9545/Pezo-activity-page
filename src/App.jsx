import React, { useState } from 'react';
import {
  ArrowLeft,
  Menu,
  FileText,
  Star,
  Clock,
  Check,
  Loader2
} from 'lucide-react';

const sampleOrders = [
  {
    id: '#12-056',
    status: 'Completed',
    timeAgo: '5 min ago',
    fileName: 'Invoice_Template.pdf',
    price: '$3.50',
    rating: 5,
    comment: 'Great print quality and fast service!',
    processingStartTime: '10:00 AM',
    processingEndTime: '1:21 PM',
    queueProgress: 100
  },
  {
    id: '#12-055',
    status: 'Completed',
    timeAgo: '1 hr ago',
    fileName: 'Contract_Agreement.pdf',
    price: '$4.00',
    rating: 5,
    comment: 'Excellent turnaround time.',
    processingStartTime: '9:00 AM',
    processingEndTime: '11:45 AM',
    queueProgress: 100
  },
  {
    id: '#12-054',
    status: 'In Process',
    timeAgo: '2 hrs ago',
    fileName: 'Budget_Report_2024.pdf',
    price: '$24.00',
    rating: 0,
    processingStartTime: '1:00 PM',
    processingEndTime: '2:15 PM',
    queueProgress: 65
  },
  {
    id: '#12-052',
    status: 'In Process',
    timeAgo: '30 min ago',
    fileName: 'Marketing_Presentation.pdf',
    price: '$17.50',
    rating: 0,
    processingStartTime: '2:00 PM',
    processingEndTime: '2:18 PM',
    queueProgress: 100
  },
  {
    id: '#12-053',
    status: 'Completed',
    timeAgo: '5 hrs ago',
    fileName: 'Proposal_Document.pdf',
    price: '$6.50',
    rating: 4,
    comment: 'Good quality, minor issues with colors.',
    processingStartTime: '8:00 AM',
    processingEndTime: '12:12 PM',
    queueProgress: 100
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('completed');
  const [orders, setOrders] = useState(sampleOrders);

  const inProcessOrders = orders.filter(order => order.status === 'In Process');
  const completedOrders = orders.filter(order => order.status === 'Completed');

  const displayedOrders = activeTab === 'in-process' ? inProcessOrders : completedOrders;

  const updateOrderRating = (orderId, newRating) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, rating: newRating } : order
      )
    );
  };

  const updateOrderComment = (orderId, newComment) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, comment: newComment } : order
      )
    );
  };

  const StarRating = ({ rating, orderId, order, editable = true }) => {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
      if (comment.trim()) {
        updateOrderComment(orderId, comment);
        setComment('');
        setIsSubmitting(true);
        setTimeout(() => setIsSubmitting(false), 1000);
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } ${editable ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
              onClick={editable ? () => updateOrderRating(orderId, star) : undefined}
            />
          ))}
          <span className="text-xs sm:text-sm text-gray-400">({rating}/5)</span>
        </div>
        {editable && (
          <div className="space-y-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your feedback..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <button
              onClick={handleSubmit}
              disabled={!comment.trim() || isSubmitting}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                !comment.trim() || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? 'Submitted!' : 'Submit'}
            </button>
          </div>
        )}
        {order?.comment && !editable && (
          <p className="text-xs sm:text-sm text-gray-600 italic mt-1">"{order.comment}"</p>
        )}
      </div>
    );
  };

  const TimeRangeEditor = ({ order }) => {
    const calculateDuration = (start, end) => {
      if (!start || !end) return '0 minutes';
      const startDate = new Date(`1970/01/01 ${start}`);
      const endDate = new Date(`1970/01/01 ${end}`);
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins === 1) return '1 minute';
      return `${diffMins} minutes`;
    };

    const renderTimeline = (sTime, eTime) => {
      if (!sTime || !eTime) return null;
      const startDate = new Date(`1970/01/01 ${sTime}`);
      const endDate = new Date(`1970/01/01 ${eTime}`);
      const totalMs = endDate.getTime() - startDate.getTime();
      const midTime = new Date(startDate.getTime() + totalMs / 2);
      const midStr = midTime.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true});

      const barColor = order.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500';
      const dotColor = order.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500';
      const midDotColor = order.status === 'Completed' ? 'bg-green-300' : 'bg-blue-300';

      return (
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex-1 h-1 bg-gray-200 rounded-full relative">
              <div
                className={`absolute left-0 top-0 h-1 rounded-full ${barColor} transition-all`}
                style={{ width: order.status === 'Completed' ? '100%' : '100%' }}
              ></div>
              <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 ${dotColor} rounded-full`}></div>
              <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 ${dotColor} rounded-full`}></div>
              <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 ${midDotColor} rounded-full`}></div>
            </div>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-500">
            <span>{sTime}</span>
            <span>{midStr}</span>
            <span>{eTime}</span>
          </div>
          {order.status === 'Completed' && (
            <div className="flex justify-end mt-1">
              <Check className="w-4 h-4 text-green-500" />
            </div>
          )}
        </div>
      );
    };

    const duration = calculateDuration(order.processingStartTime || '', order.processingEndTime || '');

    return (
      <div className="px-2 sm:px-4 pb-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-gray-600">Processing Time</span>
          <span className="text-xs sm:text-sm text-gray-500">{duration}</span>
        </div>
        {order.processingStartTime && order.processingEndTime && renderTimeline(order.processingStartTime, order.processingEndTime)}
      </div>
    );
  };

  const OrderCard = ({ order }) => (
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
        <StarRating rating={order.rating} orderId={order.id} order={order} />
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

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* Top App Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-2 sm:px-4 py-3">
          <ArrowLeft size={20} className="text-gray-600" />
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Pezo</h1>
          <Menu size={20} className="text-gray-600" />
        </div>
      </div>

      <div className="px-2 sm:px-4 pt-6">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">Order History</h2>
          <p className="text-base text-gray-600">Track all your printing orders.</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg mb-4">
          <div className="flex items-center justify-between px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex space-x-4 sm:space-x-6">
              <button
                onClick={() => setActiveTab('in-process')}
                className={`flex flex-col items-center space-y-1 ${
                  activeTab === 'in-process' ? 'text-orange-500' : 'text-gray-500'
                }`}
              >
                <span className="text-xs sm:text-sm font-medium">In Process</span>
                <span className={`text-base sm:text-lg font-bold ${
                  activeTab === 'in-process' ? 'text-orange-500' : 'text-gray-400'
                }`}>
                  {inProcessOrders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('completed')}
                className={`flex flex-col items-center space-y-1 ${
                  activeTab === 'completed' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <span className="text-xs sm:text-sm font-medium">Completed</span>
                <span className={`text-base sm:text-lg font-bold ${
                  activeTab === 'completed' ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  {completedOrders.length}
                </span>
              </button>
            </div>

            <div className="text-right">
              <div className="text-sm sm:text-base text-gray-500 font-medium">Total</div>
              <div className="text-base sm:text-lg font-bold text-orange-500">$127.50</div>
            </div>
          </div>
        </div>

        {/* Order Cards */}
        <div className="bg-white rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}

export default App;
