"use client";

import {
  Search, ListFilter, Download, RefreshCw, Calendar, ChevronDown, BarChart2, Filter, Settings2, FileText, Check, ChevronLeft, ChevronRight, Bookmark, Printer, Activity, Timer, AlertCircle, Clock, User, Layers, Radio
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const SLA_POLICIES = [
  "SLA Khẩn cấp (15p)",
  "SLA Ưu tiên (30p)",
  "SLA Tiêu chuẩn (2h)",
  "SLA Hỗ trợ ngoài giờ (24h)",
  "SLA Đối tác (4h)"
];

const AGENTS = [
  "Nguyễn Văn A",
  "Trần Thị B",
  "Lê Văn C",
  "Phạm Thị D",
  "Hoàng Văn E"
];

const SCOPE_OPTIONS = ["Toàn bộ", "Theo nhóm", "Theo kênh"];

const SUPPORT_GROUPS = [
  "Nhóm tư vấn pháp luật",
  "Nhóm hỗ trợ kỹ thuật",
  "Nhóm chăm sóc khách hàng",
  "Nhóm tư vấn doanh nghiệp"
];

const SUPPORT_CHANNELS = [
  "Website Widget",
  "Facebook Messenger",
  "Zalo",
  "Email",
  "Telegram"
];

// Mock data cho Thống kê tỷ lệ đáp ứng theo SLA
const MOCK_SLA_STATS = [
  { policy: "SLA Khẩn cấp (15p)", total: 150, met: 140, breached: 10, metRate: 93.3, firstResponseAvg: 5.2, resolutionAvg: 12.5 },
  { policy: "SLA Ưu tiên (30p)", total: 320, met: 300, breached: 20, metRate: 93.75, firstResponseAvg: 12.1, resolutionAvg: 25.4 },
  { policy: "SLA Tiêu chuẩn (2h)", total: 850, met: 800, breached: 50, metRate: 94.1, firstResponseAvg: 35.8, resolutionAvg: 95.2 },
  { policy: "SLA Đối tác (4h)", total: 210, met: 195, breached: 15, metRate: 92.8, firstResponseAvg: 45.0, resolutionAvg: 150.3 },
  { policy: "SLA Hỗ trợ ngoài giờ (24h)", total: 120, met: 115, breached: 5, metRate: 95.8, firstResponseAvg: 120.5, resolutionAvg: 450.0 }
].sort((a, b) => b.total - a.total);

// Mock data cho Các phiên vi phạm
const MOCK_BREACHED_SESSIONS = [
  { id: "CW-10293", agent: "Nguyễn Văn A", policy: "SLA Khẩn cấp (15p)", createdAt: "2026-05-14 08:15", firstResponse: 18, deadline: "2026-05-14 08:30", status: "resolved" },
  { id: "CW-10294", agent: "Trần Thị B", policy: "SLA Ưu tiên (30p)", createdAt: "2026-05-14 09:00", firstResponse: 35, deadline: "2026-05-14 09:30", status: "open" },
  { id: "CW-10305", agent: "Lê Văn C", policy: "SLA Tiêu chuẩn (2h)", createdAt: "2026-05-13 14:20", firstResponse: 130, deadline: "2026-05-13 16:20", status: "resolved" },
  { id: "CW-10312", agent: "Nguyễn Văn A", policy: "SLA Tiêu chuẩn (2h)", createdAt: "2026-05-13 15:00", firstResponse: 145, deadline: "2026-05-13 17:00", status: "pending" },
  { id: "CW-10328", agent: "Hoàng Văn E", policy: "SLA Đối tác (4h)", createdAt: "2026-05-12 10:15", firstResponse: 260, deadline: "2026-05-12 14:15", status: "resolved" }
];

const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function SLAReportPage() {
  const [fromDate, setFromDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [toDate, setToDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const policyRef = useRef<HTMLDivElement>(null);

  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const agentRef = useRef<HTMLDivElement>(null);

  const [selectedScope, setSelectedScope] = useState<string>("Toàn bộ");
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const scopeRef = useRef<HTMLDivElement>(null);

  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const groupRef = useRef<HTMLDivElement>(null);

  const [isChannelOpen, setIsChannelOpen] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const channelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (policyRef.current && !policyRef.current.contains(event.target as Node)) setIsPolicyOpen(false);
      if (agentRef.current && !agentRef.current.contains(event.target as Node)) setIsAgentOpen(false);
      if (scopeRef.current && !scopeRef.current.contains(event.target as Node)) setIsScopeOpen(false);
      if (groupRef.current && !groupRef.current.contains(event.target as Node)) setIsGroupOpen(false);
      if (channelRef.current && !channelRef.current.contains(event.target as Node)) setIsChannelOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePolicy = (policy: string) => {
    if (selectedPolicies.includes(policy)) {
      setSelectedPolicies(selectedPolicies.filter(p => p !== policy));
    } else {
      setSelectedPolicies([...selectedPolicies, policy]);
    }
  };

  const toggleAgent = (agent: string) => {
    if (selectedAgents.includes(agent)) {
      setSelectedAgents(selectedAgents.filter(a => a !== agent));
    } else {
      setSelectedAgents([...selectedAgents, agent]);
    }
  };

  const toggleGroup = (group: string) => {
    if (selectedGroups.includes(group)) {
      setSelectedGroups(selectedGroups.filter(g => g !== group));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  const toggleChannel = (channel: string) => {
    if (selectedChannels.includes(channel)) {
      setSelectedChannels(selectedChannels.filter(c => c !== channel));
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const isAllGroupsSelected = selectedGroups.length === SUPPORT_GROUPS.length || selectedGroups.length === 0;
  const isAllChannelsSelected = selectedChannels.length === SUPPORT_CHANNELS.length || selectedChannels.length === 0;

  const isAllPoliciesSelected = selectedPolicies.length === SLA_POLICIES.length || selectedPolicies.length === 0;
  const isAllAgentsSelected = selectedAgents.length === AGENTS.length || selectedAgents.length === 0;

  // Calculate Totals for Stats Table
  const totalSessions = MOCK_SLA_STATS.reduce((sum, item) => sum + item.total, 0);
  const totalMet = MOCK_SLA_STATS.reduce((sum, item) => sum + item.met, 0);
  const totalBreached = MOCK_SLA_STATS.reduce((sum, item) => sum + item.breached, 0);
  const avgMetRate = totalSessions > 0 ? ((totalMet / totalSessions) * 100).toFixed(1) : "0.0";

  const [activeTab, setActiveTab] = useState<'stats' | 'sla_rates' | 'breached'>('stats');

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Timer size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Báo cáo thống kê</div>
            <h1 className="text-xl font-bold text-[#14233b]">Thống kê SLA và Các phiên vi phạm</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
        </div>
      </header>

      <div className="flex-1 overflow-y-auto w-full flex justify-start p-4 custom-scrollbar">
        <div className="w-full max-w-none flex flex-col gap-6">

          {/* Filter Section */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-0">
              <Filter size={16} className="text-indigo-600" />
              <h3 className="font-bold text-gray-800 text-[15px]">Bộ lọc dữ liệu</h3>
            </div>

            <div className="flex flex-row items-end gap-3 flex-nowrap">
              {/* Từ ngày */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Từ ngày</label>
                <div className="relative flex items-center w-full h-[38px] border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 transition-all shadow-sm">
                  <div className="w-9 h-full flex items-center justify-center text-gray-400 shrink-0">
                    <Calendar size={14} />
                  </div>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="flex-1 h-full pr-3 outline-none bg-transparent text-[13px] text-gray-700"
                  />
                </div>
              </div>

              {/* Đến ngày */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Đến ngày</label>
                <div className="relative flex items-center w-full h-[38px] border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 transition-all shadow-sm">
                  <div className="w-9 h-full flex items-center justify-center text-gray-400 shrink-0">
                    <Calendar size={14} />
                  </div>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="flex-1 h-full pr-3 outline-none bg-transparent text-[13px] text-gray-700"
                  />
                </div>
              </div>

              {/* Chính sách SLA */}
              <div className="flex flex-col gap-1.5 relative flex-1 min-w-[150px]" ref={policyRef}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Chính sách SLA</label>
                <div
                  className="relative flex items-center justify-between w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                  onClick={() => setIsPolicyOpen(!isPolicyOpen)}
                >
                  <div className="flex items-center gap-2 overflow-hidden w-full pr-4">
                    <Bookmark size={16} className="text-gray-400 shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate select-none">
                      {isAllPoliciesSelected ? "Tất cả" : `Đã chọn ${selectedPolicies.length} chính sách`}
                    </span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 shrink-0" />
                </div>

                {isPolicyOpen && (
                  <div className="absolute top-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-2 max-h-[300px] animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 pb-2 border-b border-gray-100">
                      <button
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                        onClick={() => setSelectedPolicies([])}
                      >
                        Khôi phục chọn tất cả
                      </button>
                    </div>
                    <div className="overflow-y-auto p-2 custom-scrollbar flex flex-col gap-1">
                      {SLA_POLICIES.map(policy => (
                        <div
                          key={policy}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                          onClick={() => togglePolicy(policy)}
                        >
                          <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center transition-colors shrink-0",
                            selectedPolicies.includes(policy) || isAllPoliciesSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-300 group-hover:border-indigo-600"
                          )}>
                            {(selectedPolicies.includes(policy) || isAllPoliciesSelected) && <Check size={12} strokeWidth={3} className="text-white" />}
                          </div>
                          <span className="text-[13px] font-medium text-gray-700 select-none">{policy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Phạm vi áp dụng (single-select) */}
              <div className="flex flex-col gap-1.5 relative flex-1 min-w-[140px]" ref={scopeRef}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phạm vi áp dụng</label>
                <div
                  className="relative flex items-center justify-between w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                  onClick={() => setIsScopeOpen(!isScopeOpen)}
                >
                  <div className="flex items-center gap-2 overflow-hidden w-full pr-4">
                    <ListFilter size={15} className="text-gray-400 shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate select-none">{selectedScope}</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 shrink-0" />
                </div>
                {isScopeOpen && (
                  <div className="absolute top-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-2 animate-in fade-in slide-in-from-top-2">
                    {SCOPE_OPTIONS.map(opt => (
                      <div
                        key={opt}
                        className={cn("flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors text-[13px] font-medium",
                          selectedScope === opt ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => { setSelectedScope(opt); setIsScopeOpen(false); setSelectedGroups([]); setSelectedChannels([]); }}
                      >
                        <div className={cn("w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0",
                          selectedScope === opt ? "border-indigo-600" : "border-gray-300"
                        )}>
                          {selectedScope === opt && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                        </div>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nhóm hỗ trợ (chỉ hiển khi Theo nhóm) */}
              {selectedScope === "Theo nhóm" && (
                <div className="flex flex-col gap-1.5 relative flex-1 min-w-[150px]" ref={groupRef}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nhóm hỗ trợ</label>
                  <div
                    className="relative flex items-center justify-between w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                    onClick={() => setIsGroupOpen(!isGroupOpen)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden w-full pr-4">
                      <Layers size={15} className="text-gray-400 shrink-0" />
                      <span className="text-sm font-medium text-gray-700 truncate select-none">
                        {isAllGroupsSelected ? "Tất cả nhóm" : `Đã chọn ${selectedGroups.length} nhóm`}
                      </span>
                    </div>
                    <ChevronDown size={16} className="text-gray-400 shrink-0" />
                  </div>
                  {isGroupOpen && (
                    <div className="absolute top-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-2 max-h-[300px] animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 pb-2 border-b border-gray-100">
                        <button className="text-xs font-semibold text-indigo-600 hover:underline" onClick={() => setSelectedGroups([])}>Khôi phục chọn tất cả</button>
                      </div>
                      <div className="overflow-y-auto p-2 custom-scrollbar flex flex-col gap-1">
                        {SUPPORT_GROUPS.map(group => (
                          <div key={group} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group/item" onClick={() => toggleGroup(group)}>
                            <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center transition-colors shrink-0",
                              selectedGroups.includes(group) || isAllGroupsSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-300 group-hover/item:border-indigo-600"
                            )}>
                              {(selectedGroups.includes(group) || isAllGroupsSelected) && <Check size={12} strokeWidth={3} className="text-white" />}
                            </div>
                            <span className="text-[13px] font-medium text-gray-700 select-none">{group}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Kênh hỗ trợ (chỉ hiển khi Theo kênh) */}
              {selectedScope === "Theo kênh" && (
                <div className="flex flex-col gap-1.5 relative flex-1 min-w-[150px]" ref={channelRef}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kênh hỗ trợ</label>
                  <div
                    className="relative flex items-center justify-between w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                    onClick={() => setIsChannelOpen(!isChannelOpen)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden w-full pr-4">
                      <Radio size={15} className="text-gray-400 shrink-0" />
                      <span className="text-sm font-medium text-gray-700 truncate select-none">
                        {isAllChannelsSelected ? "Tất cả kênh" : `Đã chọn ${selectedChannels.length} kênh`}
                      </span>
                    </div>
                    <ChevronDown size={16} className="text-gray-400 shrink-0" />
                  </div>
                  {isChannelOpen && (
                    <div className="absolute top-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-2 max-h-[300px] animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 pb-2 border-b border-gray-100">
                        <button className="text-xs font-semibold text-indigo-600 hover:underline" onClick={() => setSelectedChannels([])}>Khôi phục chọn tất cả</button>
                      </div>
                      <div className="overflow-y-auto p-2 custom-scrollbar flex flex-col gap-1">
                        {SUPPORT_CHANNELS.map(channel => (
                          <div key={channel} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group/item" onClick={() => toggleChannel(channel)}>
                            <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center transition-colors shrink-0",
                              selectedChannels.includes(channel) || isAllChannelsSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-300 group-hover/item:border-indigo-600"
                            )}>
                              {(selectedChannels.includes(channel) || isAllChannelsSelected) && <Check size={12} strokeWidth={3} className="text-white" />}
                            </div>
                            <span className="text-[13px] font-medium text-gray-700 select-none">{channel}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tư vấn viên */}
              <div className="flex flex-col gap-1.5 relative flex-1 min-w-[150px]" ref={agentRef}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tư vấn viên</label>
                <div
                  className="relative flex items-center justify-between w-full h-[38px] border border-gray-200 rounded-lg bg-white px-3 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                  onClick={() => setIsAgentOpen(!isAgentOpen)}
                >
                  <div className="flex items-center gap-2 overflow-hidden w-full pr-4">
                    <User size={15} className="text-gray-400 shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate select-none">
                      {isAllAgentsSelected ? "Tất cả tư vấn viên" : `Đã chọn ${selectedAgents.length} tư vấn viên`}
                    </span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 shrink-0" />
                </div>

                {isAgentOpen && (
                  <div className="absolute top-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-2 max-h-[300px] animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 pb-2 border-b border-gray-100">
                      <button
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                        onClick={() => setSelectedAgents([])}
                      >
                        Khôi phục chọn tất cả
                      </button>
                    </div>
                    <div className="overflow-y-auto p-2 custom-scrollbar flex flex-col gap-1">
                      {AGENTS.map(agent => (
                        <div
                          key={agent}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                          onClick={() => toggleAgent(agent)}
                        >
                          <div className={cn("w-4 h-4 border-2 rounded flex items-center justify-center transition-colors shrink-0",
                            selectedAgents.includes(agent) || isAllAgentsSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-300 group-hover:border-indigo-600"
                          )}>
                            {(selectedAgents.includes(agent) || isAllAgentsSelected) && <Check size={12} strokeWidth={3} className="text-white" />}
                          </div>
                          <span className="text-[13px] font-medium text-gray-700 select-none">{agent}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100 mt-2 gap-3">
              <button className="h-[38px] px-5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors font-semibold text-[13px]">
                <Printer size={15} />
                In
              </button>
              <button className="h-[38px] px-5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors font-semibold text-[13px]">
                <Download size={15} />
                Xuất file
              </button>
              <button className="h-[38px] px-6 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-colors font-bold text-[13px]">
                <BarChart2 size={15} strokeWidth={2.5} />
                Thống kê
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 mt-2 px-2 shrink-0">
            <button
              onClick={() => setActiveTab('stats')}
              className={cn("pb-3 text-[14px] font-bold border-b-[3px] transition-all", activeTab === 'stats' ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300")}
            >
              Khối thống kê
            </button>
            <button
              onClick={() => setActiveTab('sla_rates')}
              className={cn("pb-3 text-[14px] font-bold border-b-[3px] transition-all", activeTab === 'sla_rates' ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300")}
            >
              Tỷ lệ đáp ứng theo từng chính sách SLA
            </button>
            <button
              onClick={() => setActiveTab('breached')}
              className={cn("pb-3 text-[14px] font-bold border-b-[3px] transition-all", activeTab === 'breached' ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300")}
            >
              Danh sách phiên vi phạm SLA
            </button>
          </div>

          {/* SLA KPI Cards */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">Tổng số phiên (theo dõi SLA)</span>
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Activity size={18} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-4xl font-bold text-[#14233b] leading-none">{formatNumber(totalSessions)}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">Tỷ lệ đáp ứng SLA</span>
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Check size={18} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-4xl font-bold text-emerald-600 leading-none">{avgMetRate}%</div>
                <div className="text-xs text-gray-400 font-medium">{formatNumber(totalMet)} phiên đáp ứng</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">Số phiên vi phạm SLA</span>
                  <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                    <AlertCircle size={18} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-4xl font-bold text-rose-600 leading-none">{formatNumber(totalBreached)}</div>
                <div className="text-xs text-gray-400 font-medium">{totalSessions > 0 ? ((totalBreached / totalSessions) * 100).toFixed(1) : 0}% trên tổng số</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">Thời gian phản hồi lần đầu (TB)</span>
                  <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                    <Clock size={18} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-4xl font-bold text-orange-600 leading-none">22.5 <span className="text-lg font-semibold text-gray-500">phút</span></div>
              </div>
            </div>
          )}

          {/* Table 1: SLA Stats Section */}
          {activeTab === 'sla_rates' && (
            <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-[#14233b] text-[16px] flex items-center gap-2">
                  <BarChart2 size={18} className="text-indigo-600" />
                  Tỷ lệ đáp ứng theo từng chính sách SLA
                </h3>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] w-[5%] min-w-[50px] text-left border-r border-gray-100 uppercase">STT</th>
                      <th className="py-2.5 px-6 font-bold text-gray-800 text-[12px] border-r border-gray-100 text-left uppercase">Chính sách SLA</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-right border-r border-gray-100 uppercase">Tổng số phiên</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-right border-r border-gray-100 uppercase">Số phiên đáp ứng</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-right border-r border-gray-100 uppercase">Tỷ lệ đáp ứng</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-right border-r border-gray-100 uppercase">Số phiên vi phạm</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-right border-r border-gray-100 uppercase">Phản hồi TB (phút)</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-right uppercase">Giải quyết TB (phút)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_SLA_STATS.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-indigo-50/30 transition-colors group">
                        <td className="py-2 px-4 text-[13px] font-medium text-gray-500 text-center border-r border-gray-50">{index + 1}</td>
                        <td className="py-2 px-6 text-[13px] font-bold text-[#14233b] border-r border-gray-50">{item.policy}</td>
                        <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-right border-r border-gray-50">{formatNumber(item.total)}</td>
                        <td className="py-2 px-4 text-[13px] font-semibold text-emerald-600 text-right border-r border-gray-50">{formatNumber(item.met)}</td>
                        <td className="py-2 px-4 text-[13px] font-bold text-emerald-600 text-right border-r border-gray-50">{item.metRate}%</td>
                        <td className="py-2 px-4 text-[13px] font-semibold text-rose-600 text-right border-r border-gray-50">{formatNumber(item.breached)}</td>
                        <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-right border-r border-gray-50">{item.firstResponseAvg}</td>
                        <td className="py-2 px-4 text-[13px] font-semibold text-gray-700 text-right">{item.resolutionAvg}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td className="py-2.5 px-4 text-[12px] font-bold uppercase text-gray-800 text-center border-r border-gray-200" colSpan={2}>Tổng cộng</td>
                      <td className="py-2.5 px-4 text-[14px] font-black text-indigo-600 text-right border-r border-gray-200">{formatNumber(totalSessions)}</td>
                      <td className="py-2.5 px-4 text-[14px] font-black text-indigo-600 text-right border-r border-gray-200">{formatNumber(totalMet)}</td>
                      <td className="py-2.5 px-4 text-[14px] font-black text-indigo-600 text-right border-r border-gray-200">{avgMetRate}%</td>
                      <td className="py-2.5 px-4 text-[14px] font-black text-rose-600 text-right border-r border-gray-200">{formatNumber(totalBreached)}</td>
                      <td className="py-2.5 px-4 text-[14px] font-black text-indigo-600 text-right border-r border-gray-200">-</td>
                      <td className="py-2.5 px-4 text-[14px] font-black text-indigo-600 text-right">-</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Table 2: Breached Sessions */}
          {activeTab === 'breached' && (
            <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col mb-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-rose-600 text-[16px] flex items-center gap-2">
                  <AlertCircle size={18} />
                  Danh sách phiên vi phạm SLA
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Tìm theo ID phiên..."
                      className="h-8 pl-8 pr-3 text-[13px] border border-gray-200 rounded-lg outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 w-[200px]"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] w-[5%] min-w-[50px] text-left border-r border-gray-100 uppercase">STT</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] border-r border-gray-100 text-left uppercase">ID Phiên</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] border-r border-gray-100 text-left uppercase">Tư vấn viên</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] border-r border-gray-100 text-left uppercase">Chính sách SLA</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] border-r border-gray-100 text-left uppercase">Thời điểm tạo</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] border-r border-gray-100 text-right uppercase">Phản hồi (phút)</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] border-r border-gray-100 text-left uppercase">Hạn cuối SLA</th>
                      <th className="py-2.5 px-4 font-bold text-gray-800 text-[12px] text-center uppercase">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_BREACHED_SESSIONS.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-rose-50/30 transition-colors cursor-pointer">
                        <td className="py-2.5 px-4 text-[13px] font-medium text-gray-500 text-center border-r border-gray-50">{index + 1}</td>
                        <td className="py-2.5 px-4 text-[13px] font-bold text-blue-600 hover:underline border-r border-gray-50">{item.id}</td>
                        <td className="py-2.5 px-4 text-[13px] font-medium text-gray-700 border-r border-gray-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">{item.agent.charAt(0)}</div>
                            {item.agent}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-[13px] font-medium text-gray-700 border-r border-gray-50">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[12px] border border-gray-200">
                            {item.policy}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-[13px] font-medium text-gray-600 border-r border-gray-50">{item.createdAt}</td>
                        <td className="py-2.5 px-4 text-[13px] font-bold text-rose-600 text-right border-r border-gray-50">{item.firstResponse}</td>
                        <td className="py-2.5 px-4 text-[13px] font-medium text-gray-600 border-r border-gray-50">{item.deadline}</td>
                        <td className="py-2.5 px-4 text-center">
                          {item.status === 'resolved' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">Đã giải quyết</span>}
                          {item.status === 'open' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">Đang mở</span>}
                          {item.status === 'pending' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">Chờ xử lý</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
