const fs = require('fs');

const path = 'National-Law-Portal/DanhSachCollection.json';
if (!fs.existsSync(path)) {
  console.error('DanhSachCollection.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// ----------------------------------------------------
// DỌN DẸP SCHEMA CŨ THEO BẢN CẬP NHẬT MỚI: 
// Xoá O2M alias ở directus_users và field ảo của collaborator_profiles
// ----------------------------------------------------
data.data.fields = data.data.fields.filter(f => {
  if (f.collection === 'directus_users' && (f.field === 'staff_profiles' || f.field === 'additional_information' || f.field === 'collaborator_profiles')) return false;
  if (f.collection === 'staff_profiles') return false; 
  if (f.collection === 'collaborator_profiles' && (f.field === 'user_id' || f.field === 'status')) return false;
  return true;
});

data.data.relations = (data.data.relations || []).filter(r => {
  if (r.collection === 'staff_profiles') return false;
  if (r.collection === 'collaborator_profiles' && r.field === 'user_id') return false;
  if (r.collection === 'directus_users' && (r.field === 'staff_profiles' || r.field === 'additional_information')) return false;
  return true;
});

const createCollection = (name, label, group, hidden = false, isSystem = false) => ({
  collection: name,
  meta: {
    collection: name,
    hidden: hidden,
    group: group,
    icon: 'api',
    translations: label ? [{ language: 'vi-VN', translation: label }] : null,
    system: isSystem
  },
  schema: { name: name }
});

const createField = (collection, field, type, ui, label, sort, width = 'full', group = null, options = null) => ({
  collection,
  field,
  type,
  meta: {
    interface: ui,
    options: options,
    required: false,
    readonly: false,
    hidden: false,
    system: false,
    group: group,
    width: width,
    sort: sort,
    translations: [{ language: 'vi-VN', translation: label }]
  }
});

const createFieldRelation = (collection, field, relatedCollection) => ({
  collection,
  field,
  related_collection: relatedCollection,
  meta: { }
});

// New collections
const collections = [
  createCollection('directus_users', 'Người dùng hệ thống', 'Thong_Tin_Nguoi_Dung', false, true),
  createCollection('directus_roles', 'Vai trò bảo mật', 'Thong_Tin_Nguoi_Dung', false, true),
  createCollection('directus_access', 'Access Policies', 'Thong_Tin_Nguoi_Dung', false, true),
  createCollection('role_metadata', 'Phân loại nhóm (Metadata)', 'Thong_Tin_Nguoi_Dung'),
  createCollection('staff_profiles', 'Hồ sơ Cán bộ', 'Thong_Tin_Nguoi_Dung'),
  createCollection('collaborator_profiles', 'Hồ sơ Cộng tác viên', 'Thong_Tin_Nguoi_Dung'),
  createCollection('collaborator_profiles_files', 'Tài liệu Cộng tác viên', 'Thong_Tin_Nguoi_Dung', true),
  createCollection('cms_menu_permissions', 'Phân quyền Menu', 'system_administration'),
  createCollection('content_publish_rules', 'Quy tắc phân cấp đăng bài', 'system_administration'),
  createCollection('cms_permission_configs', 'Cấu hình quyền siêu dữ liệu', 'system_administration')
];

let fields = [];
let relations = [];

// AUDIT FIELDS (Utility)
const addAuditFields = (col) => {
  fields.push(
    createField(col, 'date_created', 'timestamp', 'datetime', 'Ngày tạo', 100, 'half'),
    createField(col, 'date_updated', 'timestamp', 'datetime', 'Ngày cập nhật', 101, 'half'),
    createField(col, 'user_created', 'uuid', 'select-dropdown-m2o', 'Người tạo', 102, 'half'),
    createField(col, 'user_updated', 'uuid', 'select-dropdown-m2o', 'Người cập nhật cuối', 103, 'half')
  );
  relations.push(
    createFieldRelation(col, 'user_created', 'directus_users'),
    createFieldRelation(col, 'user_updated', 'directus_users')
  );
};

// ----------------------------------------------------
// 1. directus_users (Hệ thống)
// ----------------------------------------------------
fields.push(
  createField('directus_users', 'tabs', 'alias', 'group-tabs', '', 1),
  createField('directus_users', 'account', 'alias', 'group-raw', 'Thông tin Tài khoản', 2, 'full', 'tabs'),
  createField('directus_users', 'profile', 'alias', 'group-raw', 'Thông tin Cá nhân', 3, 'full', 'tabs'),
  createField('directus_users', 'org', 'alias', 'group-raw', 'Đơn vị / Cơ quan', 4, 'full', 'tabs'),
  
  // Account
  createField('directus_users', 'email', 'string', 'input', 'Email đăng nhập', 1, 'half', 'account'),
  createField('directus_users', 'password', 'string', 'input', 'Mật khẩu', 2, 'half', 'account'),
  createField('directus_users', 'status', 'string', 'select-dropdown', 'Trạng thái', 3, 'half', 'account', { choices: [{text:"Active", value:"active"}, {text:"Suspended", value:"suspended"}]}),
  createField('directus_users', 'role', 'uuid', 'select-dropdown-m2o', 'Vai trò (Role)', 4, 'half', 'account'),
  
  // Profile
  createField('directus_users', 'first_name', 'string', 'input', 'Họ', 1, 'half', 'profile'),
  createField('directus_users', 'last_name', 'string', 'input', 'Tên', 2, 'half', 'profile'),
  createField('directus_users', 'avatar', 'uuid', 'file-image', 'Ảnh đại diện', 3, 'full', 'profile'),
  createField('directus_users', 'phone', 'string', 'input', 'Số điện thoại', 4, 'half', 'profile'),
  
  // Org
  createField('directus_users', 'organization_id', 'integer', 'select-dropdown-m2o', 'Cơ quan công tác', 1, 'full', 'org')
);
relations.push(
  createFieldRelation('directus_users', 'role', 'directus_roles'),
  createFieldRelation('directus_users', 'organization_id', 'organizations')
);

// ----------------------------------------------------
// 2. directus_roles (Hệ thống)
// ----------------------------------------------------
fields.push(
  createField('directus_roles', 'name', 'string', 'input', 'Tên nhóm quyền', 1, 'half'),
  createField('directus_roles', 'description', 'string', 'textarea', 'Mô tả', 2, 'full'),
  createField('directus_roles', 'icon', 'string', 'input', 'Icon', 3, 'half'),
  createField('directus_roles', 'color', 'string', 'input', 'Color', 4, 'half'),
  createField('directus_roles', 'admin_access', 'boolean', 'boolean', 'Admin Access', 5, 'half'),
  createField('directus_roles', 'app_access', 'boolean', 'boolean', 'App Access', 6, 'half'),
  createField('directus_roles', 'enforce_tfa', 'boolean', 'boolean', 'Bắt buộc 2FA', 7, 'half'),
  createField('directus_roles', 'role_metadata', 'alias', 'list-o2m', 'Phân loại nhóm (Metadata)', 8, 'full', null, { fields: ['role_type', 'note']}),
  createField('directus_roles', 'policies', 'alias', 'list-m2m', 'Access Policies', 9, 'full', null, { fields: ['name', 'description']}),
  createField('directus_roles', 'users', 'alias', 'list-o2m', 'Người dùng', 10, 'full', null, { fields: ['first_name', 'email']})
);
relations.push(createFieldRelation('role_metadata', 'role_id', 'directus_roles'));

// ----------------------------------------------------
// 3. directus_access (Hệ thống)
// ----------------------------------------------------
fields.push(
  createField('directus_access', 'name', 'string', 'input', 'Tên Policy', 1, 'full'),
  createField('directus_access', 'description', 'string', 'textarea', 'Mô tả', 2, 'full'),
  createField('directus_access', 'permissions', 'json', 'input-code', 'Quyền trên Collection (JSON)', 3, 'full')
);

// ----------------------------------------------------
// 4. role_metadata (Phụ lục 502-506, bảng 1)
// ----------------------------------------------------
fields.push(
  createField('role_metadata', 'role_id', 'uuid', 'select-dropdown-m2o', 'Vai trò (Role)', 1, 'half'),
  createField('role_metadata', 'role_type', 'string', 'select-dropdown', 'Loại nghiệp vụ', 2, 'half', null, { choices: [ {text: 'Cán bộ', value: 'can_bo'}, {text: 'Cộng tác viên', value: 'cong_tac_vien'}, {text: 'Quản trị viên', value: 'quan_tri'}, {text: 'Người dùng công cộng', value: 'nguoi_dung_cong'}, {text: 'Khác', value: 'khac'} ]}),
  createField('role_metadata', 'note', 'text', 'textarea', 'Ghi chú nội bộ', 3, 'full')
);
addAuditFields('role_metadata');

// ----------------------------------------------------
// 5. staff_profiles (Phụ lục 502-506, bảng 2 & MH02 - Tách rời)
// ----------------------------------------------------
fields.push(
  createField('staff_profiles', 'account_type', 'string', 'select-dropdown', 'Loại cán bộ', 1, 'half', null, { choices: [{text: 'Cán bộ CMS (Loại 1)', value: 'cms_account'}, {text: 'Cán bộ Cổng (Loại 2)', value: 'portal_only'}]}),
  createField('staff_profiles', 'user_id', 'uuid', 'select-dropdown-m2o', 'Tài khoản CMS', 2, 'half'),
  createField('staff_profiles', 'portal_user_id', 'integer', 'select-dropdown-m2o', 'Tài khoản Cổng (PLQG)', 3, 'half'),
  createField('staff_profiles', 'full_name', 'string', 'input', 'Họ và tên', 4, 'half'),
  createField('staff_profiles', 'email', 'string', 'input', 'Email liên hệ', 5, 'half'),
  createField('staff_profiles', 'phone_number', 'string', 'input', 'Số điện thoại', 6, 'half'),
  createField('staff_profiles', 'avatar', 'uuid', 'file-image', 'Ảnh đại diện', 7, 'half'),
  createField('staff_profiles', 'organization_id', 'integer', 'select-dropdown-m2o', 'Cơ quan công tác', 8, 'half'),
  createField('staff_profiles', 'position', 'string', 'input', 'Chức vụ', 9, 'half'),
  createField('staff_profiles', 'staff_card_number', 'string', 'input', 'Số thẻ công chức / viên chức', 10, 'half'),
  createField('staff_profiles', 'join_date', 'date', 'datetime', 'Ngày vào cơ quan', 11, 'half'),
  createField('staff_profiles', 'expertise', 'text', 'textarea', 'Chuyên môn phụ trách', 12, 'full'),
  createField('staff_profiles', 'citizen_id', 'string', 'input', 'Số CMND/CCCD', 13, 'half'),
  createField('staff_profiles', 'date_of_birth', 'date', 'datetime', 'Ngày sinh', 14, 'half'),
  createField('staff_profiles', 'status', 'string', 'select-dropdown', 'Trạng thái công tác', 15, 'half', null, { choices: [{text: 'Đang công tác', value: 'active'}, {text: 'Tạm nghỉ', value: 'leave'}, {text: 'Đã nghỉ việc', value: 'inactive'}]}),
  createField('staff_profiles', 'notes', 'text', 'textarea', 'Ghi chú nội bộ', 16, 'full')
);
addAuditFields('staff_profiles');
relations.push(
  createFieldRelation('staff_profiles', 'user_id', 'directus_users'),
  createFieldRelation('staff_profiles', 'portal_user_id', 'additional_information'),
  createFieldRelation('staff_profiles', 'organization_id', 'organizations'),
  createFieldRelation('staff_profiles', 'avatar', 'directus_files')
);

// ----------------------------------------------------
// 6. collaborator_profiles (Phụ lục 502-506, bảng 3 mới nhất: Tách rời khỏi user_id)
// ----------------------------------------------------
fields.push(
  createField('collaborator_profiles', 'full_name', 'string', 'input', 'Họ và tên', 1, 'half'),
  createField('collaborator_profiles', 'phone', 'string', 'input', 'Số điện thoại', 2, 'half'),
  createField('collaborator_profiles', 'email', 'string', 'input', 'Email liên hệ', 3, 'half'),
  createField('collaborator_profiles', 'citizen_id', 'string', 'input', 'Số CMND/CCCD', 4, 'half'),
  createField('collaborator_profiles', 'address', 'text', 'textarea', 'Địa chỉ', 5, 'full'),
  createField('collaborator_profiles', 'expertise', 'string', 'input', 'Lĩnh vực chuyên môn', 6, 'half'),
  createField('collaborator_profiles', 'work_scope', 'text', 'textarea', 'Phạm vi công việc', 7, 'full'),
  createField('collaborator_profiles', 'suggested_permission_level', 'string', 'select-dropdown', 'Mức quyền đề xuất', 8, 'half', null, {choices: [ {text:"Cơ bản", value:"basic"}, {text:"Mở rộng", value:"extended"}, {text:"Đầy đủ", value:"full"}]}),
  createField('collaborator_profiles', 'cooperation_status', 'string', 'select-dropdown', 'Trạng thái hợp tác', 9, 'half', null, { choices: [{text: 'Active', value: 'active'}, {text: 'Inactive', value: 'inactive'}, {text: 'Pending', value: 'pending'}]}),
  createField('collaborator_profiles', 'start_date', 'date', 'datetime', 'Ngày bắt đầu hợp tác', 10, 'half'),
  createField('collaborator_profiles', 'end_date', 'date', 'datetime', 'Ngày kết thúc', 11, 'half'),
  createField('collaborator_profiles', 'organization_id', 'integer', 'select-dropdown-m2o', 'Cơ quan đại diện', 12, 'half'),
  createField('collaborator_profiles', 'portal_user_id', 'integer', 'select-dropdown-m2o', 'Tài khoản Cổng (Tùy chọn)', 13, 'half'),
  createField('collaborator_profiles', 'note', 'text', 'textarea', 'Ghi chú nội bộ', 14, 'full'),
  // O2M junction table representation for the UI forms 
  createField('collaborator_profiles', 'files', 'alias', 'list-o2m', 'Tài liệu đính kèm', 15, 'full')
);
addAuditFields('collaborator_profiles');
relations.push(
  createFieldRelation('collaborator_profiles', 'organization_id', 'organizations'),
  createFieldRelation('collaborator_profiles', 'portal_user_id', 'additional_information'),
  createFieldRelation('collaborator_profiles_files', 'collaborator_profiles_id', 'collaborator_profiles')
);

// ----------------------------------------------------
// 7. collaborator_profiles_files (Phụ lục 502-506, bảng 4 - Junction M2M)
// ----------------------------------------------------
fields.push(
  createField('collaborator_profiles_files', 'collaborator_profiles_id', 'integer', 'select-dropdown-m2o', 'Hồ sơ CTV', 1, 'half'),
  createField('collaborator_profiles_files', 'directus_files_id', 'uuid', 'file-image', 'File đính kèm', 2, 'half'),
  createField('collaborator_profiles_files', 'file_type', 'string', 'select-dropdown', 'Loại tài liệu', 3, 'half', null, { choices: [{text: 'Contract', value: 'contract'}, {text: 'ID Card', value: 'id_card'}, {text: 'Certificate', value: 'certificate'}, {text: 'Other', value: 'other'}]}),
  createField('collaborator_profiles_files', 'note', 'string', 'input', 'Ghi chú tài liệu', 4, 'half')
);
relations.push(createFieldRelation('collaborator_profiles_files', 'directus_files_id', 'directus_files'));

// ----------------------------------------------------
// 8. cms_menu_permissions (Phụ lục 507-511, A)
// ----------------------------------------------------
fields.push(
  createField('cms_menu_permissions', 'function_name', 'string', 'input', 'Tên chức năng / Menu item', 1, 'half'),
  createField('cms_menu_permissions', 'function_code', 'string', 'input', 'Mã định danh duy nhất', 2, 'half'),
  createField('cms_menu_permissions', 'function_type', 'string', 'select-dropdown', 'Loại chức năng', 3, 'half', null, {choices: [{text:"Menu", value:"menu"}, {text:"Button", value:"button"}, {text:"API", value:"api"}, {text:"Module", value:"module"}]}),
  createField('cms_menu_permissions', 'module_name', 'string', 'input', 'Module liên quan', 4, 'half'),
  createField('cms_menu_permissions', 'role_id', 'uuid', 'select-dropdown-m2o', 'Nhóm quyền áp dụng', 5, 'half'),
  createField('cms_menu_permissions', 'access_level', 'string', 'select-dropdown', 'Quyền truy cập', 6, 'half', null, {choices: [{text:"None", value:"none"}, {text:"Read", value:"read"}, {text:"Read/Write", value:"read_write"}, {text:"Full", value:"full"}]}),
  createField('cms_menu_permissions', 'is_active', 'boolean', 'boolean', 'Kích hoạt', 7, 'half'),
  createField('cms_menu_permissions', 'notes', 'text', 'textarea', 'Ghi chú', 8, 'full')
);
addAuditFields('cms_menu_permissions');

// ----------------------------------------------------
// 9. content_publish_rules (Phụ lục 507-511, B)
// ----------------------------------------------------
fields.push(
  createField('content_publish_rules', 'rule_name', 'string', 'input', 'Tên gợi nhớ quy tắc', 1, 'full'),
  createField('content_publish_rules', 'rule_code', 'string', 'input', 'Mã định danh quy tắc', 2, 'half'),
  createField('content_publish_rules', 'content_type', 'string', 'select-dropdown', 'Loại nội dung', 3, 'half', null, {choices: [{text:"Tin bài", value:"article"}, {text:"Văn bản", value:"van_ban"}, {text:"Hồ sơ", value:"ho_so"}, {text:"Luật sư", value:"law_expert"}, {text:"Khảo sát", value:"survey"}]}),
  createField('content_publish_rules', 'org_type', 'string', 'select-dropdown', 'Cấp hành chính', 4, 'half', null, {choices: [{text:"Trung ương", value:"trung_uong"}, {text:"Bộ ngành", value:"bo_nganh"}, {text:"Tỉnh thành", value:"tinh_thanh"}, {text:"Quận huyện", value:"quan_huyen"}, {text:"Xã phường", value:"xa_phuong"}]}),
  createField('content_publish_rules', 'allowed_actions', 'json', 'input-code', 'Mảng hành động cho phép', 5, 'full'),
  createField('content_publish_rules', 'require_approval', 'boolean', 'boolean', 'Cần duyệt cấp trên', 6, 'half'),
  createField('content_publish_rules', 'approver_org_type', 'string', 'select-dropdown', 'Cấp duyệt thầm quyền', 7, 'half', null, {choices: [{text:"Trung ương", value:"trung_uong"}, {text:"Bộ ngành", value:"bo_nganh"}, {text:"Tỉnh thành", value:"tinh_thanh"}, {text:"Quận huyện", value:"quan_huyen"}]}),
  createField('content_publish_rules', 'allow_delete', 'boolean', 'boolean', 'Được phép xoá', 8, 'half'),
  createField('content_publish_rules', 'allow_restore', 'boolean', 'boolean', 'Được phép khôi phục', 9, 'half'),
  createField('content_publish_rules', 'is_active', 'boolean', 'boolean', 'Quy tắc đang hiệu lực', 10, 'half'),
  createField('content_publish_rules', 'notes', 'text', 'textarea', 'Ghi chú', 11, 'full')
);
addAuditFields('content_publish_rules');

// ----------------------------------------------------
// 10. cms_permission_configs (Phụ lục 507-511, C)
// ----------------------------------------------------
fields.push(
  createField('cms_permission_configs', 'policy_ref', 'string', 'input', 'Access Policy Reference (Tên/ID)', 1, 'half'),
  createField('cms_permission_configs', 'role_id', 'uuid', 'select-dropdown-m2o', 'Role liên quan', 2, 'half'),
  createField('cms_permission_configs', 'config_version', 'string', 'input', 'Phiên bản cấu hình', 3, 'half'),
  createField('cms_permission_configs', 'change_reason', 'text', 'textarea', 'Lý do thay đổi cấu hình', 4, 'full'),
  createField('cms_permission_configs', 'effective_date', 'date', 'datetime', 'Ngày hiệu lực', 5, 'half'),
  createField('cms_permission_configs', 'is_active', 'boolean', 'boolean', 'Đang thiết lập', 6, 'half'),
  createField('cms_permission_configs', 'notes', 'text', 'textarea', 'Ghi chú chi tiết', 7, 'full')
);
addAuditFields('cms_permission_configs');
relations.push(createFieldRelation('cms_permission_configs', 'role_id', 'directus_roles'));

// Process injecting / overwriting
collections.forEach(nc => {
  if (!data.data.collections.find(c => c.collection === nc.collection)) {
    data.data.collections.push(nc);
  } else {
    // Overwrite to make sure it is updated
    const idx = data.data.collections.findIndex(c => c.collection === nc.collection);
    data.data.collections[idx] = nc;
  }
});

fields.forEach(nf => {
  const existingIndex = data.data.fields.findIndex(f => f.collection === nf.collection && f.field === nf.field);
  if (existingIndex === -1) {
    data.data.fields.push(nf);
  } else {
    data.data.fields[existingIndex] = nf;
  }
});

if(!data.data.relations) data.data.relations = [];
relations.forEach(nr => {
  const existingIndex = data.data.relations.findIndex(r => r.collection === nr.collection && r.field === nr.field);
  if (existingIndex === -1) {
    data.data.relations.push(nr);
  } else {
    data.data.relations[existingIndex] = nr;
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));

console.log('Patch complete (Cleaned up collaborator_profiles user_id relation & Updated UC503/UC504)');
