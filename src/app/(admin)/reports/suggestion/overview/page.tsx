"use client";

import { 
  Search, ListFilter, Download, RefreshCw, Calendar, ChevronDown, BarChart2, Filter, Settings2, FileText, Check, ChevronLeft, ChevronRight, Bookmark, Printer, Activity, Lightbulb
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// Exact list of suggestion fields in correct order, with "Chung" at the top
const ALL_FIELDS = [
  "Chung",
  "Tổ chức và hoạt động của bộ máy Nhà nước pháp quyền XHCN",
  "Phát triển nền kinh tế thị trường định hướng XHCN",
  "Văn hóa, xã hội",
  "Khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số",
  "Tài nguyên, bảo vệ môi trường, thích ứng với biến đổi khí hậu",
  "Quốc phòng, an ninh, đối ngoại"
];

const ORDERED_STATUSES = [
  "Mới gửi",
  "Đã tiếp nhận",
  "Đang xử lý",
  "Đã hoàn thành"
];

// Predefined mock data mapping to the fields (total = newSent + received + processing + processed)
const MOCK_DATA = [
  { field: "Chung", total: 420, newSent: 100, received: 150, processing: 80, processed: 90 },
  { field: "Tổ chức và hoạt động của bộ máy Nhà nước pháp quyền XHCN", total: 280, newSent: 60, received: 80, processing: 60, processed: 80 },
  { field: "Phát triển nền kinh tế thị trường định hướng XHCN", total: 310, newSent: 70, received: 95, processing: 70, processed: 75 },
  { field: "Văn hóa, xã hội", total: 245, newSent: 55, received: 70, processing: 55, processed: 65 },
  { field: "Khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số", total: 380, newSent: 100, received: 110, processing: 70, processed: 100 },
  { field: "Tài nguyên, bảo vệ môi trường, thích ứng với biến đổi khí hậu", total: 195, newSent: 40, received: 50, processing: 50, processed: 55 },
  { field: "Quốc phòng, an ninh, đối ngoại", total: 150, newSent: 30, received: 40, processing: 40, processed: 40 }
];

const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function SuggestionOverviewReport() {
  // From Date: defaults to first day of the current month (local time)
  const [fromDate, setFromDate] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-01`;
  });
  
  // To Date: defaults to current local day
  const [toDate, setToDate] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });
  
  const [isFieldOpen, setIsFieldOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const fieldRef = useRef<HTMLDivElement>(null);

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const statusRef = useRef<HTMLDivElement>(null);

  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fieldRef.current && !fieldRef.current.contains(event.target as Node)) {
        setIsFieldOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const isAllFieldsSelected = selectedFields.length === ALL_FIELDS.length || selectedFields.length === 0;
  const isAllStatusesSelected = selectedStatuses.length === ORDERED_STATUSES.length || selectedStatuses.length === 0;

  // Filter mock data dynamically based on selection
  const filteredData = MOCK_DATA.filter(item => isAllFieldsSelected || selectedFields.includes(item.field));

  // Calculate Totals based on filtered data
  const totalSuggestions = filteredData.reduce((sum, item) => sum + item.total, 0);
  const totalNewSent = filteredData.reduce((sum, item) => sum + item.newSent, 0);
  const totalReceived = filteredData.reduce((sum, item) => sum + item.received, 0);
  const totalProcessing = filteredData.reduce((sum, item) => sum + item.processing, 0);
  const totalProcessed = filteredData.reduce((sum, item) => sum + item.processed, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
    }, 800);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden print:static print:h-auto print:bg-white print:overflow-visible">
      {/* Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white print:border-none print:pb-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#5340FF]">
            <Lightbulb size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Báo cáo thống kê</div>
            <h1 className="text-xl font-bold text-[#14233b]">Thống kê hiến kế theo lĩnh vực</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 print:hidden">
          <button 
            onClick={handleReload}
            className={cn(
              "w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-all",
              isReloading && "animate-spin cursor-not-allowed opacity-50"
            )}
            disabled={isReloading}
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full flex justify-start p-4 custom-scrollbar relative print:overflow-visible print:px-0 print:p-0">
        {isReloading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-[100] flex items-center justify-center animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#5340FF]/20 border-t-[#5340FF] rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-[#5340FF] animate-pulse">Đang làm mới dữ liệu...</span>
            </div>
          </div>
        )}

        <div className="w-full max-w-none flex flex-col gap-4">

            {/* Filter Section */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3 print:hidden">
                <div className="flex items-center gap-2 mb-0">
                   <Filter size={16} className="text-[#5340FF]" />
                   <h3 className="font-bold text-gray-800 text-[15px]">Bộ lọc dữ liệu</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Từ ngày */}
                    <div className="flex flex-col gap-1.5 md:col-span-1">
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
                    <div className="flex flex-col gap-1.5 md:col-span-1">
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

                    {/* Lĩnh vực (Multi-select) */}
                    <div className="flex flex-col gap-1.5 relative md:col-span-2" ref={fieldRef}>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lĩnh vực hiến kế</label>
                        <div 
                          className="relative flex items-center justify-between w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                          onClick={() => setIsFieldOpen(!isFieldOpen)}
                        >
                            <div className="flex items-center gap-2 overflow-hidden w-full pr-4">
                               <Bookmark size={16} className="text-gray-400 shrink-0" />
                               <span className="text-sm font-medium text-gray-700 truncate select-none">
                                  {isAllFieldsSelected ? "Tất cả lĩnh vực" : `Đã chọn ${selectedFields.length} lĩnh vực`}
                               </span>
                            </div>
                            <ChevronDown size={16} className="text-gray-400 shrink-0" />
                        </div>

                        {isFieldOpen && (
                          <div className="absolute top-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-2 max-h-[300px] animate-in fade-in slide-in-from-top-2">
                             <div className="px-3 pb-2 border-b border-gray-100">
                                <button 
                                  className="text-xs font-semibold text-[#5340FF] hover:underline"
                                  onClick={() => setSelectedFields([])}
                                >
                                  Khôi phục chọn tất cả
                                </button>
                             </div>
                             <div className="overflow-y-auto p-2 custom-scrollbar flex flex-col gap-1">
                                {ALL_FIELDS.map(field => (
                                  <div 
                                    key={field}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                                    onClick={() => toggleField(field)}
                                  >
                                     <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center transition-colors shrink-0", 
                                        selectedFields.includes(field) || isAllFieldsSelected ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 group-hover:border-[#5340FF]"
                                     )}>
                                        {(selectedFields.includes(field) || isAllFieldsSelected) && <Check size={12} strokeWidth={3} className="text-white" />}
                                     </div>
                                     <span className="text-[13px] font-medium text-gray-700 select-none truncate max-w-[90%]">{field}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}
                    </div>

                    {/* Trạng thái (Multi-select) */}
                    <div className="flex flex-col gap-1.5 relative md:col-span-1" ref={statusRef}>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</label>
                        <div 
                          className="relative flex items-center justify-between w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                          onClick={() => setIsStatusOpen(!isStatusOpen)}
                        >
                            <div className="flex items-center gap-2 overflow-hidden w-full pr-4">
                               <Activity size={15} className="text-gray-400 shrink-0" />
                               <span className="text-sm font-medium text-gray-700 truncate select-none">
                                  {isAllStatusesSelected ? "Tất cả trạng thái" : `Đã chọn ${selectedStatuses.length} trạng thái`}
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
                                        selectedStatuses.includes(status) || isAllStatusesSelected ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 group-hover:border-[#5340FF]"
                                     )}>
                                        {(selectedStatuses.includes(status) || isAllStatusesSelected) && <Check size={12} strokeWidth={3} className="text-white" />}
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
                   <button 
                     onClick={handlePrint}
                     className="h-[38px] px-5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors font-semibold text-[13px]"
                   >
                      <Printer size={15} />
                      In
                   </button>
                   <button 
                     onClick={handleReload}
                     className="h-[38px] px-5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors font-semibold text-[13px]"
                   >
                      <Download size={15} />
                      Xuất file
                   </button>
                   <button 
                     onClick={handleReload}
                     className="h-[38px] px-6 rounded-lg bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center gap-2 transition-colors font-bold text-[13px]"
                   >
                      <BarChart2 size={15} strokeWidth={2.5} />
                      Thống kê
                   </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col print:border-none print:shadow-none">
               <div className="w-full overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/50 print:bg-transparent">
                        <th className="py-3 px-4 font-bold text-gray-800 text-[12px] w-[5%] min-w-[50px] text-center border-r border-gray-100 uppercase">STT</th>
                        <th className="py-3 px-6 font-bold text-gray-800 text-[12px] border-r border-gray-100 w-[35%] text-left uppercase">Lĩnh vực hiến kế</th>
                        <th className="py-3 px-4 font-bold text-gray-800 text-[12px] text-right border-r border-gray-100 w-[12%] uppercase">Tổng số hiến kế</th>
                        <th className="py-3 px-4 font-bold text-gray-800 text-[12px] text-right border-r border-gray-100 w-[12%] uppercase">Mới gửi</th>
                        <th className="py-3 px-4 font-bold text-gray-800 text-[12px] text-right border-r border-gray-100 w-[12%] uppercase">Đã tiếp nhận</th>
                        <th className="py-3 px-4 font-bold text-gray-800 text-[12px] text-right border-r border-gray-100 w-[12%] uppercase">Đang xử lý</th>
                        <th className="py-3 px-4 font-bold text-gray-800 text-[12px] text-right w-[12%] uppercase">Đã hoàn thành</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors group print:hover:bg-transparent">
                          <td className="py-2.5 px-4 text-[13px] font-medium text-gray-500 text-center border-r border-gray-50">{index + 1}</td>
                          <td className="py-2.5 px-6 text-[13px] font-bold text-[#14233b] border-r border-gray-50">{item.field}</td>
                          <td className="py-2.5 px-4 text-[13px] font-semibold text-gray-800 text-right border-r border-gray-50">{formatNumber(item.total)}</td>
                          <td className="py-2.5 px-4 text-[13px] font-semibold text-gray-800 text-right border-r border-gray-50">{formatNumber(item.newSent)}</td>
                          <td className="py-2.5 px-4 text-[13px] font-semibold text-gray-800 text-right border-r border-gray-50">{formatNumber(item.received)}</td>
                          <td className="py-2.5 px-4 text-[13px] font-semibold text-gray-800 text-right border-r border-gray-50">{formatNumber(item.processing)}</td>
                          <td className="py-2.5 px-4 text-[13px] font-semibold text-gray-800 text-right">{formatNumber(item.processed)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50/80 font-bold border-t border-gray-200">
                        <td className="py-3 px-4 text-[12px] font-black uppercase text-gray-800 text-center border-r border-gray-200" colSpan={2}>Tổng cộng</td>
                        <td className="py-3 px-4 text-[14px] font-black text-gray-900 text-right border-r border-gray-200">{formatNumber(totalSuggestions)}</td>
                        <td className="py-3 px-4 text-[14px] font-black text-gray-900 text-right border-r border-gray-200">{formatNumber(totalNewSent)}</td>
                        <td className="py-3 px-4 text-[14px] font-black text-gray-900 text-right border-r border-gray-200">{formatNumber(totalReceived)}</td>
                        <td className="py-3 px-4 text-[14px] font-black text-gray-900 text-right border-r border-gray-200">{formatNumber(totalProcessing)}</td>
                        <td className="py-3 px-4 text-[14px] font-black text-gray-900 text-right">{formatNumber(totalProcessed)}</td>
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
