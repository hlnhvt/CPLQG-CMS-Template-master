"use client";

import {
  ArrowLeft, Check, MoreVertical, Plus, RotateCcw, ChevronDown,
  Music, Video, Image, Info, Calendar, Upload,
  Layers, Search, Globe, LayoutTemplate, 
  Tag, Users, Star, User, Pencil, Undo, Redo, Bold, Italic, Underline, Strikethrough,
  Subscript, Superscript, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Outdent, Indent, List, ListOrdered, Palette, Eraser, Scissors, Copy, Clipboard as CopyIcon,
  Quote, Code, Link as LinkIcon, Table, Image as ImageIcon, Film, Calculator, Eye, Pilcrow,
  MoveRight, MoveLeft, Terminal, Sparkles, Wand2, RefreshCw, BarChart2, HelpCircle, Folder,
  MinusSquare, Minus
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type MediaType = "audio" | "video" | "image";
type Status = "draft" | "published" | "pending" | "rejected";
type TabType = "multimedia" | "management" | "seo";
type SEOSubTab = "basic" | "advanced";

const STATUS_OPTIONS: { value: Status; label: string; color: string }[] = [
  { value: "draft", label: "Bản nháp", color: "bg-gray-400" },
  { value: "pending", label: "Chờ phê duyệt", color: "bg-orange-400" },
  { value: "published", label: "Đã xuất bản", color: "bg-teal-500" },
  { value: "rejected", label: "Từ chối", color: "bg-red-500" },
];

const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const LinkedinIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.98 0 1.771-.773 1.771-1.729V1.729C24 .774 23.208 0 22.225 0z"/>
    </svg>
);

const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z"/>
    </svg>
);

const GlobalIcon = () => (
   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
);

const Trash2 = (props: any) => (
  <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);

