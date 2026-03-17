export type ItemType = 'check' | 'score' | 'text';

export interface ChecklistItemDef {
  id: number;
  title: string;
  type: ItemType;
  req: string;
}

export interface ReportItem {
  id: number;
  value: boolean | number | string;
  notes: string;
}

export interface ReportData {
  location: string;
  date: string;
  reporter: string;
  items: ReportItem[];
}

export const CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { id: 1, title: 'Chụp ảnh BC', type: 'check', req: 'Ảnh checkin, đủ hình ảnh biển hiệu bên ngoài, khu vực decor, tủ trưng bày, ko gian NH, khu vệ sinh' },
  { id: 2, title: 'Kiểm tra các đồ trang trí của CH có bị hỏng hóc, xuống cấp, lem nhem', type: 'check', req: 'Nếu đồ xuống cấp, hỏng báo ngay cho Nhân sự để xử lý.\nNếu hết thời gian trưng bày tháo bỏ\nNếu bẩn, lem nhem lau chùi\nNếu để sai chỗ sắp xếp lại.\nThay thế đồ trang trí mới (nếu có)' },
  { id: 3, title: 'Kiểm tra âm thanh, hình ảnh tại các màn chiếu', type: 'check', req: 'Nếu nhạc bật sai qui định, chỉnh lại cho đúng qđ. Lưu ý âm lượng hợp lí.\nNếu không bật các CCTV theo yc, chỉnh lại cho đúng\nNếu hôm đó có giải đấu đá bóng hay thể thao, bật theo sự kiện đc yêu cầu' },
  { id: 4, title: 'Lấy Ý kiến khách hàng', type: 'check', req: 'Xin ý kiến khách hàng cảm nhận trải nghiệm, ý kiến về món ăn cụ thể trên bàn khách.' },
  { id: 5, title: 'Mời ctkm', type: 'check', req: 'Mời khách tham gia các CTKM thường xuyên như đánh giá 5* google, đăng ký thành viên.\nTham gia mời các CTKM định kỳ như Ngày hội Bia Ơi, thứ 3 hàng tuần cho thành viên' },
  { id: 6, title: 'Hoạt động hoạt náo', type: 'check', req: 'Tham gia các hoạt động hoạt náo tại điểm cùng team MKT và nv CH như sinh nhật KH...' },
  { id: 7, title: 'Kiểm tra các tủ mát trưng bày', type: 'score', req: 'Nếu tủ không sắp xếp gọn gàng theo đúng chủng loại và đủ kín đồ thì yc sắp xếp và fill đủ đồ' },
  { id: 8, title: 'Chấm điểm hình ảnh nhân sự CH', type: 'score', req: 'NV mặc áo đồng phục theo qui định, ko đi dép lê, có đủ bút, tab, đeo bộ đàm.\nNV luôn nói Bia Ơi xin chào khi khách đến và Bia Ơi cảm ơn khi tiễn khách.\nNV CS mặc tạp dề, tóc tai gọn gàng trang điểm xinh tươi\nNV boy ko đi dép lê, ko mặc quần rách' },
  { id: 9, title: 'Chấm điểm Quản lý', type: 'score', req: 'QL có mặt đầy đủ trong giờ làm việc\nQuan sát sự giao tiếp của QL với KH\nQuan sát sự sát sao của QL với nhân viên' },
  { id: 10, title: 'Chấm điểm nhân viên làm việc đúng qui trình', type: 'score', req: 'Luôn dùng khay để bê đồ\nGhi tờ check đầy đủ\nLuôn có mặt tại bàn phục vụ không để khách phải bực mình vì không gọi đc nhân viên\nKhi dọn bàn tuân thủ đúng qui trình và đảm bảo sạch sẽ theo đúng qui định\nKhông dùng điện thoại trong ca làm việc' },
  { id: 11, title: 'Chấm điểm không gian nhà hàng', type: 'score', req: 'Bàn ghế sắp xếp theo hàng lối, và bày biện bàn đủ đồ phục vụ (gạt tàn, giấy ăn, bát đũa, sọt rác)\nVỏ bom bia xếp ở khu vực qui định\nVật tư ccdc xếp trong kho, ko để bừa ngoài khu vực không gian bán hàng\nSàn nhà sạch không có rác\nNhà vệ sinh khô ráo, ko mùi, đủ giấy vs, nước rửa tay' },
  { id: 13, title: 'Đề xuất', type: 'text', req: 'Các ý kiến để cải thiện chất lượng dịch vụ và trải nghiệm khách hàng' }
];
