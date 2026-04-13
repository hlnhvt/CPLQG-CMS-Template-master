"use client";

import { 
  Calendar, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard
} from "lucide-react";
import SurveySelector from "@/components/SurveySelector";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const HOUR_DATA = Array.from({ length: 24 }, (_, i) => ({
  label: `${i}h`,
  count: i < 7 ? 0 : i === 7 ? 12 : i === 8 ? 45 : i === 9 ? 87 : i === 10 ? 124 : i === 11 ? 98 : i === 12 ? 75 : i === 13 ? 65 : i === 14 ? 105 : i === 15 ? 98 : i === 16 ? 87 : i === 17 ? 54 : i === 18 ? 43 : i === 19 ? 38 : i === 20 ? 28 : i === 21 ? 18 : i === 22 ? 8 : 4
}));

const DAY_DATA = [
  { label: "CN", count: 45 },
  { label: "T2", count: 185 },
  { label: "T3", count: 195 },
  { label: "T4", count: 210 },
  { label: "T5", count: 188 },
  { label: "T6", count: 145 },
  { label: "T7", count: 68 },
];

export default function SurveyBehaviorReport() {
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
      <div className="px-6 py-6 shrink-0 flex items-center justify-between bg-white border-b border-gray-200 print:border-none print:pb-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 print:hidden">
            <span>Thống kê</span>
            <span className="text-gray-300">/</span>
            <span>Quản Lý Khảo Sát</span>
            <span className="text-gray-300">-</span>
            <span className="text-[#5340FF]">Hành vi</span>
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

          <h2 className="text-[18px] font-bold text-[#334155] mb-6 tracking-tight">Hành Vi Truy Cập Khảo Sát</h2>

          <div className="flex flex-col lg:flex-row gap-6 mb-20">
             <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <h3 className="text-[15px] font-bold text-[#334155] mb-8">Theo giờ trong ngày</h3>
                <div className="w-full min-h-[300px] relative">
                   <BehaviorBarChart data={HOUR_DATA} maxVal={140} color="#8b80ff" tooltip={true} />
                </div>
             </div>
             <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <h3 className="text-[15px] font-bold text-[#334155] mb-8">Theo ngày trong tuần</h3>
                <div className="w-full min-h-[300px] relative">
                   <BehaviorBarChart data={DAY_DATA} maxVal={250} color="#00D284" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BehaviorBarChart({ data, maxVal, color, tooltip = false }: { data: any[]; maxVal: number; color: string; tooltip?: boolean }) {
  const viewH = 300;
  const viewW = 800;
  const chartBottom = 260;
  const chartTop = 20;
  const chartLeft = 40;
  const chartRight = 780;

  const yLabels = Array.from({ length: 8 }, (_, i) => Math.round((maxVal / 7) * i));

  return (
    <div className="w-full h-full relative group">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        {yLabels.map((v, i) => {
          const y = chartBottom - (v / maxVal) * (chartBottom - chartTop);
          return (
            <g key={i}>
              <line x1={chartLeft} y1={y} x2={chartRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x={chartLeft - 8} y={y + 4} textAnchor="end" fontSize="12" fill="#94a3b8" fontWeight="500">{v}</text>
            </g>
          );
        })}
        <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="#e2e8f0" strokeWidth="1" />
        {data.map((item, i) => {
          const spacing = (chartRight - chartLeft) / data.length;
          const centerX = chartLeft + i * spacing + spacing / 2;
          const barWidth = spacing * 0.7;
          const x = centerX - barWidth / 2;
          const h = (item.count / maxVal) * (chartBottom - chartTop);
          const y = chartBottom - h;
          
          return (
            <g key={i} className="group/bar">
              <rect x={x} y={y} width={barWidth} height={h} fill={color} rx="2" className="transition-all duration-300 hover:opacity-80" />
              {/* Conditional label rendering for better spacing */}
              {(data.length <= 7 || i % 1 === 0) && (
                 <text x={centerX} y={chartBottom + 20} textAnchor="middle" fontSize={data.length > 12 ? "10" : "11"} fill="#64748b" fontWeight="600">
                    {item.label}
                 </text>
              )}
              {tooltip && item.label === "10h" && (
                 <foreignObject x={centerX - 50} y={y - 60} width="100" height="50" className="pointer-events-none print:hidden">
                    <div className="bg-[#1e293b] text-white p-2 rounded-lg text-[11px] shadow-xl flex flex-col gap-0.5 relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-[#1e293b]">
                       <span className="font-bold">{item.label}</span>
                       <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-sm bg-[#8b80ff]"></div>
                          <span>Lượt tham gia: {item.count}</span>
                       </div>
                    </div>
                 </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
