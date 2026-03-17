import React, { forwardRef } from 'react';
import { CHECKLIST_ITEMS, ReportData } from '../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ReportPreviewProps {
  data: ReportData;
}

export const ReportPreview = forwardRef<HTMLDivElement, ReportPreviewProps>(
  ({ data }, ref) => {
    let formattedDate = '';
    if (data.date) {
      const d = new Date(data.date);
      formattedDate = `${format(d, 'EEEE', { locale: vi })}, ngày ${format(d, 'dd')} tháng ${format(d, 'MM')} năm ${format(d, 'yyyy')}`;
    }

    // Calculate total score
    const totalScore = data.items
      .filter((item) => {
        const def = CHECKLIST_ITEMS.find((d) => d.id === item.id);
        return def?.type === 'score';
      })
      .reduce((sum, item) => sum + (item.value as number), 0);

    return (
      <div
        ref={ref}
        className="bg-white text-slate-900 w-[800px] mx-auto p-8 shadow-sm border border-slate-100"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-slate-800 pb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-900 mb-2">
            Báo Cáo Trải Nghiệm Khách Hàng
          </h1>
          <div className="text-lg font-medium text-slate-700">
            Cơ sở: <span className="font-bold text-slate-900">{data.location || '...'}</span>
          </div>
          <div className="text-sm text-slate-500 mt-1 italic">
            {formattedDate} - Người báo cáo: <span className="font-medium">{data.reporter || '...'}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-slate-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 text-sm uppercase tracking-wider">
                <th className="py-3 px-4 border-b border-slate-300 font-semibold w-12 text-center">STT</th>
                <th className="py-3 px-4 border-b border-slate-300 font-semibold w-1/3">Hạng mục / Yêu cầu</th>
                <th className="py-3 px-4 border-b border-slate-300 font-semibold w-24 text-center">Đánh giá</th>
                <th className="py-3 px-4 border-b border-slate-300 font-semibold">Thông tin chi tiết</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-200">
              {CHECKLIST_ITEMS.map((def, index) => {
                const item = data.items.find((i) => i.id === def.id);
                if (!item) return null;

                const isText = def.type === 'text';

                return (
                  <React.Fragment key={def.id}>
                    {/* Inject Total Score row before item 13 */}
                    {def.id === 13 && (
                      <tr className="bg-indigo-50/50 transition-colors">
                        <td className="py-3 px-4 text-center font-medium text-slate-500 align-top">
                          12
                        </td>
                        <td className="py-3 px-4 align-top">
                          <div className="font-bold text-slate-800 mb-1">Tổng điểm</div>
                        </td>
                        <td className="py-3 px-4 text-center align-top">
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-indigo-600 leading-none">
                              {totalScore}
                            </span>
                            <span className="text-xs text-slate-500 font-medium mt-1">/ 50</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 align-top"></td>
                      </tr>
                    )}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-center font-medium text-slate-500 align-top">
                        {def.id === 13 ? '13' : index + 1}
                      </td>
                      <td className="py-3 px-4 align-top" colSpan={isText ? 3 : 1}>
                        <div className="font-semibold text-slate-800 mb-1">{def.title}</div>
                        <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{def.req}</div>
                        {isText && (
                          <div className="mt-3 text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                            {item.value ? item.value : <span className="text-slate-400 italic">Không có đề xuất</span>}
                          </div>
                        )}
                      </td>
                      {!isText && (
                        <>
                          <td className="py-3 px-4 text-center align-top">
                            {def.type === 'check' ? (
                              item.value === true ? (
                                <div className="flex flex-col items-center text-emerald-600">
                                  <CheckCircle2 className="w-5 h-5 mb-1" />
                                  <span className="text-xs font-medium text-center">Thực hiện</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center text-rose-600">
                                  <XCircle className="w-5 h-5 mb-1" />
                                  <span className="text-xs font-medium text-center">Không TH</span>
                                </div>
                              )
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-indigo-600 leading-none">
                                  {item.value}
                                </span>
                                <span className="text-xs text-slate-500 font-medium mt-1">/ 10</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 align-top">
                            {item.notes ? (
                              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {item.notes}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-xs">Không có ghi chú</span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="mt-8 flex justify-between items-end text-sm text-slate-500">
          <div>
            <p>Báo cáo được tạo tự động từ ứng dụng.</p>
          </div>
          <div className="text-right">
            <p>Người lập báo cáo</p>
            <p className="mt-8 font-medium text-slate-800">
              {data.reporter ? data.reporter : '(Ký và ghi rõ họ tên)'}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

ReportPreview.displayName = 'ReportPreview';
