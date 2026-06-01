"use client";

import { 
  Calendar, FlaskConical, Download, RefreshCw, BarChart2,
  PieChart, Clock, MapPin, Users, Activity, LayoutDashboard,
  HelpCircle, ChevronDown, Search, Folder, MessageSquare, Check, Filter, Bookmark, Printer
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// Mock Topics for "Chúng Tôi Cần Bạn" (We Need You) campaigns
const MOCK_CAMPAIGNS = [
  { id: 1, title: "[Chúng Tôi Cần Bạn] Lấy ý kiến về Dự thảo Luật Đất đai (sửa đổi)", topic: "Pháp luật Đất đai", status: "Đang diễn ra" },
  { id: 2, title: "[Chúng Tôi Cần Bạn] Góp ý phương án cải cách thủ tục hành chính năm 2026", topic: "Thủ tục hành chính", status: "Đang diễn ra" },
  { id: 3, title: "[Chúng Tôi Cần Bạn] Thu thập ý kiến về chuyển đổi số dịch vụ công cấp xã", topic: "Chuyển đổi số", status: "Đang diễn ra" },
  { id: 4, title: "[Chúng Tôi Cần Bạn] Khảo sát nhu cầu hỗ trợ pháp lý của doanh nghiệp vừa và nhỏ", topic: "Hỗ trợ doanh nghiệp", status: "Đã kết thúc" }
];

const CAMPAIGN_TOPICS = [
  "Tất cả lĩnh vực",
  "Pháp luật Đất đai",
  "Thủ tục hành chính",
  "Chuyển đổi số",
  "Hỗ trợ doanh nghiệp"
];

// Dynamic mock question answers data mapped to each campaign
const MOCK_QUESTION_DATA: Record<number, {
  views: number;
  responses: number;
  rate: string;
  questions: Array<{
    id: number;
    text: string;
    type: "Radio" | "Checkbox" | "Open";
    typeLabel: string;
    options?: Array<{ label: string; count: number; percent: number }>;
    responses?: Array<{ name: string; time: string; content: string }>;
  }>;
}> = {
  1: {
    views: 8420,
    responses: 3850,
    rate: "89.2%",
    questions: [
      {
        id: 1,
        text: "Đồng chí đánh giá thế nào về tính công khai, minh bạch trong quy hoạch sử dụng đất cấp huyện?",
        type: "Radio",
        typeLabel: "Trắc nghiệm 1 đáp án",
        options: [
          { label: "Rất công khai, minh bạch", count: 1850, percent: 48.0 },
          { label: "Công khai, minh bạch đầy đủ", count: 1200, percent: 31.2 },
          { label: "Bình thường", count: 580, percent: 15.1 },
          { label: "Chưa thực sự minh bạch", count: 220, percent: 5.7 }
        ]
      },
      {
        id: 2,
        text: "Các hình thức tiếp cận thông tin đất đai nào đồng chí thường sử dụng? (Chọn nhiều đáp án)",
        type: "Checkbox",
        typeLabel: "Trắc nghiệm nhiều đáp án",
        options: [
          { label: "Cổng thông tin điện tử của Ủy ban nhân dân", count: 2850, percent: 74.0 },
          { label: "Bảng tin tại trụ sở Ủy ban nhân dân cấp xã", count: 1420, percent: 36.9 },
          { label: "Qua các phương tiện thông tin đại chúng", count: 1980, percent: 51.4 },
          { label: "Trực tiếp yêu cầu tại cơ quan quản lý đất đai", count: 850, percent: 22.1 }
        ]
      },
      {
        id: 3,
        text: "Đề xuất thêm giải pháp nhằm nâng cao hiệu quả lấy ý kiến người dân về quy hoạch đất đai:",
        type: "Open",
        typeLabel: "Câu hỏi mở",
        responses: [
          { name: "Nguyễn Văn A", time: "10 phút trước", content: "Nên số hóa bản đồ quy hoạch 3D để người dân dễ hình dung trực quan hơn trên điện thoại." },
          { name: "Trần Thị B", time: "1 giờ trước", content: "Cần tăng thời gian niêm yết công khai dự thảo lên ít nhất 45 ngày thay vì 30 ngày." },
          { name: "Phạm Văn C", time: "4 giờ trước", content: "Nên gửi thông báo chủ động kèm link khảo sát qua ứng dụng VNeID của công dân trong vùng ảnh hưởng." },
          { name: "Lê Minh D", time: "1 ngày trước", content: "Cần có báo cáo giải trình chi tiết về việc tiếp thu hay không tiếp thu ý kiến của người dân." }
        ]
      }
    ]
  },
  2: {
    views: 5410,
    responses: 2120,
    rate: "85.6%",
    questions: [
      {
        id: 1,
        text: "Đồng chí đánh giá thế nào về sự thay đổi của thủ tục hành chính công trực tuyến so với trực tiếp?",
        type: "Radio",
        typeLabel: "Trắc nghiệm 1 đáp án",
        options: [
          { label: "Thuận tiện hơn rất nhiều", count: 1250, percent: 59.0 },
          { label: "Có thuận tiện hơn", count: 520, percent: 24.5 },
          { label: "Không có nhiều thay đổi", count: 250, percent: 11.8 },
          { label: "Khó khăn và phức tạp hơn", count: 100, percent: 4.7 }
        ]
      },
      {
        id: 2,
        text: "Những thủ tục nào đồng chí muốn được đơn giản hóa quy trình và thời gian xử lý nhất? (Chọn nhiều đáp án)",
        type: "Checkbox",
        typeLabel: "Trắc nghiệm nhiều đáp án",
        options: [
          { label: "Cấp giấy chứng nhận quyền sử dụng đất", count: 1650, percent: 77.8 },
          { label: "Đăng ký thành lập doanh nghiệp", count: 980, percent: 46.2 },
          { label: "Đăng ký khai sinh, hộ tịch", count: 540, percent: 25.5 },
          { label: "Cấp giấy phép xây dựng nhà ở riêng lẻ", count: 1120, percent: 52.8 }
        ]
      },
      {
        id: 3,
        text: "Đóng góp ý kiến cụ thể về các rào cản hành chính đồng chí đang gặp phải:",
        type: "Open",
        typeLabel: "Câu hỏi mở",
        responses: [
          { name: "Hoàng Văn E", time: "30 phút trước", content: "Thủ tục xin cấp phép xây dựng vẫn yêu cầu quá nhiều loại giấy tờ bản giấy không thực sự cần thiết." },
          { name: "Đỗ Mai F", time: "2 giờ trước", content: "Hệ thống liên thông giữa các bộ ngành đôi khi bị nghẽn làm kéo dài thời gian xử lý hồ sơ doanh nghiệp." },
          { name: "Vũ Văn G", time: "5 giờ trước", content: "Phần mềm ký số trên dịch vụ công vẫn còn phức tạp đối với người dân không thạo công nghệ." }
        ]
      }
    ]
  },
  3: {
    views: 6120,
    responses: 2950,
    rate: "92.1%",
    questions: [
      {
        id: 1,
        text: "Đồng chí đánh giá thế nào về tốc độ đường truyền và tính ổn định của Trang dịch vụ công cấp xã?",
        type: "Radio",
        typeLabel: "Trắc nghiệm 1 đáp án",
        options: [
          { label: "Rất ổn định và nhanh chóng", count: 1550, percent: 52.5 },
          { label: "Tương đối ổn định", count: 950, percent: 32.2 },
          { label: "Thỉnh thoảng bị lỗi gián đoạn", count: 350, percent: 11.9 },
          { label: "Rất chậm và thường xuyên lỗi", count: 100, percent: 3.4 }
        ]
      },
      {
        id: 2,
        text: "Các dịch vụ công trực tuyến nào tại xã đồng chí đã từng tự thực hiện tại nhà? (Chọn nhiều đáp án)",
        type: "Checkbox",
        typeLabel: "Trắc nghiệm nhiều đáp án",
        options: [
          { label: "Xác nhận tình trạng hôn nhân", count: 1850, percent: 62.7 },
          { label: "Chứng thực bản sao từ bản chính", count: 2200, percent: 74.6 },
          { label: "Khai báo tạm trú, tạm vắng", count: 1450, percent: 49.2 },
          { label: "Đăng ký khai tử", count: 480, percent: 16.3 }
        ]
      },
      {
        id: 3,
        text: "Ý kiến đóng góp để hoàn thiện hạ tầng số và công nghệ thông tin tại UBND cấp xã:",
        type: "Open",
        typeLabel: "Câu hỏi mở",
        responses: [
          { name: "Lý Thị H", time: "1 giờ trước", content: "Cần trang bị thêm máy tính và đường truyền internet tốc độ cao tại phòng một cửa để hỗ trợ người dân tại chỗ." },
          { name: "Bùi Văn I", time: "3 giờ trước", content: "Nên phát triển giao diện dịch vụ công tối ưu hoàn hảo trên điện thoại thông minh." },
          { name: "Nguyễn Văn J", time: "1 ngày trước", content: "Cần tăng cường bảo mật hai lớp OTP khi thực hiện các giao dịch liên quan đến hộ tịch." }
        ]
      }
    ]
  },
  4: {
    views: 3120,
    responses: 1150,
    rate: "78.9%",
    questions: [
      {
        id: 1,
        text: "Doanh nghiệp của đồng chí có thường xuyên tiếp cận các chính sách hỗ trợ pháp lý của nhà nước không?",
        type: "Radio",
        typeLabel: "Trắc nghiệm 1 đáp án",
        options: [
          { label: "Thường xuyên tiếp cận", count: 320, percent: 27.8 },
          { label: "Thỉnh thoảng", count: 540, percent: 47.0 },
          { label: "Rất hiếm khi", count: 210, percent: 18.3 },
          { label: "Chưa bao giờ nghe tới", count: 80, percent: 6.9 }
        ]
      },
      {
        id: 2,
        text: "Lĩnh vực pháp lý nào doanh nghiệp của đồng chí mong muốn được tư vấn, hỗ trợ nhất? (Chọn nhiều đáp án)",
        type: "Checkbox",
        typeLabel: "Trắc nghiệm nhiều đáp án",
        options: [
          { label: "Thuế và ưu đãi đầu tư", count: 850, percent: 73.9 },
          { label: "Luật Lao động và Bảo hiểm xã hội", count: 620, percent: 53.9 },
          { label: "Sở hữu trí tuệ và chuyển giao công nghệ", count: 430, percent: 37.4 },
          { label: "Tranh chấp hợp đồng thương mại", count: 510, percent: 44.3 }
        ]
      },
      {
        id: 3,
        text: "Đề xuất hình thức hỗ trợ pháp lý hiệu quả nhất cho cộng đồng doanh nghiệp SMEs:",
        type: "Open",
        typeLabel: "Câu hỏi mở",
        responses: [
          { name: "Phạm Minh K", time: "2 giờ trước", content: "Nên tổ chức các buổi hội thảo trực tuyến giải đáp trực tiếp các vướng mắc thuế theo định kỳ hàng tháng." },
          { name: "Lê Hồng L", time: "6 giờ trước", content: "Cần biên soạn các cẩm nang pháp lý ngắn gọn dưới dạng biểu đồ số hoặc Infographic sinh động." },
          { name: "Trịnh Văn M", time: "2 ngày trước", content: "Nên thiết lập kênh tư vấn thông minh (AI Chatbot) tự động giải đáp nhanh các câu hỏi cơ bản về Luật Doanh nghiệp." }
        ]
      }
    ]
  }
};

const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function WeNeedYouOverviewReport() {
  const [fromDate, setFromDate] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-01`;
  });
  
  const [toDate, setToDate] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(MOCK_CAMPAIGNS[0]);
  const selectorRef = useRef<HTMLDivElement>(null);

  const [selectorFromDate, setSelectorFromDate] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-01`;
  });
  
  const [selectorToDate, setSelectorToDate] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsSelectorOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCampaigns = MOCK_CAMPAIGNS.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const campaignStats = MOCK_QUESTION_DATA[selectedCampaign.id] || MOCK_QUESTION_DATA[1];

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f8fafc] overflow-hidden print:static print:h-auto print:bg-white print:overflow-visible">
      
      {/* Header */}
      <header className="px-6 py-6 shrink-0 flex items-center justify-between bg-white border-b border-gray-200 print:border-none print:pb-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 print:hidden">
            <span>Thống kê</span>
            <span className="text-gray-300">/</span>
            <span>Chúng Tôi Cần Bạn</span>
            <span className="text-gray-300">-</span>
            <span className="text-[#5340FF]">Thống kê chung</span>
          </div>
          <h1 className="text-xl font-bold text-[#14233b] flex items-center gap-2">
            <HelpCircle size={22} className="text-[#5340FF]" />
            Thống kê Chúng Tôi Cần Bạn
          </h1>
        </div>


      </header>

      {/* Main content scroll container */}
      <div className="flex-1 overflow-y-auto w-full flex justify-start p-6 pt-0 custom-scrollbar relative print:overflow-visible print:px-0 print:p-0">
        
        {isReloading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-[100] flex items-center justify-center animate-in fade-in duration-300 print:hidden">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#5340FF]/20 border-t-[#5340FF] rounded-full animate-spin"></div>
              <span className="text-sm font-bold text-[#5340FF] animate-pulse">Đang cập nhật dữ liệu...</span>
            </div>
          </div>
        )}

        <div className="w-full max-w-none flex flex-col gap-6 mt-4">

          {/* Interactive Campaign Selector */}
          <div className="relative print:hidden" ref={selectorRef}>
            <div 
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-gray-300 transition-all shadow-sm group" 
              onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#5340FF]/10 flex items-center justify-center text-[#5340FF]">
                   <Filter size={16} strokeWidth={2.5} />
                </div>
                <span className="text-[14px] text-[#334155] font-bold truncate pr-4">
                  {selectedCampaign.title}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                 <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold">{selectedCampaign.status}</span>
                 <ChevronDown size={20} className={cn("text-gray-400 transition-transform duration-200", isSelectorOpen && "rotate-180")} />
              </div>
            </div>

            {isSelectorOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] flex flex-col overflow-hidden animate-in fade-in duration-200">
                <div className="bg-slate-50 border-b border-gray-100 p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                   {/* Date Range Selector */}
                   <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-md overflow-hidden px-2 py-1">
                      <Calendar size={14} className="text-gray-400 shrink-0" />
                      <input 
                         type="date" 
                         className="text-[11px] text-gray-600 bg-transparent outline-none w-full border-r border-gray-200 pr-1.5"
                         value={selectorFromDate}
                         onChange={(e) => setSelectorFromDate(e.target.value)}
                         title="Từ ngày"
                      />
                      <input 
                         type="date" 
                         className="text-[11px] text-gray-600 bg-transparent outline-none w-full pl-1.5"
                         value={selectorToDate}
                         onChange={(e) => setSelectorToDate(e.target.value)}
                         title="Đến ngày"
                      />
                   </div>
                   {/* Search Input */}
                   <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-md overflow-hidden px-2.5">
                      <Search size={15} className="text-gray-400 shrink-0" />
                      <input 
                         type="text" 
                         placeholder="Tìm kiếm chủ đề..."
                         className="w-full text-xs text-gray-600 py-1.5 bg-transparent outline-none"
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                      />
                   </div>
                </div>

                <div className="max-h-[220px] overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5">
                   {filteredCampaigns.length > 0 ? (
                      filteredCampaigns.map((campaign) => (
                         <div 
                            key={campaign.id}
                            className={cn(
                               "px-4 py-2.5 rounded-lg cursor-pointer flex flex-col gap-0.5 transition-colors",
                               selectedCampaign.id === campaign.id ? "bg-[#5340FF]/5" : "hover:bg-slate-50"
                            )}
                            onClick={() => {
                               setSelectedCampaign(campaign);
                               setIsSelectorOpen(false);
                            }}
                         >
                            <div className="flex items-center justify-between gap-4">
                               <span className={cn(
                                  "text-[13px] truncate", 
                                  selectedCampaign.id === campaign.id ? "font-bold text-[#5340FF]" : "font-medium text-[#334155]"
                               )}>
                                  {campaign.title}
                               </span>
                               {selectedCampaign.id === campaign.id && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#5340FF] shrink-0"></div>
                               )}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{campaign.topic}</span>
                         </div>
                      ))
                   ) : (
                      <div className="p-6 text-center text-xs text-gray-400 font-bold">
                         Không tìm thấy chủ đề nào.
                      </div>
                   )}
                </div>
              </div>
            )}
          </div>

          {/* Date Filter Section */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3 print:hidden">
            <div className="flex items-center gap-2 mb-0">
               <Filter size={16} className="text-[#5340FF]" />
               <h3 className="font-bold text-gray-800 text-[15px]">Bộ lọc dữ liệu</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Từ ngày */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Từ ngày</label>
                <div className="relative flex items-center w-full h-[38px] border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all shadow-sm">
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
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Đến ngày</label>
                <div className="relative flex items-center w-full h-[38px] border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-[#5340FF] focus-within:ring-1 focus-within:ring-[#5340FF] transition-all shadow-sm">
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
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100 mt-2 gap-3">
              <button 
                onClick={handlePrint}
                className="h-[38px] px-5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors font-semibold text-[13px]"
              >
                <Printer size={15} />
                In
              </button>
              <button 
                onClick={handleReload}
                className="h-[38px] px-5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors font-semibold text-[13px]"
              >
                <Download size={15} />
                Xuất file
              </button>
              <button 
                onClick={handleReload}
                className="h-[38px] px-6 rounded-lg bg-[#5340FF] text-white hover:bg-[#4330EF] shadow-md shadow-[#5340FF]/20 flex items-center gap-2 transition-colors font-bold text-[13px]"
              >
                <BarChart2 size={15} strokeWidth={2.5} />
                Thống kê
              </button>
            </div>
          </div>

          {/* Core Metrics Cards (Lượt xem chủ đề, Tổng số phản hồi - với background xanh lá cây tươi mới cho Tổng số phản hồi) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border text-blue-800 bg-blue-100/85 border-blue-200 flex flex-col gap-1 shadow-sm">
              <span className="text-xs font-bold uppercase opacity-70">Lượt xem chủ đề</span>
              <span className="text-3xl font-black text-blue-700">{formatNumber(campaignStats.views)}</span>
            </div>
            <div className="p-6 rounded-2xl border text-emerald-800 bg-emerald-100/85 border-emerald-200 flex flex-col gap-1 shadow-sm">
              <span className="text-xs font-bold uppercase opacity-70">Tổng số phản hồi</span>
              <span className="text-3xl font-black text-emerald-700">{formatNumber(campaignStats.responses)}</span>
            </div>
          </div>

          {/* Heading for Question Stats */}
          <div className="border-b border-gray-200 pb-2 mt-4">
             <h2 className="text-[17px] font-bold text-[#14233b] uppercase tracking-tight">Thống kê đáp án từng câu hỏi trong chủ đề</h2>
          </div>

          {/* Loop over questions */}
          <div className="flex flex-col gap-6 mb-20">
             {campaignStats.questions.map((question, index) => {
                return (
                   <div 
                     key={question.id}
                     className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-4"
                   >
                      {/* Question title and Type Badge */}
                      <div className="flex items-start justify-between gap-4">
                         <div className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#5340FF]/10 text-[#5340FF] flex items-center justify-center font-bold text-[13px] shrink-0">
                               {index + 1}
                            </span>
                            <h3 className="text-[14.5px] font-bold text-gray-800 leading-snug">{question.text}</h3>
                         </div>
                         <span className="px-2.5 py-1 rounded-md bg-[#f0f0ff] text-[#5340FF] text-[10px] font-black uppercase tracking-wider shrink-0">
                            {question.typeLabel}
                         </span>
                      </div>

                      {/* Question Content/Results depending on Type */}
                      {question.type === "Radio" && question.options && (
                         <div className="flex flex-col gap-3.5 mt-2 pl-9">
                            {question.options.map((opt, oIdx) => (
                               <div key={oIdx} className="flex flex-col gap-1.5">
                                  <div className="flex justify-between items-center text-xs font-bold">
                                     <span className="text-gray-700">{opt.label}</span>
                                     <span className="text-gray-950">{formatNumber(opt.count)} ({opt.percent}%)</span>
                                  </div>
                                  <div className="w-full h-2.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                                     <div 
                                       className="h-full bg-blue-500 rounded-full group-hover:shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-all duration-700" 
                                       style={{ width: `${opt.percent}%` }}
                                     ></div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      )}

                      {question.type === "Checkbox" && question.options && (
                         <div className="flex flex-col gap-3.5 mt-2 pl-9">
                            {question.options.map((opt, oIdx) => (
                               <div key={oIdx} className="flex flex-col gap-1.5">
                                  <div className="flex justify-between items-center text-xs font-bold">
                                     <span className="text-gray-700">{opt.label}</span>
                                     <span className="text-gray-950">{formatNumber(opt.count)} ({opt.percent}%)</span>
                                  </div>
                                  <div className="w-full h-2.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                                     <div 
                                       className="h-full bg-teal-500 rounded-full group-hover:shadow-[0_0_8px_rgba(20,184,166,0.3)] transition-all duration-700" 
                                       style={{ width: `${opt.percent}%` }}
                                     ></div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      )}

                      {question.type === "Open" && question.responses && (
                         <div className="mt-2 pl-9 flex flex-col gap-3">
                            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                               <div className="bg-slate-50/75 p-2.5 border-b border-gray-100 flex items-center gap-2">
                                  <MessageSquare size={14} className="text-gray-400" />
                                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Danh sách ý kiến đóng góp mới nhất</span>
                               </div>
                               <div className="flex flex-col divide-y divide-gray-100 bg-white">
                                  {question.responses.map((resp, rIdx) => (
                                     <div key={rIdx} className="p-3 hover:bg-slate-50/50 transition-colors flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                           <span className="text-xs font-bold text-[#14233b]">{resp.name}</span>
                                           <span className="text-[10px] font-medium text-gray-400">{resp.time}</span>
                                        </div>
                                        <p className="text-xs font-medium text-gray-600 leading-relaxed italic">"{resp.content}"</p>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         </div>
                      )}
                   </div>
                );
             })}
          </div>

        </div>
      </div>
    </div>
  );
}
