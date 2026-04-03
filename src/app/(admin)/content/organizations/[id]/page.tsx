"use client";

import { 
  ArrowLeft, Edit2, History, RotateCcw, Building2, ChevronDown, BookOpen, Shield, Users, CalendarClock, ChevronRight, ListFilter, Play, Bookmark, MoreVertical,
  UserCircle2, ShieldCheck, Link as LinkIcon, Search, Check
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const MOCK_USERS = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nva@moj.gov.vn', role: 'System Admin', status: 'active', last_access: '2026-04-02 10:15' },
  { id: 2, name: 'Trần Thị B', email: 'ttb@moj.gov.vn', role: 'Unit Admin', status: 'active', last_access: '2026-04-01 16:30' },
];

const MOCK_POLICIES = [
  { collection: 'tin_bai', read: true, create: true, update: true, delete: false, filter: '{"organization_code": {"_eq": "$CURRENT_USER.organization_code"}}' },
  { collection: 'van_ban', read: true, create: true, update: true, delete: false, filter: '{"organization_code": {"_eq": "$CURRENT_USER.organization_code"}}' },
  { collection: 'du_thao', read: true, create: true, update: true, delete: false, filter: '{"organization_code": {"_eq": "$CURRENT_USER.organization_code"}}' },
  { collection: 'ho_so', read: true, create: true, update: true, delete: false, filter: '' },
];

