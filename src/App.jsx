import React, { useState } from 'react';
import {
  ArrowLeft,
  Menu
} from 'lucide-react';
import InProcessOrderCard from './components/InProcessOrderCard';
import CompletedOrderCard from './components/CompletedOrderCard';

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

        {/* Segmented Tabs */}
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

        {/* Counts and Total */}
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

        {/* Order Cards */}
        <div className="bg-white rounded-lg p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {activeTab === 'in-process' ? (
            displayedOrders.map((order) => (
              <InProcessOrderCard
                key={order.id}
                order={order}
                onRatingChange={updateOrderRating}
                onCommentSubmit={updateOrderComment}
              />
            ))
          ) : (
            displayedOrders.map((order) => (
              <CompletedOrderCard
                key={order.id}
                order={order}
                onCommentSubmit={updateOrderComment}
              />
            ))
          )}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}

export default App;
