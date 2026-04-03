"use client";

import { 
  ArrowLeft, Check, MoreVertical, Plus, RotateCcw, Link as LinkIcon, ChevronDown, Building2, Layers, Bookmark
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CreateTopicPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2000);
  };

  const handleSaveAndClose = () => {
    showToast("Lưu thành công");
    setTimeout(() => {
      router.push('/content/content_topic');
    }, 1000);
  };

  const handleSaveAndContinue = () => {
    showToast("Lưu thành công");
    setIsMenuOpen(false);
  };

  const handleSaveAndCreateNew = () => {
    showToast("Lưu thành công");
    setIsMenuOpen(false);
    // Reset form fields
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('textarea').forEach(ta => ta.value = '');
  };

  const handleDiscard = () => {
    router.push('/content/content_topic');
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white shadow-sm z-20">
        <div className="flex items-center gap-4">
          <Link href="/content/content_topic" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-[1px] h-8 bg-gray-200 mx-1" />
          <div>
            <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-0.5 text-nowrap leading-tight">Quản lý chủ đề</div>
            <h1 className="text-xl font-bold text-[#14233b] text-nowrap leading-tight">Đang Tạo Bản Ghi Quản lý chủ đề Mới</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 relative">
          <button 
            className="h-10 px-4 rounded-full bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center gap-2 transition-colors font-bold text-sm"
            onClick={handleSaveAndClose}
          >
            <Check size={18} strokeWidth={2.5} />
            Lưu bản ghi
          </button>
          <button 
            className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreVertical size={20} />
          </button>

          {isMenuOpen && (
            <div className="absolute top-12 right-0 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col mt-1 py-1">
              <button 
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 w-full text-left"
                onClick={handleSaveAndContinue}
              >
                 <div className="flex items-center gap-3">
                    <Check size={16} className="text-gray-400" />
                    <span className="font-medium">Lưu và Tiếp Tục Sửa Đổi</span>
                 </div>
                 <span className="text-gray-400 text-xs font-mono">Ctrl+S</span>
              </button>
              <button 
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 w-full text-left"
                onClick={handleSaveAndCreateNew}
              >
                 <div className="flex items-center gap-3">
                    <Plus size={16} className="text-gray-400" />
                    <span className="font-medium">Lưu và Tạo Mới</span>
                 </div>
                 <span className="text-gray-400 text-xs font-mono">Ctrl+Shift+S</span>
              </button>
              <div className="h-[1px] bg-gray-100 my-1"></div>
              <button 
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDiscard}
              >
                 <RotateCcw size={16} className="text-red-500" />
                 <span className="font-medium">Discard All Changes</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full flex justify-start py-8 px-6 custom-scrollbar">
         <div className="w-full max-w-[800px] flex flex-col gap-8">
            
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 flex gap-1 items-center">
                        Mã chủ đề <span className="text-[#5340FF]">*</span>
                    </label>
                    <input type="text" placeholder="VD: TDCS" className="w-full h-11 border border-gray-200 rounded-xl px-4 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all shadow-sm" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 flex gap-1 items-center">
                        Tên chủ đề <span className="text-[#5340FF]">*</span>
                    </label>
                    <input type="text" placeholder="Nhập tên chủ đề..." className="w-full h-11 border border-gray-200 rounded-xl px-4 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all shadow-sm" />
                </div>
            </div>

            {/* Row 2: Slug */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Slug tự sinh (URL) để gắn vào Sitemap</label>
                <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-xl bg-gray-50 overflow-hidden focus-within:bg-white focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all shadow-sm">
                    <div className="w-10 h-full flex items-center justify-center text-gray-400 shrink-0">
                        <LinkIcon size={16} />
                    </div>
                    <input type="text" readOnly placeholder="Tự động sinh từ tên..." className="flex-1 h-full pr-4 outline-none bg-transparent text-sm text-gray-500 font-medium" />
                </div>
                <span className="text-xs text-blue-300 italic">Slug của chuyên trang</span>
            </div>

            {/* Row 3: Parent Topic & Sitemap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Chủ đề cha</label>
                    <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all shadow-sm">
                        <div className="w-10 h-full flex items-center justify-center text-[#5340FF] shrink-0">
                            <Bookmark size={16} />
                        </div>
                        <select className="flex-1 h-full pr-4 outline-none bg-transparent text-sm appearance-none">
                            <option value="">-- Chọn chủ đề cha --</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Sitemap <span className="text-[#5340FF]">*</span></label>
                    <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all shadow-sm">
                        <div className="w-10 h-full flex items-center justify-center text-[#5340FF] shrink-0">
                            <Layers size={16} />
                        </div>
                        <input type="text" placeholder="Chọn sitemap..." className="flex-1 h-full pr-10 outline-none bg-transparent text-sm" />
                        <div className="absolute right-3 flex items-center gap-1">
                            <Plus size={16} className="text-gray-400 cursor-pointer hover:text-[#5340FF]" />
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 4: Mô tả */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 flex gap-1">Mô tả chủ đề <span className="text-[#5340FF]">*</span></label>
                <textarea rows={5} className="w-full border border-gray-200 rounded-xl p-4 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all resize-y text-sm shadow-sm" placeholder="Nhập mô tả chi tiết cho chủ đề này..."></textarea>
            </div>

            {/* Process Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pb-12">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Biên tập viên</label>
                    <button className="w-full h-12 bg-white border-2 border-[#5340FF] text-[#5340FF] font-bold rounded-xl hover:bg-blue-50 transition-all text-sm shadow-sm">
                        Gửi duyệt Review
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Quản trị viên</label>
                    <button className="w-full h-12 bg-[#5340FF] text-white font-bold rounded-xl hover:bg-[#4330EF] transition-all text-sm shadow-md shadow-[#5340FF]/20">
                        Phê duyệt & Xuất bản
                    </button>
                </div>
            </div>

         </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-24 right-6 bg-white border border-gray-200 shadow-2xl rounded-xl px-5 py-3.5 flex items-center gap-3 z-[100] transition-all overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Thanh tiến trình */}
            <div className="absolute bottom-0 left-0 h-1 bg-green-500 animate-[progress_2s_linear]" style={{ animationFillMode: "forwards" }}></div>
            <style>{`
              @keyframes progress {
                from { width: 100%; }
                to { width: 0%; }
              }
            `}</style>
            
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-[13px] font-bold text-gray-800">{toast.message}</span>
        </div>
      )}

    </div>
  );
}
