"use client";

import { 
  ArrowLeft, Check, MoreVertical, Plus, RotateCcw, Link as LinkIcon, ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CreateCategoryPage() {
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
      router.push('/content/categories');
    }, 1000);
  };

  const handleSaveAndContinue = () => {
    showToast("Lưu thành công");
    setIsMenuOpen(false);
  };

  const handleSaveAndCreateNew = () => {
    showToast("Lưu thành công");
    setIsMenuOpen(false);
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('textarea').forEach(ta => ta.value = '');
  };

  const handleDiscard = () => {
    router.push('/content/categories');
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <Link href="/content/categories" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-xs text-gray-500 font-medium">Quản lý danh mục</div>
            <h1 className="text-xl font-bold text-[#14233b]">Đang Tạo Bản Ghi Quản lý danh mục Mới</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 relative">
          <button 
            className="w-10 h-10 rounded-full bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center justify-center transition-colors"
            onClick={handleSaveAndClose}
          >
            <Check size={20} strokeWidth={2.5} />
          </button>
          <button 
            className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreVertical size={20} />
          </button>

          {/* Action Menu Popover */}
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
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50"
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
      <div className="flex-1 overflow-y-auto w-full flex justify-start py-8 px-6">
         <div className="w-full max-w-[800px] flex flex-col gap-6">
            
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800 flex gap-1">
                        Mã <span className="text-[#5340FF]">*</span>
                    </label>
                    <input type="text" className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800 flex gap-1">
                        Tên danh mục <span className="text-[#5340FF]">*</span>
                    </label>
                    <input type="text" className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all" />
                </div>
            </div>

            {/* Mô tả */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-800 flex gap-1">
                    Mô tả <span className="text-[#5340FF]">*</span>
                </label>
                <textarea rows={4} className="w-full border border-gray-200 rounded-lg p-4 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all resize-y text-sm" placeholder="Nhập mô tả danh mục..."></textarea>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-800 flex gap-1">
                    Sitemap <span className="text-[#5340FF]">*</span>
                </label>
                <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all">
                    <input type="text" placeholder="Chọn một bản ghi..." className="flex-1 h-full px-4 outline-none bg-transparent placeholder:text-gray-400 text-sm" />
                    <div className="flex items-center gap-1 pr-3 text-gray-400">
                        <Plus size={16} className="cursor-pointer hover:text-[#5340FF] transition-colors" />
                        <ChevronDown size={16} className="cursor-pointer hover:text-gray-600 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-800">
                    Slug tự sinh (URL) để gắn vào Sitemap
                </label>
                <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-lg bg-[#f8fafc] overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all focus-within:bg-white">
                    <div className="w-10 h-full flex items-center justify-center text-gray-400 shrink-0">
                        <LinkIcon size={16} />
                    </div>
                    <input type="text" className="flex-1 h-full pr-4 outline-none bg-transparent text-sm" />
                </div>
                <span className="text-xs text-blue-300 italic">Slug của chuyên trang</span>
            </div>

            {/* Row 4 */}
            <div className="flex flex-col gap-2 opacity-60">
                <label className="text-sm font-semibold text-gray-800">Trạng thái</label>
                <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-lg bg-[#f1f5f9] overflow-hidden transition-all cursor-not-allowed">
                    <select disabled className="w-full h-full px-4 appearance-none outline-none bg-transparent text-sm text-gray-600 cursor-not-allowed">
                        <option value="draft" className="text-gray-800">Bản nháp</option>
                        <option value="published" className="text-gray-800">Đã xuất bản</option>
                        <option value="archived" className="text-gray-800">Lưu trữ</option>
                    </select>
                    <div className="absolute right-3 pointer-events-none text-gray-400">
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>



            {/* Row 6 Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-800">Biên tập gửi Review</label>
                    <button 
                      className="w-full h-11 bg-[#5340FF] text-white font-semibold rounded-lg hover:bg-[#4330EF] shadow-sm transition-colors text-sm text-center"
                      onClick={() => showToast('Đã chuyển thành công')}
                    >
                        Gửi duyệt
                    </button>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-800">Quyền xuất bản</label>
                    <button 
                      className="w-full h-11 bg-[#5340FF] text-white font-semibold rounded-lg hover:bg-[#4330EF] shadow-sm transition-colors text-sm text-center"
                      onClick={() => showToast('Đã xuất bản thành công')}
                    >
                        Xuất bản ngay
                    </button>
                </div>
            </div>

            {/* Row 7 Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-800">Chuyển trạng thái</label>
                    <button 
                      className="w-full h-11 bg-[#5340FF] text-white font-semibold rounded-lg hover:bg-[#4330EF] shadow-sm transition-colors text-sm text-center"
                      onClick={() => showToast('Đã revert trạng thái')}
                    >
                        Revert Trạng thái
                    </button>
                </div>
            </div>

         </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-24 right-6 bg-white border border-gray-200 shadow-xl rounded-lg px-5 py-3.5 flex items-center gap-3 z-[100] transition-all overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
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
            <span className="text-[13px] font-semibold text-gray-800">{toast.message}</span>
        </div>
      )}

    </div>
  );
}
