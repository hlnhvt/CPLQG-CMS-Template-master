"use client";

import { 
  Calendar, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard, Timer
} from "lucide-react";
import SurveySelector from "@/components/SurveySelector";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const QUESTION_TIMING_DATA = [
  { id: "C1", question: "Bạn thuộc nhóm đối tượng nào?", avg: 12, fast: 3, slow: 45, count: 820 },
  { id: "C2", question: "Lĩnh vực pháp lý bạn quan tâm?", avg: 28, fast: 8, slow: 124, count: 815 },
  { id: "C3", question: "Bạn thường tra cứu văn bản pháp luật qua kênh nào?", avg: 18, fast: 5, slow: 87, count: 810 },
  { id: "C4", question: "Mức độ hài lòng với cổng thông tin?", avg: 22, fast: 4, slow: 98, count: 798 },
  { id: "C5", question: "Tần suất sử dụng cổng thông tin?", avg: 15, fast: 4, slow: 76, count: 789 },
  { id: "C6", question: "Khó khăn khi sử dụng cổng thông tin?", avg: 45, fast: 12, slow: 187, count: 765 },
  { id: "C7", question: "Tốc độ tải trang?", avg: 19, fast: 5, slow: 92, count: 753 },
  { id: "C8", question: "Giao diện người dùng?", avg: 21, fast: 6, slow: 103, count: 741 },
  { id: "C9", question: "Tính chính xác của thông tin?", avg: 24, fast: 7, slow: 112, count: 712 },
  { id: "C10", question: "Bạn có giới thiệu cổng thông tin cho người khác không?", avg: 16, fast: 4, slow: 78, count: 698 },
  { id: "C11", question: "Đề xuất cải thiện (tùy chọn)?", avg: 98, fast: 15, slow: 654, count: 421 },
  { id: "C12", question: "Thông tin liên hệ (tùy chọn)?", avg: 34, fast: 8, slow: 198, count: 234 },
];

export default function QuestionTimeReport() {
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


  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden print:static print:h-auto print:bg-white print:overflow-visible">
      <div className="px-6 py-6 shrink-0 flex items-center justify-between bg-white border-b border-gray-200 print:border-none print:pb-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 print:hidden">
            <span>Thống kê</span>
            <span className="text-gray-300">/</span>
            <span>Quản Lý Khảo Sát</span>
            <span className="text-gray-300">-</span>
            <span className="text-[#5340FF]">TG trả lời câu hỏi</span>
          </div>
          <h1 className="text-2xl font-black text-[#14233b]">Quản Lý Khảo Sát</h1>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#5340FF] hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm transition-transform active:scale-95">
            <FlaskConical size={20} strokeWidth={2.5} />
          </button>
          <button onClick={handleDownload} className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#5340FF] hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm transition-transform active:scale-95">
            <Download size={20} strokeWidth={2.5} />
          </button>
          <button onClick={handleReload} className={cn("w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#5340FF] hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm transition-transform active:scale-95", isReloading && "animate-spin cursor-not-allowed opacity-50")} disabled={isReloading}>
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
          <SurveySelector />

          <h2 className="text-[18px] font-bold text-[#334155] mb-6 tracking-tight">Thống Kê Thời Gian Trả Lời Từng Câu Hỏi</h2>

          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm mb-8 relative">
             <div className="flex justify-center gap-6 mb-8 print:mb-4">
                <LegendItem color="bg-[#8b80ff]" label="Trung bình (s)" />
                <LegendItem color="bg-[#00D284]" label="Nhanh nhất (s)" />
                <LegendItem color="bg-[#FF4D4D]" label="Chậm nhất (s)" />
             </div>
             <div className="w-full overflow-x-auto custom-scrollbar-h pb-4">
                <div className="min-w-[800px]">
                   <GroupedBarChart data={QUESTION_TIMING_DATA} />
                </div>
             </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-20">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-[#eff3f8] text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <th className="px-6 py-4 w-[60px]">STT</th>
                      <th className="px-6 py-4">Câu hỏi</th>
                      <th className="px-6 py-4 w-[120px]">TB (Giây)</th>
                      <th className="px-6 py-4 w-[120px]">Nhanh nhất</th>
                      <th className="px-6 py-4 w-[120px]">Chậm nhất</th>
                      <th className="px-6 py-4 w-[120px]">Số lượt</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {QUESTION_TIMING_DATA.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                         <td className="px-6 py-5 text-[13px] font-bold text-gray-400">{i + 1}</td>
                         <td className="px-6 py-5 text-[14px] font-bold text-[#334155]">{row.question}</td>
                         <td className="px-6 py-5 text-[14px] font-black text-[#5340FF]">{formatTime(row.avg)}</td>
                         <td className="px-6 py-5 text-[14px] font-medium text-gray-500">{formatTime(row.fast)}</td>
                         <td className="px-6 py-5 text-[14px] font-medium text-gray-500">{formatTime(row.slow)}</td>
                         <td className="px-6 py-5 text-[14px] font-bold text-[#334155]">{row.count}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-6 h-2 rounded-full", color)}></div>
      <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wide">{label}</span>
    </div>
  );
}

function GroupedBarChart({ data }: { data: any[] }) {
  const maxVal = 700;
  const viewW = 1200;
  const viewH = 400;
  const chartTop = 20;
  const chartBottom = 350;
  const chartLeft = 60;
  const chartRight = 1180;
  const yLabels = [0, 100, 200, 300, 400, 500, 600, 700];

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }} preserveAspectRatio="xMidYMid meet">
      {yLabels.map(v => {
        const y = chartBottom - (v / maxVal) * (chartBottom - chartTop);
        return (
          <g key={v}>
            <line x1={chartLeft} y1={y} x2={chartRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={chartLeft - 12} y={y + 4} textAnchor="end" fontSize="12" fill="#94a3b8" fontWeight="500">{v}</text>
          </g>
        );
      })}
      <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="#e2e8f0" strokeWidth="1" />
      {data.map((item, i) => {
        const groupWidth = (chartRight - chartLeft) / data.length;
        const centerX = chartLeft + i * groupWidth + groupWidth / 2;
        const barWidth = groupWidth * 0.2;
        const spacing = barWidth * 0.2;

        const hAvg = (item.avg / maxVal) * (chartBottom - chartTop);
        const yAvg = chartBottom - hAvg;

        const hFast = (item.fast / maxVal) * (chartBottom - chartTop);
        const yFast = chartBottom - hFast;

        const hSlow = (item.slow / maxVal) * (chartBottom - chartTop);
        const ySlow = chartBottom - hSlow;

        return (
          <g key={i}>
            <rect x={centerX - barWidth * 1.5 - spacing} y={yAvg} width={barWidth} height={hAvg} fill="#8b80ff" rx="2" />
            <rect x={centerX - barWidth / 2} y={yFast} width={barWidth} height={hFast} fill="#00D284" rx="2" />
            <rect x={centerX + barWidth * 0.5 + spacing} y={ySlow} width={barWidth} height={hSlow} fill="#FF4D4D" rx="2" />
            <text x={centerX} y={chartBottom + 25} textAnchor="middle" fontSize="13" fill="#64748b" fontWeight="700">{item.id}</text>
          </g>
        );
      })}
    </svg>
  );
}
