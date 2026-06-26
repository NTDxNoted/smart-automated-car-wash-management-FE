import { useState, useEffect, useCallback } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { useLanguage } from '../../context/LanguageContext';
import AddVehicleModal from './AddVehicleModal';

/**
 * VehicleList — Tab "Xe của tôi" trong ProfilePage
 * BR-08: Không giới hạn số xe
 */
export default function VehicleList() {
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', vehicle }
  const [deleteConfirm, setDeleteConfirm] = useState(null); // null | vehicleId
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch {
      showToast('error', t('vehicleLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const handleModalSuccess = (vehicle) => {
    setModal(null);
    fetchVehicles();
    const msg = modal?.mode === 'edit' ? t('vehicleUpdateSuccess') : t('vehicleAddSuccess');
    showToast('success', msg);
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await vehicleService.deleteVehicle(id);
      setDeleteConfirm(null);
      fetchVehicles();
      showToast('success', t('vehicleDeleteSuccess'));
    } catch (err) {
      const msg = err?.response?.data?.message ?? t('vehicleDeleteFailed');
      showToast('error', msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div
          className={`
            fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl
            border text-sm font-medium shadow-xl transition-all duration-300
            ${toast.type === 'success'
              ? 'bg-cyan-950/90 border-cyan-500/30 text-cyan-300'
              : 'bg-red-950/90 border-red-500/30 text-red-300'
            }
          `}
          style={{ fontFamily: "'Be Vietnam Pro', sans-serif", backdropFilter: 'blur(8px)' }}
        >
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.msg}
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          {t('profileVehiclesCount').replace('{count}', vehicles.length)}
        </p>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-95"
          style={{
            fontFamily: "'Archivo', sans-serif",
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            boxShadow: '0 0 14px rgba(6,182,212,0.3)',
          }}
        >
          <span className="text-lg leading-none">+</span>
          {t('btnAddVehicle')}
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-20 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && vehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <span className="text-4xl opacity-20">🚗</span>
          <p className="text-slate-500 text-sm" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            {t('profileNoVehicles')}
          </p>
        </div>
      )}

      {/* Vehicle cards */}
      {!loading && vehicles.map(v => (
        <div
          key={v.id}
          className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-4 transition-all duration-200 hover:border-slate-300"
          style={{ background: '#ffffff', marginBottom: '5px' }}
        >
          <div className="space-y-0.5">
            <p
              className="text-slate-800 font-bold tracking-widest text-base"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              {v.licensePlate}
            </p>
            {v.model && v.model !== 'Chưa cập nhật' && v.model !== 'Not updated' && v.model !== t('vehicleModelPlaceholder') && (
              <p className="text-slate-500 text-xs" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                {v.model}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Edit */}
            <button
              onClick={() => setModal({ mode: 'edit', vehicle: v })}
              className="p-2 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-all duration-200"
              title={t('btnEditPlate')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.586 2a2 2 0 012.828 2.828l-7.9 7.9-3.414.586.586-3.414 7.9-7.9z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* Delete */}
            <button
              onClick={() => setDeleteConfirm(v.id)}
              className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              title={t('btnDeleteVehicle')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {/* Add / Edit Modal */}
      {modal && (
        <AddVehicleModal
          mode={modal.mode}
          vehicle={modal.vehicle ?? null}
          onSuccess={handleModalSuccess}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-200 p-6 space-y-5"
            style={{
              background: '#ffffff',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="space-y-1">
              <h3
                className="text-base font-bold text-slate-800"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                {t('confirmDeleteVehicle')}
              </h3>
              <p className="text-sm text-slate-500" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                {t('confirmDeleteVehicleWarning')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-600 text-sm hover:border-slate-400 hover:text-slate-800 transition-all duration-200"
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: '0 0 14px rgba(239,68,68,0.25)',
                }}
              >
                {deleting ? t('btnDeletingVehicle') : t('btnDeleteVehicle')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

