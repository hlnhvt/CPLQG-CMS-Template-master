"use client";

import {
  Search, ListFilter, Download, RefreshCw, Calendar, ChevronDown, BarChart2, Filter, Settings2, FileText, Check, ChevronLeft, ChevronRight, Bookmark, Printer, Activity, Users
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const FIELDS = [
  "Thuế và kế toán",
  "Lao động - Việc làm",
  "Sở hữu trí tuệ",
  "Đầu tư kinh doanh",
  "Hợp đồng thương mại",
  "Bất động sản",
  "Tranh tụng"
];

const MOCK_DATA = [
  { user: "Công ty TNHH ABC", phone: "0901234567", email: "contact@abc.vn", questions: 12, consults: 3, training: 3, total: 18 },
  { user: "Tập đoàn Vingroup", phone: "0912345678", email: "info@vingroup.net", questions: 5, consults: 8, training: 10, total: 23 },
  { user: "Nguyễn Văn A", phone: "0987654321", email: "nguyenvana@gmail.com", questions: 8, consults: 0, training: 1, total: 9 },
  { user: "HTX Nông nghiệp Xanh", phone: "0965432198", email: "htxxanh@yahoo.com", questions: 3, consults: 2, training: 2, total: 7 },
  { user: "Công ty CP XYZ", phone: "0932165487", email: "admin@xyz.com", questions: 20, consults: 15, training: 5, total: 40 },
].sort((a, b) => b.total - a.total);

const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function UserInteractionReport() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [isFieldOpen, setIsFieldOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fieldRef.current && !fieldRef.current.contains(event.target as Node)) {
        setIsFieldOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(c => c !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const isAllSelected = selectedFields.length === FIELDS.length || selectedFields.length === 0;

  // Caculate Totals
  const totalQuestions = MOCK_DATA.reduce((sum, item) => sum + item.questions, 0);
  const totalConsults = MOCK_DATA.reduce((sum, item) => sum + item.consults, 0);
  const totalTraining = MOCK_DATA.reduce((sum, item) => sum + item.training, 0);
  const totalAll = MOCK_DATA.reduce((sum, item) => sum + item.total, 0);

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
            <h1 className="text-xl font-bold text-[#14233b]">Thống kê tương tác người dùng</h1>
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

              {/* Lĩnh vực */}
              <div className="flex flex-col gap-1.5 relative md:col-span-2" ref={fieldRef}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lĩnh vực</label>
                <div
                  className="relative flex items-center justify-between w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                  onClick={() => setIsFieldOpen(!isFieldOpen)}
                >
                  <div className="flex items-center gap-2 overflow-hidden w-full pr-4">
                    <Bookmark size={16} className="text-gray-400 shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate select-none">
                      {isAllSelected ? "Tất cả lĩnh vực" : `Đã chọn ${selectedFields.length} lĩnh vực`}
                    </span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 shrink-0" />
                </div>

                {isFieldOpen && (
                  <div className="absolute top-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-2 max-h-[300px] animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 pb-2 border-b border-gray-100">
                      <button className="text-xs font-semibold text-[#5340FF] hover:underline" onClick={() => setSelectedFields([])}>Khôi phục chọn tất cả</button>
                    </div>
                    <div className="overflow-y-auto p-2 custom-scrollbar flex flex-col gap-1">
                      {FIELDS.map(cat => (
                        <div key={cat} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group" onClick={() => toggleField(cat)}>
                          <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center transition-colors shrink-0",
                            selectedFields.includes(cat) || isAllSelected ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 group-hover:border-[#5340FF]"
                          )}>
                            {(selectedFields.includes(cat) || isAllSelected) && <Check size={12} strokeWidth={3} className="text-white" />}
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
                    <th className="py-2.5 px-6 font-bold text-gray-800 text-[12px] border-r border-gray-100 w-[20%] text-left uppercase">Người dùng</th>
                    <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] border-r border-gray-100 w-[12%] text-left uppercase">Số điện thoại</th>
                    <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] border-r border-gray-100 w-[15%] text-left uppercase">Email</th>
                    <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-left border-r border-gray-100 w-[12%] uppercase">Câu hỏi đã gửi</th>
                    <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-left border-r border-gray-100 w-[12%] uppercase">Yêu cầu tư vấn</th>
                    <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-left border-r border-gray-100 w-[12%] uppercase">Đề xuất đào tạo</th>
                    <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-left w-[12%] uppercase">Tổng tương tác</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_DATA.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors group">
                      <td className="py-2 px-4 text-[13px] font-medium text-gray-500 text-center border-r border-gray-50">{index + 1}</td>
                      <td className="py-2 px-6 text-[13px] font-bold text-[#14233b] border-r border-gray-50">{item.user}</td>
                      <td className="py-2 px-4 text-[13px] font-medium text-gray-600 border-r border-gray-50">{item.phone}</td>
                      <td className="py-2 px-4 text-[13px] font-medium text-gray-600 border-r border-gray-50">{item.email}</td>
                      <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-right border-r border-gray-50">{formatNumber(item.questions)}</td>
                      <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-right border-r border-gray-50">{formatNumber(item.consults)}</td>
                      <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-right border-r border-gray-50">{formatNumber(item.training)}</td>
                      <td className="py-2 px-4 text-[13px] font-bold text-[#5340FF] text-right">{formatNumber(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td className="py-2.5 px-4 text-[12px] font-bold uppercase text-gray-800 text-center border-r border-gray-200" colSpan={4}>Tổng cộng</td>
                    <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-right border-r border-gray-200">{formatNumber(totalQuestions)}</td>
                    <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-right border-r border-gray-200">{formatNumber(totalConsults)}</td>
                    <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-right border-r border-gray-200">{formatNumber(totalTraining)}</td>
                    <td className="py-2.5 px-4 text-[14px] font-black text-[#5340FF] text-right">{formatNumber(totalAll)}</td>
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
