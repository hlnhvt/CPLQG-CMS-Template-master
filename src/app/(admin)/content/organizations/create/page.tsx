"use client";

import { 
  ArrowLeft, Check, MoreVertical, Plus, RotateCcw, Building2, ChevronDown, BookOpen, Shield, Users
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [level, setLevel] = useState('trung_uong');

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2000);
  };

  const handleSaveAndClose = () => {
    showToast("Lưu thành công");
    setTimeout(() => {
      router.push('/content/organizations');
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
    router.push('/content/organizations');
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <Link href="/content/organizations" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-xs text-gray-500 font-medium">Tổ chức và cơ quan</div>
            <h1 className="text-xl font-bold text-[#14233b]">Tạo Quản lý cơ quan / đơn vị Mới</h1>
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
      <div className="flex-1 overflow-y-auto w-full flex justify-center py-8 px-6">
         <div className="w-full max-w-[800px] flex flex-col gap-8">
            
            {/* Nhóm 1: Thông tin cơ quan / đơn vị */}
            <div className="flex flex-col gap-6 relative">
               <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <Building2 size={18} className="text-[#5340FF]" />
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Thông tin cơ quan / đơn vị</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-gray-800 flex gap-1">
                           Tên cơ quan / đơn vị <span className="text-[#5340FF]">*</span>
                       </label>
                       <input type="text" placeholder="Nhập tên cơ quan hoặc đơn vị" className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all" />
                   </div>
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-gray-800 flex gap-1">
                           Mã cơ quan <span className="text-[#5340FF]">*</span>
                       </label>
                       <input type="text" placeholder="vd: so-tu-phap-ha-noi" className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all" />
                       <span className="text-xs text-blue-400 italic">Mã này phải khớp với organization_code của account</span>
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-gray-800 flex gap-1">
                           Cấp đơn vị <span className="text-[#5340FF]">*</span>
                       </label>
                       <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-lg bg-white overflow-hidden transition-all focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF]">
                           <select value={level} onChange={e => setLevel(e.target.value)} className="w-full h-full px-4 appearance-none outline-none bg-transparent text-sm text-gray-800">
                               <option value="trung_uong">Trung ương</option>
                               <option value="bo_nganh">Bộ-Ngành</option>
                               <option value="tinh_thanh">Tỉnh-Thành phố</option>
                               <option value="quan_huyen">Quận-Huyện</option>
                               <option value="xa_phuong">Xã-Phường</option>
                           </select>
                           <div className="absolute right-3 pointer-events-none text-gray-400">
                               <ChevronDown size={16} />
                           </div>
                       </div>
                   </div>

                   {level !== 'trung_uong' && (
                       <div className="flex flex-col gap-2">
                           <label className="text-sm font-semibold text-gray-800 flex gap-1">
                               Bộ/Ngành chủ quản
                           </label>
                           <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all">
                               <input type="text" placeholder="Chọn Bộ/Ngành..." className="flex-1 h-full px-4 outline-none bg-transparent placeholder:text-gray-400 text-sm" />
                               <div className="flex items-center gap-1 pr-3 text-gray-400">
                                   <Plus size={16} className="cursor-pointer hover:text-[#5340FF] transition-colors" />
                                   <ChevronDown size={16} className="cursor-pointer hover:text-gray-600 transition-colors" />
                               </div>
                           </div>
                       </div>
                   )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-gray-800 flex gap-1">
                           Cơ quan cấp trên
                       </label>
                       <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all">
                           <input type="text" placeholder="Chọn cơ quan quản lý..." className="flex-1 h-full px-4 outline-none bg-transparent placeholder:text-gray-400 text-sm" />
                           <div className="flex items-center gap-1 pr-3 text-gray-400">
                               <Plus size={16} className="cursor-pointer hover:text-[#5340FF] transition-colors" />
                               <ChevronDown size={16} className="cursor-pointer hover:text-gray-600 transition-colors" />
                           </div>
                       </div>
                   </div>

                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-gray-800">Trạng thái <span className="text-[#5340FF]">*</span></label>
                       <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-lg bg-white overflow-hidden transition-all focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF]">
                           <select defaultValue="active" className="w-full h-full px-4 appearance-none outline-none bg-transparent text-sm text-gray-800">
                               <option value="active" className="text-gray-800">Đang hoạt động</option>
                               <option value="inactive" className="text-gray-800">Đã tắt</option>
                           </select>
                           <div className="absolute right-3 pointer-events-none text-gray-400">
                               <ChevronDown size={16} />
                           </div>
                       </div>
                   </div>
               </div>

               <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-gray-800 flex gap-1">
                       Ghi chú nội bộ
                   </label>
                   <textarea rows={4} className="w-full border border-gray-200 rounded-lg p-4 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all resize-y text-sm" placeholder="Nhập ghi chú..."></textarea>
               </div>
            </div>

            {/* Nhóm 2: Cấu hình phân quyền Directus */}
            <div className="flex flex-col gap-6 relative">
               <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <Shield size={18} className="text-[#5340FF]" />
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Cấu hình phân quyền Directus</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-gray-800 flex gap-1">
                           User Role được gán <span className="text-[#5340FF]">*</span>
                       </label>
                       <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all">
                           <input type="text" placeholder="Chọn Role..." className="flex-1 h-full px-4 outline-none bg-transparent placeholder:text-gray-400 text-sm" />
                           <div className="flex items-center gap-1 pr-3 text-gray-400">
                               <Plus size={16} className="cursor-pointer hover:text-[#5340FF] transition-colors" />
                               <ChevronDown size={16} className="cursor-pointer hover:text-gray-600 transition-colors" />
                           </div>
                       </div>
                       <span className="text-xs text-blue-400 italic">User Role được gán cho toàn bộ tài khoản ở đơn vị</span>
                   </div>

                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-gray-800 flex gap-1">
                           Access Policies <span className="text-[#5340FF]">*</span>
                       </label>
                       <div className="relative flex flex-col w-full border border-gray-200 rounded-lg bg-white overflow-hidden p-2 min-h-11">
                           <div className="flex flex-wrap gap-2 mb-2">
                               <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200">
                                   unit-access-tinh 
                                   <span className="cursor-pointer hover:text-red-500 font-bold ml-1">×</span>
                               </span>
                           </div>
                           <button className="flex items-center gap-2 text-sm text-[#5340FF] hover:text-[#4330EF] font-medium py-1 px-2 hover:bg-blue-50 rounded transition-colors w-fit">
                               <Plus size={14} /> Add existing
                           </button>
                       </div>
                   </div>
               </div>
            </div>

            {/* Nhóm 3: Metadata hệ thống */}
            <div className="flex flex-col gap-6 relative opacity-60">
               <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <BookOpen size={18} className="text-gray-600" />
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Thông tin hệ thống</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-gray-800 flex gap-1">Date Created</label>
                       <input type="text" disabled placeholder="Auto" className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-gray-50 outline-none cursor-not-allowed" />
                   </div>
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-gray-800 flex gap-1">Date Updated</label>
                       <input type="text" disabled placeholder="Auto" className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-gray-50 outline-none cursor-not-allowed" />
                   </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-gray-800 flex gap-1">User Created</label>
                       <input type="text" disabled placeholder="Auto" className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-gray-50 outline-none cursor-not-allowed" />
                   </div>
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-gray-800 flex gap-1">User Updated</label>
                       <input type="text" disabled placeholder="Auto" className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-gray-50 outline-none cursor-not-allowed" />
                   </div>
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
