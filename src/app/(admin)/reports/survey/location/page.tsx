"use client";

import {
  Calendar, ChevronDown, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard, Search, Filter, ArrowDown
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const LOCATION_DATA = [
  { id: 1, province: "Hà Nội", district: "Hoàn Kiếm", count: 142, percentage: 17.3 },
  { id: 2, province: "TP. Hồ Chí Minh", district: "Quận 1", count: 128, percentage: 15.6 },
  { id: 3, province: "Đà Nẵng", district: "Hải Châu", count: 87, percentage: 10.6 },
  { id: 4, province: "Hà Nội", district: "Cầu Giấy", count: 76, percentage: 9.2 },
  { id: 5, province: "TP. Hồ Chí Minh", district: "Bình Thạnh", count: 65, percentage: 7.9 },
  { id: 6, province: "Cần Thơ", district: "Ninh Kiều", count: 54, percentage: 6.6 },
  { id: 7, province: "Hải Phòng", district: "Lê Chân", count: 48, percentage: 5.8 },
  { id: 8, province: "Huế", district: "Phú Hội", count: 43, percentage: 5.2 },
  { id: 9, province: "Bình Dương", district: "Dĩ An", count: 38, percentage: 4.6 },
  { id: 10, province: "Đồng Nai", district: "Biên Hòa", count: 32, percentage: 3.9 },
];

export default function SurveyLocationReport() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "province" | "district">("all");
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
            <span className="text-[#5340FF]">Địa phương</span>
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

          <h1 className="text-[18px] font-bold text-[#334155] mb-6 tracking-tight">Thống Kê Theo Địa Phương</h1>

          {/* Filter Bar */}
          <div className="bg-[#f1f5f9] p-5 rounded-xl border border-gray-100 mb-6 print:hidden">
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase pl-1">Hiển thị theo:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterMode("all")}
                  className={cn("px-5 py-2 rounded-lg text-[13px] font-bold transition-all",
                    filterMode === "all" ? "bg-[#5340FF] text-white shadow-md shadow-[#5340FF]/20" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50")
                  }
                >Tất cả</button>
                <button
                  onClick={() => setFilterMode("province")}
                  className={cn("px-5 py-2 rounded-lg text-[13px] font-bold transition-all",
                    filterMode === "province" ? "bg-[#5340FF] text-white shadow-md" : "bg-white text-gray-400/60 border border-gray-200")
                  }
                >Tỉnh / Thành phố</button>
                <button
                  onClick={() => setFilterMode("district")}
                  className={cn("px-5 py-2 rounded-lg text-[13px] font-bold transition-all",
                    filterMode === "district" ? "bg-[#5340FF] text-white shadow-md" : "bg-white text-gray-400/60 border border-gray-200")
                  }
                >Quận / Huyện</button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm shadow-blue-900/5 mb-20">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#eff3f8] border-b border-gray-200">
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase w-[60px]">#</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase ">
                    <div className="flex items-center gap-2">
                      Tỉnh/Thành
                      <Activity size={12} className="text-gray-300" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase">
                    <div className="flex items-center gap-2">
                      Quận/Huyện
                      <Activity size={12} className="text-gray-300" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-[#5340FF] uppercase bg-blue-50/50">
                    <div className="flex items-center gap-2">
                      Số lượng
                      <ArrowDown size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase ">Tỷ lệ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {LOCATION_DATA.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-500">{item.id}</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-[#334155]">{item.province}</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-gray-500/80">{item.district}</td>
                    <td className="px-6 py-4 text-[14px] font-black text-[#334155] bg-blue-50/20">{formatNumber(item.count)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className="h-full bg-[#5340FF] rounded-full group-hover:shadow-[0_0_8px_rgba(83,64,255,0.4)] transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-[13px] font-black text-[#334155] w-12">{item.percentage}%</span>
                      </div>
                    </td>
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
