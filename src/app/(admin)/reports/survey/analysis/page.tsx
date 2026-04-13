"use client";

import {
  Calendar, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard, Filter, ChevronDown
} from "lucide-react";
import SurveySelector from "@/components/SurveySelector";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const DONUT_QUESTIONS = [
  {
    text: "Bạn thuộc nhóm đối tượng nào?",
    type: "Radio",
    data: [
      { label: "Công dân", value: 60, color: "#5340FF" },
      { label: "Doanh nghiệp", value: 25, color: "#FF9D00" },
      { label: "Cơ quan nhà nước", value: 10, color: "#00D284" },
      { label: "Khác", value: 5, color: "#FF4D4D" },
    ]
  },
  {
    text: "Lĩnh vực pháp lý bạn quan tâm?",
    type: "Checkbox",
    data: [
      { label: "Dân sự", value: 25, color: "#5340FF" },
      { label: "Hình sự", value: 20, color: "#FF9D00" },
      { label: "Hành chính", value: 20, color: "#00D284" },
      { label: "Kinh tế - Thương mại", value: 15, color: "#FF4D4D" },
      { label: "Lao động", value: 12, color: "#4D9FFF" },
      { label: "Đất đai", value: 8, color: "#A06FFF" },
    ]
  },
  {
    text: "Bạn thường tra cứu văn bản pháp luật qua kênh nào?",
    type: "Radio",
    data: [
      { label: "Cổng thông tin quốc gia", value: 50, color: "#5340FF" },
      { label: "Website bộ ngành", value: 25, color: "#FF9D00" },
      { label: "Mạng xã hội", value: 15, color: "#00D284" },
      { label: "Báo điện tử", value: 10, color: "#FF4D4D" },
    ]
  }
];

const BAR_QUESTIONS = [
  {
    text: "Mức độ hài lòng với cổng thông tin?",
    type: "Rating",
    labels: ["1 sao", "2 sao", "3 sao", "4 sao", "5 sao"],
    data: [20, 50, 150, 300, 320],
    maxVal: 350
  },
  {
    text: "Tốc độ tải trang?",
    type: "Scale",
    labels: ["1", "2", "3", "4", "5"],
    data: [30, 60, 200, 320, 200],
    maxVal: 350
  }
];

export default function SurveyAnalysisReport() {
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
            <span className="text-[#5340FF]">Phân tích câu hỏi</span>
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

          <h2 className="text-[18px] font-bold text-[#334155] mb-6 tracking-tight">Phân Tích Câu Hỏi</h2>

          <div className="bg-[#f1f5f9] p-5 rounded-xl border border-gray-100 mb-6 print:hidden">
            <div className="flex flex-col gap-2 max-w-[400px]">
              <span className="text-[11px] font-bold text-gray-400 uppercase pl-1">Lọc theo câu hỏi:</span>
              <div className="relative">
                <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-[#334155] outline-none appearance-none cursor-pointer">
                  <option>Tất cả câu hỏi</option>
                  {DONUT_QUESTIONS.map((q, i) => <option key={i}>{q.text}</option>)}
                  {BAR_QUESTIONS.map((q, i) => <option key={i}>{q.text}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 mb-20">
            {DONUT_QUESTIONS.map((q, idx) => <DonutAnalysisCard key={idx} {...q} />)}
            {BAR_QUESTIONS.map((q, idx) => <BarAnalysisCard key={idx} {...q} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function DonutAnalysisCard({ text, type, data }: { text: string; type: string; data: any[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
      <div className="mb-8">
        <h3 className="text-[15px] font-bold text-[#334155] mb-2">{text}</h3>
        <span className="px-2.5 py-1 rounded-md bg-[#f0f0ff] text-[#5340FF] text-[10px] font-black uppercase tracking-wider">{type}</span>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
        <div className="w-full max-w-[280px] aspect-square">
          <AnalysisDonutChart data={data} />
        </div>
        <div className="flex flex-col gap-3 min-w-[200px]">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
              <span className="text-[13px] font-medium text-[#64748b] whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BarAnalysisCard({ text, type, labels, data, maxVal }: { text: string; type: string; labels: string[]; data: number[]; maxVal: number }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
      <div className="mb-12">
        <h3 className="text-[15px] font-bold text-[#334155] mb-2">{text}</h3>
        <span className="px-2.5 py-1 rounded-md bg-[#f0f0ff] text-[#5340FF] text-[10px] font-black uppercase tracking-wider">{type}</span>
      </div>
      <div className="w-full max-w-[800px] mx-auto">
        <AnalysisBarChart labels={labels} data={data} maxVal={maxVal} />
      </div>
    </div>
  );
}

function AnalysisDonutChart({ data }: { data: any[] }) {
  const radius = 70;
  const strokeWidth = 35;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  let cumulativeValue = 0;

  return (
    <svg viewBox="0 0 140 140" className="w-full h-full transform -rotate-90 overflow-visible">
      {data.map((item, idx) => {
        const strokeDashoffset = circumference - (item.value / 100) * circumference;
        const rotation = (cumulativeValue / 100) * 360;
        cumulativeValue += item.value;
        return (
          <circle key={idx} stroke={item.color} fill="transparent" strokeWidth={strokeWidth} strokeDasharray={`${circumference} ${circumference}`} style={{ strokeDashoffset, transform: `rotate(${rotation}deg)`, transformOrigin: '70px 70px' }} r={normalizedRadius} cx={70} cy={70} className="transition-all duration-1000 ease-in-out" />
        );
      })}
      <circle cx={70} cy={70} r={radius - strokeWidth} fill="white" />
    </svg>
  );
}

function AnalysisBarChart({ labels, data, maxVal }: { labels: string[]; data: number[]; maxVal: number }) {
  const viewW = 1000;
  const viewH = 400;
  const chartTop = 20;
  const chartBottom = 350;
  const chartLeft = 60;
  const chartRight = 980;
  const yLabels = [0, 50, 100, 150, 200, 250, 300, 350];

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
      {data.map((val, i) => {
        const spacing = (chartRight - chartLeft) / data.length;
        const centerX = chartLeft + i * spacing + spacing / 2;
        const barWidth = spacing * 0.45;
        const x = centerX - barWidth / 2;
        const h = (val / maxVal) * (chartBottom - chartTop);
        const y = chartBottom - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={h} fill="#8b80ff" rx="4" />
            <text x={centerX} y={chartBottom + 25} textAnchor="middle" fontSize="13" fill="#64748b" fontWeight="600">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}
