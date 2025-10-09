import React, { useState } from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CompletedOrderCard from './components/CompletedOrderCard';
import InProcessOrderCard from './components/InProcessOrderCard';

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
    id: '#PZ-001',
    status: 'Processing',
    timeAgo: '2:30 PM',
    fileName: 'Business_Report.pdf',
    price: '$12.50',
    rating: 4,
    processingStartTime: '10:00 AM',
    processingEndTime: '12:00 PM',
    queueProgress: 45,
    position: 21,
    pages: 15,
    type: "Colour",
    size: "A4",
    remainingTime: '5 Min'
  },
  {
    id: '#PZ-002',
    status: 'Waiting',
    timeAgo: '1:15 PM',
    fileName: 'Resume_2024.pdf',
    price: '$2.00',
    rating: 0,
    processingStartTime: '11:00 AM',
    processingEndTime: '1:00 PM',
    queueProgress: 10,
    position: 5,
    pages: 2,
    type: "B&W",
    size: "A4",
    remainingTime: '15 Min'
  },
  {
    id: '#PZ-003',
    status: 'Ready',
    timeAgo: '12:45 PM',
    fileName: 'Marketing_Presentation.ppt',
    price: '$18.75',
    rating: 5,
    processingStartTime: '9:00 AM',
    processingEndTime: '11:00 AM',
    queueProgress: 100,
    position: 1,
    pages: 25,
    type: "Colour",
    size: "A4",
    remainingTime: '0 Min',
    otp: '4829'
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
  const navigate = useNavigate();

  const inProcessOrders = orders.filter(order => ['Processing', 'Waiting', 'Ready'].includes(order.status));
  const completedOrders = orders.filter(order => order.status === 'Completed');
  const displayedOrders = activeTab === 'in-process' ? inProcessOrders : completedOrders;

  const totalSpend = orders.reduce((sum, order) => sum + parseFloat(order.price.slice(1)), 0);

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

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-2 sm:px-4 py-3">
          <ArrowLeft size={20} className="text-gray-600" />
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Pezo</h1>
          <Menu size={20} className="text-gray-600" />
        </div>
      </div>

      {/* Title + Button */}
      <div className="px-2 sm:px-4 pt-6">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
              Order History
            </h2>
            <p className="text-base text-gray-600">
              Track all your printing orders.
            </p>
          </div>

          <button
            onClick={() => navigate('/place-order')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md text-sm sm:text-base transition-all"
          >
            Place Order
          </button>

        </div>

        <div className="bg-white rounded-lg mb-2">
          <div className="flex items-center justify-between px-2 sm:px-4 py-3 sm:py-4">
            <div className="relative flex bg-gray-200 rounded-md p-0.5">
              <button
                onClick={() => setActiveTab('in-process')}
                className={`relative z-10 flex-1 px-4 py-2 text-center text-sm font-medium transition-colors ${
                  activeTab === 'in-process'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-300'
                }`}
              >
                In Process
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`relative z-10 flex-1 px-4 py-2 text-center text-sm font-medium transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-300'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg px-2 sm:px-4 py-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{inProcessOrders.length}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{completedOrders.length}</div>
            </div>
            <div className="text-right">
              <div className="text-base sm:text-lg font-bold text-orange-500">${totalSpend.toFixed(2)}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <div>Active</div>
            <div>Completed</div>
            <div className="text-right">Total Spent</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2 sm:p-4">
          {activeTab === 'in-process' ? (
            <div className="flex flex-row space-x-4 pb-4 flex-nowrap overflow-x-auto">
              {displayedOrders.map((order) => (
                <div key={order.id} className="flex-shrink-0 w-[360px]">
                  <InProcessOrderCard
                    order={order}
                    onCommentSubmit={updateOrderComment}
                    onRatingChange={updateOrderRating}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-row space-x-4 pb-4 flex-nowrap overflow-x-auto">
              {displayedOrders.map((order) => (
                <div key={order.id} className="flex-shrink-0 w-[360px]">
                  <CompletedOrderCard
                    order={order}
                    onCommentSubmit={updateOrderComment}
                    onRatingChange={updateOrderRating}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
}

export default App;
