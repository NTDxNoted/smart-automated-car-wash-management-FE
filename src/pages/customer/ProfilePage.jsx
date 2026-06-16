import { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import TierBadge from '../../components/profile/TierBadge';
import TierProgressBar from '../../components/profile/TierProgressBar';
import VehicleList from '../../components/profile/VehicleList';

export default function ProfilePage() {
  const { auth, setAuth } = useAuth();
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { key: 'info', label: t('profileTabInfo') },
    { key: 'vehicles', label: t('profileTabVehicles') },
  ];

  const formatVND = (amount) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // Profile state
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Edit fullName
  const [editMode, setEditMode] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Fetch profile ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoadingProfile(true);
        const data = await profileService.getProfile();
        setProfile(data);
        setNameInput(data.fullName);
      } catch {
        // Có thể thêm toast lỗi nếu cần
      } finally {
        setLoadingProfile(false);
      }
    };
    fetch();
  }, []);

  // ── Lưu fullName ────────────────────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      setSaveError(t('profileNameRequired'));
      return;
    }
    if (nameInput.trim() === profile.fullName) {
      setEditMode(false);
      return;
    }
    setSaveError('');
    try {
      setSaving(true);
      const result = await profileService.updateProfile({ fullName: nameInput.trim() });
      // Cập nhật local profile state
      setProfile(prev => ({ ...prev, fullName: result.fullName }));
      // Cập nhật AuthContext để header/nav hiển thị đúng tên mới
      setAuth({ ...auth, fullName: result.fullName });
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError(t('profileUpdateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setNameInput(profile?.fullName ?? '');
    setSaveError('');
    setEditMode(false);
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="space-y-3 w-full max-w-md px-6">
          {[80, 120, 60, 100].map((h, i) => (
            <div key={i} className="rounded-xl bg-slate-200 animate-pulse" style={{ height: h }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(6,182,212,0.1) 0%, transparent 70%), #f8fafc',
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* 💡 1. HỘP ĐỆM TÀNG HÌNH: Giúp đẩy toàn bộ nội dung xuống dưới gầm Navbar */}
      <div className="h-16 w-full block shrink-0" aria-hidden="true"></div>

      {/* ── TOP: Profile card ── */}
      {/* 💡 2. SỬA CHÍNH XÁC DÒNG NÀY: 
          - Đổi max-w-2xl thành max-w-5xl để box bự ra rõ rệt.
          - w-full và px-6 giúp nó co giãn tốt theo chiều ngang.
          - flex-grow và py-8 giúp box kéo dài không gian theo chiều dọc thoải mái. */}
      <div className="w-full max-w-4xl mx-auto h-auto px-6 py-8 space-y-6">

        {/* Profile hero */}
        <div
          className="rounded-2xl border border-slate-200 p-6 space-y-5"
          style={{
            background: '#ffffff',
            boxShadow: '0 0 40px rgba(6,182,212,0.06)',
          }}
        >
          {/* Avatar + Name + Tier */}
          <div className="flex items-start gap-5">
            {/* Avatar initials */}
            <div
              className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-cyan-300"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))',
                border: '1px solid rgba(6,182,212,0.2)',
                fontFamily: "'Archivo', sans-serif",
              }}
            >
              {profile?.fullName?.charAt(0)?.toUpperCase() ?? '?'}
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              {/* Tier badge */}
              <TierBadge tier={profile?.tier} size="sm" />

              {/* Name row */}
              {!editMode ? (
                <div className="flex items-center gap-2">
                  <h1
                    className="text-xl font-bold text-slate-800 truncate"
                    style={{ fontFamily: "'Archivo', sans-serif" }}
                  >
                    {profile?.fullName}
                  </h1>
                  <button
                    onClick={() => { setEditMode(true); setSaveError(''); }}
                    className="text-slate-500 hover:text-cyan-400 transition-colors flex-shrink-0"
                    title={t('profileEditName')}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M11.586 2a2 2 0 012.828 2.828l-7.9 7.9-3.414.586.586-3.414 7.9-7.9z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => { setNameInput(e.target.value); setSaveError(''); }}
                      className="flex-1 bg-white border border-cyan-500 rounded-lg px-3 py-1.5 text-slate-800 text-sm focus:outline-none focus:border-cyan-600 transition-all"
                      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') handleCancelEdit(); }}
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={saving}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50 transition-all"
                      style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', fontFamily: "'Archivo', sans-serif" }}
                    >
                      {saving ? '...' : t('btnSave')}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-600 border border-slate-300 hover:text-slate-800 transition-all"
                    >
                      {t('btnCancel')}
                    </button>
                  </div>
                  {saveError && (
                    <p className="text-red-400 text-xs">{saveError}</p>
                  )}
                </div>
              )}

              {/* SĐT readonly */}
              <p className="text-slate-400 text-sm">{profile?.phone}</p>

              {/* Save success toast inline */}
              {saveSuccess && (
                <p className="text-cyan-600 text-xs">{t('profileUpdateSuccess')}</p>
              )}
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-xl border border-slate-200 p-4 space-y-1"
              style={{ background: '#ffffff' }}
            >
              <p className="text-xs text-slate-500 uppercase tracking-widest" style={{ fontFamily: "'Archivo', sans-serif" }}>
                {t('profileTotalSpending')}
              </p>
              <p className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Archivo', sans-serif" }}>
                {formatVND(profile?.totalSpending)}
              </p>
            </div>
            <div
              className="rounded-xl border border-slate-200 px-4 py-6 space-y-1"
              style={{ background: '#ffffff' }}
            >
              <p className="text-xs text-slate-500 uppercase tracking-widest" style={{ fontFamily: "'Archivo', sans-serif" }}>
                {t('profilePoints')}
              </p>
              <p className="text-lg font-bold text-cyan-600" style={{ fontFamily: "'Archivo', sans-serif" }}>
                {profile?.loyaltyPoints?.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN')} {t('loyaltyPoints')}
              </p>
            </div>
          </div>

          {/* ── Tier progress bar ── */}
          <TierProgressBar tier={profile?.tier} totalSpending={profile?.totalSpending} />
        </div>

        {/* ── TAB BAR ── */}
        <div
          className="flex h-12 rounded-xl border border-slate-200 overflow-hidden"
          style={{ background: '#ffffff' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-1 py-3 text-sm font-semibold transition-all duration-200
                ${activeTab === tab.key
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-slate-500 border-b-2 border-transparent hover:text-slate-700'
                }
              `}
              style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '0.05em' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <div
          className="rounded-2xl border border-slate-200 px-6 py-9"
          style={{
            background: '#ffffff',
          }}
        >
          {activeTab === 'info' && (
            <div className="space-y-4">
              <h2
                className="text-sm uppercase tracking-widest text-slate-500"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                {t('profileAccountInfo')}
              </h2>
              <div className="space-y-3">
                {[
                  { label: t('profileCustomerId'), value: profile?.customerId },
                  { label: t('profileFullName'), value: profile?.fullName },
                  { label: t('profilePhone'), value: profile?.phone, note: t('profilePhoneNote') },
                  { label: t('profileTier'), value: profile?.tier },
                ].map(row => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center py-3 border-b border-slate-200 last:border-0"
                  >
                    <span className="text-sm text-slate-500">{row.label}</span>
                    <div className="text-right">
                      <span className="text-sm text-slate-800 font-medium" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                        {row.value}
                      </span>
                      {row.note && (
                        <p className="text-xs text-slate-500">{row.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && <VehicleList />}
        </div>
      </div>
    </div>
  );
}

