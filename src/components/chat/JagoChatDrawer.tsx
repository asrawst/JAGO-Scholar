import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Send, 
  Mic, 
  Bot, 
  User, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { AppTab } from '../../types';

export const JagoChatDrawer: React.FC = () => {
  const { 
    isJagoOpen, 
    setIsJagoOpen, 
    chatMessages, 
    sendUserChatMessage, 
    language,
    setActiveTab,
    setSelectedSchemeForDetail,
    schemes
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isJagoOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isJagoOpen]);

  if (!isJagoOpen) return null;

  const handleSend = () => {
    if (!inputVal.trim()) return;
    sendUserChatMessage(inputVal);
    setInputVal('');
  };

  const handleVoiceSimulate = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const voiceQuery = language === 'hi' 
        ? 'मेरी छात्रवृत्ति का स्टेटस क्या है?' 
        : 'Where is my scholarship application?';
      sendUserChatMessage(voiceQuery);
    }, 1400);
  };

  const handleQuickAction = (action: any) => {
    if (action.actionType === 'navigate_tab') {
      setActiveTab(action.payload as AppTab);
      setIsJagoOpen(false);
    } else if (action.actionType === 'check_eligibility' || action.actionType === 'open_scheme') {
      const target = schemes.find(s => s.id === action.payload);
      if (target) {
        setSelectedSchemeForDetail(target);
        setActiveTab('scholarships');
        setIsJagoOpen(false);
      }
    }
  };

  return (
    <div 
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsJagoOpen(false)}
    >
      <div 
        className="bg-white rounded-t-3xl max-w-md w-full mx-auto h-[92%] flex flex-col shadow-2xl overflow-hidden animate-slide-up relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-mota-navy to-slate-900 text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-mota-saffron to-amber-300 flex items-center justify-center text-mota-navy shadow-md flex-shrink-0">
              <Bot className="w-5 h-5 text-mota-navy" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-extrabold text-base tracking-tight text-white">JAGO Assistant</h3>
                <span className="text-[9px] bg-amber-500/30 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/40">
                  AI Context
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium">
                Just Assistance & Guidance Online • MoTA
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsJagoOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>



        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 min-h-0 overscroll-contain">
          {chatMessages.map(msg => {
            const isBot = msg.sender === 'jago';

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-xl bg-mota-navy flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4 text-amber-400" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isBot
                        ? 'bg-white border border-slate-200 text-slate-800 shadow-card-soft rounded-tl-sm'
                        : 'bg-mota-navy text-white font-medium rounded-tr-sm shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-line">
                      {language === 'hi' && msg.textHi ? msg.textHi : msg.text}
                    </p>

                    {/* Optional Context Card inside bot message */}
                    {msg.contextCard && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px]">{msg.contextCard.title}</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                            {msg.contextCard.statusBadge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">{msg.contextCard.details}</p>
                      </div>
                    )}

                    <span className={`block text-[9px] mt-1.5 ${isBot ? 'text-slate-400 text-left' : 'text-slate-300 text-right'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Quick action buttons if provided */}
                  {isBot && msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickActions.map((qa, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickAction(qa)}
                          className="text-[11px] font-semibold bg-white hover:bg-slate-100 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1 active:scale-95 transition-all"
                        >
                          <span>{language === 'hi' ? qa.labelHi : qa.label}</span>
                          <ArrowRight className="w-3 h-3 text-amber-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-xl bg-mota-saffron flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm font-bold text-xs">
                    R
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Pills */}
        <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex items-center space-x-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
          <button
            onClick={() => sendUserChatMessage(language === 'hi' ? 'मेरा आवेदन कहाँ है?' : 'Where is my scholarship?')}
            className="whitespace-nowrap text-[11px] bg-white border border-slate-300 text-slate-700 px-2.5 py-1 rounded-full hover:border-mota-navy active:scale-95 transition-all"
          >
            {language === 'hi' ? '🔍 आवेदन ट्रैक करें' : '🔍 Where is my application?'}
          </button>
          <button
            onClick={() => sendUserChatMessage(language === 'hi' ? 'क्या मैं पोस्ट-मैट्रिक के लिए पात्र हूँ?' : 'Am I eligible for Post-Matric?')}
            className="whitespace-nowrap text-[11px] bg-white border border-slate-300 text-slate-700 px-2.5 py-1 rounded-full hover:border-mota-navy active:scale-95 transition-all"
          >
            {language === 'hi' ? '🎯 पात्रता जांचें' : '🎯 Check Eligibility'}
          </button>
          <button
            onClick={() => sendUserChatMessage(language === 'hi' ? 'डिजिलॉकर से आय प्रमाण पत्र कैसे लिंक करें?' : 'How to sync income certificate?')}
            className="whitespace-nowrap text-[11px] bg-white border border-slate-300 text-slate-700 px-2.5 py-1 rounded-full hover:border-mota-navy active:scale-95 transition-all"
          >
            {language === 'hi' ? '📁 डिजिलॉकर सिंक' : '📁 DigiLocker Sync'}
          </button>
        </div>

        {/* Chat Input with Safe Bottom Padding */}
        <div className="p-3 pb-6 sm:pb-3 bg-white border-t border-slate-200 flex items-center space-x-2 flex-shrink-0 relative z-10 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <button
            onClick={handleVoiceSimulate}
            className={`p-2.5 rounded-full transition-all flex-shrink-0 ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
            title="Voice Query Simulation"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={language === 'hi' ? 'जागो से कुछ भी पूछें...' : 'Ask JAGO anything...'}
            className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-mota-navy focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
          />

          <button
            onClick={handleSend}
            disabled={!inputVal.trim()}
            className="p-2.5 rounded-full bg-mota-navy hover:bg-slate-900 disabled:opacity-40 text-white shadow-sm flex-shrink-0 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
