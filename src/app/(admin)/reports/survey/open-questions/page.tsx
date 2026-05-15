"use client";

import {
  Calendar, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard, MessageSquare, Type, ALargeSmall
} from "lucide-react";
import SurveySelector from "@/components/SurveySelector";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

import { ChevronDown, ChevronUp } from "lucide-react";

const MOCK_OPEN_QUESTIONS = [
  {
    id: 1,
    question: "Bạn có góp ý gì để cải thiện Cổng thông tin điện tử?",
    keywords: ["Tốc độ tải trang", "Giao diện", "Tìm kiếm nâng cao", "Ứng dụng di động"],
    answers: [
      { time: "15:12 28/03/2025", text: "Cổng thông tin cần cải thiện tốc độ tải trang, đặc biệt trên thiết bị di động.", words: 16, chars: 86 },
      { time: "16:45 28/03/2025", text: "Giao diện khá thân thiện nhưng cần thêm chức năng tìm kiếm nâng cao.", words: 13, chars: 73 },
      { time: "21:23 27/03/2025", text: "Đề nghị bổ sung tính năng đăng ký nhận thông báo khi có văn bản pháp luật mới.", words: 17, chars: 89 },
      { time: "23:05 27/03/2025", text: "Nên có phiên bản ứng dụng di động để tiện sử dụng hơn.", words: 12, chars: 53 },
      { time: "17:30 26/03/2025", text: "Hệ thống tìm kiếm văn bản cần được cải thiện khi từ khóa không chính xác hoàn toàn.", words: 17, chars: 93 },
    ]
  },
  {
    id: 2,
    question: "Bạn gặp khó khăn gì khi tra cứu văn bản pháp luật?",
    keywords: ["Từ khóa", "Lọc kết quả", "Văn bản liên quan"],
    answers: [
      { time: "09:12 28/03/2025", text: "Tính năng lọc kết quả theo lĩnh vực chưa thực sự chính xác.", words: 12, chars: 66 },
      { time: "10:20 28/03/2025", text: "Khó tìm được các văn bản hướng dẫn thi hành liên quan đến luật gốc.", words: 14, chars: 78 },
    ]
  }
];

export default function SurveyOpenQuestionsReport() {
  const [isReloading, setIsReloading] = useState(false);
  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
    }, 1000);
  };

  const handleDownload = () => {
    window.print();
  };


  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden print:static print:h-auto print:bg-white print:overflow-visible">
      {/* Breadcrumb and Page Title + Action Buttons */}
      <div className="px-6 py-6 shrink-0 flex items-center justify-between bg-white border-b border-gray-200 print:border-none print:pb-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 print:hidden">
            <span>Thống kê</span>
            <span className="text-gray-300">/</span>
            <span>Quản Lý Khảo Sát</span>
            <span className="text-gray-300">-</span>
            <span className="text-[#5340FF]">Câu hỏi mở</span>
          </div>
          <h1 className="text-2xl font-black text-[#14233b]">Quản Lý Khảo Sát</h1>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#5340FF] hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm transition-transform active:scale-95">
            <FlaskConical size={20} strokeWidth={2.5} />
          </button>
          <button
            onClick={handleDownload}
            className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#5340FF] hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm transition-transform active:scale-95"
          >
            <Download size={20} strokeWidth={2.5} />
          </button>
          <button
            onClick={handleReload}
            className={cn(
              "w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#5340FF] hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm transition-transform active:scale-95",
              isReloading && "animate-spin cursor-not-allowed opacity-50"
            )}
            disabled={isReloading}
          >
            <RefreshCw size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full flex justify-start p-6 pt-0 custom-scrollbar relative print:overflow-visible print:px-0 print:p-0">
        {isReloading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-[100] flex items-center justify-center animate-in fade-in duration-300 print:hidden">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#5340FF]/20 border-t-[#5340FF] rounded-full animate-spin"></div>
              <span className="text-sm font-bold text-[#5340FF] animate-pulse">Đang cập nhật dữ liệu...</span>
            </div>
          </div>
        )}
        <div className="w-full max-w-none flex flex-col gap-0 mt-4">

          {/* Survey Selector */}
          <SurveySelector />

          <h2 className="text-[18px] font-bold text-[#334155] mb-6 tracking-tight">Phân Tích Câu Hỏi Mở</h2>

          {/* Summary Stats Bar */}
          {/* <div className="bg-[#f1f5f9] p-4 rounded-xl flex items-center gap-8 mb-6 border border-gray-100 print:hidden">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-gray-400" />
              <span className="text-[13px] text-gray-400 font-medium">Tổng câu trả lời: <span className="text-[#334155] font-bold">421</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Type size={18} className="text-gray-400" />
              <span className="text-[13px] text-gray-400 font-medium">Trung bình: <span className="text-[#334155] font-bold">24 từ/câu</span></span>
            </div>
            <div className="flex items-center gap-2">
              <ALargeSmall size={20} className="text-gray-400" />
              <span className="text-[13px] text-gray-400 font-medium">Trung bình: <span className="text-[#334155] font-bold">142 ký tự/câu</span></span>
            </div>
          </div> */}

          <div className="flex flex-col gap-6 mb-20">
            {MOCK_OPEN_QUESTIONS.map((q, idx) => (
              <QuestionCard key={q.id} questionData={q} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ questionData, index }: { questionData: typeof MOCK_OPEN_QUESTIONS[0]; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#14233b] mb-3">
              <span className="text-[#5340FF] mr-1.5">Câu {index + 1}:</span>
              {questionData.question}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-semibold text-[#5340FF] bg-blue-50 px-2 py-1 rounded-md border border-blue-100 flex items-center gap-1">
                Từ khóa nổi bật:
              </span>
              {questionData.keywords.map((kw, idx) => (
                <span key={idx} className="text-[12px] font-medium text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-full shadow-sm">
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[13px] font-bold text-gray-500 hover:text-[#5340FF] transition-colors shrink-0 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm"
          >
            {isExpanded ? (
              <>Thu gọn <ChevronUp size={16} /></>
            ) : (
              <>Xem chi tiết <ChevronDown size={16} /></>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 bg-gray-50/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[14px] font-bold text-gray-700">Danh sách câu trả lời ({questionData.answers.length})</h4>
          </div>
          <div className="flex flex-col gap-3">
            {questionData.answers.map((ans, idx) => (
              <FeedbackCard key={idx} {...ans} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackCard({ time, text, words, chars }: { time: string; text: string; words: number; chars: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-200 transition-colors">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold text-gray-400">{time}</span>
          {/* <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{words} từ • {chars} ký tự</span> */}
        </div>
        <p className="text-[14px] font-medium text-[#334155] leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
