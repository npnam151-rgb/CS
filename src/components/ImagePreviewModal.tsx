import React, { useState } from 'react';
import { Copy, Check, Download, X, Info } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  fileName: string;
  isDownloadBlocked?: boolean;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  fileName,
}) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [copyErrorMessage, setCopyErrorMessage] = useState('');

  if (!isOpen || !imageUrl) return null;

  const handleCopyImage = async () => {
    try {
      setCopyStatus('idle');
      setCopyErrorMessage('');

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      if (typeof window !== 'undefined' && 'clipboard' in navigator && typeof window.ClipboardItem !== 'undefined') {
        const pngBlob = blob.type === 'image/png' ? blob : new Blob([blob], { type: 'image/png' });
        const clipboardItem = new ClipboardItem({
          'image/png': pngBlob,
        });

        await navigator.clipboard.write([clipboardItem]);
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 3000);
      } else {
        throw new Error('ClipboardItem API không được hỗ trợ');
      }
    } catch (err) {
      console.warn('Không thể sao chép ảnh trực tiếp qua Clipboard API:', err);
      setCopyStatus('error');
      setCopyErrorMessage('Trình duyệt chưa hỗ trợ sao chép tự động. Bạn hãy chạm giữ vào ảnh bên dưới 1-2 giây rồi chọn "Sao chép" nhé!');
      setTimeout(() => setCopyStatus('idle'), 5000);
    }
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = imageUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Lỗi khi tải ảnh:', err);
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div 
      id="image-preview-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="image-preview-modal-container"
        className="relative flex flex-col w-full max-w-xl max-h-[94vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 bg-white">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Ảnh Báo Cáo Hoàn Chỉnh
            </h3>
            <p className="text-sm sm:text-base text-slate-500 font-normal mt-1">
              Bấm copy hoặc chạm giữ vào ảnh để lưu/gửi
            </p>
          </div>
          
          <button
            id="btn-close-modal-top"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition-colors ml-2"
            title="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notice / Mẹo gửi nhanh (Exact design from screenshot) */}
        <div className="px-6 py-4 bg-[#fffdf0] border-y border-[#fef3c7] flex items-start gap-3.5">
          <div className="mt-0.5">
            <div className="w-6 h-6 rounded-full border-2 border-[#c27803] flex items-center justify-center text-[#c27803] font-bold text-xs">
              i
            </div>
          </div>
          <div className="text-sm sm:text-[15px] leading-relaxed text-[#78350f]">
            <p className="font-bold text-base mb-0.5 text-[#78350f]">
              Mẹo gửi nhanh:
            </p>
            <p>
              Bấm nút <strong className="font-bold text-[#4338ca]">"Copy ảnh"</strong> để dán trực tiếp vào Zalo/Tin nhắn, hoặc chạm và giữ ngón tay vào ảnh bên dưới trong 1-2 giây rồi chọn <strong className="font-bold">"Sao chép" (Copy)</strong> / <strong className="font-bold">"Lưu vào Ảnh"</strong>.
            </p>
          </div>
        </div>

        {copyStatus === 'error' && copyErrorMessage && (
          <div className="px-6 py-2.5 bg-amber-100 border-b border-amber-200 text-xs sm:text-sm text-amber-900 font-medium">
            {copyErrorMessage}
          </div>
        )}

        {/* Image Preview Canvas / Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-white flex items-start justify-center min-h-[220px]">
          <div className="w-full bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden">
            <img
              src={imageUrl}
              alt="Báo cáo hoàn chỉnh"
              className="w-full h-auto block object-contain mx-auto"
              draggable={true}
            />
          </div>
        </div>

        {/* Footer Actions (Exact design from screenshot) */}
        <div className="px-6 pt-3 pb-5 bg-white border-t border-slate-100 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Button Copy ảnh */}
            <button
              id="btn-copy-image"
              onClick={handleCopyImage}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-base sm:text-lg font-bold shadow-xs transition-all ${
                copyStatus === 'copied'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#4f46e5] hover:bg-[#4338ca] text-white'
              }`}
            >
              {copyStatus === 'copied' ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Đã copy!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy ảnh</span>
                </>
              )}
            </button>

            {/* Button Tải ảnh */}
            <button
              id="btn-download-image"
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-base sm:text-lg font-bold bg-[#f1f5f9] hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <Download className="w-5 h-5 text-slate-700" />
              <span>Tải ảnh</span>
            </button>
          </div>

          {/* Button Đóng text */}
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="w-full py-2 text-center text-base sm:text-lg font-bold text-slate-800 hover:text-slate-950 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
