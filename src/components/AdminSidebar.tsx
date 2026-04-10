"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Box, Users, Folder, TrendingUp, Settings, HelpCircle,
  Bell, User, ChevronRight, Search, Plus, Save, DownloadCloud,
  Layers, Lock, Sliders, Bookmark, Globe, Sparkles, ShoppingBag,
  Puzzle, AlertCircle, MessageSquare, LayoutTemplate, FileText, Hash, Megaphone,
  Radio, BarChart, Database, ListFilter, ClipboardList, PieChart, Clock, MapPin,
  BarChart2, LineChart, UserX, Timer, Hourglass, Smartphone, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MENU_GROUPS } from "@/lib/menu-data";

const ICON_MAP: Record<string, any> = {
  Box, Users, Folder, TrendingUp, Settings, HelpCircle,
  Bell, User, Search, Layers, Lock, Sliders, Bookmark,
  Globe, Sparkles, ShoppingBag, Puzzle, AlertCircle, MessageSquare,
  LayoutTemplate, FileText, Hash, Megaphone, Radio, BarChart, Database, ListFilter
};

export default function AdminSidebar() {
  const pathname = usePathname() || "";
  const isSettings = pathname.includes('/settings');
  const isReports = pathname.includes('/reports');
  const isContent = !isSettings && !isReports && (pathname.includes('/content') || pathname.includes('/collections') || pathname === '/' || pathname === '/(admin)');

  const [openGroups, setOpenGroups] = useState<string[]>(["Content_Management"]);

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  return (
    <div className="flex h-screen w-[320px] shrink-0 border-r border-gray-200 print:hidden">
      {/* Primary Sidebar (Narrow) */}
      <div className="flex flex-col w-[60px] bg-[#1a2332] text-white shrink-0 justify-between items-center py-4">
        <div className="flex flex-col gap-4 items-center">
          <Link href="/collections/content_articles" className="w-10 h-10 flex items-center justify-center mb-2 overflow-hidden rounded-md bg-white">
            <img src="/logo.webp" alt="Quốc huy Việt Nam" className="w-full h-full object-cover" />
          </Link>

          <NavIcon icon={Box} href="/collections/content_articles" active={isContent} />
          <NavIcon icon={Users} href="/collections/directus_users" />
          <NavIcon icon={Folder} href="#" />
          <NavIcon icon={TrendingUp} href="/reports/article-by-category" active={isReports} />
          <NavIcon icon={Settings} href="/settings/data-model" active={isSettings} />
          <NavIcon icon={HelpCircle} href="#" />
        </div>

        <div className="flex flex-col gap-4 items-center">
          <NavIcon icon={Bell} href="#" />
          <NavIcon icon={User} href="#" />
        </div>
      </div>

      {/* Secondary Sidebar (Wider) */}
      <div className="flex-1 bg-[#f8fafc] flex flex-col overflow-y-auto">
        <div className="h-16 flex items-center px-4 font-semibold text-sm text-[#14233b] border-b border-gray-200 uppercase tracking-tight shrink-0">
          CỔNG PHÁP LUẬT QUỐC GIA
        </div>

        <div className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar text-[13px] font-medium text-gray-700 pb-20">
          {isSettings && (
            <>
              <SidebarItem icon={Box} label="Mô Hình Dữ Liệu" href="/settings/data-model" active={pathname.includes('/data-model')} />
              <SidebarItem icon={TrendingUp} label="Flows" href="#" />
              <SidebarItem icon={Users} label="Vai trò người dùng" href="/collections/directus_roles" />
              <SidebarItem icon={Lock} label="Access Policies" href="/collections/directus_access" />
              
              <div className="my-2 border-t border-gray-200"></div>
              
              <SidebarItem icon={Settings} label="Cài đặt" href="#" />
              <SidebarItem icon={Sliders} label="Appearance" href="#" />
              <SidebarItem icon={Bookmark} label="Đánh dấu" href="#" />
              <SidebarItem icon={Globe} label="Các Bản Dịch" href="#" />
              <SidebarItem icon={Sparkles} label="AI" href="#" />
              
              <div className="my-2 border-t border-gray-200"></div>
              
              <SidebarItem icon={ShoppingBag} label="Cửa hàng" href="#" />
              <SidebarItem icon={Puzzle} label="Phần mở rộng" href="#" />
              
              <div className="my-2 border-t border-gray-200"></div>
              
              <SidebarItem icon={AlertCircle} label="Báo Cáo Lỗi" href="#" />
              <SidebarItem icon={MessageSquare} label="Yêu cầu tính năng" href="#" />
            </>
          )}

          {isReports && (
            <>
              <SidebarItem icon={BarChart} label="Theo chuyên mục" href="/reports/article-by-category" active={pathname === '/reports/article-by-category'} />
              <SidebarItem icon={Users} label="Theo người biên tập" href="/reports/article-by-contributor" active={pathname === '/reports/article-by-contributor'} />
              <SidebarItem icon={ListFilter} label="Theo trạng thái" href="/reports/article-by-status" active={pathname === '/reports/article-by-status'} />
              
              <div className="my-2 border-t border-gray-200"></div>
              
              <SidebarGroup icon={ClipboardList} label="Quản Lý Khảo Sát" expanded={openGroups.includes('Survey_Management')} onClick={() => toggleGroup('Survey_Management')}>
                <SidebarItem icon={PieChart} label="Tổng quan" href="/reports/survey/overview" active={pathname === '/reports/survey/overview'} indent />
                <SidebarItem icon={Clock} label="Theo thời gian" href="/reports/survey/time" active={pathname === '/reports/survey/time'} indent />
                <SidebarItem icon={MapPin} label="Địa phương" href="/reports/survey/location" active={pathname === '/reports/survey/location'} indent />
                <SidebarItem icon={Users} label="Loại người dùng" href="/reports/survey/user-type" active={pathname === '/reports/survey/user-type'} indent />
                <SidebarItem icon={BarChart2} label="Thống kê câu hỏi" href="/reports/survey/questions" active={pathname === '/reports/survey/questions'} indent />
                <SidebarItem icon={MessageSquare} label="Câu hỏi mở" href="/reports/survey/open-ended" active={pathname === '/reports/survey/open-ended'} indent />
                <SidebarItem icon={LineChart} label="Phân tích câu hỏi" href="/reports/survey/analysis" active={pathname === '/reports/survey/analysis'} indent />
                <SidebarItem icon={UserX} label="Bỏ giữa chừng" href="/reports/survey/drop-off" active={pathname === '/reports/survey/drop-off'} indent />
                <SidebarItem icon={Timer} label="Thời gian hoàn thành" href="/reports/survey/completion-time" active={pathname === '/reports/survey/completion-time'} indent />
                <SidebarItem icon={Hourglass} label="Thời gian trả lời câu hỏi" href="/reports/survey/question-time" active={pathname === '/reports/survey/question-time'} indent />
                <SidebarItem icon={Smartphone} label="Thiết bị" href="/reports/survey/devices" active={pathname === '/reports/survey/devices'} indent />
                <SidebarItem icon={Activity} label="Hành vi" href="/reports/survey/behavior" active={pathname === '/reports/survey/behavior'} indent />
              </SidebarGroup>
            </>
          )}

          {isContent && MENU_GROUPS.map(group => {
            if (group.id === "Ungrouped") return null; // skip root metadata if you prefer
            const GroupIcon = ICON_MAP[group.icon] || Folder;
            const isExpanded = openGroups.includes(group.id);
            
            return (
               <SidebarGroup key={group.id} icon={GroupIcon} label={group.label} expanded={isExpanded} onClick={() => toggleGroup(group.id)}>
                 {group.collections.map(col => {
                    const ColIcon = ICON_MAP[col.icon] || FileText;
                    return (
                        <SidebarItem 
                           key={col.id}
                           icon={ColIcon} 
                           label={col.label} 
                           href={`/collections/${col.id}`} 
                           active={pathname.includes(`/collections/${col.id}`)} 
                           indent 
                        />
                    );
                 })}
               </SidebarGroup>
            );
          })}
        </div>

        <div className="p-4 text-xs text-gray-400 font-medium shrink-0 border-t border-gray-200 bg-[#f8fafc]">
          Directus 11.14.1
        </div>
      </div>
    </div>
  );
}

