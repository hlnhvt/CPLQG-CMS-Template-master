"use client";

import {
  ChevronLeft, LayoutTemplate, Save, Send, Eye, Image as ImageIcon,
  Plus, X, GripVertical, Settings2, Globe, Building2, Layers,
  CheckCircle2, AlertCircle, Info, Sparkles, Trash2, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

const AGENCIES = [
  "Bộ Tư pháp", "Cục Hộ tịch", "Cục Kiểm tra VBQPPL", "Tổng cục THADS", "Vụ Pháp luật Hình sự"
];

const CATEGORIES = [
  "Phổ biến GDPL", "Cải cách hành chính", "Tin nổi bật", "Hoạt động lãnh đạo Bộ"
];

export default function CreateInfographicPage() {
  const [activeTab, setActiveTab] = useState("content");
  const [gallery, setGallery] = useState<{ id: string; url: string; name: string }[]>([
    { id: "1", url: "", name: "Infographic_Slide_1.jpg" },
    { id: "2", url: "", name: "Infographic_Slide_2.jpg" },
  ]);
  const [selectedAgency, setSelectedAgency] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const addImage = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setGallery([...gallery, { id: newId, url: "", name: `New_Slide_${gallery.length + 1}.jpg` }]);
  };

  const removeImage = (id: string) => {
    setGallery(gallery.filter(img => img.id !== id));
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Top Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white shadow-sm z-20">
        <div className="flex items-center gap-4">
          <Link href="/content/infographics" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ChevronLeft size={20} className="text-gray-500" />
          </Link>
          <div className="w-[1px] h-8 bg-gray-200 mx-1" />
          <div>
            <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Tạo mới Infographic</div>
            <h1 className="text-lg font-bold text-[#14233b] flex items-center gap-2">
              Chưa đặt tiêu đề
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] text-gray-500 font-bold border border-gray-200">BẢN NHÁP</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
            <Eye size={16} />
            Xem trước
          </button>
          
          <div className="w-[1px] h-6 bg-gray-200 mx-1" />

          <button className="h-10 px-4 rounded-full border border-[#5340FF]/20 text-[#5340FF] bg-white hover:bg-blue-50 text-sm font-bold transition-all flex items-center gap-2">
            <Save size={16} />
            Lưu tạm
          </button>

          <button className="h-10 px-4 rounded-full bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 text-sm font-bold transition-all flex items-center gap-2">
            <Send size={16} />
            Gửi duyệt
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Form Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-[900px] mx-auto space-y-8">
            
            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-gray-200 px-1 mb-8">
              <TabBtn label="Nội dung chính" active={activeTab === "content"} onClick={() => setActiveTab("content")} />
              <TabBtn label="Cài đặt hiển thị" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
              <TabBtn label="SEO & Metadata" active={activeTab === "seo"} onClick={() => setActiveTab("seo")} />
            </div>

            {activeTab === "content" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Title Section */}
                <div className="space-y-3">
                   <label className="text-sm font-bold text-gray-700 ml-1">Tiêu đề Infographic</label>
                   <input 
                      type="text" 
                      placeholder="Nhập tiêu đề tại đây..." 
                      className="w-full text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 placeholder:text-gray-300 p-0"
                   />
                   <div className="w-full h-[1px] bg-gray-200 group-focus-within:bg-[#5340FF]" />
                </div>

                {/* Summary */}
                <div className="space-y-3">
                   <label className="text-sm font-bold text-gray-700 ml-1">Mô tả tóm tắt</label>
                   <textarea 
                      placeholder="Mô tả nội dung chính sẽ giúp người dùng hiểu nhanh thông điệp..." 
                      className="w-full h-24 bg-white border border-gray-200 rounded-xl p-4 text-[14px] text-gray-700 focus:border-[#5340FF] outline-none transition-all resize-none shadow-sm"
                   />
                </div>

                {/* Gallery Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-gray-700">Bộ sưu tập ảnh (Infographic Slides)</h3>
                      <p className="text-[12px] text-gray-400 font-medium">Tải lên các phần của infographic để tạo dạng trượt hoặc cuộn liên tục.</p>
                    </div>
                    <button onClick={addImage} className="h-9 px-3 rounded-lg border border-[#5340FF] text-[#5340FF] hover:bg-blue-50 text-[13px] font-bold transition-all flex items-center gap-2">
                      <Plus size={16} />
                      Thêm ảnh
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {gallery.map((item, index) => (
                      <div key={item.id} className="group relative bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-[#5340FF]/30 transition-all shadow-sm">
                        <div className="cursor-grab text-gray-300 hover:text-gray-400">
                          <GripVertical size={18} />
                        </div>
                        <div className="w-24 h-24 rounded-lg bg-gray-100 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-1 overflow-hidden relative">
                           <ImageIcon size={24} />
                           <span className="text-[10px] font-bold">SLIDE {index + 1}</span>
                           <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <input 
                              type="text" 
                              value={item.name} 
                              className="text-sm font-bold text-gray-700 bg-transparent border-none outline-none focus:ring-0 p-0"
                              onChange={(e) => {
                                const newGal = [...gallery];
                                newGal[index].name = e.target.value;
                                setGallery(newGal);
                              }}
                            />
                            <button onClick={() => removeImage(item.id)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                             <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md text-[11px] text-gray-500 font-medium">
                                <Info size={12} />
                                <span>Chưa có liên kết văn bản</span>
                             </div>
                             <div className="text-[11px] text-[#5340FF] font-bold cursor-pointer hover:underline flex items-center gap-0.5">
                                <ArrowUpRight size={12} />
                                Gắn Link văn bản
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-gray-50/50 hover:bg-gray-50 hover:border-[#5340FF]/30 transition-all cursor-pointer">
                     <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
                        <Plus size={20} />
                     </div>
                     <span className="text-sm font-bold text-gray-400">Kéo thả hoặc Click để tải thêm nhiều ảnh cùng lúc</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Building2 size={16} className="text-[#5340FF]" />
                      Cơ quan liên quan
                    </label>
                    <select 
                      className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm font-medium focus:border-[#5340FF] outline-none transition-all shadow-sm"
                      value={selectedAgency}
                      onChange={(e) => setSelectedAgency(e.target.value)}
                    >
                      <option value="">-- Chọn cơ quan --</option>
                      {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Layers size={16} className="text-[#5340FF]" />
                      Chuyên mục
                    </label>
                    <select 
                      className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm font-medium focus:border-[#5340FF] outline-none transition-all shadow-sm"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">-- Chọn chuyên mục --</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50/50 rounded-2xl p-6 space-y-4 border border-blue-100/50">
                  <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-500" />
                    Gợi ý từ AI
                  </h4>
                  <p className="text-xs text-blue-800/70 leading-relaxed font-medium">
                    Hãy hoàn thiện bộ ảnh để AI có thể tự động phân tích và gắn các tags, chuyên mục phù hợp với nội dung hình ảnh.
                  </p>
                  <button className="w-full py-2 bg-white text-blue-600 rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-all">
                    Chạy Phân Tích
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Info Sidebar */}
        {isSidebarOpen && (
          <aside className="w-[320px] border-l border-gray-200 bg-white shrink-0 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 space-y-8 flex-1 overflow-y-auto">
              {/* Publication Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-tight">
                  <CheckCircle2 size={18} className="text-teal-500" />
                  Xuất bản
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">Trạng thái:</span>
                    <span className="text-amber-500 font-bold">Bản nháp</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">Lượt xem:</span>
                    <span className="text-gray-800 font-bold">0</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">Lần lưu cuối:</span>
                    <span className="text-gray-800 font-bold">Vừa xong</span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100" />

              {/* Tips Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-tight">
                   <AlertCircle size={18} className="text-[#5340FF]" />
                   Thông tin hỗ trợ
                </div>
                <ul className="space-y-3">
                   <TipItem text="Kích thước ảnh tối ưu: 1200x1600px cho từng slide." />
                   <TipItem text="Hỗ trợ định dạng JPG, WebP chất lượng cao." />
                   <TipItem text="Infographic bộ sưu tập sẽ hiển thị dạng slider trên Portal." />
                </ul>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
               <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-white hover:shadow-sm transition-all">
                  Lưu & Xem Lịch Sử
               </button>
               <button className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all">
                  Xóa bài viết này
               </button>
            </div>
          </aside>
        )}
      </div>

      {/* Floating Toggle Sidebar */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={cn("absolute bottom-6 right-6 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all bg-white text-gray-400 border border-gray-200 hover:text-[#5340FF]", isSidebarOpen ? "" : "bg-[#5340FF] text-white")}
      >
        <Settings2 size={24} />
      </button>
    </div>
  );
}

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "pb-4 text-sm font-bold transition-all relative whitespace-nowrap",
        active ? "text-[#5340FF]" : "text-gray-400 hover:text-gray-600"
      )}
    >
      {label}
      {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5340FF] rounded-t-full shadow-[0_-2px_6px_rgba(83,64,255,0.4)]" />}
    </button>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <li className="flex gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-[#5340FF]/40 mt-1.5 shrink-0" />
      <span className="text-[12px] text-gray-500 font-medium leading-relaxed">{text}</span>
    </li>
  );
}
