"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Filter, Calendar, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

const SURVEY_TOPICS = [
  "Tất cả chủ đề",
  "Khảo sát Cấp Quốc Gia",
  "Khảo sát Bộ Ngành",
  "Khảo sát Địa phương",
  "Khảo sát Doanh nghiệp",
];

const MOCK_SURVEYS = [
  { id: 1, title: "[Demo] Khảo sát Cổng Thông Tin Quốc Gia", topic: "Khảo sát Cấp Quốc Gia", status: "Đang diễn ra" },
  { id: 2, title: "[Demo] Khảo sát sự hài lòng về dịch vụ công trực tuyến", topic: "Khảo sát Bộ Ngành", status: "Đang diễn ra" },
  { id: 3, title: "[Demo] Khảo sát mức độ tiếp cận pháp luật cấp xã", topic: "Khảo sát Địa phương", status: "Đã kết thúc" },
  { id: 4, title: "[Demo] Khảo sát vướng mắc pháp lý cho doanh nghiệp FDI", topic: "Khảo sát Doanh nghiệp", status: "Đang diễn ra" },
  { id: 5, title: "[Demo] Đánh giá hiệu quả công tác tuyên truyền phổ biến PL", topic: "Khảo sát Cấp Quốc Gia", status: "Bản nháp" },
];

export default function SurveySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(MOCK_SURVEYS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filters State
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTopic, setSelectedTopic] = useState("Tất cả chủ đề");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSurveys = MOCK_SURVEYS.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === "Tất cả chủ đề" || survey.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="relative mb-6" ref={dropdownRef}>
      {/* Target Button */}
      <div 
        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer hover:border-gray-300 transition-all shadow-sm group" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#5340FF]/10 flex items-center justify-center text-[#5340FF] print:hidden">
             <Filter size={16} strokeWidth={2.5} />
          </div>
          <span className="text-[14px] text-[#334155] font-sans font-bold tracking-tight">
            {selectedSurvey.title}
          </span>
        </div>
        <div className="flex items-center gap-3 print:hidden">
           <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold">{selectedSurvey.status}</span>
           <ChevronDown size={20} className={cn("text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
        </div>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] print:hidden flex flex-col overflow-hidden">
          
          {/* Filter Bar */}
          <div className="bg-slate-50 border-b border-gray-100 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Date Range */}
             <div className="flex items-center gap-2 col-span-1 md:col-span-1 border border-gray-200 bg-white rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-[#5340FF]">
                <div className="pl-3 text-gray-400"><Calendar size={16} /></div>
                <input 
                   type="date" 
                   className="w-full text-xs text-gray-600 py-2 bg-transparent outline-none"
                   value={fromDate}
                   onChange={(e) => setFromDate(e.target.value)}
                   title="Từ ngày"
                />
                <span className="text-gray-300">-</span>
                <input 
                   type="date" 
                   className="w-full text-xs text-gray-600 py-2 bg-transparent outline-none pr-3"
                   value={toDate}
                   onChange={(e) => setToDate(e.target.value)}
                   title="Đến ngày"
                />
             </div>

             {/* Topic Dropdown */}
             <div className="flex items-center gap-2 col-span-1 border border-gray-200 bg-white rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-[#5340FF] px-3">
                <Folder size={16} className="text-gray-400" />
                <select 
                   className="w-full py-2 text-xs text-gray-600 bg-transparent outline-none cursor-pointer"
                   value={selectedTopic}
                   onChange={(e) => setSelectedTopic(e.target.value)}
                >
                   {SURVEY_TOPICS.map((topic, idx) => (
                      <option key={idx} value={topic}>{topic}</option>
                   ))}
                </select>
             </div>

             {/* Search */}
             <div className="flex items-center gap-2 col-span-1 border border-gray-200 bg-white rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-[#5340FF] px-3">
                <Search size={16} className="text-gray-400" />
                <input 
                   type="text" 
                   placeholder="Tìm kiếm khảo sát..."
                   className="w-full text-xs text-gray-600 py-2 bg-transparent outline-none"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>

          {/* Survey List */}
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
             {filteredSurveys.length > 0 ? (
                filteredSurveys.map((survey) => (
                   <div 
                      key={survey.id}
                      className={cn(
                         "px-4 py-3 rounded-lg cursor-pointer flex flex-col gap-1 transition-colors",
                         selectedSurvey.id === survey.id ? "bg-[#5340FF]/5" : "hover:bg-slate-50"
                      )}
                      onClick={() => {
                         setSelectedSurvey(survey);
                         setIsOpen(false);
                      }}
                   >
                      <div className="flex items-center justify-between">
                         <span className={cn(
                            "text-[14px] font-sans", 
                            selectedSurvey.id === survey.id ? "font-bold text-[#5340FF]" : "font-medium text-[#334155]"
                         )}>
                            {survey.title}
                         </span>
                         {selectedSurvey.id === survey.id && (
                            <div className="w-2 h-2 rounded-full bg-[#5340FF]"></div>
                         )}
                      </div>
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{survey.topic}</span>
                   </div>
                ))
             ) : (
                <div className="p-8 text-center text-sm text-gray-500 font-medium">
                   Không tìm thấy cuộc khảo sát nào.
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
