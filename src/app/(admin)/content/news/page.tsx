"use client";

import {
  Search, Plus, LayoutTemplate, Settings2, RefreshCw, Layers, Archive, ArrowDownUp, Sparkles, ChevronRight,
  Trash2, Edit2, ChevronDown, GripVertical, ListFilter,
  AlignLeft, AlignCenter, AlignRight, Minus, ArrowUp, ArrowDown, ChevronLeft, Check, User
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from "react";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const AUTHORS = [
  { name: "Khuê Phạm", color: "bg-teal-500" },
  { name: "Minh Quân", color: "bg-purple-500" },
  { name: "Hà Linh", color: "bg-orange-400" },
];

function generateNews() {
  const titles = [
    "[Ảnh] Bộ ảnh minh họa số 2",
    "Công bố quyết định kiểm tra, giám sát đối với Ban Thường vụ Đảng ủy Q...",
    "[Ảnh] Bộ ảnh minh họa số 2",
    "[Ảnh] Bộ ảnh minh họa số 3",
    "[Ảnh] Bộ ảnh minh họa số 4",
    "[Ảnh] Bộ ảnh minh họa số 9",
    "[Ảnh] Bộ ảnh minh họa số 6",
    "[Ảnh] Bộ ảnh minh họa số 7",
    "[Ảnh] Bộ ảnh minh họa số 8",
    "[Ảnh] Bộ ảnh minh họa số 10",
    "[Ảnh] Bộ ảnh minh họa số 9",
    "[Video] Video mẫu số 1",
    "[Ảnh] Bộ ảnh minh họa số 4",
    "[Ảnh] Bộ ảnh minh họa số 5",
    "[Ảnh] Bộ ảnh minh họa số 6",
    "[Ảnh] Bộ ảnh minh họa số 7",
    "[Ảnh] Bộ ảnh minh họa số 8",
    "[Ảnh] Bộ ảnh minh họa số 3",
    "[Ảnh] Bộ ảnh minh họa số 10",
    "[Ảnh] Bộ ảnh minh họa số 1",
    "[Ảnh] Bộ ảnh minh họa số 11",
    "[Ảnh] Bộ ảnh minh họa số 12",
    "[Ảnh] Bộ ảnh minh họa số 13",
    "[Video] Video mẫu số 2",
    "[Ảnh] Bộ ảnh minh họa số 14",
  ];

  const thumbColors = [
    "bg-blue-300", "bg-teal-400", "bg-yellow-400", "bg-purple-400",
    "bg-orange-400", "bg-red-400", "bg-green-400", "bg-pink-400",
  ];

  return Array.from({ length: 1275 }, (_, i) => {
    const titleIndex = i % titles.length;
    const author = AUTHORS[i % AUTHORS.length];
    const baseDate = new Date(2026, 2, 25, 5, 7, 0);
    const createdAt = new Date(baseDate.getTime() + i * 60000);
    const updatedAt = new Date(2026, 2, 25, 12, 7, 36 + (i % 60));
    const hasThumb = i % 5 !== 3;
    const views = i === 1 ? 1211 : i % 7 === 0 ? ((i * 37 + 13) % 500) : 0;
    return {
      id: i + 1,
      title: titles[titleIndex],
      status: "Đã xuất bản",
      createdAt: formatDateTime(createdAt),
      views: views > 0 ? String(views) : "–",
      author,
      updatedAt: formatDateTime(updatedAt),
      hasThumb,
      thumbColor: thumbColors[i % thumbColors.length],
    };
  });
}

function formatDateTime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const ALL_NEWS = generateNews();
const PAGE_SIZE_OPTIONS = [25, 50, 100];
const TOTAL = ALL_NEWS.length;

// ─── Page Component ──────────────────────────────────────────────────────────

export default function NewsManagementPage() {
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

  const pagedData = ALL_NEWS.slice(start, end).sort((a, b) => {
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

  // Pagination page numbers
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 9) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
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
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <LayoutTemplate size={20} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Nội dung</div>
            <h1 className="text-xl font-bold text-[#14233b]">Quản lý tin tức</h1>
          </div>
          <button className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors ml-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-400">
            {start + 1}–{end} of {TOTAL.toLocaleString("vi-VN")} Items
          </span>

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
              <Link href="/content/news/create" className="w-10 h-10 rounded-full bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center justify-center transition-colors ml-1">
                <Plus size={20} strokeWidth={2.5} />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Search + Filter */}
              <div className="relative" ref={filterRef}>
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden hover:bg-gray-50 transition-colors bg-white h-10">
                  <button className="w-10 h-full flex items-center justify-center text-gray-500" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    <Search size={16} strokeWidth={2.5} />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-200" />
                  <button className="w-10 h-full flex items-center justify-center text-gray-500" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    <ListFilter size={16} />
                  </button>
                </div>
                {isFilterOpen && (
                  <div className="absolute top-12 right-0 w-[400px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col mt-1">
                    <div className="p-3 border-b border-[#5340FF]/20 bg-white relative rounded-t-xl z-10 mx-[-1px] mt-[-1px] rounded-b-none border-x border-t ring-1 ring-[#5340FF]">
                      <div className="flex items-center gap-2 text-gray-400 mb-2 px-2">
                        <Search size={16} />
                        <input type="text" placeholder="Tìm kiếm..." className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400" autoFocus />
                        <Settings2 size={16} className="text-[#5340FF] cursor-pointer" />
                      </div>
                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black py-2 px-3 hover:bg-gray-50 rounded-lg w-full border border-gray-100">
                        <Plus size={16} className="text-gray-400" />
                        <span>Thêm bộ lọc</span>
                      </button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2 py-3">
                      <div className="px-3 py-1.5 text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Cơ bản</div>
                      <FilterOption label="Tiêu đề" />
                      <FilterOption label="Trạng thái" />
                      <FilterOption label="Ngày tạo" hasSub />
                      <FilterOption label="Tác giả" hasSub />
                      <FilterOption label="Ngày cập nhật" hasSub />
                    </div>
                  </div>
                )}
              </div>

              <button className="w-10 h-10 rounded-full border border-transparent flex items-center justify-center text-gray-300 opacity-50 cursor-not-allowed">
                <Trash2 size={18} />
              </button>
              <button className="w-10 h-10 rounded-full border border-transparent flex items-center justify-center text-gray-300 opacity-50 cursor-not-allowed hidden sm:flex">
                <Archive size={18} />
              </button>
              <Link href="/content/news/create" className="w-10 h-10 rounded-full bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center justify-center transition-colors">
                <Plus size={20} strokeWidth={2.5} />
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Table */}
        <div className="flex-1 overflow-auto bg-white flex flex-col relative">
          <div className="flex flex-col min-h-full">
            {/* Table Header */}
            <div className="flex items-center border-b border-gray-200 h-11 shrink-0 bg-white text-[12px] font-semibold text-gray-600 tracking-tight sticky top-0 z-10">
              {/* Drag handle space + Checkbox */}
              <div className="w-16 shrink-0 flex items-center justify-center gap-2 px-2">
                <div className="w-4 h-4 invisible"><GripVertical size={14} /></div>
                <div
                  className={cn("w-4 h-4 border-2 rounded flex items-center justify-center cursor-pointer transition-colors",
                    isAllSelected ? "bg-[#5340FF] border-[#5340FF]" : isIndeterminate ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 hover:border-gray-400 bg-white")}
                  onClick={toggleSelectAll}
                >
                  {isAllSelected ? <Check size={10} strokeWidth={3} className="text-white" /> : isIndeterminate ? <div className="w-2 h-[2px] bg-white rounded" /> : null}
                </div>
              </div>

              {/* Thumbnail */}
              <div className="w-14 shrink-0" />

              {/* Title */}
              <ColHeader label="Tiêu đề" sortKey="title" sortConfig={sortConfig} onSort={handleSort} className="flex-1 min-w-[220px]" />
              {/* Status */}
              <ColHeader label="Trạng thái" sortKey="status" sortConfig={sortConfig} onSort={handleSort} className="w-36" />
              {/* Created */}
              <ColHeader label="Ngày tạo" sortKey="createdAt" sortConfig={sortConfig} onSort={handleSort} className="w-40" />
              {/* Views */}
              <ColHeader label="Lượt xem" sortKey="views" sortConfig={sortConfig} onSort={handleSort} className="w-24 text-right" />
              {/* Author */}
              <ColHeader label="Tác giả" sortKey="author" sortConfig={sortConfig} onSort={handleSort} className="w-36" />
              {/* Updated */}
              <ColHeader label="Ngày cập nhật" sortKey="updatedAt" sortConfig={sortConfig} onSort={handleSort} className="w-40" />
            </div>

            {/* Table Rows */}
            <div className="flex-1">
              {pagedData.map((news) => (
                <div
                  key={news.id}
                  className={cn(
                    "flex items-center border-b border-gray-100 hover:bg-gray-50/60 transition-colors h-[52px] group",
                    selectedIds.includes(news.id) ? "bg-blue-50/40" : ""
                  )}
                >
                  {/* Drag + Checkbox */}
                  <div className="w-16 shrink-0 flex items-center justify-center gap-2 px-2 cursor-pointer" onClick={() => toggleSelect(news.id)}>
                    <GripVertical size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                    <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center cursor-pointer transition-colors group-hover:border-gray-400",
                      selectedIds.includes(news.id) ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 bg-white")}>
                      {selectedIds.includes(news.id) && <Check size={10} strokeWidth={3} className="text-white" />}
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-14 shrink-0 flex items-center justify-start">
                    {news.hasThumb ? (
                      <div className={cn("w-9 h-9 rounded overflow-hidden shrink-0 flex items-center justify-center", news.thumbColor)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 8h18" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-[220px] px-3 flex items-center">
                    <span className="text-[13px] text-gray-800 font-medium line-clamp-2 leading-snug">{news.title}</span>
                  </div>

                  {/* Status */}
                  <div className="w-36 shrink-0 px-3 flex items-center">
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold text-teal-600">
                      <span className="w-2 h-2 rounded-full bg-teal-500 inline-block shrink-0" />
                      Đã xuất bản
                    </span>
                  </div>

                  {/* Created Date */}
                  <div className="w-40 shrink-0 px-3">
                    <span className="text-[12px] text-gray-500">{news.createdAt}</span>
                  </div>

                  {/* Views */}
                  <div className="w-24 shrink-0 px-3 text-right">
                    <span className="text-[12px] text-gray-500">{news.views}</span>
                  </div>

                  {/* Author */}
                  <div className="w-36 shrink-0 px-3 flex items-center gap-2">
                    <div className={cn("w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white", news.author.color)}>
                      <User size={12} strokeWidth={2} />
                    </div>
                    <span className="text-[12px] text-gray-600 font-medium truncate">{news.author.name}</span>
                  </div>

                  {/* Updated Date */}
                  <div className="w-40 shrink-0 px-3">
                    <span className="text-[12px] text-gray-500">{news.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="h-14 border-t border-gray-200 flex items-center justify-between px-4 bg-white shrink-0 sticky bottom-0 z-10">
              {/* Page buttons */}
              <div className="flex items-center gap-1">
                <PaginationBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft size={16} />
                </PaginationBtn>

                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
                  ) : (
                    <PaginationBtn key={p} onClick={() => setPage(p as number)} active={page === p}>
                      {p}
                    </PaginationBtn>
                  )
                )}

                <PaginationBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight size={16} />
                </PaginationBtn>
              </div>

              {/* Page size selector */}
              <div className="relative" ref={pageSizeRef}>
                <button
                  onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                  className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Mỗi trang {pageSize}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {isPageSizeOpen && (
                  <div className="absolute bottom-10 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-36 py-1 overflow-hidden">
                    {PAGE_SIZE_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setPageSize(s); setPage(1); setIsPageSizeOpen(false); }}
                        className={cn("w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50",
                          pageSize === s ? "text-[#5340FF] bg-blue-50" : "text-gray-700")}
                      >
                        {s} / trang
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Options Sidebar */}
        <div
          className={cn("border-l border-[#e2e8f0] bg-[#f8fafc] flex flex-col shrink-0 h-full transition-all duration-300",
            isSidebarExpanded ? "w-[280px]" : "w-[56px]",
            !isSidebarExpanded && "cursor-pointer")}
          onClick={() => { if (!isSidebarExpanded) setIsSidebarExpanded(true); }}
        >
          <div className="flex-1 overflow-y-auto w-full overflow-x-hidden">
            <SidebarAccordion id="layout" icon={Layers} title="Các Tuỳ Chọn Bố Cục" isOpen={openAccordion === "layout"} isExpanded={isSidebarExpanded} onClick={() => setOpenAccordion((p) => p === "layout" ? null : "layout")}>
              <div className="flex flex-col gap-4 p-4">
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

            <div className="border-t border-gray-200" />

            <SidebarAccordion id="archive" icon={Archive} title="Lưu trữ" isOpen={openAccordion === "archive"} isExpanded={isSidebarExpanded} onClick={() => setOpenAccordion((p) => p === "archive" ? null : "archive")}>
              <div className="flex flex-col gap-3 p-4">
                <RadioOption label="Hiển thị các mục đang hoạt động" active={archiveFilter === "active"} onClick={() => setArchiveFilter("active")} />
                <RadioOption label="Hiển thị các mục đã Lưu Trữ" active={archiveFilter === "archived"} onClick={() => setArchiveFilter("archived")} />
                <RadioOption label="Hiển thị tất cả các mục" active={archiveFilter === "all"} onClick={() => setArchiveFilter("all")} />
              </div>
            </SidebarAccordion>

            <div className="border-t border-gray-200" />

            <SidebarAccordion id="refresh" icon={RefreshCw} title="Tự động Làm mới" isOpen={openAccordion === "refresh"} isExpanded={isSidebarExpanded} onClick={() => setOpenAccordion((p) => p === "refresh" ? null : "refresh")}>
              <div className="flex flex-col gap-1.5 p-4">
                <label className="text-xs font-semibold text-gray-700">Thời gian làm mới</label>
                <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer hover:border-gray-300 transition-colors">
                  <span className="text-[13px] text-gray-700 font-medium">Không tự làm mới</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              </div>
            </SidebarAccordion>

            <div className="border-t border-gray-200" />
          </div>

          {/* Bottom Footer */}
          <div className="mt-auto flex flex-col bg-[#f8fafc]">
            <div className={cn("p-4 w-full flex items-center gap-3 cursor-pointer transition-colors text-sm font-medium",
              !isSidebarExpanded ? "justify-center px-0 h-14 hover:bg-gray-200/50 text-[#1e293b]" : "hover:bg-gray-50 text-gray-700")}>
              <Sparkles size={!isSidebarExpanded ? 20 : 18} strokeWidth={!isSidebarExpanded ? 1.5 : 2} className="shrink-0" />
              {isSidebarExpanded && <span className="truncate">AI Assistant</span>}
              {isSidebarExpanded && <ChevronLeft size={14} className="ml-auto text-gray-400" />}
            </div>

            <div
              className={cn("w-full h-[52px] flex items-center cursor-pointer transition-colors",
                isSidebarExpanded ? "justify-end px-4 hover:bg-gray-100 text-gray-400 hover:text-gray-600 border-t border-gray-200" : "justify-center hover:bg-gray-200/50 text-[#1e293b]")}
              onClick={(e) => { e.stopPropagation(); setIsSidebarExpanded(!isSidebarExpanded); }}
            >
              {isSidebarExpanded ? <ChevronRight size={14} /> : <ChevronLeft size={16} strokeWidth={1.5} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ColHeader({ label, sortKey, sortConfig, onSort, className }: {
  label: string; sortKey: string;
  sortConfig: { key: string; direction: "asc" | "desc" | null };
  onSort: (key: string) => void; className?: string;
}) {
  const active = sortConfig.key === sortKey;
  return (
    <div
      className={cn("flex items-center gap-1 px-3 h-full cursor-pointer select-none group/col hover:bg-gray-50 transition-colors", className)}
      onClick={() => onSort(sortKey)}
    >
      <span className="truncate font-bold text-gray-700">{label}</span>
      <div className="w-4 h-4 flex items-center justify-center shrink-0">
        {active && sortConfig.direction === "asc" && <ArrowUp size={12} strokeWidth={2.5} className="text-[#5340FF]" />}
        {active && sortConfig.direction === "desc" && <ArrowDown size={12} strokeWidth={2.5} className="text-[#5340FF]" />}
        {!active && <ArrowDownUp size={12} className="opacity-0 group-hover/col:opacity-60 transition-opacity" />}
      </div>
    </div>
  );
}

function PaginationBtn({ onClick, disabled, active, children }: { onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
        active ? "bg-[#5340FF] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100",
        disabled && "opacity-40 cursor-not-allowed hover:bg-transparent"
      )}
    >
      {children}
    </button>
  );
}

function FilterOption({ label, hasSub, onClick, active }: { label: string; hasSub?: boolean; onClick?: () => void; active?: boolean }) {
  return (
    <div
      className={cn("flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors", active ? "bg-blue-50" : "")}
      onClick={onClick}
    >
      <span className={cn("text-[13px] font-medium text-gray-700", active ? "text-[#5340FF] font-semibold" : "")}>{label}</span>
      {hasSub && <ChevronRight size={14} className="text-gray-400" />}
    </div>
  );
}

function SidebarAccordion({ id, icon: Icon, title, isOpen, isExpanded, onClick, children }: any) {
  if (!isExpanded) {
    return (
      <div className="w-full h-14 flex items-center justify-center cursor-pointer hover:bg-gray-200/50 transition-colors relative group" onClick={onClick}>
        <Icon size={20} strokeWidth={1.5} className={cn("transition-colors", isOpen ? "text-[#0f172a]" : "text-[#1e293b]")} />
        {isOpen && <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-[#5340FF]" />}
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-[#f8fafc]">
      <div className={cn("p-4 flex items-center justify-between cursor-pointer transition-colors group", isOpen ? "bg-white" : "hover:bg-gray-50")} onClick={onClick}>
        <div className="flex items-center gap-3">
          <Icon size={20} className={cn("transition-colors", isOpen ? "text-gray-800" : "text-gray-500")} strokeWidth={1.5} />
          <span className={cn("text-sm font-semibold", isOpen ? "text-gray-900" : "text-gray-700")}>{title}</span>
        </div>
        {isOpen ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronLeft size={14} className="text-gray-400" />}
      </div>
      {isOpen && children && <div className="bg-white border-b border-gray-100">{children}</div>}
    </div>
  );
}

function RadioOption({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
      <div className={cn("w-[14px] h-[14px] rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
        active ? "border-[#5340FF] bg-white" : "border-gray-300 bg-white")}>
        {active && <div className="w-[6px] h-[6px] rounded-full bg-[#5340FF]" />}
      </div>
      <span className="text-[13px] text-gray-700 font-medium select-none truncate">{label}</span>
    </label>
  );
}
