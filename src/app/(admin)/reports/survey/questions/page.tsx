"use client";

import {
  Calendar, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard
} from "lucide-react";
import SurveySelector from "@/components/SurveySelector";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const QUESTION_DATA = [
  { text: "Bạn thuộc nhóm đối tượng nào?", type: "Radio", current: 820, total: 823, percent: 99.6 },
  { text: "Lĩnh vực pháp lý bạn quan tâm?", type: "Checkbox", current: 815, total: 823, percent: 99.0 },
  { text: "Bạn thường tra cứu văn bản pháp luật qua kênh nào?", type: "Radio", current: 810, total: 823, percent: 98.4 },
  { text: "Mức độ hài lòng với cổng thông tin?", type: "Rating", current: 798, total: 823, percent: 97.0 },
  { text: "Tần suất sử dụng cổng thông tin?", type: "Radio", current: 789, total: 823, percent: 95.9 },
  { text: "Khó khăn khi sử dụng cổng thông tin?", type: "Checkbox", current: 765, total: 823, percent: 93.0 },
  { text: "Tốc độ tải trang?", type: "Scale", current: 753, total: 823, percent: 91.5 },
];

export default function SurveyQuestionsReport() {
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
            <span className="text-[#5340FF]">Thống kê câu hỏi</span>
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

          <h2 className="text-[18px] font-bold text-[#334155] mb-6 tracking-tight">Biểu Đồ Thống Kê Theo Câu Hỏi</h2>

          <div className="flex flex-col gap-4 mb-20">
            {QUESTION_DATA.map((q, idx) => (
              <QuestionCard key={idx} {...q} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ text, type, current, total, percent }: { text: string; type: string; current: number; total: number; percent: number }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[14px] font-bold text-[#334155] leading-relaxed pr-8">{text}</h3>
        <span className="px-2.5 py-1 rounded-md bg-[#f0f0ff] text-[#5340FF] text-[10px] font-black uppercase tracking-wider shrink-0">{type}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00D284] rounded-full group-hover:shadow-[0_0_8px_rgba(0,210,132,0.4)] transition-all duration-700 ease-out"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <div className="shrink-0 text-right min-w-[120px]">
          <span className="text-[13px] font-bold text-gray-400">
            <span className="text-[#334155]">{current}</span>/{total} ({percent}%)
          </span>
        </div>
      </div>
    </div>
  );
}
