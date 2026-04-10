"use client";

import { 
  Search, ListFilter, Download, RefreshCw, Calendar, ChevronDown, BarChart2, Filter, Settings2, FileText, Check, ChevronLeft, ChevronRight, User, Users, Printer, Activity
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const baseCTVs = [
  "Bùi Thị Trang",
  "Đặng Thu Hồng",
  "Hoàng Xuân Trường",
  "Lê Hải An",
  "Nguyễn Văn Tuấn",
  "Phạm Quang Sáng",
  "Trần Thanh Tùng",
  "Vũ Hải Yến",
  "Lý Mạc Sầu",
  "Trương Vô Kỵ"
];

const ALL_CTVS = [...baseCTVs].sort((a, b) => a.localeCompare(b));

const ALL_STATUSES = ["Tất cả", "Hoạt động", "Không hoạt động"];

const MOCK_DATA = [
  { name: "Bùi Thị Trang", status: "Hoạt động", posted: 45, approved: 45 },
  { name: "Đặng Thu Hồng", status: "Hoạt động", posted: 120, approved: 110 },
  { name: "Hoàng Xuân Trường", status: "Không hoạt động", posted: 10, approved: 8 },
  { name: "Lê Hải An", status: "Hoạt động", posted: 85, approved: 80 },
  { name: "Nguyễn Văn Tuấn", status: "Hoạt động", posted: 210, approved: 195 },
  { name: "Phạm Quang Sáng", status: "Không hoạt động", posted: 0, approved: 0 },
  { name: "Trần Thanh Tùng", status: "Hoạt động", posted: 320, approved: 300 },
  { name: "Vũ Hải Yến", status: "Hoạt động", posted: 15, approved: 10 },
  { name: "Lý Mạc Sầu", status: "Không hoạt động", posted: 5, approved: 1 },
  { name: "Trương Vô Kỵ", status: "Hoạt động", posted: 60, approved: 58 }
].sort((a, b) => a.name.localeCompare(b.name));

const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function ArticleByContributorReport() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  
  const [isCtvOpen, setIsCtvOpen] = useState(false);
  const [selectedCtvs, setSelectedCtvs] = useState<string[]>([]);
  const ctvRef = useRef<HTMLDivElement>(null);

  const [statusFilter, setStatusFilter] = useState("Tất cả");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ctvRef.current && !ctvRef.current.contains(event.target as Node)) {
        setIsCtvOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCtv = (name: string) => {
    if (selectedCtvs.includes(name)) {
      setSelectedCtvs(selectedCtvs.filter(c => c !== name));
    } else {
      setSelectedCtvs([...selectedCtvs, name]);
    }
  };

  const isAllSelected = selectedCtvs.length === ALL_CTVS.length || selectedCtvs.length === 0;

  // Caculate Totals based on filtered data
  const filteredData = MOCK_DATA.filter(item => {
     if (statusFilter !== "Tất cả" && item.status !== statusFilter) return false;
     if (!isAllSelected && !selectedCtvs.includes(item.name)) return false;
     return true;
  });

  const totalPosted = filteredData.reduce((sum, item) => sum + item.posted, 0);
  const totalApproved = filteredData.reduce((sum, item) => sum + item.approved, 0);
  const totalRatio = totalPosted === 0 ? "0%" : `${Math.round((totalApproved / totalPosted) * 100)}%`;

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#5340FF]">
            <Users size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Báo cáo thống kê</div>
            <h1 className="text-xl font-bold text-[#14233b]">Thống kê tin bài theo cộng tác viên</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto w-full flex justify-start p-4 custom-scrollbar">
         <div className="w-full max-w-none flex flex-col gap-4">

            {/* Filter Section */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-0">
                   <Filter size={16} className="text-[#5340FF]" />
                   <h3 className="font-bold text-gray-800 text-[15px]">Bộ lọc dữ liệu</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Từ ngày */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Từ ngày</label>
                        <div className="relative flex items-center w-full h-[38px] border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all shadow-sm">
                            <div className="w-9 h-full flex items-center justify-center text-gray-400 shrink-0">
                                <Calendar size={14} />
                            </div>
                            <input 
                              type="date" 
                              value={fromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                              className="flex-1 h-full pr-3 outline-none bg-transparent text-[13px] text-gray-700" 
                            />
                        </div>
                    </div>

                    {/* Đến ngày */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Đến ngày</label>
                        <div className="relative flex items-center w-full h-[38px] border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all shadow-sm">
                            <div className="w-9 h-full flex items-center justify-center text-gray-400 shrink-0">
                                <Calendar size={14} />
                            </div>
                            <input 
                              type="date" 
                              value={toDate}
                              onChange={(e) => setToDate(e.target.value)}
                              className="flex-1 h-full pr-3 outline-none bg-transparent text-[13px] text-gray-700" 
                            />
                        </div>
                    </div>

                    {/* Cộng tác viên (Multi-select) */}
                    <div className="flex flex-col gap-1.5 relative" ref={ctvRef}>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cộng tác viên</label>
                        <div 
                          className="relative flex items-center justify-between w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                          onClick={() => setIsCtvOpen(!isCtvOpen)}
                        >
                            <div className="flex items-center gap-2 overflow-hidden w-full pr-4">
                               <User size={15} className="text-gray-400 shrink-0" />
                               <span className="text-sm font-medium text-gray-700 truncate select-none">
                                  {isAllSelected ? "Tất cả CTV" : `Đã chọn ${selectedCtvs.length} CTV`}
                               </span>
                            </div>
                            <ChevronDown size={16} className="text-gray-400 shrink-0" />
                        </div>

                        {isCtvOpen && (
                          <div className="absolute top-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-2 max-h-[300px] animate-in fade-in slide-in-from-top-2">
                             <div className="px-3 pb-2 border-b border-gray-100">
                                <button 
                                  className="text-xs font-semibold text-[#5340FF] hover:underline"
                                  onClick={() => setSelectedCtvs([])} // Empty means ALL realistically
                                >
                                  Khôi phục chọn tất cả
                                </button>
                             </div>
                             <div className="overflow-y-auto p-2 custom-scrollbar flex flex-col gap-1">
                                {ALL_CTVS.map(name => (
                                  <div 
                                    key={name}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                                    onClick={() => toggleCtv(name)}
                                  >
                                     <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center transition-colors shrink-0", 
                                        selectedCtvs.includes(name) || isAllSelected ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 group-hover:border-[#5340FF]"
                                     )}>
                                        {(selectedCtvs.includes(name) || isAllSelected) && <Check size={12} strokeWidth={3} className="text-white" />}
                                     </div>
                                     <span className="text-[13px] font-medium text-gray-700 select-none">{name}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}
                    </div>

                    {/* Trạng thái hoạt động */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</label>
                        <div className="relative flex items-center w-full h-[38px] border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all shadow-sm">
                            <div className="w-9 h-full flex items-center justify-center text-gray-400 shrink-0">
                                <Activity size={14} />
                            </div>
                            <select 
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                              className="flex-1 h-full pr-3 outline-none bg-transparent text-[13px] text-gray-700 appearance-none"
                            >
                               {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100 mt-2 gap-3">
                   <button className="h-[38px] px-5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors font-semibold text-[13px]">
                      <Printer size={15} />
                      In
                   </button>
                   <button className="h-[38px] px-5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors font-semibold text-[13px]">
                      <Download size={15} />
                      Xuất file
                   </button>
                   <button className="h-[38px] px-6 rounded-lg bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center gap-2 transition-colors font-bold text-[13px]">
                      <BarChart2 size={15} strokeWidth={2.5} />
                      Thống kê
                   </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
               <div className="w-full overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] w-[5%] min-w-[50px] text-left border-r border-gray-100 uppercase">STT</th>
                        <th className="py-2.5 px-6 font-bold text-gray-800 text-[12px] border-r border-gray-100 w-[35%] text-left uppercase">Cộng tác viên</th>
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] border-r border-gray-100 w-[20%] text-left uppercase">Trạng thái</th>
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] border-r border-gray-100 w-[15%] text-left uppercase">SL Đăng</th>
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] border-r border-gray-100 w-[15%] text-left uppercase">SL Đã duyệt</th>
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] w-[10%] text-left uppercase">Tỷ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? filteredData.map((item, index) => {
                        const ratio = item.posted === 0 ? "0%" : `${Math.round((item.approved / item.posted) * 100)}%`;
                        return (
                        <tr key={index} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors group">
                          <td className="py-2 px-4 text-[13px] font-medium text-gray-500 text-left border-r border-gray-50">{index + 1}</td>
                          <td className="py-2 px-6 text-[13px] font-bold text-[#14233b] border-r border-gray-50">{item.name}</td>
                          <td className="py-2 px-4 text-[13px] text-left border-r border-gray-50">
                             <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold", 
                                item.status === "Hoạt động" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                             )}>
                               {item.status}
                             </span>
                          </td>
                          <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-left border-r border-gray-50">{formatNumber(item.posted)}</td>
                          <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-left border-r border-gray-50">{formatNumber(item.approved)}</td>
                          <td className="py-2 px-4 text-[13px] font-bold text-[#5340FF] text-left">{ratio}</td>
                        </tr>
                      )}) : (
                        <tr>
                           <td colSpan={6} className="py-8 text-center text-[13px] text-gray-500 font-medium">
                              Không tìm thấy dữ liệu thống kê phù hợp
                           </td>
                        </tr>
                      )}
                    </tbody>
                    {filteredData.length > 0 && (
                        <tfoot>
                        <tr className="bg-gray-50">
                            <td className="py-2.5 px-4 text-[12px] font-bold uppercase text-gray-800 text-center border-r border-gray-200" colSpan={3}>Tổng cộng</td>
                            <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-left border-r border-gray-200">{formatNumber(totalPosted)}</td>
                            <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-left border-r border-gray-200">{formatNumber(totalApproved)}</td>
                            <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-left">{totalRatio}</td>
                        </tr>
                        </tfoot>
                    )}
                 </table>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
