"use client";

import { 
  Search, ListFilter, Download, RefreshCw, Calendar, ChevronDown, BarChart2, Filter, Settings2, FileText, Check, ChevronLeft, ChevronRight, Bookmark, Printer
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const baseCategories = [
  "Tin hoạt động",
  "Tin Ban Chỉ đạo Nghị quyết số 66-NQ/TW",
  "Chính sách mới",
  "Thời sự pháp luật",
  "Radio pháp luật",
  "Đại hội lần thứ XIV của Đảng",
  "Câu chuyện thành công",
  "Toàn văn nghị quyết",
  "Nghiên cứu trao đổi pháp luật",
  "Ngày pháp luật Việt Nam"
];

const ALL_CATEGORIES = [...baseCategories].sort((a, b) => a.localeCompare(b));

const MOCK_DATA = [
  { category: "Tin hoạt động", news: 320, video: 15, image: 45, audio: 1 },
  { category: "Tin Ban Chỉ đạo Nghị quyết số 66-NQ/TW", news: 150, video: 10, image: 20, audio: 5 },
  { category: "Chính sách mới", news: 120, video: 5, image: 12, audio: 2 },
  { category: "Thời sự pháp luật", news: 412, video: 10, image: 15, audio: 3 },
  { category: "Radio pháp luật", news: 0, video: 0, image: 0, audio: 15 },
  { category: "Đại hội lần thứ XIV của Đảng", news: 60, video: 5, image: 10, audio: 1 },
  { category: "Câu chuyện thành công", news: 45, video: 12, image: 8, audio: 0 },
  { category: "Toàn văn nghị quyết", news: 56, video: 0, image: 2, audio: 0 },
  { category: "Nghiên cứu trao đổi pháp luật", news: 85, video: 2, image: 8, audio: 0 },
  { category: "Ngày pháp luật Việt Nam", news: 210, video: 0, image: 0, audio: 0 }
].sort((a, b) => a.category.localeCompare(b.category));

export default function ArticleByCategoryReport() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const isAllSelected = selectedCategories.length === ALL_CATEGORIES.length || selectedCategories.length === 0;

  // Caculate Totals
  const totalNews = MOCK_DATA.reduce((sum, item) => sum + item.news, 0);
  const totalVideo = MOCK_DATA.reduce((sum, item) => sum + item.video, 0);
  const totalImage = MOCK_DATA.reduce((sum, item) => sum + item.image, 0);
  const totalAudio = MOCK_DATA.reduce((sum, item) => sum + item.audio, 0);

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#5340FF]">
            <BarChart2 size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Báo cáo thống kê</div>
            <h1 className="text-xl font-bold text-[#14233b]">Thống kê bài viết theo chuyên mục</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
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

                    {/* Chuyên mục (Multi-select) */}
                    <div className="flex flex-col gap-1.5 relative md:col-span-2" ref={categoryRef}>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Chuyên mục</label>
                        <div 
                          className="relative flex items-center justify-between w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        >
                            <div className="flex items-center gap-2 overflow-hidden w-full pr-4">
                               <Bookmark size={16} className="text-gray-400 shrink-0" />
                               <span className="text-sm font-medium text-gray-700 truncate select-none">
                                  {isAllSelected ? "Tất cả chuyên mục" : `Đã chọn ${selectedCategories.length} chuyên mục`}
                               </span>
                            </div>
                            <ChevronDown size={16} className="text-gray-400 shrink-0" />
                        </div>

                        {isCategoryOpen && (
                          <div className="absolute top-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-2 max-h-[300px] animate-in fade-in slide-in-from-top-2">
                             <div className="px-3 pb-2 border-b border-gray-100">
                                <button 
                                  className="text-xs font-semibold text-[#5340FF] hover:underline"
                                  onClick={() => setSelectedCategories([])} // Empty means ALL realistically
                                >
                                  Khôi phục chọn tất cả
                                </button>
                             </div>
                             <div className="overflow-y-auto p-2 custom-scrollbar flex flex-col gap-1">
                                {ALL_CATEGORIES.map(cat => (
                                  <div 
                                    key={cat}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                                    onClick={() => toggleCategory(cat)}
                                  >
                                     <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center transition-colors shrink-0", 
                                        selectedCategories.includes(cat) || isAllSelected ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 group-hover:border-[#5340FF]"
                                     )}>
                                        {(selectedCategories.includes(cat) || isAllSelected) && <Check size={12} strokeWidth={3} className="text-white" />}
                                     </div>
                                     <span className="text-[13px] font-medium text-gray-700 select-none">{cat}</span>
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
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] w-[5%] min-w-[50px] text-left border-r border-gray-100 uppercase">STT</th>
                        <th className="py-2.5 px-6 font-bold text-gray-800 text-[12px] border-r border-gray-100 w-[35%] text-left uppercase">Chuyên mục</th>
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-left border-r border-gray-100 w-[15%] uppercase">Tin bài</th>
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-left border-r border-gray-100 w-[15%] uppercase">Video</th>
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-left border-r border-gray-100 w-[15%] uppercase">Hình ảnh</th>
                        <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-left w-[15%] uppercase">Âm thanh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_DATA.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors group">
                          <td className="py-2 px-4 text-[13px] font-medium text-gray-500 text-center border-r border-gray-50">{index + 1}</td>
                          <td className="py-2 px-6 text-[13px] font-bold text-[#14233b] border-r border-gray-50">{item.category}</td>
                          <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-right border-r border-gray-50">{item.news.toLocaleString()}</td>
                          <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-right border-r border-gray-50">{item.video.toLocaleString()}</td>
                          <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-right border-r border-gray-50">{item.image.toLocaleString()}</td>
                          <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-right">{item.audio.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td className="py-2.5 px-4 text-[12px] font-bold uppercase text-gray-800 text-center border-r border-gray-200" colSpan={2}>Tổng cộng</td>
                        <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-right border-r border-gray-200">{totalNews.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-right border-r border-gray-200">{totalVideo.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-right border-r border-gray-200">{totalImage.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-right">{totalAudio.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                 </table>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
