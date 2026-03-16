import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { ReportForm } from './components/ReportForm';
import { ReportPreview } from './components/ReportPreview';
import { ReportData, CHECKLIST_ITEMS } from './types';

export default function App() {
  const [reportData, setReportData] = useState<ReportData>({
    location: '',
    date: new Date().toISOString().split('T')[0],
    timeRange: '',
    items: CHECKLIST_ITEMS.map((item) => ({
      id: item.id,
      value: item.type === 'check' ? true : 10,
      notes: '',
    })),
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExportImage = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    setExportSuccess(false);

    try {
      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2, // High resolution for Zalo
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      const fileName = `BaoCao_${reportData.location || 'CoSo'}_${reportData.date}.png`;
      link.download = fileName.replace(/\s+/g, '_');
      link.href = dataUrl;
      link.click();
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export image', err);
      alert('Có lỗi xảy ra khi xuất ảnh. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Camera className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Báo Cáo Trải Nghiệm KH
              </h1>
            </div>
            
            <button
              onClick={handleExportImage}
              disabled={isExporting}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Tải ảnh báo cáo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 sm:pb-8">
        {exportSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="font-medium">Xuất ảnh thành công! Bạn có thể gửi ảnh này qua Zalo.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3 text-indigo-800">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Hướng dẫn sử dụng</p>
                <p>Nhập thông tin vào biểu mẫu bên dưới. Bản xem trước sẽ tự động cập nhật bên phải. Nhấn "Tải ảnh báo cáo" để lưu thành ảnh gửi Zalo.</p>
              </div>
            </div>
            
            <ReportForm data={reportData} onChange={setReportData} />
          </div>

          {/* Right Column: Preview */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Bản xem trước</h2>
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
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.05)] z-50">
        <button
          onClick={handleExportImage}
          disabled={isExporting}
          className="w-full flex justify-center items-center gap-2 px-4 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          Tải ảnh báo cáo
        </button>
      </div>
    </div>
  );
}