export default function OrganizationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <Link href="/content/organizations" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-xs text-gray-500 font-medium">Tổ chức và cơ quan</div>
            <h1 className="text-xl font-bold text-[#14233b]">Bộ Tư pháp</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <History size={18} />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center justify-center transition-colors">
            <Edit2 size={18} />
          </button>
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Main Layout containing content and Sidebar Panels */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-auto bg-[#f8fafc] flex flex-col relative w-full items-center py-8 px-6">
           <div className="w-full max-w-[800px] flex flex-col gap-8">
              
              {/* Nhóm 1: Thông tin cơ quan / đơn vị (Readonly) */}
              <div className="flex flex-col gap-6 relative">
                 <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <Building2 size={18} className="text-[#5340FF]" />
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Thông tin cơ quan / đơn vị</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-800 flex gap-1">Tên cơ quan / đơn vị</label>
                         <input type="text" disabled value="Bộ Tư pháp" className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-gray-50 text-gray-700 outline-none cursor-default font-medium" />
                     </div>
                     <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-800 flex gap-1">Mã cơ quan</label>
                         <input type="text" disabled value="bo-tu-phap" className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-gray-50 text-gray-700 outline-none cursor-default font-mono text-sm" />
                     </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-800 flex gap-1">Cấp đơn vị</label>
                         <input type="text" disabled value="Trung ương" className="w-full h-11 border border-gray-200 rounded-lg px-4 bg-gray-50 text-gray-700 outline-none cursor-default font-medium" />
                     </div>
                     <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-800 flex gap-1">Trạng thái</label>
                         <div className="flex items-center h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg gap-2 cursor-default">
                             <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                             <span className="text-sm font-medium text-gray-700">Đang hoạt động</span>
                         </div>
                     </div>
                 </div>

                 <div className="flex flex-col gap-2">
                     <label className="text-sm font-semibold text-gray-800 flex gap-1">Ghi chú nội bộ</label>
                     <div className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-500 text-sm min-h-[100px] cursor-default">
                         Cơ quan quản lý cao nhất về tư pháp. Cần đảm bảo phân quyền chặt chẽ.
                     </div>
                 </div>
              </div>

              {/* Nhóm 2: Cấu hình phân quyền Directus (Readonly) */}
              <div className="flex flex-col gap-6 relative">
                 <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <Shield size={18} className="text-[#5340FF]" />
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Cấu hình phân quyền Directus</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-800 flex gap-1">User Role được gán</label>
                         <Link href="#" className="flex items-center h-11 px-4 border border-blue-200 bg-blue-50 text-[#5340FF] hover:bg-blue-100 transition-colors rounded-lg font-medium text-sm gap-2 w-max">
                             <LinkIcon size={14} /> System Admin
                         </Link>
                     </div>

                     <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-800 flex gap-1">Access Policies</label>
                         <div className="flex flex-wrap gap-2">
                             <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md border border-gray-200">
                                 policy-trung-uong-full
                             </span>
                             <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md border border-gray-200">
                                 policy-management
                             </span>
                         </div>
                     </div>
                 </div>
              </div>

              {/* Nhóm 3: Metadata hệ thống (Readonly) */}
              <div className="flex flex-col gap-6 relative opacity-80">
                 <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <BookOpen size={18} className="text-gray-500" />
                    <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Thông tin hệ thống</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-600 flex gap-1">Date Created</label>
                         <span className="text-sm font-medium text-gray-900">2026-03-01 08:00:00</span>
                     </div>
                     <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-600 flex gap-1">Date Updated</label>
                         <span className="text-sm font-medium text-gray-900">2026-04-02 09:30:15</span>
                     </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-600 flex gap-1">User Created</label>
                         <span className="text-sm font-medium text-gray-900">Admin</span>
                     </div>
                     <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-600 flex gap-1">User Updated</label>
                         <span className="text-sm font-medium text-gray-900">System Bot</span>
                     </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Panels (Directus Sidebar Style) */}
        <div className="w-[400px] border-l border-gray-200 bg-white flex flex-col shrink-0 h-full overflow-y-auto">
           
           {/* Section: Related Users Panel */}
           <div className="border-b border-gray-200">
               <div className="p-4 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2 text-gray-800 font-semibold">
                     <Users size={18} className="text-[#5340FF]" />
                     <span>Người dùng thuộc đơn vị</span>
                  </div>
                  <Link href="#" className="text-xs text-[#5340FF] font-medium hover:underline flex items-center gap-1">
                     <LinkIcon size={12} /> User Mgmt
                  </Link>
               </div>
               <div className="p-4 flex flex-col gap-3">
                  <div className="relative">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input type="text" placeholder="Tìm người dùng..." className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#5340FF] transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                     {MOCK_USERS.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors bg-white">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                                 {u.name.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-bold text-gray-800 leading-tight">{u.name}</span>
                                 <span className="text-xs text-gray-500">{u.email}</span>
                              </div>
                           </div>
                           <div className="flex flex-col items-end gap-1">
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold text-gray-600">{u.role}</span>
                              <div className={cn("w-2 h-2 rounded-full", u.status === 'active' ? "bg-green-500" : "bg-gray-300")} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
           </div>

           {/* Section: Access Policy Summary Panel */}
           <div className="border-b border-gray-200">
               <div className="p-4 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2 text-gray-800 font-semibold">
                     <ShieldCheck size={18} className="text-[#5340FF]" />
                     <span>Tóm tắt quyền Access Policy</span>
                  </div>
               </div>
               <div className="p-4">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                     <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8fafc] border-b border-gray-200">
                           <tr className="text-gray-600 uppercase tracking-wider font-semibold">
                              <th className="px-3 py-2 border-r border-gray-200">Collection</th>
                              <th className="px-2 py-2 text-center" title="Read">R</th>
                              <th className="px-2 py-2 text-center" title="Create">C</th>
                              <th className="px-2 py-2 text-center" title="Update">U</th>
                              <th className="px-2 py-2 text-center border-r border-gray-200" title="Delete">D</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {MOCK_POLICIES.map((p, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                 <td className="px-3 py-2 font-medium text-gray-800 border-r border-gray-200">
                                    {p.collection}
                                    {p.filter && <div className="text-[10px] text-gray-400 font-mono truncate max-w-[120px] inline-block ml-1 align-bottom cursor-help" title={p.filter}>(filter)</div>}
                                 </td>
                                 <td className="px-2 py-2 text-center">{p.read ? <Check size={14} className="text-green-500 mx-auto" /> : <span className="text-gray-300">-</span>}</td>
                                 <td className="px-2 py-2 text-center">{p.create ? <Check size={14} className="text-green-500 mx-auto" /> : <span className="text-gray-300">-</span>}</td>
                                 <td className="px-2 py-2 text-center">{p.update ? <Check size={14} className="text-green-500 mx-auto" /> : <span className="text-gray-300">-</span>}</td>
                                 <td className="px-2 py-2 text-center border-r border-gray-200">{p.delete ? <Check size={14} className="text-green-500 mx-auto" /> : <span className="text-gray-300">-</span>}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
           </div>

           {/* Section: Revisions (Lịch sử thay đổi) */}
           <div className="">
               <div className="p-4 flex items-center justify-between bg-gray-50/50 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-800 font-semibold">
                     <History size={18} className="text-[#5340FF]" />
                     <span>Lịch sử thay đổi (Revisions)</span>
                  </div>
               </div>
               <div className="p-4 flex flex-col gap-4">
                  <div className="flex items-start gap-3 relative before:absolute before:left-4 before:top-8 before:bottom-[-20px] before:w-[2px] before:bg-gray-100">
                     <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold z-10 shrink-0">AD</div>
                     <div className="flex flex-col gap-1 w-full bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold text-gray-800">Admin</span>
                           <span className="text-xs text-gray-500">2 giờ trước</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                           Đã cập nhật <span className="font-semibold bg-gray-100 px-1 rounded">status</span> từ <del className="text-red-400 ml-1">inactive</del> thành <span className="text-green-600 font-medium">active</span>
                        </div>
                        <button className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded w-fit mt-2 transition-colors">
                           <RotateCcw size={12} /> Khôi phục
                        </button>
                     </div>
                  </div>

                  <div className="flex items-start gap-3 relative">
                     <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold z-10 shrink-0">SB</div>
                     <div className="flex flex-col gap-1 w-full bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold text-gray-800">System Bot</span>
                           <span className="text-xs text-gray-500">2026-03-01</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Đã tạo bản ghi này</div>
                     </div>
                  </div>
               </div>
           </div>

        </div>
      </div>
    </div>
  );
}
