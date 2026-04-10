"use client";

import { 
  Calendar, ChevronDown, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const DEVICES_DATA = [
  { label: "Mobile", count: 456, rate: 55.4, color: "#4D9FFF" },
  { label: "Desktop", count: 312, rate: 37.9, color: "#FF9D00" },
  { label: "Tablet", count: 55, rate: 6.7, color: "#00D284" },
];

const BROWSERS_DATA = [
  { label: "Chrome", count: 487, rate: 59.2, color: "#4D9FFF" },
  { label: "Safari", count: 198, rate: 24.1, color: "#FF9D00" },
  { label: "Firefox", count: 76, rate: 9.2, color: "#00D284" },
  { label: "Edge", count: 45, rate: 5.5, color: "#FF4D4D" },
  { label: "Other", count: 17, rate: 2.1, color: "#4D9FFF" },
];

const OS_DATA = [
  { label: "Android", count: 312, rate: 37.9, color: "#4D9FFF" },
  { label: "iOS", count: 198, rate: 24.1, color: "#FF9D00" },
  { label: "Windows", count: 245, rate: 29.8, color: "#00D284" },
  { label: "macOS", count: 54, rate: 6.6, color: "#FF4D4D" },
  { label: "Linux", count: 14, rate: 1.7, color: "#4D9FFF" },
];

export default function SurveyDevicesReport() {
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
      <div className="px-6 py-6 shrink-0 flex items-center justify-between bg-white border-b border-gray-200 print:border-none print:pb-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 print:hidden">
            <span>Thống kê</span>
            <span className="text-gray-300">/</span>
            <span>Quản Lý Khảo Sát</span>
            <span className="text-gray-300">-</span>
            <span className="text-[#5340FF]">Thiết bị</span>
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
          <div className="relative mb-6" ref={surveyRef}>
            <div className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer hover:border-gray-300 transition-all shadow-sm" onClick={() => setIsSurveyOpen(!isSurveyOpen)}>
              <span className="text-[14px] text-[#334155] font-sans tracking-tight">[Demo] Khảo sát Cổng Thông Tin Quốc Gia</span>
              <ChevronDown size={20} className="text-gray-400 print:hidden" />
            </div>
            {isSurveyOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2 print:hidden">
                <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm font-bold text-[#334155] font-sans">[Demo] Khảo sát Cổng Thông Tin Quốc Gia</div>
              </div>
            )}
          </div>

          <h2 className="text-[18px] font-bold text-[#334155] mb-6 tracking-tight">Thống Kê Thiết Bị Truy Cập</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
             <ChartCard title="Loại thiết bị (Mobile / Tablet / Desktop)">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 h-full">
                   <div className="w-[180px] aspect-square">
                      <DonutChart data={DEVICES_DATA} />
                   </div>
                   <div className="flex flex-col gap-2">
                      {DEVICES_DATA.map((item, i) => (
                         <div key={i} className="flex items-center gap-2">
                            <div className="w-6 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </ChartCard>

             <ChartCard title="Trình duyệt">
                <BarChart data={BROWSERS_DATA} maxVal={500} />
             </ChartCard>

             <ChartCard title="Hệ điều hành">
                <BarChart data={OS_DATA} maxVal={350} />
             </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
             <DataTableCard title="Loại thiết bị" data={DEVICES_DATA} />
             <DataTableCard title="Trình duyệt" data={BROWSERS_DATA} />
             <DataTableCard title="Hệ điều hành" data={OS_DATA} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[350px] flex flex-col">
       <h3 className="text-[13px] font-bold text-[#475569] mb-8">{title}</h3>
       <div className="flex-1 w-full">
          {children}
       </div>
    </div>
  );
}

function DataTableCard({ title, data }: { title: string; data: any[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
       <h3 className="text-[13px] font-bold text-[#475569] mb-2">{title}</h3>
       <div className="flex flex-col gap-4">
          {data.map((item, i) => (
             <div key={i} className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-[#475569]">{item.label}</span>
                <div className="flex items-center gap-4">
                   <span className="text-[14px] font-bold text-[#334155]">{item.count}</span>
                   <span className="px-2 py-0.5 rounded bg-slate-100 text-[#64748b] text-[11px] font-black">{item.rate}%</span>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}

function DonutChart({ data }: { data: any[] }) {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  let currentOffset = 0;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
      {data.map((item, i) => {
        const percentage = (item.count / total) * 100;
        const dashArray = `${percentage} ${100 - percentage}`;
        const dashOffset = -currentOffset;
        currentOffset += percentage;
        return (
          <circle
            key={i}
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke={item.color}
            strokeWidth="12"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            pathLength="100"
            className="transition-all duration-700"
          />
        );
      })}
      <circle cx="50" cy="50" r="28" fill="white" />
    </svg>
  );
}

function BarChart({ data, maxVal }: { data: any[]; maxVal: number }) {
  const viewH = 300;
  const viewW = 500;
  const chartBottom = 260;
  const chartTop = 20;
  const chartLeft = 40;
  const chartRight = 480;

  const yLabels = Array.from({ length: 6 }, (_, i) => Math.round((maxVal / 5) * i));

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full h-full overflow-visible">
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
        const barWidth = spacing * 0.6;
        const x = centerX - barWidth / 2;
        const h = (item.count / maxVal) * (chartBottom - chartTop);
        const y = chartBottom - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={h} fill={item.color} rx="2" />
            <text x={centerX} y={chartBottom + 20} textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">{item.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
