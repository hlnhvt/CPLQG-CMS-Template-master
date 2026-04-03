"use client";

import { 
  ArrowLeft, Edit2, History, Database, BookOpen, Layers,
  MoreVertical, Check, Plus, ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MENU_GROUPS } from "@/lib/menu-data";
import { COLLECTION_FIELDS } from "@/lib/collection-fields";

export default function GenericCollectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.collectionId as string;
  const id = params.id as string;

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
  const editableFields = fields.filter(f => !f.hidden && f.field !== 'id' && !f.system);

  // Phân loại fields
  const tabGroups = editableFields.filter(f => f.interface === 'group-tabs' || f.interface === 'group-raw');
  // Default fields = ko thuộc tab (không có group), và ko phải là định nghĩa tab
  const defaultFields = editableFields.filter(f => !f.group && f.interface !== 'group-tabs' && f.interface !== 'group-raw');

  const firstTabSort = tabGroups.length > 0 ? (tabGroups[0].sort || 9999) : 9999;
  const topFields = defaultFields.filter(f => (f.sort || 9999) <= firstTabSort);
  const bottomFields = defaultFields.filter(f => (f.sort || 9999) > firstTabSort);

  const [activeTab, setActiveTab] = useState<string>(tabGroups.length > 0 ? tabGroups[0].field : '');

  // MOCK DATA READING DỰA TRÊN SCHEMA
  const mockData: any = { id };
  fields.forEach(s => {
      if(s.field === 'id') return;
      if(s.field === 'status') {
          mockData[s.field] = 'published';
      } else if(s.type === 'boolean') {
          mockData[s.field] = true;
      } else if (s.interface === 'select-dropdown' && s.options?.choices) {
          mockData[s.field] = s.options.choices[0].value;
      } else if (s.type === 'integer' || s.type === 'float') {
          mockData[s.field] = 42;
      } else if (s.type === 'timestamp' || s.type === 'dateTime') {
          mockData[s.field] = `2026-04-03 10:00:00`;
      } else if (s.relation) {
          mockData[s.field] = `1`; // foreign key mock
      } else if (s.interface === 'publish-button') {
          mockData[s.field] = null;
      } else {
          mockData[s.field] = `Dữ liệu chi tiết mẫu của ${s.field}`;
      }
  });

  // Helper render Form Field cho View mode (readonly)
  const renderReadonlyField = (f: any) => {
      const val = mockData[f.field];
      
      // Publish Button
      if (f.interface === 'publish-button') {
          return (
              <button disabled className="w-full h-11 bg-[#5340FF] text-white rounded-lg font-bold text-[14px] transition-colors shadow-md shadow-[#5340FF]/25 opacity-80 cursor-not-allowed">
                 {f.options?.text || f.label || 'Submit'}
              </button>
          );
      }

      // Select
      if (f.interface === 'select-dropdown' && f.options?.choices) {
          const text = f.options.choices.find((c:any) => c.value === val)?.text || val;
          return <input type="text" disabled value={text || ''} className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-gray-50 text-gray-700 outline-none cursor-default font-medium" />;
      }
      
      // Status Special
      if (f.field === 'status') {
          const isPub = val === 'published' || val === 'active';
          return (
             <div className="flex items-center h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg gap-2 w-full cursor-default">
                 <div className={cn("w-2.5 h-2.5 rounded-full", isPub ? "bg-green-500" : "bg-orange-400")} />
                 <span className="text-[13px] font-medium text-gray-800">{val}</span>
             </div>
          );
      }

      // Boolean toggle
      if (f.type === 'boolean' || f.interface === 'boolean') {
          return (
              <label className="flex items-center gap-2 cursor-not-allowed opacity-80 h-11">
                  <div className="relative">
                      <input type="checkbox" className="sr-only peer" disabled checked={!!val} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-[#5340FF]"></div>
                  </div>
                  <span className="text-[13px] font-medium text-[#5340FF]">Đã kích hoạt</span>
              </label>
          );
      }

      // Textarea / HTML
      if (f.interface === 'input-multiline' || f.type === 'text' || f.interface === 'input-rich-text-html') {
          return <div className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-800 text-[13.5px] min-h-[100px] cursor-default whitespace-pre-wrap">{val}</div>;
      }

      // Relation (M2O / M2M)
      if (f.relation) {
          return (
             <div className="relative flex items-center w-full h-11 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden transition-all disabled:bg-gray-50">
                 <input type="text" disabled value={`Bản ghi: ID ${val}`} className="flex-1 h-full px-4 outline-none bg-transparent text-gray-800 text-sm disabled:cursor-not-allowed disabled:bg-gray-50" />
                 <Link href="#" className="flex items-center gap-1 pr-3 text-[#5340FF] hover:underline text-[13px] font-semibold">
                     Mở {f.relation.related_collection}
                 </Link>
             </div>
          );
      }

      // Default
      return <input type="text" disabled value={val || ''} className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-gray-50 text-gray-800 outline-none cursor-default" />;
  }

  // Render function cho layout field
  const renderFieldBlock = (f: any) => {
      const isFullWidth = f.width === 'full';
      return (
          <div key={f.field} className={cn("flex flex-col", isFullWidth ? "col-span-1 md:col-span-2" : "col-span-1")}>
              <label className="text-[14px] font-semibold text-[#14233b] mb-2">{f.label || f.field}</label>
              {renderReadonlyField(f)}
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
            <h1 className="text-xl font-bold text-[#14233b]">Bản ghi ID: {id}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <History size={18} />
          </button>
          <Link href={`/collections/${collectionId}/create`} className="w-10 h-10 rounded-full bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center justify-center transition-colors">
            <Edit2 size={18} />
          </Link>
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Main Layout containing content and Sidebar Panels */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-auto bg-[#f8fafc] flex flex-col relative w-full items-center py-6 px-6 custom-scrollbar">
           <div className="w-full max-w-[800px] flex flex-col gap-6 pb-10">
              
              {/* Các trường Default nửa trên (Top Fields) */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                  {/* Luôn hiển thị ID Bản ghi */}
                  <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                       <label className="text-[14px] font-semibold text-[#14233b] flex gap-1">ID Bản ghi</label>
                       <input type="text" disabled value={id} className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-gray-50 text-gray-800 outline-none cursor-default font-mono text-sm" />
                  </div>
                  
                  {topFields.map(f => renderFieldBlock(f))}
              </div>

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

        {/* Right Panels (Directus Sidebar Style) */}
        <div className="w-[320px] border-l border-gray-200 bg-white flex flex-col shrink-0 h-full overflow-y-auto hidden lg:flex">
           {/* Section: Quick Actions */}
           <div className="border-b border-gray-100 p-4">
               <button className="w-full h-10 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-[13px] font-semibold text-gray-700 transition-colors">
                  <Database size={14} /> Open in API
               </button>
           </div>
           
           {/* Section: Revisions (Lịch sử thay đổi) */}
           <div className="">
               <div className="p-4 flex items-center justify-between bg-gray-50/50 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-800 font-semibold">
                     <History size={16} className="text-[#5340FF]" />
                     <span className="text-sm">Lịch sử sửa đổi</span>
                  </div>
               </div>
               <div className="p-4 flex flex-col gap-5">
                  <div className="flex items-start gap-3 relative before:absolute before:left-3.5 before:top-8 before:bottom-[-20px] before:w-[2px] before:bg-gray-100">
                     <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold z-10 shrink-0 outline outline-4 outline-white">AD</div>
                     <div className="flex flex-col gap-1 w-full bg-white border border-gray-100 rounded-lg p-2.5 shadow-sm">
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-gray-800">Admin</span>
                           <span className="text-[10px] text-gray-500">2 giờ trước</span>
                        </div>
                        <div className="text-[11px] text-gray-600 mt-1">
                           Cập nhật <span className="font-semibold bg-gray-100 px-1 rounded">status</span>
                        </div>
                     </div>
                  </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
