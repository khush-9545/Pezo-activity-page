import React from 'react';
import { Check } from 'lucide-react';
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
export default TimeRangeEditor;
