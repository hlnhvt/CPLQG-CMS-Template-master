"use client";

import { 
  Calendar, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard, LogOut, TrendingDown
} from "lucide-react";
import SurveySelector from "@/components/SurveySelector";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const DROP_OFF_DATA = [
  { index: 6, question: "Khó khăn khi sử dụng cổng thông tin?", type: "Checkbox", count: 48, rate: 31.6 },
  { index: 11, question: "Đề xuất cải thiện (tùy chọn)?", type: "Textarea", count: 38, rate: 25.0 },
  { index: 9, question: "Tính chính xác của thông tin?", type: "Rating", count: 29, rate: 19.1 },
  { index: 10, question: "Bạn có giới thiệu cổng thông tin cho người khác không?", type: "Radio", count: 21, rate: 13.8 },
  { index: 12, question: "Thông tin liên hệ (tùy chọn)?", type: "Text", count: 16, rate: 10.5 },
];

export default function SurveyDropOffReport() {
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
            <span className="text-[#5340FF]">Bỏ giữa chừng</span>
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

          <h2 className="text-[18px] font-bold text-[#334155] mb-6 tracking-tight">Tỷ Lệ Bỏ Giữa Chừng</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
             <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                   <LogOut size={28} />
                </div>
                <div className="flex flex-col text-[#334155]">
                   <span className="text-[32px] font-black leading-none">152</span>
                   <span className="text-[13px] font-bold text-gray-400 mt-1">Bỏ giữa chừng</span>
                </div>
             </div>
             <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                   <TrendingDown size={28} />
                </div>
                <div className="flex flex-col text-[#334155]">
                   <span className="text-[32px] font-black leading-none">18.5%</span>
                   <span className="text-[13px] font-bold text-gray-400 mt-1">Tỷ lệ bỏ cuộc</span>
                </div>
             </div>
          </div>

          <h3 className="text-[16px] font-bold text-[#334155] mb-4 tracking-tight">Câu Hỏi Gây Bỏ Giữa Chừng Nhiều Nhất</h3>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-[#eff3f8] text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <th className="px-6 py-4 w-[100px]">Thứ tự</th>
                      <th className="px-6 py-4">Câu hỏi</th>
                      <th className="px-6 py-4 w-[150px]">Loại</th>
                      <th className="px-6 py-4 w-[150px]">Số lượt bỏ</th>
                      <th className="px-6 py-4 w-[200px]">Tỷ lệ</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {DROP_OFF_DATA.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                         <td className="px-6 py-5 text-[13px] font-bold text-gray-400">{row.index}</td>
                         <td className="px-6 py-5 text-[14px] font-bold text-[#334155]">{row.question}</td>
                         <td className="px-6 py-5">
                            <span className="px-2.5 py-1 rounded-md bg-[#f0f0ff] text-[#5340FF] text-[10px] font-black uppercase tracking-wider">{row.type}</span>
                         </td>
                         <td className="px-6 py-5 text-[15px] font-bold text-red-500">{row.count}</td>
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                               <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-red-400 rounded-full transition-all duration-700" style={{ width: `${row.rate}%` }}></div>
                               </div>
                               <span className="text-[13px] font-bold text-[#334155] min-w-[45px]">{row.rate}%</span>
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