function NavIcon({ icon: Icon, active, href }: { icon: any, active?: boolean, href: string }) {
  return (
    <Link href={href || "#"} className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative",
      active ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"
    )}>
      {active && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#5340FF] rounded-r-md"></div>}
      <Icon size={20} strokeWidth={2} />
    </Link>
  );
}

function SidebarItem({ icon: Icon, label, active, href, indent }: { icon: any, label: string, active?: boolean, href: string, indent?: boolean }) {
  return (
    <Link href={href || "#"} className={cn("flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      active ? "bg-white shadow-sm text-[#5340FF]" : "hover:bg-gray-100/80",
      indent ? "ml-6" : ""
    )}>
      <Icon size={18} className={active ? "text-[#5340FF]" : "text-gray-400"} />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function SidebarGroup({ icon: Icon, label, expanded, onClick, children }: { icon: any, label: string, expanded?: boolean, onClick: () => void, children?: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div onClick={onClick} className={cn("flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer hover:bg-gray-100/80 text-gray-700")}>
        <div className="flex items-center gap-3 w-[calc(100%-20px)]">
          <Icon size={18} className="text-gray-400 shrink-0" />
          <span className="truncate">{label}</span>
        </div>
        <ChevronRight size={14} className={cn("text-gray-400 transition-transform shrink-0", expanded ? "rotate-90" : "")} />
      </div>
      {expanded && children && (
        <div className="flex flex-col mt-0.5">
          {children}
        </div>
      )}
    </div>
  );
}
