import React from 'react';
import { CHECKLIST_ITEMS, ReportData, ReportItem } from '../types';
import { cn } from '../lib/utils';
import { Check, X } from 'lucide-react';

interface ReportFormProps {
  data: ReportData;
  onChange: (data: ReportData) => void;
}

export function ReportForm({ data, onChange }: ReportFormProps) {
  const handleItemChange = (id: number, field: keyof ReportItem, value: any) => {
    const newItems = data.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Thông tin chung</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Cơ sở</label>
            <select
              value={data.location}
              onChange={(e) => onChange({ ...data, location: e.target.value })}
              className="w-full px-4 py-3 md:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
            >
              <option value="">-- Chọn cơ sở --</option>
              <option value="94 Lò Đúc">94 Lò Đúc</option>
              <option value="96 Hồng Tiến">96 Hồng Tiến</option>
              <option value="98 Vũ Trọng Phụng">98 Vũ Trọng Phụng</option>
              <option value="01 Đặng Dung">01 Đặng Dung</option>
              <option value="3D Nguyễn Văn Huyên">3D Nguyễn Văn Huyên</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Ngày</label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ ...data, date: e.target.value })}
              className="w-full px-4 py-3 md:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Người báo cáo</label>
            <input
              type="text"
              value={data.reporter}
              onChange={(e) => onChange({ ...data, reporter: e.target.value })}
              className="w-full px-4 py-3 md:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="VD: Nguyễn Văn A"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {CHECKLIST_ITEMS.map((def) => {
          const item = data.items.find((i) => i.id === def.id)!;
          return (
            <div key={def.id} className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4 mb-4 md:mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold md:font-medium text-slate-800 text-base md:text-sm">
                    {def.id === 13 ? '13' : def.id}. {def.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 whitespace-pre-wrap">{def.req}</p>
                </div>
                
                <div className="shrink-0 w-full md:w-auto mt-1 md:mt-0">
                  {def.type === 'check' ? (
                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg w-full">
                      <button
                        onClick={() => handleItemChange(def.id, 'value', true)}
                        className={cn(
                          "flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 md:py-1.5 rounded-md text-sm font-medium transition-all",
                          item.value === true 
                            ? "bg-emerald-500 text-white shadow-sm" 
                            : "text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        <Check className="w-4 h-4" /> Thực hiện
                      </button>
                      <button
                        onClick={() => handleItemChange(def.id, 'value', false)}
                        className={cn(
                          "flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 md:py-1.5 rounded-md text-sm font-medium transition-all",
                          item.value === false 
                            ? "bg-rose-500 text-white shadow-sm" 
                            : "text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        <X className="w-4 h-4" /> Không TH
                      </button>
                    </div>
                  ) : def.type === 'score' ? (
                    <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto bg-slate-100 md:bg-transparent p-2 md:p-0 rounded-lg">
                      <span className="text-sm font-medium text-slate-600 ml-2 md:ml-0">Điểm đánh giá:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={item.value as number}
                          onChange={(e) => {
                            let val = parseInt(e.target.value);
                            if (isNaN(val)) val = 0;
                            if (val > 10) val = 10;
                            if (val < 0) val = 0;
                            handleItemChange(def.id, 'value', val);
                          }}
                          className="w-20 px-3 py-2 md:py-1.5 border border-slate-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                        />
                        <span className="text-sm text-slate-500 mr-2 md:mr-0">/ 10</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                {def.type === 'text' ? (
                  <textarea
                    value={item.value as string}
                    onChange={(e) => handleItemChange(def.id, 'value', e.target.value)}
                    placeholder="Nhập nội dung đề xuất..."
                    className="w-full px-4 py-3 md:py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y min-h-[100px]"
                  />
                ) : (
                  <textarea
                    value={item.notes}
                    onChange={(e) => handleItemChange(def.id, 'notes', e.target.value)}
                    placeholder="Thông tin chi tiết / Ghi chú (nếu có)..."
                    className="w-full px-4 py-3 md:py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y min-h-[80px] md:min-h-[60px]"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
