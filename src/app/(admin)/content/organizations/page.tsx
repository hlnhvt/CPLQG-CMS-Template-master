"use client";

import { 
  Search, Plus, LayoutTemplate, Settings2, Download, RefreshCw, Layers, CheckSquare, Settings, Play, Archive, ArrowDownUp, Sparkles, ChevronRight,
  Trash2, Edit2, ChevronDown, ChevronUp, GripHorizontal, ListFilter,
  AlignLeft, AlignCenter, AlignRight, Minus, ArrowUp, ArrowDown, ChevronLeft, Check, Bookmark, Building2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from "react";

const MOCK_ORGANIZATIONS = [
  { id: 1, name: 'Bộ Tư pháp', organization_code: 'bo-tu-phap', level: 'Trung ương', ministry_id: '', parent_id: '', role_id: 'System Admin', status: 'active', date_updated: '2026-04-01 10:00' },
  { id: 2, name: 'Sở Tư pháp Hà Nội', organization_code: 'so-tu-phap-ha-noi', level: 'Tỉnh-Thành phố', ministry_id: 'Bộ Tư pháp', parent_id: 'Bộ Tư pháp', role_id: 'Unit Admin', status: 'active', date_updated: '2026-04-02 09:30' },
  { id: 3, name: 'UBND Quận Ba Đình', organization_code: 'ubnd-quan-ba-dinh', level: 'Quận-Huyện', ministry_id: '', parent_id: 'Sở Tư pháp Hà Nội', role_id: 'Unit Admin', status: 'inactive', date_updated: '2026-04-01 14:00' },
];

export default function OrganizationsManagementPage() {
  const [columns, setColumns] = useState([
    { id: 'name', label: 'Tên cơ quan / đơn vị', visible: true, width: 250, align: 'left' },
    { id: 'organization_code', label: 'Mã cơ quan', visible: true, width: 200, align: 'left' },
    { id: 'level', label: 'Cấp đơn vị', visible: true, width: 150, align: 'left' },
    { id: 'ministry_id', label: 'Bộ/Ngành chủ quản', visible: true, width: 200, align: 'left' },
    { id: 'parent_id', label: 'Cơ quan cấp trên', visible: true, width: 200, align: 'left' },
    { id: 'role_id', label: 'User Role được gán', visible: true, width: 180, align: 'left' },
    { id: 'status', label: 'Trạng thái', visible: true, width: 120, align: 'left' },
    { id: 'date_updated', label: 'Ngày cập nhật', visible: true, width: 150, align: 'left' },
    { id: 'id', label: 'ID', visible: false, width: 80, align: 'left' }
  ]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('layout');
  
  const filterRef = useRef<HTMLDivElement>(null);
  const addColumnRef = useRef<HTMLDivElement>(null);

  // Sorting
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });

  // Resizing columns
  const [resizingCol, setResizingCol] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  // Row selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Column Reordering
  const [draggedColId, setDraggedColId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedColId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedColId || draggedColId === targetId) return;

    setColumns(prev => {
      const newCols = [...prev];
      const draggedIndex = newCols.findIndex(c => c.id === draggedColId);
      const targetIndex = newCols.findIndex(c => c.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      
      const [draggedItem] = newCols.splice(draggedIndex, 1);
      newCols.splice(targetIndex, 0, draggedItem);
      return newCols;
    });
    setDraggedColId(null);
  };

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, colId: string } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) setIsFilterOpen(false);
      if (addColumnRef.current && !addColumnRef.current.contains(event.target as Node)) setIsAddColumnOpen(false);
      if (!contextMenuRef.current?.contains(event.target as Node)) setContextMenu(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!resizingCol) return;
    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      setColumns(cols => cols.map(c => c.id === resizingCol ? { ...c, width: Math.max(50, startWidth + diff) } : c));
    };
    const handleMouseUp = () => setResizingCol(null);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none";
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [resizingCol, startX, startWidth]);

  const startResize = (e: ReactMouseEvent, id: string, width: number) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingCol(id);
    setStartX(e.clientX);
    setStartWidth(width);
  };

  const toggleColumn = (id: string) => setColumns(prev => prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  const changeAlign = (id: string, align: string) => setColumns(prev => prev.map(c => c.id === id ? { ...c, align } : c));

  const handleSort = (key: string, forceDirection?: 'asc' | 'desc') => {
    setSortConfig(prev => {
      if (forceDirection) return { key, direction: forceDirection };
      let direction: 'asc' | 'desc' | null = 'asc';
      if (prev.key === key && prev.direction === 'asc') direction = 'desc';
      else if (prev.key === key && prev.direction === 'desc') direction = null;
      return { key: direction ? key : '', direction };
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length > 0) setSelectedIds([]);
    else setSelectedIds(MOCK_ORGANIZATIONS.map(n => n.id));
  };
  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const sortedData = [...MOCK_ORGANIZATIONS].sort((a, b) => {
    if (!sortConfig.direction || !sortConfig.key) return 0;
    const aVal = (a as any)[sortConfig.key];
    const bVal = (b as any)[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const isAllSelected = selectedIds.length === MOCK_ORGANIZATIONS.length && MOCK_ORGANIZATIONS.length > 0;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < MOCK_ORGANIZATIONS.length;

  return (
    <div className="absolute inset-0 flex flex-col bg-white overflow-hidden">
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <Building2 size={20} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Quản lý nội dung</div>
            <h1 className="text-xl font-bold text-[#14233b]">Quản lý cơ quan</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-400">Có {MOCK_ORGANIZATIONS.length} bản ghi</span>
          
          {selectedIds.length > 0 ? (
             <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full bg-red-50 text-[#e63946] hover:bg-red-100 flex items-center justify-center transition-colors">
                  <Trash2 size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <Archive size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <Edit2 size={18} />
                </button>
               <Link href="/content/organizations/create" className="w-10 h-10 rounded-full bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center justify-center transition-colors ml-2">
                 <Plus size={20} strokeWidth={2.5} />
               </Link>
             </div>
          ) : (
             <div className="flex items-center gap-2">
               <div className="relative" ref={filterRef}>
                 <div className="flex items-center border border-gray-200 rounded-full overflow-hidden hover:bg-gray-50 transition-colors bg-white h-10">
                   <button 
                     className="w-10 h-full flex items-center justify-center text-gray-500"
                     onClick={() => setIsFilterOpen(!isFilterOpen)}
                   >
                     <Search size={16} strokeWidth={2.5} />
                   </button>
                   <div className="w-[1px] h-4 bg-gray-200"></div>
                   <button 
                     className="w-10 h-full flex items-center justify-center text-gray-500"
                     onClick={() => setIsFilterOpen(!isFilterOpen)}
                   >
                     <ListFilter size={16} />
                   </button>
                 </div>
   
                 {isFilterOpen && (
                   <div className="absolute top-12 right-0 w-[400px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col scale-100 origin-top-right transition-all transform mt-1">
                     <div className="p-3 border-b border-[#5340FF]/20 bg-white relative rounded-t-xl z-10 mx-[-1px] mt-[-1px] rounded-b-none border-x border-t transition-colors ring-1 ring-[#5340FF]">
                       <div className="flex items-center gap-2 text-gray-400 mb-2 px-2">
                          <Search size={16} />
                          <input type="text" placeholder="Tìm kiếm..." className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400" autoFocus />
                          <Settings2 size={16} className="text-[#5340FF] cursor-pointer" />
                       </div>
                       <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black py-2 px-3 hover:bg-gray-50 rounded-lg w-full transition-colors border border-gray-100">
                         <Plus size={16} className="text-gray-400" />
                         <span>Thêm bộ lọc</span>
                       </button>
                     </div>
   
                     <div className="max-h-[300px] overflow-y-auto w-full p-2 py-3 bg-white">
                       <div className="px-3 py-1.5 text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Cơ bản</div>
                       <FilterOption label="And / Or group" border />
                       
                       <div className="px-3 py-2 mt-2">
                          <div className="flex items-center gap-2 border-2 border-[#5340FF] rounded-lg px-3 py-2">
                            <input type="text" placeholder="Tìm kiếm" className="flex-1 outline-none text-sm" />
                            <Search size={16} className="text-gray-400" />
                          </div>
                       </div>
   
                       <FilterOption label="ID" onClick={() => toggleColumn('id')} active={columns.find(c=>c.id==='id')?.visible} />
                     </div>
                   </div>
                 )}
               </div>
               <button className="w-10 h-10 rounded-full border border-transparent flex items-center justify-center text-gray-300 opacity-50 cursor-not-allowed hidden sm:flex">
                 <Trash2 size={18} />
               </button>
               <button className="w-10 h-10 rounded-full border border-transparent flex items-center justify-center text-gray-300 opacity-50 cursor-not-allowed hidden sm:flex">
                 <Archive size={18} />
               </button>
               <Link href="/content/organizations/create" className="w-10 h-10 rounded-full bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center justify-center transition-colors ml-2">
                 <Plus size={20} strokeWidth={2.5} />
               </Link>
             </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-auto bg-white flex flex-col relative" style={{ cursor: resizingCol ? 'col-resize' : 'default' }}>
          <div className="flex-1 min-w-max flex flex-col">
            <div className="flex items-center border-b border-gray-200 h-12 shrink-0 bg-white font-semibold text-[13px] text-gray-800 tracking-tight z-10 sticky top-0 px-2 group">
              <div className="w-12 shrink-0 flex items-center justify-center" onClick={toggleSelectAll}>
                <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center cursor-pointer transition-colors", 
                  isAllSelected ? "bg-[#5340FF] border-[#5340FF]" : isIndeterminate ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 hover:border-gray-400 bg-white")}>
                  {isAllSelected ? <Check size={12} strokeWidth={3} className="text-white" /> : isIndeterminate ? <div className="w-2.5 h-[2px] bg-white rounded-full"></div> : null}
                </div>
              </div>
              
              {columns.map(col => col.visible && (
                <div 
                  key={col.id} 
                  className={cn("relative flex items-center group/col px-4 h-full border-r border-transparent hover:border-gray-100 transition-colors", 
                     draggedColId === col.id ? "opacity-50" : "opacity-100")} 
                  style={{ width: col.width, minWidth: col.width }}
                  onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, colId: col.id }); }}
                  draggable={!!col.label}
                  onDragStart={(e) => col.label && handleDragStart(e, col.id)}
                  onDragOver={(e) => col.label && handleDragOver(e, col.id)}
                  onDrop={(e) => col.label && handleDrop(e, col.id)}
                >
                  <div className="flex items-center gap-1.5 cursor-pointer flex-1 select-none min-w-0 h-full justify-start" onClick={() => col.label && handleSort(col.id)}>
                    <span className="truncate font-bold text-gray-950">{col.label}</span>
                    {col.label && (
                      <div className="w-4 h-4 flex items-center justify-center text-gray-400 shrink-0">
                        {sortConfig.key === col.id && sortConfig.direction === 'asc' && <ArrowDownUp size={13} strokeWidth={2.5} className="text-[#5340FF]" />}
                        {sortConfig.key === col.id && sortConfig.direction === 'desc' && <ArrowDownUp size={13} strokeWidth={2.5} className="text-[#5340FF] rotate-180" />}
                        {sortConfig.key !== col.id && <ArrowDownUp size={13} className="opacity-0 group-hover/col:opacity-100 transition-opacity" />}
                      </div>
                    )}
                  </div>
                  {col.label && (
                    <div className="absolute right-0 top-1/4 bottom-1/4 w-[3px] cursor-col-resize hover:bg-[#5340FF] opacity-0 group-hover/col:opacity-100 transition-opacity z-10" onMouseDown={(e) => startResize(e, col.id, col.width)} />
                  )}
                </div>
              ))}
              
              <div className="w-12 shrink-0 flex items-center justify-center relative border-l border-transparent" ref={addColumnRef}>
                 <button className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors shrink-0" onClick={() => setIsAddColumnOpen(!isAddColumnOpen)}>
                    <Plus size={16} />
                 </button>
                 {isAddColumnOpen && (
                   <div className="absolute top-10 right-0 w-[320px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col mt-1">
                      <div className="p-3 bg-white">
                        <div className="flex items-center gap-2 border-2 border-[#5340FF] rounded-lg px-3 py-2">
                          <input type="text" placeholder="Tìm kiếm" className="flex-1 outline-none text-sm text-gray-700" autoFocus />
                          <Search size={16} className="text-[#5340FF]" />
                        </div>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto w-full p-2 custom-scrollbar">
                        <FilterOption label="ID" onClick={() => toggleColumn('id')} active={columns.find(c=>c.id==='id')?.visible} />
                      </div>
                   </div>
                 )}
              </div>
            </div>
  
            <div className="flex-1 overflow-y-auto">
              {sortedData.map(item => (
                <div key={item.id} className={cn("flex items-center border-b border-gray-100 hover:bg-gray-50/50 transition-colors px-2 h-14 group", selectedIds.includes(item.id) ? "bg-blue-50/40" : "")}>
                  <div className="w-12 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer pl-1" onClick={() => toggleSelect(item.id)}>
                    <GripHorizontal size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 hover:text-gray-600 transition-opacity" />
                    <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center cursor-pointer transition-colors group-hover:border-gray-400",
                      selectedIds.includes(item.id) ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 bg-white"
                    )}>
                      {selectedIds.includes(item.id) && <Check size={12} strokeWidth={3} className="text-white" />}
                    </div>
                  </div>
                  
                  {columns.map(col => {
                    if (!col.visible) return null;
                    return (
                      <div key={col.id} className={cn("px-4 flex items-center", col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start')} style={{ width: col.width, minWidth: col.width }}>
                        {col.id === 'level' ? (
                          <div className={cn("px-2.5 py-1 text-xs font-semibold rounded-md border", 
                            item.level === 'Trung ương' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            item.level === 'Bộ-Ngành' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            item.level === 'Tỉnh-Thành phố' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                            item.level === 'Quận-Huyện' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          )}>
                            {String((item as any)[col.id])}
                          </div>
                        ) : col.id === 'status' ? (
                          <div className={cn("px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5",
                             item.status === 'active' ? 'text-green-700' : 'text-gray-500'
                          )}>
                            <div className={cn("w-2 h-2 rounded-full", item.status === 'active' ? 'bg-green-500' : 'bg-gray-300')} />
                            {item.status === 'active' ? 'Đang hoạt động' : 'Đã tắt'}
                          </div>
                        ) : (
                          <span className={cn("truncate text-[13px] font-medium w-full", col.id === 'organization_code' ? 'text-gray-400' : 'text-gray-700')} style={{ textAlign: col.align as any }}>
                            {String((item as any)[col.id]) || '--'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <div className="w-12 shrink-0"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={cn("border-l border-[#e2e8f0] bg-[#f8fafc] flex flex-col shrink-0 h-full transition-all duration-300", isSidebarExpanded ? "w-[300px]" : "w-[56px]", !isSidebarExpanded && "cursor-pointer")} onClick={() => { if (!isSidebarExpanded) setIsSidebarExpanded(true); }}>
            <div className="flex-1 overflow-y-auto w-full overflow-x-hidden custom-scrollbar">
               <SidebarAccordion id="layout" icon={Layers} title="Các Tuỳ Chọn Bố Cục" isOpen={openAccordion === 'layout'} isExpanded={isSidebarExpanded} onClick={() => setOpenAccordion(prev => prev === 'layout' ? null : 'layout')}>
                  <div className="flex flex-col gap-4 p-4 pt-4">
                     <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Bố cục</label>
                        <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer hover:border-gray-300 transition-colors">
                            <div className="flex items-center gap-2 text-gray-700">
                               <LayoutTemplate size={14} className="text-[#5340FF]" />
                               <span className="text-[13px] font-medium">Bảng</span>
                            </div>
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>
                     </div>
                  </div>
               </SidebarAccordion>
               <div className="border-t border-gray-200"></div>
            </div>

            <div className="mt-auto flex flex-col bg-[#f8fafc]">
               <div className={cn("p-4 w-full flex items-center gap-3 cursor-pointer transition-colors text-sm font-medium", !isSidebarExpanded ? "justify-center px-0 h-14 hover:bg-gray-200/50 text-[#1e293b]" : "hover:bg-gray-50 text-gray-700")}>
                  <Sparkles size={!isSidebarExpanded ? 20 : 18} strokeWidth={!isSidebarExpanded ? 1.5 : 2} className="shrink-0" />
                  {isSidebarExpanded && <span className="truncate">AI Assistant</span>}
               </div>
               <div className={cn("w-full h-[52px] flex items-center cursor-pointer transition-colors", isSidebarExpanded ? "justify-end px-4 hover:bg-gray-100 text-gray-400 hover:text-gray-600 border-t border-gray-200" : "justify-center hover:bg-gray-200/50 text-[#1e293b]")} onClick={(e) => { e.stopPropagation(); setIsSidebarExpanded(!isSidebarExpanded); }}>
                  {isSidebarExpanded ? <ChevronRight size={14} /> : <ChevronLeft size={16} strokeWidth={1.5} />}
               </div>
            </div>
          </div>

        {contextMenu && (
          <div ref={contextMenuRef} className="fixed bg-white border border-gray-100 rounded-xl shadow-2xl z-50 w-56 flex flex-col py-2" style={{ top: contextMenu.y, left: Math.min(contextMenu.x, window.innerWidth - 250) }}>
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-[13px] font-medium text-gray-700 w-full text-left" onClick={() => { handleSort(contextMenu.colId, 'asc'); setContextMenu(null); }}>
               <ArrowUp size={16} className="text-gray-400" /> Sắp xếp tăng dần
            </button>
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-[13px] font-medium text-gray-700 w-full text-left" onClick={() => { handleSort(contextMenu.colId, 'desc'); setContextMenu(null); }}>
               <ArrowDown size={16} className="text-gray-400" /> Sắp xếp giảm dần
            </button>
            <div className="h-[1px] bg-gray-100 my-1"></div>
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-[13px] font-medium text-gray-700 w-full text-left" onClick={() => { toggleColumn(contextMenu.colId); setContextMenu(null); }}>
               <Minus size={16} className="text-gray-400" /> Ẩn trường
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterOption({ label, border, active, onClick }: any) {
  return (
    <div className={cn("flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50", border ? "border-b border-gray-100 rounded-none pb-3 mb-1" : "", active ? "bg-blue-50" : "")} onClick={onClick}>
      <span className={cn("text-[13px] font-medium text-gray-700", active ? "text-[#5340FF] font-semibold" : "")}>{label}</span>
      <ChevronRight size={14} className="text-gray-400" />
    </div>
  );
}

function SidebarAccordion({ id, icon: Icon, title, isOpen, isExpanded, onClick, children }: any) {
  if (!isExpanded) {
    return (
       <div className="w-full h-14 flex items-center justify-center cursor-pointer hover:bg-gray-200/50 relative group" onClick={onClick}>
          <Icon size={20} className={cn("transition-colors", isOpen ? "text-[#0f172a]" : "text-[#1e293b]")} />
          {isOpen && <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-[#5340FF]" />}
       </div>
    );
  }
  return (
    <div className="flex flex-col bg-[#f8fafc]">
       <div className={cn("p-4 flex items-center justify-between cursor-pointer", isOpen ? "bg-white" : "hover:bg-gray-50")} onClick={onClick}>
          <div className="flex items-center gap-3">
             <Icon size={20} className="text-gray-500" />
             <span className="text-sm font-semibold">{title}</span>
          </div>
          {isOpen ? <ChevronDown size={14} /> : <ChevronLeft size={14} />}
       </div>
       {isOpen && children && <div className="bg-white border-b border-gray-100">{children}</div>}
    </div>
  );
}
