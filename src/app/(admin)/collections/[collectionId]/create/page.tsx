"use client";

import { 
  ArrowLeft, Check, MoreVertical, Plus, RotateCcw, Database, ChevronDown, HelpCircle, Layers, X, GripVertical
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
  const RELATION_LIST_INTERFACES = ['list-m2a', 'list-m2m', 'list-o2m', 'list-m2o'];
  const SPECIAL_INTERFACES = ['group-tabs', 'group-raw', 'super-header', 'inline-repeater-interface', ...RELATION_LIST_INTERFACES];
  const tabGroups = editableFields.filter(f => f.interface === 'group-tabs' || f.interface === 'group-raw');
  // Default fields = ko thuộc tab (không có group), và ko phải là định nghĩa tab/special
  const defaultFields = editableFields.filter(f => !f.group && !SPECIAL_INTERFACES.includes(f.interface));
  // Fields đặc biệt (super-header, inline-repeater-interface, relation lists) ngoài tab, không có group
  const specialFields = editableFields.filter(f => !f.group && (
    f.interface === 'super-header' || f.interface === 'inline-repeater-interface' || RELATION_LIST_INTERFACES.includes(f.interface)
  ));

  const firstTabSort = tabGroups.length > 0 ? (tabGroups[0].sort || 9999) : 9999;
  const topFields = defaultFields.filter(f => (f.sort || 9999) <= firstTabSort);
  const bottomFields = defaultFields.filter(f => (f.sort || 9999) > firstTabSort);
  const specialTopFields = specialFields.filter(f => (f.sort || 9999) <= firstTabSort);
  const specialBottomFields = specialFields.filter(f => (f.sort || 9999) > firstTabSort);

  const [activeTab, setActiveTab] = useState<string>(tabGroups.length > 0 ? tabGroups[0].field : '');

  // State cho inline-repeater-interface: lưu danh sách rows theo field name
  const [repeaterRows, setRepeaterRows] = useState<Record<string, any[]>>({});

  const getRepeaterRows = (fieldName: string, fields: any[]) => {
    if (!repeaterRows[fieldName]) return [{}];
    return repeaterRows[fieldName];
  };

  const addRepeaterRow = (fieldName: string) => {
    setRepeaterRows(prev => ({ ...prev, [fieldName]: [...(prev[fieldName] || [{}]), {}] }));
  };

  const removeRepeaterRow = (fieldName: string, idx: number) => {
    setRepeaterRows(prev => {
      const rows = [...(prev[fieldName] || [])];
      rows.splice(idx, 1);
      return { ...prev, [fieldName]: rows };
    });
  };

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

  // Helper sinh giá trị mock phù hợp với tên cột
  const getMockCellValue = (colPath: string, rowIdx: number): string => {
    const col = colPath.split('.').pop()?.toLowerCase() || colPath.toLowerCase();
    const idx = rowIdx + 1;
    if (col === 'id' || col.endsWith('_id')) return String(1000 + idx);
    if (col.includes('email')) return `user${idx}@example.vn`;
    if (col.includes('phone') || col.includes('sdt') || col.includes('dien_thoai')) return `098${idx}000${idx}00`;
    if (col === 'status' || col === 'trang_thai') return idx === 1 ? 'published' : idx === 2 ? 'draft' : 'archived';
    if (col.includes('date') || col.includes('ngay') || col.includes('time') || col.includes('timestamp')) return `2026-04-0${idx} 0${idx + 8}:00`;
    if (col === 'type' || col === 'loai' || col.includes('_type')) return ['Text', 'Textarea', 'Hidden'][rowIdx % 3];
    if (col.includes('value') || col === 'gia_tri') return `Giá trị mẫu №${idx}`;
    if (col === 'name' || col === 'ten' || col === 'ho_ten' || col.includes('title') || col.includes('tieu_de')) {
      return ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Nam'][rowIdx % 3];
    }
    if (col === 'label' || col.includes('nhan') || col.includes('caption')) return `Mục ${idx}`;
    if (col.includes('file') || col.includes('anh') || col.includes('image') || col.includes('avatar')) return `file_${idx}.pdf`;
    if (col.includes('sort') || col.includes('thu_tu') || col.includes('order')) return String(idx * 10);
    if (col.includes('dan') || col.includes('url') || col.includes('link') || col.includes('slug')) return `/duong-dan-${idx}`;
    if (col.includes('note') || col.includes('ghi_chu') || col.includes('mo_ta') || col.includes('description')) return `Ghi chú mẫu ${idx}`;
    if (col.includes('content') || col.includes('noi_dung')) return `Nội dung mẫu ${idx}`;
    return `Dữ liệu ${idx}`;
  };

  // ---- Render Relation List (list-m2a, list-m2m, list-o2m) ----
  const renderRelationList = (f: any) => {
    const columns: string[] = f.options?.fields || ['id', 'status'];
    const colLabels = columns.map((c: string) => c.split('.').pop() || c);
    const MOCK_ROW_COUNT = 3;
    // Sinh dữ liệu mock động theo tên cột thực tế
    const mockRows = Array.from({ length: MOCK_ROW_COUNT }, (_, rIdx) => {
      const row: Record<string, string> = {};
      columns.forEach((col) => {
        row[col] = getMockCellValue(col, rIdx);
      });
      return row;
    });
    return (
      <div key={f.field} className="col-span-1 md:col-span-2 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[15px] font-bold text-[#14233b] flex items-center gap-1">
            {f.label || f.field}
            {f.required && <span className="text-[#5340FF]">*</span>}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-400 font-medium">Có {mockRows.length} bản ghi</span>
            <button type="button" className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
            </button>
            <button type="button" className="w-8 h-8 rounded-full bg-[#5340FF] hover:bg-[#4330EF] text-white flex items-center justify-center transition-colors shadow-sm shadow-[#5340FF]/20">
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          {/* Table header */}
          <div className="flex items-center border-b border-gray-200 bg-white h-11 px-3 text-[12px] font-bold text-gray-800 tracking-tight">
            <div className="w-7 shrink-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-gray-300 rounded bg-white"></div>
            </div>
            <div className="w-6 shrink-0"></div>
            {colLabels.map((col, i) => (
              <div key={i} className="flex-1 px-3 truncate capitalize">{col}</div>
            ))}
            <div className="w-9 shrink-0"></div>
          </div>
          {/* Table rows */}
          {mockRows.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors h-12 px-3 group">
              <div className="w-7 shrink-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-300 rounded bg-white group-hover:border-gray-400 transition-colors"></div>
              </div>
              <div className="w-6 shrink-0">
                <svg width="12" height="12" className="text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
              </div>
              {columns.map((col, cIdx) => {
                const cellVal = row[col] || '--';
                const colKey = col.split('.').pop()?.toLowerCase() || '';
                // Cột đầu tiên = link tím
                if (cIdx === 0) return (
                  <div key={col} className="flex-1 px-3 text-[13px] text-[#5340FF] font-medium truncate cursor-pointer hover:underline">{cellVal}</div>
                );
                // Cột type = badge pill
                if (colKey === 'type' || colKey === 'loai') {
                  const badgeStyle = cellVal === 'Text' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    cellVal === 'Textarea' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                    cellVal === 'Hidden' ? 'bg-gray-100 text-gray-500 border-gray-200' :
                    'bg-green-50 text-green-700 border-green-100';
                  return (
                    <div key={col} className="flex-1 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeStyle}`}>{cellVal}</span>
                    </div>
                  );
                }
                // Cột status = badge pill
                if (colKey === 'status' || colKey === 'trang_thai') {
                  const badgeStyle = cellVal === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                    cellVal === 'archived' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                    'bg-orange-50 text-orange-600 border-orange-100';
                  return (
                    <div key={col} className="flex-1 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeStyle}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cellVal === 'published' ? 'bg-green-500' : cellVal === 'archived' ? 'bg-yellow-500' : 'bg-orange-400'}`}></span>
                        {cellVal}
                      </span>
                    </div>
                  );
                }
                // Cột thường
                return <div key={col} className="flex-1 px-3 text-[13px] text-gray-700 truncate">{cellVal}</div>;
              })}
              <div className="w-9 shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        {f.note && <span className="text-[12px] text-gray-400 italic mt-1">{f.note}</span>}
      </div>
    );
  };

  // ---- Render M2O List (list-m2o) - dạng danh sách fields với pill metadata ----
  const renderM2OList = (f: any) => {
    const mockFields = [
      { name: 'Citizen ID', hidden: true, width: '100%', blockWidth: '100%' },
      { name: 'Type', hidden: true, width: '100%', blockWidth: '100%' },
    ];
    return (
      <div key={f.field} className="col-span-1 md:col-span-2 flex flex-col gap-2">
        <label className="text-[15px] font-bold text-[#14233b] flex items-center gap-1">
          {f.label || f.field}
          {f.required && <span className="text-[#5340FF]">*</span>}
        </label>
        <div className="flex flex-col gap-2">
          {mockFields.map((mf, idx) => (
            <div key={idx} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white hover:border-gray-300 transition-colors group">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <svg width="14" height="14" className="text-gray-300 cursor-grab shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
                <span className="text-[13px] font-semibold text-gray-800 truncate">{mf.name}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[11px] font-medium border border-gray-200 shrink-0">
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth={2}/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" strokeWidth={2}/></svg>
                  Hidden
                </span>
                <span className="text-[12px] text-gray-400 font-mono shrink-0">- {mf.width} - Chiều rộng của trường trong khối (block): ↔ {mf.blockWidth}</span>
              </div>
              <button type="button" className="w-7 h-7 rounded-md flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-2">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 bg-[#5340FF] hover:bg-[#4330EF] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm shadow-[#5340FF]/20">
            Tạo Mới
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 border border-[#5340FF] text-[#5340FF] hover:bg-[#5340FF]/5 text-[13px] font-semibold rounded-lg transition-colors">
            Thêm Dữ Liệu Sẵn Có
          </button>
        </div>
        {f.note && <span className="text-[12px] text-gray-400 italic mt-1">{f.note}</span>}
      </div>
    );
  };

  // ---- Render Super Header ----
  const renderSuperHeader = (f: any) => {
    const { title, subtitle } = f.options || {};
    return (
      <div key={f.field} className="col-span-1 md:col-span-2 flex items-start justify-between pb-3 mb-1 border-b border-gray-100">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[17px] font-bold text-[#14233b] leading-tight">{title || f.label || f.field}</h2>
          {subtitle && <p className="text-[13px] text-gray-500">{subtitle}</p>}
        </div>
        {f.options?.helpDisplayMode && (
          <button
            type="button"
            className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50 transition-colors shrink-0 mt-0.5"
            title={f.options?.help || ''}
          >
            <HelpCircle size={13} /> help
          </button>
        )}
      </div>
    );
  };

  // ---- Render Inline Repeater Interface ----
  const renderInlineRepeater = (f: any) => {
    const subFields: any[] = f.options?.fields || [];
    const rows = getRepeaterRows(f.field, subFields);
    const note = f.note || '';
    return (
      <div key={f.field} className="col-span-1 md:col-span-2 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[13px] font-bold text-[#14233b] uppercase tracking-wide flex items-center gap-1">
            {f.label || f.field}
            {f.required && <span className="text-[#5340FF]">*</span>}
          </label>
        </div>
        <div className="flex flex-col gap-2">
          {rows.map((row: any, rowIdx: number) => (
            <div key={rowIdx} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
                <GripVertical size={14} className="text-gray-300 cursor-grab" />
                <ChevronDown size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-mono flex-1">--</span>
                <button type="button" onClick={() => removeRepeaterRow(f.field, rowIdx)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 hover:text-red-500 text-gray-300 transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {subFields.map((sf: any) => {
                  const sfWidth = sf.meta?.width || 'full';
                  return (
                    <div key={sf.field} className={cn("flex flex-col gap-1.5", sfWidth === 'half' ? 'col-span-1' : 'col-span-1 md:col-span-2')}>
                      <label className="text-[12px] font-semibold text-gray-600 capitalize">{sf.name || sf.field}</label>
                      {sf.meta?.type === 'text' || sf.meta?.interface === null
                        ? <textarea rows={3} className="w-full border border-gray-200 rounded-lg p-3 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all resize-y text-[13px] text-gray-800" placeholder={`Nhập ${sf.name || sf.field}...`} />
                        : <input type="text" className="w-full h-10 border border-gray-200 rounded-lg px-3 bg-white outline-none focus:border-[#5340FF] focus:ring-1 focus:ring-[#5340FF] transition-all text-[13px] text-gray-800" placeholder={`Nhập ${sf.name || sf.field}...`} />
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-1">
          <button
            type="button"
            onClick={() => addRepeaterRow(f.field)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5340FF] hover:bg-[#4330EF] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm shadow-[#5340FF]/20"
          >
            <Plus size={14} /> Thêm mới
          </button>
          {note && <span className="text-[12px] text-gray-400 italic">{note}</span>}
        </div>
      </div>
    );
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
      // Super header: full-width section heading, không có input
      if (f.interface === 'super-header') return renderSuperHeader(f);
      // Inline repeater: full-width repeatable list
      if (f.interface === 'inline-repeater-interface') return renderInlineRepeater(f);
      // Relation lists: table-style
      if (f.interface === 'list-m2a' || f.interface === 'list-m2m' || f.interface === 'list-o2m') return renderRelationList(f);
      // M2O list: field-list style
      if (f.interface === 'list-m2o') return renderM2OList(f);

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

            {/* Các trường special nửa trên (Super Header / Inline Repeater) */}
            {specialTopFields.map(f => (
              <div key={f.field} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                {renderFieldBlock(f)}
              </div>
            ))}

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

            {/* Các trường special nửa dưới (Super Header / Inline Repeater) */}
            {specialBottomFields.map(f => (
              <div key={f.field} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 mt-2">
                {renderFieldBlock(f)}
              </div>
            ))}

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
