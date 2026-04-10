"use client";

import {
  Calendar, ChevronDown, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const SUMMARY_CARDS = [
  { label: "TRUNG BÌNH", value: "5m 24s" },
  { label: "NHANH NHẤT", value: "1m 27s" },
  { label: "CHẬM NHẤT", value: "30m 42s" },
  { label: "TRUNG VỊ", value: "4m 45s" },
];

const DISTRIBUTION_DATA = [
  { label: "< 2 phút", count: 45, color: "#8b80ff" },
  { label: "2-5 phút", count: 198, color: "#FF9D00" },
  { label: "5-10 phút", count: 287, color: "#00D284" },
  { label: "10-20 phút", count: 112, color: "#FF4D4D" },
  { label: "> 20 phút", count: 30, color: "#4D9FFF" },
];

const COMPLETION_LOG = [
  { start: "15:12 30/03/2025", finish: "15:17 30/03/2025", duration: "5m 24s", userType: "Công dân" },
  { start: "16:05 30/03/2025", finish: "16:09 30/03/2025", duration: "4m 27s", userType: "Doanh nghiệp" },
  { start: "17:22 30/03/2025", finish: "17:33 30/03/2025", duration: "11m 18s", userType: "Cơ quan nhà nước" },
  { start: "18:45 30/03/2025", finish: "18:47 30/03/2025", duration: "2m 12s", userType: "Công dân" },
  { start: "21:01 30/03/2025", finish: "21:08 30/03/2025", duration: "7m 45s", userType: "Công dân" },
];

export default function SurveyCompletionTimeReport() {
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
            <span className="text-[#5340FF]">Thời gian hoàn thành</span>
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
                <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm font-bold text-[#334155] font-sans">[Demo] Khảo sát Cổng Thông Tin Quốc Gia</div>
              </div>
            )}
          </div>

          <h2 className="text-[18px] font-bold text-[#334155] mb-6 tracking-tight">Thống Kê Thời Gian Hoàn Thành</h2>

          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {SUMMARY_CARDS.map((card, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-bold text-gray-400 uppercase mb-2">{card.label}</span>
                <span className="text-[24px] font-bold text-[#6366f1]">{card.value}</span>
              </div>
            ))}
          </div>

          {/* Distribution Chart */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm mb-8">
            <h3 className="text-[15px] font-bold text-[#334155] mb-8">Phân phối thời gian hoàn thành</h3>
            <div className="w-full max-w-[800px] mx-auto">
              <TimeDistributionChart data={DISTRIBUTION_DATA} />
            </div>
          </div>

          <h3 className="text-[16px] font-bold text-[#334155] mb-4 tracking-tight">Danh Sách Từng Lượt Hoàn Thành</h3>

          {/* Completion Table */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#eff3f8] text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4 w-[60px]">#</th>
                  <th className="px-6 py-4">Bắt đầu</th>
                  <th className="px-6 py-4">Hoàn thành</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4">Loại người dùng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {COMPLETION_LOG.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 text-[13px] font-medium text-gray-400">{i + 1}</td>
                    <td className="px-6 py-5 text-[14px] font-medium text-[#475569]">{row.start}</td>
                    <td className="px-6 py-5 text-[14px] font-medium text-[#475569]">{row.finish}</td>
                    <td className="px-6 py-5 text-[14px] font-bold text-[#5340FF]">{row.duration}</td>
                    <td className="px-6 py-5 text-[14px] font-medium text-[#475569]">{row.userType}</td>
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

function TimeDistributionChart({ data }: { data: any[] }) {
  const maxVal = 300;
  const viewW = 1000;
  const viewH = 400;
  const chartTop = 20;
  const chartBottom = 350;
  const chartLeft = 60;
  const chartRight = 980;
  const yLabels = [0, 50, 100, 150, 200, 250, 300];

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }} preserveAspectRatio="xMidYMid meet">
      {/* Grid Lines and Y Labels */}
      {yLabels.map(v => {
        const y = chartBottom - (v / maxVal) * (chartBottom - chartTop);
        return (
          <g key={v}>
            <line x1={chartLeft} y1={y} x2={chartRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={chartLeft - 12} y={y + 4} textAnchor="end" fontSize="12" fill="#94a3b8" fontWeight="500">{v}</text>
          </g>
        );
      })}

      {/* X Axis Line */}
      <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="#e2e8f0" strokeWidth="1" />

      {/* Bars */}
      {data.map((item, i) => {
        const spacing = (chartRight - chartLeft) / data.length;
        const centerX = chartLeft + i * spacing + spacing / 2;
        const barWidth = spacing * 0.7;
        const x = centerX - barWidth / 2;
        const h = (item.count / maxVal) * (chartBottom - chartTop);
        const y = chartBottom - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={h} fill={item.color} rx="4" />
            <text x={centerX} y={chartBottom + 25} textAnchor="middle" fontSize="13" fill="#64748b" fontWeight="600">{item.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
