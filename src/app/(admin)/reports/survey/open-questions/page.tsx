"use client";

import { 
  Calendar, ChevronDown, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard, MessageSquare, Type, ALargeSmall
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const FEEDBACK_DATA = [
  { time: "15:12 28/03/2025", text: "Cổng thông tin cần cải thiện tốc độ tải trang, đặc biệt trên thiết bị di động.", words: 32, chars: 198 },
  { time: "16:45 28/03/2025", text: "Giao diện khá thân thiện nhưng cần thêm chức năng tìm kiếm nâng cao.", words: 18, chars: 112 },
  { time: "21:23 27/03/2025", text: "Đề nghị bổ sung tính năng đăng ký nhận thông báo khi có văn bản pháp luật mới.", words: 28, chars: 174 },
  { time: "23:05 27/03/2025", text: "Nên có phiên bản ứng dụng di động để tiện sử dụng hơn.", words: 15, chars: 94 },
  { time: "17:30 26/03/2025", text: "Hệ thống tìm kiếm văn bản cần được cải thiện khi từ khóa không chính xác hoàn toàn.", words: 41, chars: 256 },
];

export default function SurveyOpenQuestionsReport() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const surveyRef = useRef<HTMLDivElement>(null);

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
    }, 1000);
  };

  const handleDownload = () => {
    window.print();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (surveyRef.current && !surveyRef.current.contains(event.target as Node)) {
        setIsSurveyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="relative mb-6" ref={surveyRef}>
            <div
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer hover:border-gray-300 transition-all shadow-sm"
              onClick={() => setIsSurveyOpen(!isSurveyOpen)}
            >
              <span className="text-[14px] text-[#334155] font-sans tracking-tight">[Demo] Khảo sát Cổng Thông Tin Quốc Gia</span>
              <ChevronDown size={20} className="text-gray-400 print:hidden" />
            </div>
            {isSurveyOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2 print:hidden">
                <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-[#334155] font-sans">[Demo] Khảo sát Cổng Thông Tin Quốc Gia</div>
              </div>
            )}
          </div>

          <h2 className="text-[18px] font-bold text-[#334155] mb-6 tracking-tight">Phân Tích Câu Hỏi Mở</h2>

          {/* Summary Stats Bar */}
          <div className="bg-[#f1f5f9] p-4 rounded-xl flex items-center gap-8 mb-6 border border-gray-100 print:hidden">
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
          </div>

          <div className="flex flex-col gap-4 mb-20">
            {FEEDBACK_DATA.map((item, idx) => (
              <FeedbackCard key={idx} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackCard({ time, text, words, chars }: { time: string; text: string; words: number; chars: number }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group relative">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold text-gray-400/80">{time}</span>
          <span className="text-[11px] font-bold text-gray-400 group-hover:text-gray-500 transition-colors">{words} từ • {chars} ký tự</span>
        </div>
        <p className="text-[14px] font-bold text-[#334155] leading-relaxed max-w-[90%]">{text}</p>
      </div>
    </div>
  );
}
