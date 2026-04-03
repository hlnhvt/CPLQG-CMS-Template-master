"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Box, Users, Folder, TrendingUp, Settings, HelpCircle,
  Bell, User, ChevronRight, Search, Plus, Save, DownloadCloud,
  Layers, Lock, Sliders, Bookmark, Globe, Sparkles, ShoppingBag,
  Puzzle, AlertCircle, MessageSquare, LayoutTemplate, FileText, Hash, Megaphone,
  Radio, BarChart, Database, ListFilter
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
  const isContent = pathname.includes('/content') || pathname.includes('/collections') || pathname === '/(admin)';

  const [openGroups, setOpenGroups] = useState<string[]>(["Content_Management"]);

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  return (
    <div className="flex h-screen w-[320px] shrink-0 border-r border-gray-200">
      {/* Primary Sidebar (Narrow) */}
      <div className="flex flex-col w-[60px] bg-[#1a2332] text-white shrink-0 justify-between items-center py-4">
        <div className="flex flex-col gap-4 items-center">
          <Link href="/collections/content_articles" className="w-10 h-10 flex items-center justify-center mb-2 overflow-hidden rounded-md bg-white">
            <img src="/logo.webp" alt="Quốc huy Việt Nam" className="w-full h-full object-cover" />
          </Link>

          <NavIcon icon={Box} href="/collections/content_articles" active={isContent} />
          <NavIcon icon={Users} href="#" />
          <NavIcon icon={Folder} href="#" />
          <NavIcon icon={TrendingUp} href="#" />
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
              <SidebarItem icon={Users} label="Vai trò người dùng" href="#" />
              <SidebarItem icon={Lock} label="Access Policies" href="#" />
              
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
