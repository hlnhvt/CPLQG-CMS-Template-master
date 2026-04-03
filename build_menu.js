const fs = require('fs');

const data = JSON.parse(fs.readFileSync('National-Law-Portal/DanhSachCollection.json', 'utf8'));

const collections = data.data.collections.map(c => {
    return {
        name: c.collection,
        group: c.meta?.group,
        hidden: c.meta?.hidden,
        translation: c.meta?.translations?.[0]?.translation
    };
});

const visibleCollections = collections.filter(c => !c.hidden && !c.name.startsWith('directus_'));

const grouped = {};
visibleCollections.forEach(c => {
    const g = c.group || 'Ungrouped';
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push({
       id: c.name,
       label: c.translation || c.name,
       icon: 'FileText' // default
    });
});

const groupsMeta = {
  "Ungrouped": { label: "General", icon: "Folder" },
  "system_administration": { label: "Quản trị hệ thống", icon: "Settings" },
  "legal_document_manager": { label: "Quản lý Văn bản QPPL", icon: "FileText" },
  "surveys": { label: "Khảo sát", icon: "BarChart" },
  "ho_tro_phap_ly": { label: "Hỗ trợ pháp lý", icon: "HelpCircle" },
  "filter_list": { label: "Danh sách bộ lọc", icon: "ListFilter" },
  "elements": { label: "Elements", icon: "Layers" },
  "documents_contracts": { label: "Văn bản, Hợp đồng", icon: "FileText" },
  "frequently_asked_questions": { label: "Câu hỏi thường gặp FAQ", icon: "MessageSquare" },
  "legal_faq": { label: "Hỏi đáp pháp luật", icon: "MessageSquare" },
  "system_field": { label: "Trường hệ thống", icon: "Settings" },
  "Content_Management": { label: "Quản lý nội dung", icon: "Folder" },
  "comment": { label: "Bình luận", icon: "MessageSquare" },
  "Quan_ly_thong_tin_ca_nhan_hoa": { label: "Quản lý thông tin cá nhân", icon: "User" },
  "delegation_and_authorization": { label: "Phân cấp phân quyền", icon: "Shield" },
  "discussion_event_folder": { label: "Tọa đàm / Sự kiện", icon: "Radio" },
  "draft_legislation": { label: "Dự thảo QH", icon: "FileText" },
  "websites": { label: "Quản trị Website", icon: "Globe" },
  "draft_document_manager": { label: "Văn bản góp ý dự thảo", icon: "FileText" },
  "pages": { label: "Pages", icon: "LayoutTemplate" },
  "legal_aid_providers": { label: "Trợ giúp pháp lý", icon: "Users" },
  "forms": { label: "Biểu mẫu", icon: "LayoutTemplate" },
  "Dien_dan_chinh_sach_phap_luat": { label: "Diễn đàn CS Pháp luật", icon: "Users" },
  "tong_ra_soat": { label: "Tổng rà soát", icon: "Search" },
  "ho_dap_tu_van_phap_luat": { label: "Tư vấn pháp luật", icon: "MessageSquare" },
  "Nghi_quyet_66": { label: "Nghị quyết 66", icon: "Folder" },
  "notification_group": { label: "Groups Thông báo", icon: "Bell" },
  "user_manual": { label: "HD Sử dụng", icon: "BookOpen" },
  "legal_support": { label: "Legal Support", icon: "HelpCircle" },
  "reflecting_policy": { label: "Phản ánh chính sách", icon: "Radio" },
  "legal_compliance_guide": { label: "Tuân thủ PL", icon: "Shield" },
  "notifications_english": { label: "Notifi (EN)", icon: "Bell" },
  "quan_ly_khao_sat": { label: "Quản lý khảo sát", icon: "BarChart" },
  "survey_answers": { label: "Câu trả lời khảo sát", icon: "BarChart" },
  "Thong_Tin_Nguoi_Dung": { label: "Thông tin User", icon: "Users" }
};

let tsContent = `// Automatically generated menu data from Directus schema\n\n`;
tsContent += `export const MENU_GROUPS = [\n`;

for(const [gId, gInfo] of Object.entries(groupsMeta)) {
   if(!grouped[gId]) continue;
   tsContent += `  {\n`;
   tsContent += `    id: "${gId}",\n`;
   tsContent += `    label: "${gInfo.label}",\n`;
   tsContent += `    icon: "${gInfo.icon}",\n`;
   tsContent += `    collections: [\n`;
   grouped[gId].forEach(c => {
       tsContent += `      { id: "${c.id}", label: "${c.label.replace(/"/g, '\\"')}", icon: "${c.icon}" },\n`;
   });
   tsContent += `    ]\n  },\n`;
}

tsContent += `];\n`;

fs.mkdirSync('src/lib', { recursive: true });
fs.writeFileSync('src/lib/menu-data.ts', tsContent, 'utf8');