export default function CreateNewsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("multimedia");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false, type: "success" as "success" | "error" });

  // Form state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [publishDate, setPublishDate] = useState("");
  const [status, setStatus] = useState<Status>("draft");
  const [statusReason, setStatusReason] = useState("");
  const [slug, setSlug] = useState("slug");
  const [isFeatured, setIsFeatured] = useState(false);

  // New states from detailed screenshots
  const [multimediaEnabled, setMultimediaEnabled] = useState(true);
  const [seoTab, setSeoTab] = useState<SEOSubTab>("basic");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setIsStatusOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, visible: true, type });
    setTimeout(() => setToast({ message: "", visible: false, type: "success" }), 2500);
  };

  const handleSaveAndClose = () => {
    showToast("Lưu thành công");
    setTimeout(() => router.push("/content/news"), 1000);
  };

  const selectedStatus = STATUS_OPTIONS.find((s) => s.value === status)!;

  return (
    <div className="absolute inset-0 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/content/news"
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex flex-col">
            <div className="text-[11px] text-gray-500 font-medium leading-tight text-nowrap">Quản lý tin tức</div>
            <h1 className="text-base font-bold text-[#14233b] leading-tight text-nowrap">
              Đang Tạo Bản Ghi Quản lý tin tức Mới
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 relative" ref={menuRef}>
          <button
            className="w-8 h-8 rounded-full bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center justify-center transition-colors"
            onClick={handleSaveAndClose}
          >
            <Check size={18} strokeWidth={3} />
          </button>
          <button
            className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 flex items-center justify-center transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[1000px] ml-0 py-10 px-10 flex flex-col items-stretch">
          
          {/* GLOBAL FIELDS - TOP PART */}
          <div className="flex flex-col gap-10 mb-10">
             <FormField label="Tiêu đề (Tiếng Việt)" required>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="" className="w-full h-11 border border-[#e2e8f0] rounded-lg px-4 bg-white outline-none focus:border-[#5340FF] transition-all text-sm font-medium" />
             </FormField>

             <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-[#14233b]">Slug (URL)</label>
                <div className="flex items-center gap-2 text-blue-400 font-medium text-sm underline cursor-pointer hover:text-blue-600 transition-colors w-fit group">
                   <span>{slug}</span>
                   <Pencil size={14} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
             </div>

             <FormField label="Nội dung (Tiếng Việt)" required>
                <div className="border border-[#e2e8f0] rounded-lg bg-white overflow-hidden transition-all shadow-sm">
                   {/* Editor Mockup */}
                   <div className="flex flex-col border-b border-[#f1f5f9] bg-[#f8fafc]">
                      <div className="flex items-center gap-1 px-3 py-2 flex-wrap border-b border-[#f1f5f9]">
                         <EditorBtn icon={Undo} /> <EditorBtn icon={Redo} /> <EditorDivider />
                         <EditorBtn icon={Bold} /> <EditorBtn icon={Italic} /> <EditorBtn icon={Underline} />
                         <EditorBtn icon={Strikethrough} /> <EditorBtn icon={Subscript} /> <EditorBtn icon={Superscript} />
                         <EditorDivider />
                         <div className="px-2 h-7 flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:bg-gray-200 rounded transition-colors cursor-pointer"><span>Inter,system...</span><ChevronDown size={10} /></div>
                         <div className="px-2 h-7 flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:bg-gray-200 rounded transition-colors cursor-pointer"><span>15px</span><ChevronDown size={10} /></div>
                         <EditorDivider />
                         {["H1", "H2", "H3", "H4", "H5", "H6"].map(h => <button key={h} className="px-1.5 h-7 text-[10px] font-black text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">{h}</button>)}
                      </div>
                      <div className="flex items-center gap-1 px-3 py-2 flex-wrap border-b border-[#f1f5f9]">
                         <div className="px-2 h-7 flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:bg-gray-200 rounded transition-colors cursor-pointer"><span>Pre</span><ChevronDown size={10} /></div>
                         <EditorDivider />
                         <EditorBtn icon={AlignLeft} /> <EditorBtn icon={AlignCenter} /> <EditorBtn icon={AlignRight} /> <EditorBtn icon={AlignJustify} />
                         <EditorDivider />
                         <EditorBtn icon={Outdent} /> <EditorBtn icon={Indent} /> <EditorBtn icon={List} /> <EditorBtn icon={ListOrdered} />
                         <EditorDivider />
                         <EditorBtn icon={Palette} /> <EditorBtn icon={Palette} color="bg-yellow-100" /> <EditorBtn icon={Eraser} />
                         <EditorDivider />
                         <EditorBtn icon={Scissors} /> <EditorBtn icon={Copy} /> <CopyIcon className="w-7 h-7 p-1.5 text-gray-500 hover:bg-gray-200 rounded cursor-pointer" /> <Trash2 className="text-gray-500 hover:bg-gray-200 p-1 rounded cursor-pointer" /> <Globe className="w-7 h-7 p-1.5 text-gray-500 hover:bg-gray-200 rounded cursor-pointer" />
                         <EditorDivider />
                         <EditorBtn icon={Quote} /> <EditorBtn icon={Code} /> <EditorBtn icon={LinkIcon} />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-2 flex-wrap bg-[#f8fafc]">
                         <EditorBtn icon={Table} /> <EditorBtn icon={ImageIcon} /> <EditorBtn icon={Film} /> <EditorBtn icon={LayoutTemplate} />
                         <EditorDivider />
                         <EditorBtn icon={Calculator} /> <EditorBtn icon={Eye} /> <EditorBtn icon={Pilcrow} /> <EditorBtn icon={MoveLeft} /> <EditorBtn icon={MoveRight} /> <EditorBtn icon={Terminal} />
                      </div>
                   </div>
                   <textarea rows={12} value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-6 outline-none bg-transparent resize-y text-sm font-normal min-h-[400px]" />
                </div>
             </FormField>

             <FormField label="Tóm tắt (Tiếng Việt)">
                <div className="relative group">
                   <textarea rows={6} value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full border border-[#e2e8f0] rounded-lg p-4 bg-white outline-none focus:border-[#5340FF] transition-all resize-y text-sm min-h-[160px]" maxLength={1000} />
                   <div className="absolute bottom-3 right-4 text-[11px] font-bold text-gray-400">1000</div>
                </div>
             </FormField>
          </div>

          {/* TABS - STARTS HERE */}
          <div className="flex items-center gap-1 mb-10 bg-gray-50 p-1 rounded-lg w-fit">
             <TabPill active={activeTab === "multimedia"} onClick={() => setActiveTab("multimedia")} label="Multimedia" />
             <TabPill active={activeTab === "management"} onClick={() => setActiveTab("management")} label="Quản lý nội dung" />
             <TabPill active={activeTab === "seo"} onClick={() => setActiveTab("seo")} label="· SEO" />
          </div>

          <div className="flex flex-col gap-10">
            {/* ─── TAB: Multimedia ───────────────────────────────────────────── */}
            {activeTab === "multimedia" && (
                <div className="flex flex-col gap-10 animate-in fade-in duration-300">
                   <FormField label="Hiển thị Multimedia">
                      <div className="border border-[#e2e8f0] rounded-lg p-5 bg-white flex flex-col gap-2 shadow-sm">
                        <label className="flex items-center gap-3 cursor-pointer group w-fit">
                          <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", multimediaEnabled ? "bg-[#5340FF] border-[#5340FF]" : "border-gray-300 bg-white")}>
                             {multimediaEnabled && <Check size={12} strokeWidth={4} className="text-white" />}
                             <input type="checkbox" className="hidden" checked={multimediaEnabled} onChange={() => setMultimediaEnabled(!multimediaEnabled)} />
                          </div>
                          <span className="text-sm font-bold text-[#5340FF]">Kích hoạt</span>
                        </label>
                      </div>
                   </FormField>

                   <FormField label="Phân loại Media">
                      <div className="grid grid-cols-3 gap-5">
                        {[
                          { type: "audio" as MediaType, label: "Âm thanh", Icon: () => (
                             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#5340FF]"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                          )},
                          { type: "video" as MediaType, label: "Video", Icon: () => (
                             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#5340FF]"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                          )},
                          { type: "image" as MediaType, label: "Hình ảnh", Icon: () => (
                             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#5340FF]"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                          )},
                        ].map(({ type, label, Icon }) => (
                          <button key={type} type="button" onClick={() => setMediaType(type)} className={cn("relative flex flex-col items-center justify-center py-7 rounded-lg border-2 transition-all gap-4", mediaType === type ? "border-[#5340FF] bg-white shadow-md shadow-blue-50" : "border-gray-100 bg-white hover:border-gray-200")}>
                            <div className={cn("w-5 h-5 rounded-full border-2 absolute top-3 left-3 flex items-center justify-center", mediaType === type ? "border-[#5340FF]" : "border-gray-100")}>
                              {mediaType === type && <div className="w-2.5 h-2.5 rounded-full bg-[#5340FF]" />}
                            </div>
                            <Icon />
                            <span className={cn("text-xs font-bold", mediaType === type ? "text-gray-700" : "text-gray-500")}>{label}</span>
                          </button>
                        ))}
                      </div>
                   </FormField>
                   <FormField label="Thêm các file cho multimedia">
                      <RelatedRecordBox label="Tải lên tập tin" />
                   </FormField>
                </div>
            )}

            {/* ─── TAB: Quản lý nội dung ────────────────────────────────────── */}
            {activeTab === "management" && (
                <div className="flex flex-col gap-10 animate-in fade-in duration-300">
                   {/* ROW 1: Image Dropzone & Display Activation */}
                   <div className="grid grid-cols-2 gap-10 items-end">
                      <FormField label="Hình ảnh đại diện">
                         <div className="border border-dashed border-[#e2e8f0] rounded-xl bg-white flex flex-col items-center justify-center py-10 px-6 cursor-pointer group aspect-video shadow-sm">
                            <div className="flex items-center gap-4 text-gray-400 grayscale opacity-60 mb-4 scale-150">
                               <Upload size={14} /> <Folder size={14} /> <GlobalIcon />
                            </div>
                            <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600">Kéo & thả tệp vào đây</span>
                         </div>
                         <span className="text-[11px] text-gray-400 italic">Chọn hình ảnh. Tối đa 10MB.</span>
                      </FormField>
                      <FormField label="Hiển thị hình ảnh đại diện trong Chi tiết">
                         <div className="border border-[#e2e8f0] rounded-lg p-5 bg-white flex flex-col gap-2 shadow-sm min-h-[44px] justify-center mb-4">
                           <label className="flex items-center gap-3 cursor-pointer group w-fit">
                              <div className="w-5 h-5 border-2 border-[#5340FF] rounded flex items-center justify-center transition-all">
                                 <Check size={14} strokeWidth={3} className="text-[#5340FF]" />
                              </div>
                              <span className="text-sm font-bold text-[#5340FF]">Đã kích hoạt</span>
                           </label>
                         </div>
                      </FormField>
                   </div>

                   {/* ROW 2: Caption (Left) & Category (Right) */}
                   <div className="grid grid-cols-2 gap-10 items-start">
                      <FormField label="Chú thích hình ảnh">
                         <div className="border border-[#e2e8f0] rounded-lg p-3 bg-white flex items-center gap-3 shadow-sm h-11 shrink-0">
                            <div className="w-4.5 h-4.5 border-[1.5px] border-[#94a3b8] rounded flex items-center justify-center scale-90 p-0.5">
                               <div className="w-full h-[1.5px] bg-[#94a3b8]" />
                         </div>
                            <span className="text-[13px] font-bold text-gray-700">Đã kích hoạt</span>
                         </div>
                      </FormField>
                      <FormField label="Danh mục *">
                         <div className="relative flex items-center w-full h-11 border border-[#e2e8f0] rounded-lg bg-white overflow-hidden transition-all shadow-sm">
                           <input type="text" placeholder="Chọn một bản ghi..." className="flex-1 h-full px-4 outline-none text-sm bg-transparent placeholder:text-gray-300" />
                           <div className="flex items-center gap-2 pr-4 text-gray-400">
                              <Plus size={16} className="cursor-pointer hover:text-black opacity-60" />
                              <ChevronDown size={14} className="opacity-60" />
                           </div>
                         </div>
                      </FormField>
                   </div>

                   {/* ROW 3: Tags (Left) & Author (Right) */}
                   <div className="grid grid-cols-2 gap-10 items-start">
                      <FormField label="Tags">
                         <RelatedRecordBox />
                      </FormField>
                      <FormField label="Tác giả">
                         <div className="relative flex items-center w-full h-11 border border-[#e2e8f0] rounded-lg bg-white overflow-hidden transition-all shadow-sm">
                           <input type="text" placeholder="Chọn một bản ghi..." className="flex-1 h-full px-4 outline-none text-sm bg-transparent placeholder:text-gray-300" />
                           <div className="flex items-center gap-2 pr-4 text-gray-400">
                              <Plus size={16} className="cursor-pointer hover:text-black opacity-60" />
                              <ChevronDown size={14} className="opacity-60" />
                           </div>
                         </div>
                      </FormField>
                   </div>

                   {/* ROW 4: Featured (Left) */}
                   <div className="grid grid-cols-2 gap-10 items-start">
                      <FormField label="Bài nổi bật">
                         <div className="border border-[#f1f5f9] rounded-lg p-5 bg-white flex flex-col gap-2 shadow-sm">
                           <label className="flex items-center gap-3 cursor-pointer group w-fit">
                             <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-gray-400 bg-white flex items-center justify-center transition-all">
                                <input type="checkbox" className="hidden" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} />
                                {isFeatured && <Check size={12} strokeWidth={4} className="text-[#5340FF]" />}
                             </div>
                             <span className="text-sm font-bold text-gray-700">Kích hoạt</span>
                           </label>
                           <span className="text-[11px] text-gray-400 italic font-medium leading-relaxed">Đánh dấu bài viết này là bài nổi bật để hiển thị ưu tiên.</span>
                         </div>
                      </FormField>
                   </div>
                </div>
            )}

            {/* ─── TAB: SEO ─────────────────────────────────────────────────── */}
            {activeTab === "seo" && (
                <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                   <div className="flex flex-col gap-6">
                      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                         <div className="w-1 h-4 bg-[#5340FF]/20" /> Nội dung SEO
                      </h3>
                      <div className="flex items-center gap-8 border-b border-gray-100 pb-2">
                         <button onClick={() => setSeoTab("basic")} className={cn("text-xs font-bold transition-colors relative pb-2", seoTab === "basic" ? "text-[#5340FF]" : "text-gray-400 hover:text-gray-600")}>
                            Cơ bản {seoTab === "basic" && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#5340FF] rounded-full" />}
                         </button>
                         <button onClick={() => setSeoTab("advanced")} className={cn("text-xs font-bold transition-colors relative pb-2", seoTab === "advanced" ? "text-[#5340FF]" : "text-gray-400 hover:text-gray-600")}>
                            Nâng cao {seoTab === "advanced" && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#5340FF] rounded-full" />}
                         </button>
                      </div>
                   </div>

                   {seoTab === "basic" && (
                      <div className="flex flex-col gap-10">
                         <FormField label="Tiêu đề trang">
                            <div className="relative">
                               <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Nhập tiêu đề SEO của bạn" className="w-full h-11 border border-[#e2e8f0] rounded-lg px-4 pr-10 bg-white outline-none focus:border-[#5340FF] transition-all text-sm" />
                               <Sparkles size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <span className="text-[10px] text-gray-400">Missing Khuyến nghị 45-60 ký tự. (Hiện tại: {seoTitle.length})</span>
                         </FormField>

                         <FormField label="Mô tả Meta">
                            <div className="relative">
                               <textarea rows={4} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} placeholder="Nhập mô tả meta của bạn" className="w-full border border-[#e2e8f0] rounded-lg p-4 pr-10 bg-white outline-none focus:border-[#5340FF] transition-all resize-y text-sm" />
                               <Sparkles size={16} className="absolute right-3 top-5 text-gray-400" />
                            </div>
                            <span className="text-[10px] text-gray-400">Missing Khuyến nghị 130-160 ký tự. (Hiện tại: {metaDesc.length})</span>
                         </FormField>

                         <div className="flex flex-col gap-4">
                            <label className="text-[13px] font-bold text-[#14233b]">Xem trước tìm kiếm</label>
                            <div className="border border-[#e2e8f0] rounded-xl p-6 bg-white shadow-sm flex flex-col gap-2">
                               <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#5340FF]"><Globe size={12} /></div>
                                  <div className="flex flex-col text-[10px]">
                                     <span className="font-bold text-gray-400 leading-tight">CỔNG PHÁP LUẬT QUỐC GIA</span>
                                     <span className="text-gray-300 leading-tight">http://10.15.68.122:8056 › content_articles</span>
                                  </div>
                               </div>
                               <h4 className="text-[#5340FF] text-base font-medium truncate">{seoTitle || "Nhập tiêu đề để xem trước"}</h4>
                               <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{metaDesc || "Nhập mô tả meta để xem trước"}</p>
                            </div>
                         </div>

                         <div className="flex flex-col gap-6 mt-6 border-t border-gray-100 pt-10">
                            <label className="text-[13px] font-bold text-[#14233b]">Xem trước mạng xã hội</label>
                            <div className="flex flex-col lg:flex-row gap-10">
                               <div className="flex-1 flex flex-col gap-4">
                                  <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl bg-white flex flex-col items-center justify-center py-20 px-6 cursor-pointer group aspect-video shadow-sm">
                                     <div className="flex items-center gap-4 text-gray-400 opacity-60 mb-4 scale-150">
                                        <Upload size={14} /> <Folder size={14} /> <GlobalIcon />
                                     </div>
                                     <span className="text-sm font-bold text-gray-400">Kéo & thả tệp vào đây</span>
                                  </div>
                                  <span className="text-[11px] text-gray-400 italic">Tải ảnh lên để xem trước liên kết...</span>
                               </div>
                               <div className="w-full lg:w-[300px] flex flex-col gap-7">
                                  <div className="flex flex-col gap-4 text-xs text-gray-500 font-medium leading-relaxed">
                                     <span>Xem trước nội dung của bạn sẽ hiển thị như thế nào khi chia sẻ trên mạng xã hội.</span>
                                     <div className="flex flex-col gap-1.5">
                                        <SocialPreviewItem icon={FacebookIcon} label="Facebook" color="text-[#1877F2]" />
                                        <SocialPreviewItem icon={LinkedinIcon} label="LinkedIn" color="text-[#0A66C2]" active />
                                        <SocialPreviewItem icon={XIcon} label="X" color="text-black" />
                                     </div>
                                  </div>
                                  <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                                     <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Kích thước ảnh khuyến nghị</span>
                                     <div className="flex flex-col gap-1 text-[12px] text-gray-500 font-bold">
                                        <div className="flex items-center gap-2 mr-2 leading-none"><div className="w-1 h-1 rounded-full bg-gray-400" /> 1200 X 630 pixels</div>
                                        <div className="flex items-center gap-2 mr-2 leading-none"><div className="w-1 h-1 rounded-full bg-gray-400" /> 1.91:1 aspect ratio</div>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   )}

                   {seoTab === "advanced" && (
                      <div className="flex flex-col gap-12 animate-in fade-in duration-300">
                         {/* Group 1: Sitemap */}
                         <div className="flex flex-col gap-3">
                            <label className="text-[13px] font-bold text-[#14233b]">Cài đặt Sơ đồ trang (i)</label>
                            <div className="grid grid-cols-2 gap-10">
                               <div className="flex flex-col gap-2">
                                  <div className="relative flex items-center w-full h-11 border border-[#e2e8f0] rounded-lg bg-white overflow-hidden transition-all shadow-sm">
                                     <RefreshCw size={16} className="ml-4 text-gray-400" />
                                     <input type="text" placeholder="Hàng tháng" className="flex-1 h-full px-3 outline-none text-sm bg-transparent" />
                                     <ChevronDown size={14} className="mr-4 text-gray-400" />
                                  </div>
                                  <span className="text-[11px] text-gray-400">Tần suất nội dung có thể thay đổi</span>
                               </div>
                               <div className="flex flex-col gap-2">
                                  <div className="relative flex items-center w-full h-11 border border-[#e2e8f0] rounded-lg bg-white overflow-hidden transition-all shadow-sm">
                                     <BarChart2 size={16} className="ml-4 text-gray-400" />
                                     <input type="text" placeholder="Trung bình (0.5)" className="flex-1 h-full px-3 outline-none text-sm bg-transparent" />
                                     <ChevronDown size={14} className="mr-4 text-gray-400" />
                                  </div>
                                  <span className="text-[11px] text-gray-400">Độ ưu tiên của URL này so với các trang khác</span>
                               </div>
                            </div>
                         </div>

                         {/* Group 2: Crawler */}
                         <div className="flex flex-col gap-3">
                            <label className="text-[13px] font-bold text-[#14233b]">Điều khiển công cụ tìm kiếm (i)</label>
                            <div className="grid grid-cols-2 gap-10">
                               <div className="border border-[#e2e8f0] rounded-lg p-4 bg-white flex items-center gap-4 shadow-sm h-14">
                                  <div className="w-5 h-5 border-2 border-gray-100 rounded bg-white shadow-inner" />
                                  <span className="text-sm font-bold text-gray-500">Không lập chỉ mục</span>
                               </div>
                               <div className="border border-[#e2e8f0] rounded-lg p-4 bg-white flex items-center gap-4 shadow-sm h-14">
                                  <div className="w-5 h-5 border-2 border-gray-100 rounded bg-white shadow-inner" />
                                  <span className="text-sm font-bold text-gray-500">Không theo dõi</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
            )}
          </div>

          {/* SHARED BOTTOM FIELDS */}
          <div className="flex flex-col gap-8 mt-16 pt-12 border-t border-[#f1f5f9]">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <FormField label="Ngày đăng">
                  <div className="relative flex items-center w-full h-11 border border-[#e2e8f0] rounded-lg bg-white overflow-hidden shadow-sm">
                    <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="flex-1 h-full px-4 outline-none text-sm text-gray-600" />
                    <div className="w-10 pr-1 flex items-center justify-center text-gray-400 shrink-0 pointer-events-none opacity-60"><Calendar size={18} /></div>
                  </div>
                </FormField>
                <FormField label="Trạng thái" required>
                  <div className="relative" ref={statusRef}>
                    <button type="button" onClick={() => setIsStatusOpen(!isStatusOpen)} className="w-full h-11 border border-[#e2e8f0] rounded-lg px-4 bg-white flex items-center justify-between text-sm hover:bg-gray-50 transition-all shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <span className={cn("w-2 h-2 rounded-full", selectedStatus.color)} />
                        <span className="font-bold text-gray-700">{selectedStatus.label}</span>
                      </div>
                      <ChevronDown size={14} className={cn("text-gray-400 transition-transform", isStatusOpen && "rotate-180")} />
                    </button>
                    {isStatusOpen && (
                      <div className="absolute top-12 left-0 right-0 bg-white border border-[#e2e8f0] rounded-lg shadow-xl z-30 py-1 overflow-hidden">
                        {STATUS_OPTIONS.map((opt) => (
                          <button key={opt.value} type="button" onClick={() => { setStatus(opt.value); setIsStatusOpen(false); }} className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors", status === opt.value && "bg-blue-50 text-[#5340FF] font-bold")}>
                            <span className={cn("w-2 h-2 rounded-full", opt.color)} />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </FormField>
             </div>
             
             <FormField label="Lý do chuyển đổi trạng thái">
                <textarea rows={6} value={statusReason} onChange={(e) => setStatusReason(e.target.value)} className="w-full border border-[#e2e8f0] rounded-lg p-4 bg-white outline-none focus:border-[#5340FF] transition-all text-sm min-h-[160px] shadow-sm" placeholder="" />
             </FormField>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
                <div className="flex flex-col gap-3">
                   <label className="text-[13px] font-bold text-[#14233b]">Biên tập gửi Review</label>
                   <button type="button" onClick={() => showToast("Đã gửi duyệt")} className="w-full h-11 bg-[#5340FF] text-white text-[12px] font-bold uppercase tracking-tight rounded-lg hover:bg-[#4330EF] transition-all shadow-lg shadow-[#5340FF]/25 active:scale-[0.98]">Gửi duyệt</button>
                </div>
                <div className="flex flex-col gap-3">
                   <label className="text-[13px] font-bold text-[#14233b]">Quyền xuất bản</label>
                   <button type="button" onClick={() => { setStatus("published"); showToast("Đã xuất bản"); }} className="w-full h-11 bg-[#5340FF] text-white text-[12px] font-bold uppercase tracking-tight rounded-lg hover:bg-[#4330EF] transition-all shadow-lg shadow-[#5340FF]/25 active:scale-[0.98]">Xuất bản ngay</button>
                </div>
             </div>

             <div className="mt-8 flex flex-col gap-3">
                <label className="text-[13px] font-bold text-[#14233b]">Comment ID</label>
                <div className="border border-[#e2e8f0] border-l-4 border-l-[#5340FF] bg-[#f8fafc]/80 rounded-lg px-5 py-4 flex items-center gap-4 shadow-sm h-14 shrink-0">
                   <div className="w-5 h-5 rounded-full border-2 border-[#5340FF] flex items-center justify-center text-[#5340FF] shrink-0"><Info size={11} strokeWidth={4} /></div>
                   <span className="text-[13px] font-bold text-[#64748b]">Không có bản ghi nào</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                   <button type="button" className="px-5 py-2.5 bg-[#5340FF] text-white text-[12px] font-bold tracking-tight rounded-lg hover:bg-[#4330EF] transition-all shadow-md shadow-[#5340FF]/25 text-nowrap active:scale-[0.98]">Tạo Mới</button>
                   <button type="button" className="px-5 py-2.5 bg-[#5340FF] text-white text-[12px] font-bold tracking-tight rounded-lg hover:bg-[#4330EF] transition-all shadow-md shadow-[#5340FF]/25 text-nowrap active:scale-[0.98]">Thêm Dữ Liệu Sẵn Có</button>
                </div>
             </div>
          </div>
          <div className="h-20" />
        </div>
      </div>

      {/* Toast */}
      {toast.visible && (
        <div className="fixed top-24 right-6 bg-white border border-gray-100 shadow-2xl rounded-lg px-6 py-4 flex items-center gap-4 z-[100] overflow-hidden animate-in fade-in slide-in-from-right-10 duration-300">
           <div className="absolute bottom-0 left-0 h-1 bg-green-500 animate-[progress_2.5s_linear_forwards]" />
           <style>{`@keyframes progress { from { width: 100%; } to { width: 0%; } }`}</style>
           <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check size={16} strokeWidth={4} /></div>
           <span className="text-sm font-bold text-gray-800">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {label && (
        <label className="text-[13px] font-bold text-[#14233b] flex items-center gap-1">
          {label}
          {required && <span className="text-[#5340FF]">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

function TabPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("px-6 h-10 rounded-md text-xs font-bold transition-all flex items-center justify-center text-nowrap", active ? "bg-[#e2e8f0] text-gray-800 shadow-sm" : "bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50")}>
      {label}
    </button>
  );
}

function RelatedRecordBox({ label = "Tạo Mới" }: { label?: string }) {
  return (
    <div className="flex flex-col gap-3.5 w-full">
       <div className="border border-[#e2e8f0] border-l-4 border-l-[#5340FF] bg-[#f8fafc]/80 rounded-lg px-5 py-4 flex items-center gap-4 shadow-sm h-14 shrink-0">
          <div className="w-5 h-5 rounded-full border-2 border-[#5340FF] flex items-center justify-center text-[#5340FF] shrink-0"><Info size={11} strokeWidth={4} /></div>
          <span className="text-[13px] font-bold text-[#64748b]">Không có bản ghi nào</span>
       </div>
       <div className="flex items-center gap-3 mt-1">
          <button type="button" className="px-5 py-2.5 bg-[#5340FF] text-white text-[12px] font-bold rounded-lg hover:bg-[#4330EF] transition-all shadow-md shadow-[#5340FF]/25 text-nowrap active:scale-[0.98]">{label}</button>
          <button type="button" className="px-5 py-2.5 bg-[#5340FF] text-white text-[12px] font-bold rounded-lg hover:bg-[#4330EF] transition-all shadow-md shadow-[#5340FF]/25 text-nowrap active:scale-[0.98]">Thêm Dữ Liệu Sẵn Có</button>
       </div>
    </div>
  );
}

function SocialPreviewItem({ icon: Icon, label, color, active }: { icon: any; label: string; color: string; active?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between p-3.5 rounded-lg border-2 transition-all cursor-pointer", active ? "border-[#5340FF] bg-blue-50/10 shadow-sm" : "border-transparent hover:bg-gray-50")}>
        <div className="flex items-center gap-3.5">
            <div className={cn("w-5 h-5 flex items-center justify-center", color)}><Icon /></div>
            <span className={cn("text-[13px] font-bold tracking-tight", active ? "text-gray-900" : "text-gray-400")}>{label}</span>
        </div>
        {active && <div className="w-1.5 h-6 rounded-full bg-[#5340FF]" />}
    </div>
  );
}

function EditorBtn({ icon: Icon, color }: { icon: any; color?: string }) {
  return (
    <button type="button" className={cn("w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors text-gray-400", color)}>
       <Icon size={14} strokeWidth={2.5} />
    </button>
  );
}

function EditorDivider() {
  return <div className="w-[1px] h-4 bg-gray-200 mx-1" />;
}
