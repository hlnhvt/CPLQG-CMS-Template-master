"use client";

import {
  BarChart2, PieChart, Clock, MapPin, Users, MessageSquare,
  LineChart, UserX, Timer, Hourglass, Smartphone, Activity,
  FlaskConical, Download, RefreshCw, Calendar,
  Filter, Check, Bookmark, Printer, LayoutDashboard
} from "lucide-react";
import SurveySelector from "@/components/SurveySelector";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const NAVIGATION_ITEMS = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/reports/survey/overview" },
  { label: "Theo thời gian", icon: Clock, href: "/reports/survey/time" },
  { label: "Địa phương", icon: MapPin, href: "/reports/survey/location" },
  { label: "Loại người dùng", icon: Users, href: "/reports/survey/user-type" },
  { label: "Thống kê câu hỏi", icon: BarChart2, href: "/reports/survey/questions" },
  { label: "Câu hỏi mở", icon: MessageSquare, href: "/reports/survey/open-ended" },
  { label: "Phân tích câu hỏi", icon: LineChart, href: "/reports/survey/analysis" },
  { label: "Bỏ giữa chừng", icon: UserX, href: "/reports/survey/drop-off" },
  { label: "Thời gian hoàn thành", icon: Timer, href: "/reports/survey/completion-time" },
  { label: "Thời gian trả lời câu hỏi", icon: Hourglass, href: "/reports/survey/question-time" },
  { label: "Thiết bị", icon: Smartphone, href: "/reports/survey/devices" },
  { label: "Hành vi", icon: Activity, href: "/reports/survey/behavior" },
];

export default function SurveyOverviewReport() {
  const pathname = usePathname();
  const [fromDate, setFromDate] = useState<string>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
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
            <span className="text-[#5340FF]">Tổng quan</span>
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
        <div className="w-full max-w-none flex flex-col gap-6 mt-4">

          {/* Survey Selector */}
          <SurveySelector />

          {/* Filter Section */}
          <div className="bg-[#eff3f8] p-4 rounded-2xl flex flex-col md:flex-row items-center gap-6 print:hidden">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
              <Calendar size={18} />
            </div>

            <div className="flex flex-col gap-1.5 w-full md:w-[200px]">
              <label className="text-[11px] font-bold text-gray-400 uppercase pl-1">Từ ngày:</label>
              <div className="relative flex items-center w-full h-[40px] border border-gray-100 rounded-xl bg-white px-3 shadow-sm overflow-hidden">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="flex-1 h-full outline-none bg-transparent text-[13px] text-gray-700"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full md:w-[200px]">
              <label className="text-[11px] font-bold text-gray-400 uppercase pl-1">Đến ngày:</label>
              <div className="relative flex items-center w-full h-[40px] border border-gray-100 rounded-xl bg-white px-3 shadow-sm overflow-hidden">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="flex-1 h-full outline-none bg-transparent text-[13px] text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Overview Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard label="Tổng số phản hồi" value={formatNumber(1458)} color="blue" />
            <StatCard label="Tỷ lệ hoàn thành" value="86%" color="green" />
            <StatCard label="Thời gian trung bình" value="4:12" color="orange" />
            <StatCard label="Lượt xem khảo sát" value={formatNumber(2840)} color="purple" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartBox title="Loại người dùng">
              <div className="h-[300px] flex items-center justify-center relative">
                {/* Dummy SVG Pie Chart */}
                <svg width="200" height="200" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#eff3f8" strokeWidth="6"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#5340FF" strokeWidth="6" strokeDasharray="60 40"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FF9D00" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="-60"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#00D284" strokeWidth="6" strokeDasharray="15 85" strokeDashoffset="-85"></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-lg font-black text-[#14233b]">1.458</span>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Tổng số</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <LegendItem color="bg-[#5340FF]" label="Công dân" value="60%" />
                <LegendItem color="bg-[#FF9D00]" label="Doanh nghiệp" value="25%" />
                <LegendItem color="bg-[#00D284]" label="Cơ quan nhà nước" value="15%" />
              </div>
            </ChartBox>

            <ChartBox title="Nhóm tuổi">
              <div className="h-[300px] flex items-center justify-center relative">
                <svg width="200" height="200" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#eff3f8" strokeWidth="6"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#5340FF" strokeWidth="6" strokeDasharray="40 60"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FF9D00" strokeWidth="6" strokeDasharray="30 70" strokeDashoffset="-40"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#00D284" strokeWidth="6" strokeDasharray="20 80" strokeDashoffset="-70"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FF5050" strokeWidth="6" strokeDasharray="10 90" strokeDashoffset="-90"></circle>
                </svg>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <LegendItem color="bg-[#5340FF]" label="18-25" value="40%" />
                <LegendItem color="bg-[#FF9D00]" label="26-35" value="30%" />
                <LegendItem color="bg-[#00D284]" label="36-45" value="20%" />
                <LegendItem color="bg-[#FF5050]" label="46+" value="10%" />
              </div>
            </ChartBox>

            <ChartBox title="Giới tính">
              <div className="h-[300px] flex items-center justify-center relative">
                <svg width="200" height="200" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#eff3f8" strokeWidth="6"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#5340FF" strokeWidth="6" strokeDasharray="55 45"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FF9D00" strokeWidth="6" strokeDasharray="40 60" strokeDashoffset="-55"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#00D284" strokeWidth="6" strokeDasharray="5 95" strokeDashoffset="-95"></circle>
                </svg>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <LegendItem color="bg-[#5340FF]" label="Nam" value="55%" />
                <LegendItem color="bg-[#FF9D00]" label="Nữ" value="40%" />
                <LegendItem color="bg-[#00D284]" label="Không xác định" value="5%" />
              </div>
            </ChartBox>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    green: "text-green-600 bg-green-50 border-green-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100"
  };

  return (
    <div className={cn("p-6 rounded-2xl border flex flex-col gap-1 shadow-sm", colorMap[color])}>
      <span className="text-xs font-bold uppercase opacity-70">{label}</span>
      <span className="text-3xl font-black">{value}</span>
    </div>
  );
}

function ChartBox({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-sm font-black text-gray-500 uppercase mb-6 border-b border-gray-50 pb-2">{title}</h3>
      {children}
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn("w-3 h-3 rounded-full", color)}></div>
        <span className="text-[13px] font-bold text-gray-600">{label}</span>
      </div>
      <span className="text-[13px] font-black text-[#14233b]">{value}</span>
    </div>
  );
}
