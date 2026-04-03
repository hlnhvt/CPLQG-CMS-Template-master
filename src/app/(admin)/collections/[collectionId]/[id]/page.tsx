"use client";

import { 
  ArrowLeft, Edit2, History, Database, BookOpen, Layers,
  MoreVertical, Check, Plus, ChevronDown, HelpCircle, X, GripVertical
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
  const RELATION_LIST_INTERFACES = ['list-m2a', 'list-m2m', 'list-o2m', 'list-m2o'];
  const SPECIAL_INTERFACES = ['group-tabs', 'group-raw', 'super-header', 'inline-repeater-interface', ...RELATION_LIST_INTERFACES];
  const tabGroups = editableFields.filter(f => f.interface === 'group-tabs' || f.interface === 'group-raw');
  // Default fields = ko thuộc tab (không có group), và ko phải là định nghĩa tab/special
  const defaultFields = editableFields.filter(f => !f.group && !SPECIAL_INTERFACES.includes(f.interface));
  // Fields đặc biệt ngoài tab, không có group
  const specialFields = editableFields.filter(f => !f.group && (
    f.interface === 'super-header' || f.interface === 'inline-repeater-interface' || RELATION_LIST_INTERFACES.includes(f.interface)
  ));

  const firstTabSort = tabGroups.length > 0 ? (tabGroups[0].sort || 9999) : 9999;
  const topFields = defaultFields.filter(f => (f.sort || 9999) <= firstTabSort);
  const bottomFields = defaultFields.filter(f => (f.sort || 9999) > firstTabSort);
  const specialTopFields = specialFields.filter(f => (f.sort || 9999) <= firstTabSort);
  const specialBottomFields = specialFields.filter(f => (f.sort || 9999) > firstTabSort);

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

  // ---- Render Super Header (readonly view) ----
  const renderSuperHeader = (f: any) => {
    const { title, subtitle } = f.options || {};
    return (
      <div key={f.field} className="col-span-1 md:col-span-2 flex items-start justify-between pb-3 mb-1 border-b border-gray-100">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[17px] font-bold text-[#14233b] leading-tight">{title || f.label || f.field}</h2>
          {subtitle && <p className="text-[13px] text-gray-500">{subtitle}</p>}
        </div>
        {f.options?.helpDisplayMode && (
          <button type="button" className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50 transition-colors shrink-0 mt-0.5" title={f.options?.help || ''}>
            <HelpCircle size={13} /> help
          </button>
        )}
      </div>
    );
  };

  // ---- Render Inline Repeater (readonly view) ----
  const renderInlineRepeater = (f: any) => {
    const subFields: any[] = f.options?.fields || [];
    const mockRows = [{}, {}];
    return (
      <div key={f.field} className="col-span-1 md:col-span-2 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[13px] font-bold text-[#14233b] uppercase tracking-wide">{f.label || f.field}</label>
        </div>
        <div className="flex flex-col gap-2">
          {mockRows.map((_row: any, rowIdx: number) => (
            <div key={rowIdx} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
                <GripVertical size={14} className="text-gray-200" />
                <ChevronDown size={14} className="text-gray-300" />
                <span className="text-xs text-gray-400 font-mono flex-1">--</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {subFields.map((sf: any) => {
                  const sfWidth = sf.meta?.width || 'full';
                  return (
                    <div key={sf.field} className={`flex flex-col gap-1.5 ${sfWidth === 'half' ? 'col-span-1' : 'col-span-1 md:col-span-2'}`}>
                      <label className="text-[12px] font-semibold text-gray-600 capitalize">{sf.name || sf.field}</label>
                      {sf.meta?.type === 'text' || sf.meta?.interface === null
                        ? <div className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-700 text-[13px] min-h-[60px]">--</div>
                        : <input type="text" disabled value="--" className="w-full h-10 border border-gray-200 rounded-lg px-3 bg-gray-50 text-gray-700 outline-none text-[13px] cursor-default" />
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {f.note && <span className="text-[12px] text-gray-400 italic mt-1">{f.note}</span>}
      </div>
    );
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
    if (col.includes('url') || col.includes('link') || col.includes('slug')) return `/duong-dan-${idx}`;
    if (col.includes('note') || col.includes('ghi_chu') || col.includes('mo_ta') || col.includes('description')) return `Ghi chú mẫu ${idx}`;
    if (col.includes('content') || col.includes('noi_dung')) return `Nội dung mẫu ${idx}`;
    return `Dữ liệu ${idx}`;
  };

  // ---- Render Relation List readonly (list-m2a, list-m2m, list-o2m) ----
  const renderRelationList = (f: any) => {
    const columns: string[] = f.options?.fields || ['id', 'status'];
    const colLabels = columns.map((c: string) => c.split('.').pop() || c);
    const MOCK_ROW_COUNT = 3;
    const mockRows = Array.from({ length: MOCK_ROW_COUNT }, (_, rIdx) => {
      const row: Record<string, string> = {};
      columns.forEach((col) => { row[col] = getMockCellValue(col, rIdx); });
      return row;
    });
    return (
      <div key={f.field} className="col-span-1 md:col-span-2 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[15px] font-bold text-[#14233b]">{f.label || f.field}</label>
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
          <div className="flex items-center border-b border-gray-200 bg-white h-11 px-3 text-[12px] font-bold text-gray-800 tracking-tight">
            <div className="w-7 shrink-0 flex items-center justify-center"><div className="w-4 h-4 border-2 border-gray-300 rounded bg-white"></div></div>
            <div className="w-6 shrink-0"></div>
            {colLabels.map((col, i) => (<div key={i} className="flex-1 px-3 truncate capitalize">{col}</div>))}
            <div className="w-9 shrink-0"></div>
          </div>
          {mockRows.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors h-12 px-3 group">
              <div className="w-7 shrink-0 flex items-center justify-center"><div className="w-4 h-4 border-2 border-gray-300 rounded bg-white"></div></div>
              <div className="w-6 shrink-0"><svg width="12" height="12" className="text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg></div>
              {columns.map((col, cIdx) => {
                const cellVal = row[col] || '--';
                const colKey = col.split('.').pop()?.toLowerCase() || '';
                if (cIdx === 0) return (
                  <div key={col} className="flex-1 px-3 text-[13px] text-[#5340FF] font-medium truncate cursor-pointer hover:underline">{cellVal}</div>
                );
                if (colKey === 'type' || colKey === 'loai') {
                  const s = cellVal === 'Text' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    cellVal === 'Textarea' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                    cellVal === 'Hidden' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-green-50 text-green-700 border-green-100';
                  return (<div key={col} className="flex-1 px-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${s}`}>{cellVal}</span></div>);
                }
                if (colKey === 'status' || colKey === 'trang_thai') {
                  const s = cellVal === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                    cellVal === 'archived' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-orange-50 text-orange-600 border-orange-100';
                  const dot = cellVal === 'published' ? 'bg-green-500' : cellVal === 'archived' ? 'bg-yellow-500' : 'bg-orange-400';
                  return (<div key={col} className="flex-1 px-3"><span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${s}`}><span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>{cellVal}</span></div>);
                }
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

  // ---- Render M2O List readonly (list-m2o) ----
  const renderM2OList = (f: any) => {
    const mockFields = [
      { name: 'Citizen ID', hidden: true, width: '100%', blockWidth: '100%' },
      { name: 'Type', hidden: true, width: '100%', blockWidth: '100%' },
    ];
    return (
      <div key={f.field} className="col-span-1 md:col-span-2 flex flex-col gap-2">
        <label className="text-[15px] font-bold text-[#14233b]">{f.label || f.field}</label>
        <div className="flex flex-col gap-2">
          {mockFields.map((mf, idx) => (
            <div key={idx} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <svg width="14" height="14" className="text-gray-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
                <span className="text-[13px] font-semibold text-gray-800 truncate">{mf.name}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[11px] font-medium border border-gray-200 shrink-0">
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth={2}/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" strokeWidth={2}/></svg>
                  Hidden
                </span>
                <span className="text-[12px] text-gray-400 font-mono shrink-0">- {mf.width} - Chiều rộng của trường trong khối (block): ↔ {mf.blockWidth}</span>
              </div>
            </div>
          ))}
        </div>
        {f.note && <span className="text-[12px] text-gray-400 italic mt-1">{f.note}</span>}
      </div>
    );
  };

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

      // Textarea (ph\u1ea3i \u0111\u1eb7t SAU rich-text check)
      if (f.interface === 'input-multiline' || (f.type === 'text' && f.interface !== 'input-rich-text-html')) {
          return <div className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-800 text-[13.5px] min-h-[100px] cursor-default whitespace-pre-wrap">{val}</div>;
      }

      // WYSIWYG Rich Text HTML (readonly view) \u2014 ph\u1ea3i ki\u1ec3m tra TR\u01af\u1edcC textarea
      if (f.interface === 'input-rich-text-html') {
          return (
            <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white opacity-90">
              {/* Toolbar Row 1 (disabled) */}
              <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-[#f8fafc] pointer-events-none opacity-60">
                <span className="wysiwyg-btn"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg></span>
                <span className="wysiwyg-btn"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg></span>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <span className="wysiwyg-btn font-bold">B</span>
                <span className="wysiwyg-btn italic">I</span>
                <span className="wysiwyg-btn underline">U</span>
                <span className="wysiwyg-btn line-through">S</span>
                <span className="wysiwyg-btn text-[11px]">X₂</span>
                <span className="wysiwyg-btn text-[11px]">X²</span>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <span className="wysiwyg-btn px-2 text-[11px] min-w-[70px] flex items-center gap-1">Inter,system... <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
                <span className="wysiwyg-btn px-2 text-[11px] min-w-[40px] flex items-center gap-1">15px <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                {['H1','H2','H3','H4','H5','H6'].map(h => (
                  <span key={h} className="wysiwyg-btn text-[11px] font-bold px-1.5">{h}</span>
                ))}
              </div>
              {/* Toolbar Row 2 (disabled) */}
              <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-[#f8fafc] pointer-events-none opacity-60">
                <span className="wysiwyg-btn text-[10px] font-mono">Pre</span>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                {[0,1,2,3].map(i => (
                  <span key={i} className="wysiwyg-btn">
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={i===0?"M4 6h16M4 12h8M4 18h12":i===1?"M4 6h16M8 12h8M6 18h12":i===2?"M4 6h16M10 12h10M8 18h12":"M4 6h16M4 12h16M4 18h16"} /></svg>
                  </span>
                ))}
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <span className="wysiwyg-btn text-[11px] font-bold italic">Ix</span>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <span className="wysiwyg-btn text-[13px]">””</span>
                <span className="wysiwyg-btn font-mono text-[11px]">{'{}'}</span>
                <span className="wysiwyg-btn"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></span>
              </div>
              {/* Toolbar Row 3 (disabled) */}
              <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-[#f8fafc] pointer-events-none opacity-60">
                <span className="wysiwyg-btn"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2}/><circle cx="8.5" cy="8.5" r="1.5" strokeWidth={2}/><polyline points="21 15 16 10 5 21" strokeWidth={2}/></svg></span>
                <span className="wysiwyg-btn"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polygon points="23 7 16 12 23 17 23 7" strokeWidth={2}/><rect x="1" y="5" width="15" height="14" rx="2" ry="2" strokeWidth={2}/></svg></span>
                <span className="wysiwyg-btn text-[11px] font-medium">View invisible elements</span>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <span className="wysiwyg-btn font-mono text-[11px]">&lt;&gt;</span>
              </div>
              {/* Content area */}
              <div className="min-h-[160px] p-4 text-[14px] text-gray-800 leading-relaxed bg-white cursor-default" dangerouslySetInnerHTML={{ __html: val || '<p class="text-gray-400">Không có nội dung</p>' }} />
            </div>
          );
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
      // Super header
      if (f.interface === 'super-header') return renderSuperHeader(f);
      // Inline repeater
      if (f.interface === 'inline-repeater-interface') return renderInlineRepeater(f);
      // Relation lists: table-style
      if (f.interface === 'list-m2a' || f.interface === 'list-m2m' || f.interface === 'list-o2m') return renderRelationList(f);
      // M2O list: field-list style
      if (f.interface === 'list-m2o') return renderM2OList(f);

      const isFullWidth = f.width === 'full';
      return (
          <div key={f.field} className={`flex flex-col ${isFullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
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
              
              {/* Các trường special nửa trên (super-header, repeater, relation list) */}
              {specialTopFields.map(f => (
                <div key={f.field} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                  {renderFieldBlock(f)}
                </div>
              ))}

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
                                  className={`px-4 py-2 text-[14px] font-semibold rounded-lg transition-colors border ${
                                      activeTab === tab.field 
                                      ? 'bg-[#f1f5f9] text-[#14233b] border-transparent' 
                                      : 'text-[#475569] hover:bg-gray-50 border-transparent'}`}
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

              {/* Các trường special nửa dưới */}
              {specialBottomFields.map(f => (
                <div key={f.field} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 mt-2">
                  {renderFieldBlock(f)}
                </div>
              ))}

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
