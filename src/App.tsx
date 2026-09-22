import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { ReportForm } from './components/ReportForm';
import { ReportPreview } from './components/ReportPreview';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { ReportData, CHECKLIST_ITEMS } from './types';

// TODO: Thay thế đường dẫn này bằng URL Web App của Google Apps Script của bạn
const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxWKIm74psex5-61MTbeSZKTyA5_K8GBE2MzZ3iOcn7bu1ekM7NqvGXDOJLmz88iDGQ/exec";

export default function App() {
  const [reportData, setReportData] = useState<ReportData>({
    location: '',
    date: new Date().toISOString().split('T')[0],
    reporter: '',
    items: CHECKLIST_ITEMS.map((item) => ({
      id: item.id,
      value: item.type === 'check' ? true : item.type === 'score' ? 10 : '',
      notes: '',
    })),
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [sheetStatus, setSheetStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  // Modal Preview & Copy states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string>('');
  const [modalFileName, setModalFileName] = useState<string>('');
  const [isDownloadBlocked, setIsDownloadBlocked] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const saveToGoogleSheets = async (data: ReportData) => {
    if (!GOOGLE_SHEET_WEBHOOK_URL) {
      console.log("Chưa cấu hình Google Sheets Webhook URL. Bỏ qua bước lưu dữ liệu.");
      return false;
    }

    // Tính tổng điểm
    const totalScore = data.items
      .filter((item) => {
        const def = CHECKLIST_ITEMS.find((d) => d.id === item.id);
        return def?.type === 'score';
      })
      .reduce((sum, item) => sum + (Number(item.value) || 0), 0);

    const payload = {
      sheetName: "BC CX",
      location: data.location,
      date: data.date,
      reporter: data.reporter,
      totalScore: totalScore,
      items: data.items.map(item => {
        const def = CHECKLIST_ITEMS.find((d) => d.id === item.id);
        
        // Format true/false thành text
        let formattedValue = item.value;
        if (item.value === true) formattedValue = "Thực hiện";
        if (item.value === false) formattedValue = "Không thực hiện";

        return {
          title: def?.title || `Hạng mục ${item.id}`,
          value: formattedValue,
          notes: item.notes
        };
      })
    };

    try {
      setSheetStatus('saving');
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', // Dùng no-cors để tránh lỗi CORS policy khi gọi từ trình duyệt
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Đổi thành text/plain để fix lỗi trên iOS/Safari
        },
        body: JSON.stringify(payload)
      });
      console.log("Đã gửi dữ liệu lên Google Sheets");
      setSheetStatus('success');
      return true;
    } catch (error) {
      console.error("Lỗi khi lưu vào Google Sheets:", error);
      setSheetStatus('error');
      return false;
    }
  };

  const handleExportImage = async () => {
    if (!previewRef.current || isExporting) return;
    
    setIsExporting(true);
    setExportSuccess(false);
    setSheetStatus('idle');
    setIsDownloadBlocked(false);

    try {
      // Lưu dữ liệu vào Google Sheets
      await saveToGoogleSheets(reportData);

      // Delay nhỏ để DOM render ổn định
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2, // Độ phân giải cao cho Zalo
        backgroundColor: '#ffffff',
      });

      const rawFileName = `BaoCao_${reportData.location || 'CoSo'}_${reportData.date}.png`;
      const fileName = rawFileName.replace(/\s+/g, '_');

      setModalImageUrl(dataUrl);
      setModalFileName(fileName);

      // Thử kích hoạt tải xuống trực tiếp
      let directDownloadFailed = false;
      try {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (dlErr) {
        console.warn('Trình duyệt chặn tải xuống trực tiếp:', dlErr);
        directDownloadFailed = true;
      }

      // Tự động mở Popup ảnh luôn để người dùng xem và copy
      setIsDownloadBlocked(directDownloadFailed);
      setIsModalOpen(true);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to export image', err);
      if (modalImageUrl) {
        setIsDownloadBlocked(true);
        setIsModalOpen(true);
      } else {
        alert('Có lỗi xảy ra khi xuất ảnh. Vui lòng thử lại.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-xs">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  CS Báo Cáo Trải Nghiệm KH
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Hệ thống lập báo cáo & xuất ảnh gửi Zalo
                </p>
              </div>
            </div>
            
            <button
              id="btn-header-download"
              onClick={handleExportImage}
              disabled={isExporting}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {sheetStatus === 'saving' ? 'Đang lưu Sheets...' : 'Đang xuất ảnh...'}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Tải ảnh báo cáo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32 sm:pb-8">
        {exportSuccess && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${sheetStatus === 'error' ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'}`}>
            {sheetStatus === 'error' ? <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            <div className="text-sm">
              <p className="font-semibold">
                {sheetStatus === 'error' 
                  ? 'Đã tạo ảnh thành công, nhưng có lỗi khi lưu dữ liệu lên Google Sheets. Vui lòng kiểm tra lại mạng!' 
                  : 'Đã tạo ảnh và lưu dữ liệu lên Google Sheets thành công!'}
              </p>
              <p className="text-xs mt-0.5 opacity-90">
                Popup ảnh đã mở. Bạn có thể nhấn <strong>"Sao chép ảnh"</strong> để gửi ngay vào Zalo hoặc tải xuống.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3 text-indigo-900">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-indigo-600" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Hướng dẫn sử dụng</p>
                <p>
                  Nhập thông tin bên dưới, bản xem trước tự động cập nhật bên phải. Nhấn <strong>"Tải ảnh báo cáo"</strong> để tự động tải ảnh và mở popup sao chép ảnh gửi Zalo.
                </p>
              </div>
            </div>
            
            <ReportForm data={reportData} onChange={setReportData} />
          </div>

          {/* Right Column: Preview */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Bản xem trước trực tiếp</h2>
              <span className="text-xs font-medium px-2 py-1 bg-slate-200 text-slate-600 rounded-md">
                Tự động cập nhật
              </span>
            </div>
            
            <div className="bg-slate-200 p-2 sm:p-4 rounded-xl sm:rounded-2xl overflow-x-auto shadow-inner border border-slate-300">
              <div className="w-[800px] min-w-[800px] mx-auto">
                <ReportPreview data={reportData} ref={previewRef} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-8px_20px_-3px_rgba(0,0,0,0.08)] z-40">
        <button
          id="btn-mobile-download"
          onClick={handleExportImage}
          disabled={isExporting}
          className="w-full flex justify-center items-center gap-2 px-4 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{sheetStatus === 'saving' ? 'Đang lưu Sheets...' : 'Đang xử lý xuất ảnh...'}</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Tải ảnh báo cáo</span>
            </>
          )}
        </button>
      </div>

      {/* Modal Xem trước & Copy ảnh */}
      <ImagePreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={modalImageUrl}
        fileName={modalFileName}
        isDownloadBlocked={isDownloadBlocked}
      />
    </div>
  );
}

