"use client";

import { 
  ArrowLeft, Check, MoreVertical, Plus, RotateCcw, Database, ChevronDown, HelpCircle, Layers
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MENU_GROUPS } from "@/lib/menu-data";
import { COLLECTION_FIELDS } from "@/lib/collection-fields";

export default function GenericCollectionCreatePage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.collectionId as string;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });

  // Tìm thông tin collection
  let collectionName = collectionId;
  let groupName = "General";
  for(const group of MENU_GROUPS) {
      const found = group.collections.find(c => c.id === collectionId);
      if(found) {
          collectionName = found.label;
          groupName = group.label;
          break;
      }
  }

  // Load form fields from schema
  const fields = COLLECTION_FIELDS[collectionId] || [];
  
  // Lọc các field được dùng để nhập liệu (bỏ id tự tăng, các cột meta ẩn, system fields)
  const editableFields = fields.filter(f => !f.hidden && f.field !== 'id' && !f.system);

  // Phân loại fields
  const tabGroups = editableFields.filter(f => f.interface === 'group-tabs' || f.interface === 'group-raw');
  // Default fields = ko thuộc tab (không có group), và ko phải là định nghĩa tab
  const defaultFields = editableFields.filter(f => !f.group && f.interface !== 'group-tabs' && f.interface !== 'group-raw');

  const firstTabSort = tabGroups.length > 0 ? (tabGroups[0].sort || 9999) : 9999;
  const topFields = defaultFields.filter(f => (f.sort || 9999) <= firstTabSort);
  const bottomFields = defaultFields.filter(f => (f.sort || 9999) > firstTabSort);

  const [activeTab, setActiveTab] = useState<string>(tabGroups.length > 0 ? tabGroups[0].field : '');

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2000);
  };

  const handleSaveAndClose = () => {
    showToast("Lưu thành công");
    setTimeout(() => {
      router.push(`/collections/${collectionId}`);
    }, 1000);
  };

  const handleSaveAndContinue = () => {
    showToast("Lưu thành công");
    setIsMenuOpen(false);
  };

  const handleSaveAndCreateNew = () => {
    showToast("Lưu thành công");
    setIsMenuOpen(false);
    document.querySelectorAll('input').forEach(input => { if(input.type!=='checkbox' && input.type!=='radio') input.value = ''; });
    document.querySelectorAll('textarea').forEach(ta => ta.value = '');
  };

  // Helper render Form Field
  const renderField = (f: any) => {
      const isRequired = f.required || false;
      const isReadonly = f.readonly || false;

      // Publish Button
      if (f.interface === 'publish-button') {
          return (
              <button className="w-full h-11 bg-[#5340FF] hover:bg-[#4330EF] text-white rounded-lg font-bold text-[14px] transition-colors shadow-md shadow-[#5340FF]/25 focus:ring-2 focus:ring-[#5340FF] focus:ring-offset-2">
                 {f.options?.text || f.label || 'Submit'}
              </button>
          );
      }

      // Dropdown / Select
      if (f.interface === 'select-dropdown' && f.options?.choices) {
          return (
              <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-lg bg-white overflow-hidden transition-all focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF]">
                  <select disabled={isReadonly} className="w-full h-full px-4 appearance-none outline-none bg-transparent text-sm text-gray-800 disabled:bg-gray-50 disabled:text-gray-500">
                      <option value="">-- Chọn --</option>
                      {f.options.choices.map((c: any, idx: number) => (
                          <option key={idx} value={c.value}>{c.text}</option>
                      ))}
                  </select>
                  <div className="absolute right-3 pointer-events-none text-gray-400">
                      <ChevronDown size={16} />
                  </div>
              </div>
          );
      }

      // Multiple Checkboxes/Dropdowns
      if (f.interface === 'select-multiple-dropdown' && f.options?.choices) {
         return (
             <div className="relative flex flex-wrap gap-2 w-full min-h-11 border border-gray-200 rounded-lg bg-white p-2">
                 <span className="text-gray-400 text-sm mt-1 ml-1">Giữ Ctrl / Cmd để chọn nhiều...</span>
                 <select multiple disabled={isReadonly} className="w-full h-24 p-2 outline-none bg-transparent text-sm text-gray-800 disabled:bg-gray-50 mt-1">
                     {f.options.choices.map((c: any, idx: number) => (
                         <option key={idx} value={c.value}>{c.text}</option>
                     ))}
                 </select>
             </div>
         );
     }

      // Boolean toggle
      if (f.type === 'boolean' || f.interface === 'boolean') {
          return (
              <label className="flex items-center gap-3 cursor-pointer py-1.5 w-fit">
                  <div className="relative">
                      <input type="checkbox" className="sr-only peer" disabled={isReadonly} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5340FF] opacity-90"></div>
                  </div>
                  <span className="text-sm font-medium text-[#5340FF]">Đã kích hoạt</span>
              </label>
          );
      }

      // Textarea / HTML / RichText
      if (f.interface === 'input-multiline' || f.type === 'text' || f.interface === 'input-rich-text-html') {
          return (
              <textarea rows={f.interface === 'input-rich-text-html' ? 10 : 4} disabled={isReadonly} className="w-full border border-gray-200 rounded-lg p-4 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all resize-y text-[13.5px] text-gray-800 disabled:bg-gray-50 disabled:text-gray-500" placeholder={`Nhập nội dung...`}></textarea>
          );
      }

      // File/Image upload
      if (f.interface === 'file-image' || f.interface === 'files') {
          return (
              <div className="w-full border-2 border-dashed border-gray-300 hover:border-[#5340FF] transition-colors rounded-lg flex flex-col items-center justify-center py-8 bg-gray-50/50 cursor-pointer min-h-[160px]">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#5340FF] flex items-center justify-center mb-2">
                     <Plus size={20} />
                  </div>
                  <span className="text-[13px] text-gray-400 italic">Chọn tệp đính kèm. Tối đa 10MB.</span>
              </div>
          );
      }

      // Relation (M2O / M2M)
      if (f.relation) {
          return (
             <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all disabled:bg-gray-50">
                 <input type="text" disabled={isReadonly} placeholder={`Chọn mục...`} className="flex-1 h-full px-4 outline-none bg-transparent placeholder:text-gray-400 text-sm disabled:cursor-not-allowed disabled:bg-gray-50" />
                 <div className="flex items-center gap-1 pr-3 text-gray-400">
                     <Plus size={16} className="cursor-pointer hover:text-[#5340FF] transition-colors" />
                     <ChevronDown size={16} className="cursor-pointer hover:text-gray-600 transition-colors" />
                 </div>
             </div>
          );
      }

      // DateTime
      if (f.type === 'dateTime' || f.type === 'date' || f.type === 'timestamp') {
          return (
              <input type={f.type==='date'?'date':'datetime-local'} disabled={isReadonly} className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all text-sm disabled:bg-gray-50 disabled:text-gray-500" />
          );
      }

      // Default (String / Number / UUID / Generic Input)
      return (
          <input type={f.type === 'integer' || f.type === 'float' ? 'number' : 'text'} disabled={isReadonly} placeholder="" className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all text-sm disabled:bg-gray-50 disabled:text-gray-500 text-gray-800" />
      );
  }
  
  // Render function cho layout field
  const renderFieldBlock = (f: any) => {
      // Xác định width dựa trên Schema
      const isFullWidth = f.width === 'full';
      
      return (
          <div key={f.field} className={cn("flex flex-col", isFullWidth ? "col-span-1 md:col-span-2" : "col-span-1")}>
              <label className="text-[14px] font-semibold text-[#14233b] flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                     {f.label || f.field} {f.required && <span className="text-[#5340FF]">*</span>}
                  </div>
                  {f.note && (
                      <span className="text-gray-400 group relative cursor-help">
                          <HelpCircle size={14} />
                          <div className="absolute bottom-5 right-0 w-max max-w-[250px] p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                             {f.note}
                          </div>
                      </span>
                  )}
              </label>
              {renderField(f)}
          </div>
      );
  };

  const currentTabFields = editableFields.filter(f => f.group === activeTab);

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <Link href={`/collections/${collectionId}`} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-xs text-gray-500 font-medium">{groupName}</div>
            <h1 className="text-xl font-bold text-[#14233b]">Tạo {collectionName}</h1>
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

          {isMenuOpen && (
            <div className="absolute top-12 right-0 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col mt-1 py-1">
              <button className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 w-full text-left" onClick={handleSaveAndContinue}>
                 <div className="flex items-center gap-3"><Check size={16} className="text-gray-400" /><span className="font-medium">Lưu và Tiếp Tục Sửa Đổi</span></div>
                 <span className="text-gray-400 text-xs font-mono">Ctrl+S</span>
              </button>
              <button className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 w-full text-left" onClick={handleSaveAndCreateNew}>
                 <div className="flex items-center gap-3"><Plus size={16} className="text-gray-400" /><span className="font-medium">Lưu và Tạo Mới</span></div>
                 <span className="text-gray-400 text-xs font-mono">Ctrl+Shift+S</span>
              </button>
              <div className="h-[1px] bg-gray-100 my-1"></div>
              <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => router.push(`/collections/${collectionId}`)}>
                 <RotateCcw size={16} className="text-red-500" /><span className="font-medium">Hủy Thay Đổi</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full flex justify-center py-6 px-6 bg-[#f8fafc]">
         <div className="w-full max-w-[800px] flex flex-col gap-6 pb-10">
            
            {editableFields.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    Chưa có trường dữ liệu nào được cấu hình cho collection này.
                </div>
            )}

            {/* Các trường Default nửa trên (Top Fields) */}
            {topFields.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                    {topFields.map(f => renderFieldBlock(f))}
                </div>
            )}

            {/* Tab Navigation */}
            {tabGroups.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6 mt-2">
                    <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-2">
                        {tabGroups.map(tab => (
                            <button 
                                key={tab.field}
                                onClick={() => setActiveTab(tab.field)}
                                className={cn("px-4 py-2 text-[14px] font-semibold rounded-lg transition-colors border", 
                                    activeTab === tab.field 
                                    ? "bg-[#f1f5f9] text-[#14233b] border-transparent" 
                                    : "text-[#475569] hover:bg-gray-50 border-transparent")}
                            >
                                {tab.label || tab.field}
                            </button>
                        ))}
                    </div>
                    
                    {/* Render fields thuộc Tab đang chọn */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 mt-1">
                        {currentTabFields.map(f => renderFieldBlock(f))}
                    </div>
                </div>
            )}

            {/* Các trường Default nửa dưới (Bottom Fields) */}
            {bottomFields.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 mt-2">
                    {bottomFields.map(f => renderFieldBlock(f))}
                </div>
            )}

         </div>
      </div>

      {toast.visible && (
        <div className="fixed top-24 right-6 bg-white border border-gray-200 shadow-xl rounded-lg px-5 py-3.5 flex items-center gap-3 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="absolute bottom-0 left-0 h-1 bg-green-500 animate-[progress_2s_linear]" style={{ animationFillMode: "forwards" }}></div>
            <style>{`@keyframes progress { from { width: 100%; } to { width: 0%; } }`}</style>
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check size={14} strokeWidth={3} /></div>
            <span className="text-[13px] font-semibold text-gray-800">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
