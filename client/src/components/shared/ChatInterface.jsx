import { useState, useEffect } from 'react';
import { getUserById } from '../../shared/utils/items.js';

export default function ChatInterface({ item, currentUserItem, onClose, onTrade }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showTradeConfirm, setShowTradeConfirm] = useState(false);
  
  const itemOwner = getUserById(item.ownerId);
  
  // Mock initial messages
  useEffect(() => {
    const initialMessages = [
      {
        id: 1,
        senderId: item.ownerId,
        senderName: itemOwner?.name || 'Unknown User',
        message: `Hi! I see you're interested in my ${item.name}. What would you like to trade for it?`,
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        isCurrentUser: false
      }
    ];
    setMessages(initialMessages);
  }, [item, itemOwner]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: messages.length + 1,
      senderId: 999, // Current user ID (mock)
      senderName: 'You',
      message: newMessage,
      timestamp: new Date(),
      isCurrentUser: true
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Mock response after 2 seconds
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        senderId: item.ownerId,
        senderName: itemOwner?.name || 'Unknown User',
        message: getRandomResponse(),
        timestamp: new Date(),
        isCurrentUser: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const getRandomResponse = () => {
    const responses = [
      "That sounds like a fair trade! Let me think about it.",
      "I'm interested! Can you tell me more about the condition?",
      "That's exactly what I'm looking for! Let's do this trade.",
      "Hmm, do you have anything else you'd be willing to trade?",
      "Perfect! I'd love to make this trade happen."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleTradeProposal = () => {
    setShowTradeConfirm(true);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {itemOwner?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{itemOwner?.name || 'Unknown User'}</h3>
                <p className="text-sm text-gray-600">Discussing: <span className="font-medium">{item.name}</span></p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[300px]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                msg.isCurrentUser 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${msg.isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trade Proposal Section */}
        {currentUserItem && (
          <div className="p-4 bg-amber-50 border-t border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <span className="text-amber-800 font-medium">Your item:</span>
                  <span className="ml-2 text-gray-700">{currentUserItem.name}</span>
                </div>
              </div>
              <button
                onClick={handleTradeProposal}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Propose Trade
              </button>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send
            </button>
          </div>
        </div>

        {/* Trade Confirmation Modal */}
        {showTradeConfirm && (
          <TradeConfirmationModal
            yourItem={currentUserItem}
            theirItem={item}
            onClose={() => setShowTradeConfirm(false)}
            onConfirm={onTrade}
          />
        )}
      </div>
    </div>
  );
}

function TradeConfirmationModal({ yourItem, theirItem, onClose, onConfirm }) {
  const [yourConfirmed, setYourConfirmed] = useState(false);
  const [theirConfirmed, setTheirConfirmed] = useState(false);
  const [showMeetup, setShowMeetup] = useState(false);
  
  const meetupAddress = "Starbucks, 123 Main Street, San Jose, CA 95112";

  const handleYourConfirmation = () => {
    if (!yourConfirmed) return;
    
    // Simulate other user confirming after 3 seconds
    setTimeout(() => {
      setTheirConfirmed(true);
      setTimeout(() => {
        setShowMeetup(true);
      }, 1000);
    }, 3000);
  };

  if (showMeetup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-60">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Trade Confirmed! 🎉</h3>
          <p className="text-gray-600 mb-6">
            Both parties have confirmed the trade. Here's your meetup location:
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="font-medium text-blue-900">Meetup Location</span>
            </div>
            <p className="text-sm text-blue-800">{meetupAddress}</p>
          </div>
          <button
            onClick={() => {
              onConfirm(meetupAddress);
              onClose();
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-60">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4 text-center text-gray-900">Confirm Trade</h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-blue-900">You're trading:</p>
              <p className="text-sm text-blue-700">{yourItem.name}</p>
            </div>
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <div className="text-right">
              <p className="font-medium text-blue-900">For:</p>
              <p className="text-sm text-blue-700">{theirItem.name}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.934-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-red-900 mb-1">Important Notice:</p>
              <p className="text-red-800">
                Both users must confirm that they are trading their personal items. Any scam will result in permanent ban from the website.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={yourConfirmed}
              onChange={(e) => setYourConfirmed(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I confirm that I own the item "{yourItem.name}" and agree to trade it honestly. I understand that any fraudulent activity will result in permanent ban from the platform.
            </span>
          </label>
          
          <div className="flex items-start gap-3">
            <div className={`mt-1 w-4 h-4 border rounded ${theirConfirmed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
              {theirConfirmed && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-700">
              {theirConfirmed 
                ? "✓ Other party has confirmed their agreement" 
                : "⏳ Waiting for other party to confirm..."}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleYourConfirmation}
            disabled={!yourConfirmed}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              yourConfirmed
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {theirConfirmed ? 'Complete Trade' : 'Confirm Trade'}
          </button>
        </div>
      </div>
    </div>
  );
}