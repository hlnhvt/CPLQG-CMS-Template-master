"use client";

import {
  Search, Plus, LayoutTemplate, Settings2, RefreshCw, Layers, Archive, ArrowDownUp, Sparkles, ChevronRight,
  Trash2, Edit2, ChevronDown, GripVertical, ListFilter,
  ArrowUp, ArrowDown, ChevronLeft, Check, User, Image as ImageIcon,
  Building2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const AGENCIES = [
  "Bộ Tư pháp", "Cục Hộ tịch", "Cục Kiểm tra VBQPPL", "Tổng cục THADS", "Vụ Pháp luật Hình sự"
];

const AUTHORS = [
  { name: "Khuê Phạm", color: "bg-teal-500" },
  { name: "Minh Quân", color: "bg-purple-500" },
  { name: "Hà Linh", color: "bg-orange-400" },
];

function generateInfographics() {
  const titles = [
    "Quy trình cấp thẻ Căn cước mới 2026",
    "6 Điểm mới trong Luật Đất đai",
    "Hướng dẫn nộp hồ sơ trực tuyến",
    "Sơ đồ tổ chức Bộ Tư pháp",
    "Các bước đăng ký kết hôn có yếu tố nước ngoài",
    "Lộ trình số hóa văn bản pháp luật",
    "Chỉ số cải cách hành chính 2025",
    "Quy tắc ứng xử trên không gian mạng",
  ];

  const thumbColors = [
    "bg-indigo-300", "bg-emerald-400", "bg-amber-400", "bg-rose-400",
    "bg-sky-400", "bg-violet-400", "bg-lime-400", "bg-fuchsia-400",
  ];

  const statuses = ["Đã xuất bản", "Chờ duyệt", "Draft", "Bị từ chối"];

  return Array.from({ length: 154 }, (_, i) => {
    const titleIndex = i % titles.length;
    const author = AUTHORS[i % AUTHORS.length];
    const agency = AGENCIES[i % AGENCIES.length];
    const status = i < 5 ? statuses[i % 4] : "Đã xuất bản";
    const baseDate = new Date(2026, 2, 25, 8, 15, 0);
    const createdAt = new Date(baseDate.getTime() + i * 3600000);
    const updatedAt = new Date(baseDate.getTime() + i * 3800000);
    const views = i % 7 === 0 ? ((i * 42 + 21) % 1000) : 0;
    
    return {
      id: i + 1,
      title: titles[titleIndex],
      status: status,
      agency: agency,
      createdAt: formatDateTime(createdAt),
      views: views > 0 ? String(views) : "–",
      author,
      updatedAt: formatDateTime(updatedAt),
      hasThumb: true,
      thumbColor: thumbColors[i % thumbColors.length],
    };
  });
}

function formatDateTime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const ALL_INFOGRAPHICS = generateInfographics();
const PAGE_SIZE_OPTIONS = [25, 50, 100];
const TOTAL = ALL_INFOGRAPHICS.length;

// ─── Page Component ──────────────────────────────────────────────────────────

export default function InfographicManagementPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("layout");
  const [archiveFilter, setArchiveFilter] = useState("active");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" | null }>({ key: "", direction: null });

  const filterRef = useRef<HTMLDivElement>(null);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(TOTAL / pageSize);
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, TOTAL);

  const pagedData = ALL_INFOGRAPHICS.slice(start, end).sort((a, b) => {
    if (!sortConfig.direction || !sortConfig.key) return 0;
    const aVal = (a as any)[sortConfig.key];
    const bVal = (b as any)[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const pageIds = pagedData.map((n) => n.id);
  const isAllSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const isIndeterminate = pageIds.some((id) => selectedIds.includes(id)) && !isAllSelected;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setIsFilterOpen(false);
      if (pageSizeRef.current && !pageSizeRef.current.contains(e.target as Node)) setIsPageSizeOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    else setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((i) => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key && prev.direction === "asc") return { key, direction: "desc" };
      if (prev.key === key && prev.direction === "desc") return { key: "", direction: null };
      return { key, direction: "asc" };
    });
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 9) return Array.from({ length: totalPages }, (_, i) => i + 1);
    pages.push(1);
    if (page > 4) pages.push("...");
    for (let i = Math.max(2, page - 2); i <= Math.min(totalPages - 1, page + 2); i++) pages.push(i);
    if (page < totalPages - 3) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#5340FF]">
            <ImageIcon size={20} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Nội dung</div>
            <h1 className="text-xl font-bold text-[#14233b]">Quản lý Infographics</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-400">
            {start + 1}–{end} of {TOTAL.toLocaleString("vi-VN")} Items
          </span>

          <div className="flex items-center gap-2">
            {/* Search + Filter */}
            <div className="relative" ref={filterRef}>
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden hover:bg-gray-50 transition-colors bg-white h-10">
                <button className="w-10 h-full flex items-center justify-center text-gray-500">
                  <Search size={16} strokeWidth={2.5} />
                </button>
                <div className="w-[1px] h-4 bg-gray-200" />
                <button className="w-10 h-full flex items-center justify-center text-gray-500" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                  <ListFilter size={16} />
                </button>
              </div>
              {isFilterOpen && (
                <div className="absolute top-12 right-0 w-[300px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2 mt-1">
                   <div className="px-3 py-2 text-xs text-gray-500 font-medium uppercase">Bộ lọc nhanh</div>
                   <FilterOption label="Trạng thái" hasSub />
                   <FilterOption label="Cơ quan liên quan" hasSub />
                   <FilterOption label="Ngày tạo" hasSub />
                </div>
              )}
            </div>

            <Link href="/content/infographics/create" className="px-4 h-10 rounded-full bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center gap-2 transition-colors">
              <Plus size={18} strokeWidth={2.5} />
              <span className="text-sm font-bold">Thêm mới</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Table */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-auto bg-white">
          <div className="flex flex-col min-h-full">
            {/* Table Header */}
            <div className="flex items-center border-b border-gray-200 h-11 shrink-0 bg-white text-[12px] font-semibold text-gray-600 sticky top-0 z-10">
              <div className="w-14 shrink-0 flex items-center justify-center">
                <div
                  className={cn("w-4 h-4 border-2 rounded flex items-center justify-center cursor-pointer transition-colors",
                    isAllSelected ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 bg-white")}
                  onClick={toggleSelectAll}
                >
                  {isAllSelected && <Check size={10} strokeWidth={3} className="text-white" />}
                </div>
              </div>
              <div className="w-14 shrink-0" />
              <ColHeader label="Tiêu đề" sortKey="title" sortConfig={sortConfig} onSort={handleSort} className="flex-1 min-w-[250px]" />
              <ColHeader label="Trạng thái" sortKey="status" sortConfig={sortConfig} onSort={handleSort} className="w-36" />
              <ColHeader label="Cơ quan" sortKey="agency" sortConfig={sortConfig} onSort={handleSort} className="w-44" />
              <ColHeader label="Tác giả" sortKey="author" sortConfig={sortConfig} onSort={handleSort} className="w-36" />
              <ColHeader label="Lượt xem" sortKey="views" sortConfig={sortConfig} onSort={handleSort} className="w-24 text-right" />
              <ColHeader label="Ngày tạo" sortKey="createdAt" sortConfig={sortConfig} onSort={handleSort} className="w-40" />
            </div>

            {/* Table Rows */}
            <div className="flex-1">
              {pagedData.map((item) => (
                <div key={item.id} className="flex items-center border-b border-gray-100 hover:bg-gray-50/60 transition-colors h-[56px] group">
                  <div className="w-14 shrink-0 flex items-center justify-center cursor-pointer" onClick={() => toggleSelect(item.id)}>
                    <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center transition-colors group-hover:border-gray-400",
                      selectedIds.includes(item.id) ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 bg-white")}>
                      {selectedIds.includes(item.id) && <Check size={10} strokeWidth={3} className="text-white" />}
                    </div>
                  </div>

                  <div className="w-14 shrink-0 flex items-center">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", item.thumbColor)}>
                      <ImageIcon size={18} />
                    </div>
                  </div>

                  <div className="flex-1 px-3">
                    <Link href={`/content/infographics/edit/${item.id}`} className="text-[13px] text-gray-800 font-semibold hover:text-[#5340FF] line-clamp-1">
                      {item.title}
                    </Link>
                  </div>

                  <div className="w-36 px-3">
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="w-44 px-3 flex items-center gap-2">
                    <Building2 size={14} className="text-gray-400" />
                    <span className="text-[12px] text-gray-600 truncate font-medium">{item.agency}</span>
                  </div>

                  <div className="w-36 px-3 flex items-center gap-2">
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]", item.author.color)}>
                      {item.author.name.charAt(0)}
                    </div>
                    <span className="text-[12px] text-gray-600 truncate">{item.author.name}</span>
                  </div>

                  <div className="w-24 px-3 text-right">
                    <span className="text-[12px] text-gray-500 font-medium">{item.views}</span>
                  </div>

                  <div className="w-40 px-3">
                    <span className="text-[12px] text-gray-400">{item.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="h-14 border-t border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 sticky bottom-0">
              <div className="flex items-center gap-1">
                 <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30">
                    <ChevronLeft size={18} />
                 </button>
                 {getPageNumbers().map((p, i) => (
                    <button key={i} onClick={() => typeof p === 'number' && setPage(p)} className={cn("w-8 h-8 rounded-lg text-sm font-bold transition-colors", page === p ? "bg-[#5340FF] text-white" : "text-gray-600 hover:bg-gray-100")}>
                      {p}
                    </button>
                 ))}
                 <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30">
                    <ChevronRight size={18} />
                 </button>
              </div>
              <div className="text-sm text-gray-500 font-medium">Hiển thị {start + 1}-{end} trên {TOTAL}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColHeader({ label, sortKey, sortConfig, onSort, className }: any) {
  const active = sortConfig.key === sortKey;
  return (
    <div className={cn("flex items-center gap-1 px-3 h-full cursor-pointer hover:bg-gray-50 transition-colors uppercase tracking-wider", className)} onClick={() => onSort(sortKey)}>
      <span>{label}</span>
      <ArrowDownUp size={12} className={cn("text-gray-300", active && "text-[#5340FF]")} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    "Đã xuất bản": "bg-teal-50 text-teal-600 border-teal-100",
    "Chờ duyệt": "bg-amber-50 text-amber-600 border-amber-100",
    "Draft": "bg-gray-50 text-gray-500 border-gray-100",
    "Bị từ chối": "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded text-[11px] font-bold border uppercase", colors[status] || colors.Draft)}>
      {status}
    </span>
  );
}

function FilterOption({ label, hasSub }: any) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
      <span className="text-[13px] font-medium text-gray-700">{label}</span>
      {hasSub && <ChevronRight size={14} className="text-gray-400" />}
    </div>
  );
}
