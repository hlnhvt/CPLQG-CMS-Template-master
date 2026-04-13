"use client";

import {
  Calendar, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard
} from "lucide-react";
import SurveySelector from "@/components/SurveySelector";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const USER_TYPE_DATA = [
  { label: "Công dân", value: 60, color: "#5340FF" },
  { label: "Doanh nghiệp", value: 25, color: "#FF9D00" },
  { label: "Cơ quan nhà nước", value: 10, color: "#00D284" },
  { label: "Khác", value: 5, color: "#FF4D4D" },
];

const AGE_GROUP_DATA = [
  { label: "18-25", value: 20, color: "#5340FF" },
  { label: "26-35", value: 40, color: "#FF9D00" },
  { label: "36-45", value: 25, color: "#00D284" },
  { label: "46-55", value: 10, color: "#FF4D4D" },
  { label: "56+", value: 5, color: "#4D9FFF" },
];

const GENDER_DATA = [
  { label: "Nam", value: 55, color: "#5340FF" },
  { label: "Nữ", value: 40, color: "#FF9D00" },
  { label: "Không xác định", value: 5, color: "#00D284" },
];

export default function SurveyUserTypeReport() {
  const [fromDate, setFromDate] = useState<string>("2026-04-10");
  const [toDate, setToDate] = useState<string>("2026-04-10");  const [isReloading, setIsReloading] = useState(false);
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
            <span className="text-[#5340FF]">Loại người dùng</span>
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

          <h2 className="text-[18px] font-bold text-[#334155] mb-2 tracking-tight">Thống Kê Theo Loại Người Dùng</h2>

          {/* Filter Section */}
          <div className="bg-[#f1f5f9] p-4 rounded-xl flex flex-col md:flex-row items-center gap-8 print:hidden mb-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2 w-full md:w-[200px]">
                <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">Từ ngày:</label>
                <div className="relative flex items-center w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 shadow-sm">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="flex-1 h-full outline-none bg-transparent text-[13px] font-semibold text-[#334155]"
                  />
                  <Calendar size={15} className="text-gray-400 pointer-events-none absolute right-3" />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-[200px]">
                <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">Đến ngày:</label>
                <div className="relative flex items-center w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 shadow-sm">
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="flex-1 h-full outline-none bg-transparent text-[13px] font-semibold text-[#334155]"
                  />
                  <Calendar size={15} className="text-gray-400 pointer-events-none absolute right-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <ChartCard title="Loại người dùng" data={USER_TYPE_DATA} />
            <ChartCard title="Nhóm tuổi" data={AGE_GROUP_DATA} />
            <ChartCard title="Giới tính" data={GENDER_DATA} />
          </div>
        </div>
      </div>
      <style jsx global>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          width: 30px;
          height: 100%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function ChartCard({ title, data }: { title: string; data: { label: string; value: number; color: string }[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center">
      <h3 className="text-[15px] font-bold text-[#334155] self-start mb-10">{title}</h3>
      <div className="relative w-full aspect-[4/3] flex flex-col items-center justify-center">
        <div className="w-full h-full max-w-[200px] max-h-[200px] mb-6">
          <DonutChart data={data} />
        </div>
        <div className="w-full flex flex-col gap-2 px-4 mt-4">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-2">
                <div className="w-6 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-[12px] font-medium text-[#64748b] group-hover:text-[#334155] transition-colors">{item.label}</span>
              </div>
              <span className="text-[12px] font-bold text-[#334155]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
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
          <circle
            key={idx}
            stroke={item.color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transform: `rotate(${rotation}deg)`, transformOrigin: '70px 70px' }}
            r={normalizedRadius}
            cx={70}
            cy={70}
            className="transition-all duration-1000 ease-in-out"
          />
        );
      })}
      {/* Inner white circle to make it look cleaner if needed, but the donut hole is already there */}
      <circle cx={70} cy={70} r={radius - strokeWidth} fill="white" />
    </svg>
  );
}
