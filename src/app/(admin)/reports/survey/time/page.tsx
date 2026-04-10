"use client";

import {
  Calendar, ChevronDown, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function SurveyTimeReport() {
  const [fromDate, setFromDate] = useState<string>("2026-03-01");
  const [toDate, setToDate] = useState<string>("2026-03-30");
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
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
            <span className="text-[#5340FF]">Theo thời gian</span>
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
                <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-[#475569] font-sans">Khảo sát mức độ hài lòng về dịch vụ công 2026</div>
              </div>
            )}
          </div>

          <h2 className="text-[18px] font-bold text-[#334155] mb-2 tracking-tight">Lượt Tham Gia Theo Thời Gian</h2>

          {/* Filter Section */}
          <div className="bg-[#f1f5f9] p-4 rounded-xl flex flex-col md:flex-row items-center gap-8 print:hidden mb-4 border border-gray-100">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">Chu kỳ:</label>
              <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                <button onClick={() => setPeriod("day")} className={cn("px-4 py-1.5 rounded-md text-[13px] font-bold transition-all", period === "day" ? "bg-[#5340FF] text-white shadow-sm" : "text-[#475569] hover:bg-gray-50")}>Ngày</button>
                <button onClick={() => setPeriod("week")} className={cn("px-4 py-1.5 rounded-md text-[13px] font-medium transition-all text-[#94a3b8]")}>Tuần</button>
                <button onClick={() => setPeriod("month")} className={cn("px-4 py-1.5 rounded-md text-[13px] font-medium transition-all text-[#94a3b8]")}>Tháng</button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2 w-full md:w-[200px]">
                <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">Từ ngày:</label>
                <div className="relative flex items-center w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 shadow-sm">
                  <input type="text" value="01/03/2026" className="flex-1 h-full outline-none bg-transparent text-[13px] font-semibold text-[#334155]" readOnly />
                  <Calendar size={15} className="text-gray-400" />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-[200px]">
                <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">Đến ngày:</label>
                <div className="relative flex items-center w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 shadow-sm">
                  <input type="text" value="30/03/2026" className="flex-1 h-full outline-none bg-transparent text-[13px] font-semibold text-[#334155]" readOnly />
                  <Calendar size={15} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <LineChartComponent />

          <h2 className="text-[18px] font-bold text-[#334155] mb-4 mt-8 tracking-tight">Phân Bố Theo Loại Đối Tượng Tham Gia</h2>

          <StackedBarChartComponent />
        </div>
      </div>
    </div>
  );
}

