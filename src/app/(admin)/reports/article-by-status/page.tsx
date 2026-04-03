"use client";

import { 
  Search, ListFilter, Download, RefreshCw, Calendar, ChevronDown, BarChart2, Filter, Settings2, FileText, Check, ChevronLeft, ChevronRight, Bookmark, Printer, Activity
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const ORDERED_STATUSES = [
  "Bản nháp", 
  "Chờ phê duyệt", 
  "Từ chối bài viết", 
  "Chờ xuất bản", 
  "Đã xuất bản", 
  "Đã gỡ bài viết"
];

const MOCK_DATA = [
  { status: "Bản nháp", news: 45, video: 12, image: 8, audio: 0 },
  { status: "Chờ phê duyệt", news: 120, video: 5, image: 12, audio: 2 },
  { status: "Từ chối bài viết", news: 15, video: 2, image: 3, audio: 0 },
  { status: "Chờ xuất bản", news: 85, video: 2, image: 8, audio: 0 },
  { status: "Đã xuất bản", news: 412, video: 35, image: 45, audio: 10 },
  { status: "Đã gỡ bài viết", news: 5, video: 0, image: 2, audio: 0 },
].sort((a, b) => ORDERED_STATUSES.indexOf(a.status) - ORDERED_STATUSES.indexOf(b.status));

export default function ArticleByStatusReport() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const isAllSelected = selectedStatuses.length === ORDERED_STATUSES.length || selectedStatuses.length === 0;

  // Filter Data
  const filteredData = MOCK_DATA.filter(item => {
     if (!isAllSelected && !selectedStatuses.includes(item.status)) return false;
     return true;
  });

  // Calculate Totals
  const totalNews = filteredData.reduce((sum, item) => sum + item.news, 0);
  const totalVideo = filteredData.reduce((sum, item) => sum + item.video, 0);
  const totalImage = filteredData.reduce((sum, item) => sum + item.image, 0);
  const totalAudio = filteredData.reduce((sum, item) => sum + item.audio, 0);

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#5340FF]">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Báo cáo thống kê</div>
            <h1 className="text-xl font-bold text-[#14233b]">Thống kê bài viết theo trạng thái</h1>
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

                    {/* Trạng thái (Multi-select) */}
                    <div className="flex flex-col gap-1.5 relative md:col-span-2" ref={statusRef}>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</label>
                        <div 
                          className="relative flex items-center justify-between w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                          onClick={() => setIsStatusOpen(!isStatusOpen)}
                        >
                            <div className="flex items-center gap-2 overflow-hidden w-full pr-4">
                               <Activity size={15} className="text-gray-400 shrink-0" />
                               <span className="text-sm font-medium text-gray-700 truncate select-none">
                                  {isAllSelected ? "Tất cả trạng thái" : `Đã chọn ${selectedStatuses.length} trạng thái`}
                               </span>
                            </div>
                            <ChevronDown size={16} className="text-gray-400 shrink-0" />
                        </div>

                        {isStatusOpen && (
                          <div className="absolute top-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-2 max-h-[300px] animate-in fade-in slide-in-from-top-2">
                             <div className="px-3 pb-2 border-b border-gray-100">
                                <button 
                                  className="text-xs font-semibold text-[#5340FF] hover:underline"
                                  onClick={() => setSelectedStatuses([])}
                                >
                                  Khôi phục chọn tất cả
                                </button>
                             </div>
                             <div className="overflow-y-auto p-2 custom-scrollbar flex flex-col gap-1">
                                {ORDERED_STATUSES.map(status => (
                                  <div 
                                    key={status}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                                    onClick={() => toggleStatus(status)}
                                  >
                                     <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center transition-colors shrink-0", 
                                        selectedStatuses.includes(status) || isAllSelected ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 group-hover:border-[#5340FF]"
                                     )}>
                                        {(selectedStatuses.includes(status) || isAllSelected) && <Check size={12} strokeWidth={3} className="text-white" />}
                                     </div>
                                     <span className="text-[13px] font-medium text-gray-700 select-none">{status}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}
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
                 <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] w-[5%] min-w-[60px] text-left border-r border-gray-100 uppercase">STT</th>
                        <th className="py-2.5 px-6 font-bold text-gray-800 text-[12px] border-r border-gray-100 w-[35%] text-left uppercase">Trạng thái</th>
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-left border-r border-gray-100 w-[15%] uppercase">Tin bài</th>
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-left border-r border-gray-100 w-[15%] uppercase">Video</th>
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-left border-r border-gray-100 w-[15%] uppercase">Hình ảnh</th>
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-left w-[15%] uppercase">Âm thanh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? filteredData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors group">
                          <td className="py-2 px-4 text-[13px] font-medium text-gray-500 text-left border-r border-gray-50">{index + 1}</td>
                          <td className="py-2 px-6 text-[13px] font-bold text-[#14233b] border-r border-gray-50">{item.status}</td>
                          <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-left border-r border-gray-50">{item.news.toLocaleString()}</td>
                          <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-left border-r border-gray-50">{item.video.toLocaleString()}</td>
                          <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-left border-r border-gray-50">{item.image.toLocaleString()}</td>
                          <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-left">{item.audio.toLocaleString()}</td>
                        </tr>
                      )) : (
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
                            <td className="py-2.5 px-4 text-[12px] font-bold uppercase text-gray-800 text-center border-r border-gray-200" colSpan={2}>Tổng cộng</td>
                            <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-left border-r border-gray-200">{totalNews.toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-left border-r border-gray-200">{totalVideo.toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-left border-r border-gray-200">{totalImage.toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-left">{totalAudio.toLocaleString()}</td>
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
