export type ItemType = 'check' | 'score';

export interface ChecklistItemDef {
  id: number;
  title: string;
  type: ItemType;
  req: string;
}

export interface ReportItem {
  id: number;
  value: boolean | number;
  notes: string;
}

export interface ReportData {
  location: string;
  date: string;
  timeRange: string;
  items: ReportItem[];
}

export const CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { id: 1, title: 'Chụp ảnh BC theo yêu cầu', type: 'check', req: 'Chụp ảnh báo cáo theo yêu cầu' },
  { id: 2, title: 'Kiểm tra các đồ trang trí của CH', type: 'check', req: 'Đồ xuống cấp, hỏng hóc, lem nhem, sai chỗ, thay mới' },
  { id: 3, title: 'Kiểm tra âm thanh, hình ảnh tại các màn chiếu', type: 'check', req: 'Nhạc đúng quy định, CCTV đúng yêu cầu, bật sự kiện thể thao' },
  { id: 4, title: 'Lấy Ý kiến khách hàng', type: 'check', req: 'Xin ý kiến khách hàng cảm nhận trải nghiệm, món ăn' },
  { id: 5, title: 'Mời CTKM', type: 'check', req: 'Mời khách tham gia CTKM, đánh giá 5* google, đăng ký thành viên' },
  { id: 6, title: 'Hoạt động hoạt náo', type: 'check', req: 'Tham gia các hoạt động hoạt náo tại điểm cùng team MKT' },
  { id: 7, title: 'Kiểm tra các tủ trưng bày', type: 'score', req: 'Tủ sắp xếp gọn gàng, đúng chủng loại, đủ đồ' },
  { id: 8, title: 'Kiểm tra diện mạo của nhân sự CH', type: 'score', req: 'Đồng phục đúng quy định, chào hỏi khách, đầu tóc gọn gàng' },
  { id: 9, title: 'Đánh giá QL', type: 'score', req: 'QL có mặt đầy đủ, giao tiếp KH, sát sao nhân viên' },
  { id: 10, title: 'Kiểm tra nhân viên làm việc theo đúng qui trình', type: 'score', req: 'Bê đồ bằng khay, dọn dẹp bàn, mời bia, dọn bàn sạch sẽ' },
  { id: 11, title: 'Kiểm tra không gian nhà hàng', type: 'score', req: 'Bàn ghế ngay ngắn, sàn nhà sạch, NVS sạch sẽ đủ đồ' },
];