function LineChartComponent() {
  const data = [12, 18, 8, 24, 31, 27, 19, 44, 38, 52, 41, 36, 29, 33, 47, 55, 62, 48, 39, 43, 57, 61, 54, 49, 45, 38, 42, 53, 67, 71];
  const viewW = 1000;
  const viewH = 420;
  const chartTop = 20;
  const chartBottom = 350;
  const chartLeft = 50;
  const chartRight = 980;
  const maxVal = 80;

  const points = data.map((v, i) => {
    const x = chartLeft + i * ((chartRight - chartLeft) / 29);
    const y = chartBottom - (v / maxVal) * (chartBottom - chartTop);
    return { x, y };
  });

  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  const yLabels = [0, 10, 20, 30, 40, 50, 60, 70, 80];

  return (
    <div className="bg-[#f8fafc] border border-gray-100 rounded-xl shadow-sm mb-6" style={{ overflow: 'visible' }}>
      <div className="p-6 pb-4">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 bg-white shadow-sm">
            <div className="w-8 h-[3px] bg-[#5340FF] rounded"></div>
            <span className="text-[13px] font-semibold text-gray-500 tracking-wide">Lượt tham gia</span>
          </div>
        </div>
      </div>
      <div className="w-full px-6 pb-8">
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Horizontal grid lines */}
          {yLabels.map(v => {
            const y = chartBottom - (v / maxVal) * (chartBottom - chartTop);
            return (
              <g key={v}>
                <line x1={chartLeft} y1={y} x2={chartRight} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                <text x={chartLeft - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8" fontWeight="500">{v}</text>
              </g>
            );
          })}

          {/* Vertical grid lines */}
          {data.map((_, i) => {
            const x = chartLeft + i * ((chartRight - chartLeft) / 29);
            return <line key={i} x1={x} y1={chartTop} x2={x} y2={chartBottom} stroke="#f1f5f9" strokeWidth="1" />;
          })}

          {/* Bottom axis line */}
          <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="#e2e8f0" strokeWidth="1" />

          {/* Line path */}
          <path d={pathD} fill="none" stroke="#5340FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points + rotated X labels */}
          {points.map((p, i) => {
            const d = (i + 1).toString().padStart(2, '0');
            const date = `${d}/03/2026`;
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="3" fill="white" stroke="#5340FF" strokeWidth="2" />
                <text
                  x={p.x}
                  y={chartBottom + 14}
                  fontSize="9.5"
                  fill="#94a3b8"
                  textAnchor="end"
                  transform={`rotate(-45 ${p.x} ${chartBottom + 14})`}
                >{date}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function StackedBarChartComponent() {
  const stackData = [
    { day: "24/03/2026", c: 25, b: 12, a: 8 },
    { day: "25/03/2026", c: 22, b: 14, a: 9 },
    { day: "26/03/2026", c: 18, b: 11, a: 9 },
    { day: "27/03/2026", c: 21, b: 13, a: 8 },
    { day: "28/03/2026", c: 29, b: 16, a: 8 },
    { day: "29/03/2026", c: 35, b: 20, a: 12 },
    { day: "30/03/2026", c: 38, b: 21, a: 12 },
  ];

  const viewW = 1000;
  const viewH = 380;
  const chartTop = 20;
  const chartBottom = 300;
  const chartLeft = 50;
  const chartRight = 980;
  const maxVal = 80;
  const yLabels = [0, 10, 20, 30, 40, 50, 60, 70, 80];

  return (
    <div className="bg-[#f8fafc] border border-gray-100 rounded-xl shadow-sm mb-10" style={{ overflow: 'visible' }}>
      <div className="p-6 pb-4">
        <div className="flex justify-center gap-8 flex-wrap">
          <LegendItem color="bg-[#5340FF]" label="Công dân" />
          <LegendItem color="bg-[#FF9D00]" label="Doanh nghiệp" />
          <LegendItem color="bg-[#00D284]" label="Cơ quan nhà nước" />
        </div>
      </div>
      <div className="w-full px-6 pb-10">
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Horizontal grid lines */}
          {yLabels.map(v => {
            const y = chartBottom - (v / maxVal) * (chartBottom - chartTop);
            return (
              <g key={v}>
                <line x1={chartLeft} y1={y} x2={chartRight} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                <text x={chartLeft - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8" fontWeight="500">{v}</text>
              </g>
            );
          })}

          {/* Bottom axis */}
          <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="#e2e8f0" strokeWidth="1" />

          {/* Bars */}
          {stackData.map((item, i) => {
            const spacing = (chartRight - chartLeft) / stackData.length;
            const centerX = chartLeft + i * spacing + spacing / 2;
            const barWidth = spacing * 0.45;
            const x = centerX - barWidth / 2;

            const scale = (chartBottom - chartTop) / maxVal;

            const cH = item.c * scale;
            const bH = item.b * scale;
            const aH = item.a * scale;

            const y_c = chartBottom - cH;
            const y_b = y_c - bH;
            const y_a = y_b - aH;

            return (
              <g key={i}>
                <rect x={x} y={y_a} width={barWidth} height={aH} fill="#00D284" />
                <rect x={x} y={y_b} width={barWidth} height={bH} fill="#FF9D00" />
                <rect x={x} y={y_c} width={barWidth} height={cH} fill="#5340FF" />
                <text x={centerX} y={chartBottom + 20} textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="500">{item.day}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-6 h-2", color)}></div>
      <span className="text-[13px] font-medium text-[#475569]">{label}</span>
    </div>
  );
}
