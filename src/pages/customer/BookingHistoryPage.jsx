import { useState, useEffect, useCallback } from "react";

// ─── Mock Data (inline for preview) ─────────────────────────────────────────
const MOCK_BOOKINGS = [
  {
    bookingId: "BK-20250101",
    vehiclePlate: "51A-12345",
    serviceName: "Rửa xe cao cấp Premium",
    scheduledTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    status: "Pending",
    baseAmount: 250000, tierDiscount: 25000, promotionDiscount: 0, rewardDiscount: 0,
    finalAmount: 225000, pointsEarned: 22, pointsRefunded: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    bookingId: "BK-20250102",
    vehiclePlate: "51B-67890",
    serviceName: "Bảo dưỡng định kỳ 5000km",
    scheduledTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 phút → ẩn nút hủy
    status: "Pending",
    baseAmount: 850000, tierDiscount: 85000, promotionDiscount: 50000, rewardDiscount: 0,
    finalAmount: 715000, pointsEarned: 71, pointsRefunded: 0,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    bookingId: "BK-20250098",
    vehiclePlate: "51A-12345",
    serviceName: "Đánh bóng sơn Ceramic Coating",
    scheduledTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Completed",
    baseAmount: 1500000, tierDiscount: 150000, promotionDiscount: 0, rewardDiscount: 100000,
    finalAmount: 1250000, pointsEarned: 125, pointsRefunded: 0,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    bookingId: "BK-20250090",
    vehiclePlate: "51C-11111",
    serviceName: "Rửa xe tiêu chuẩn",
    scheduledTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Cancelled",
    baseAmount: 120000, tierDiscount: 0, promotionDiscount: 0, rewardDiscount: 0,
    finalAmount: 120000, pointsEarned: 0, pointsRefunded: 12,
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    bookingId: "BK-20250085",
    vehiclePlate: "51B-67890",
    serviceName: "Bảo dưỡng toàn diện",
    scheduledTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Failed",
    baseAmount: 2200000, tierDiscount: 220000, promotionDiscount: 0, rewardDiscount: 0,
    finalAmount: 1980000, pointsEarned: 0, pointsRefunded: 0,
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    bookingId: "BK-20250080",
    vehiclePlate: "51A-12345",
    serviceName: "Rửa xe + Hút bụi nội thất",
    scheduledTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: "No-show",
    baseAmount: 180000, tierDiscount: 18000, promotionDiscount: 0, rewardDiscount: 0,
    finalAmount: 162000, pointsEarned: 0, pointsRefunded: 0,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));

async function getMyBookings({ status = "all", page = 1, pageSize = 5 } = {}) {
  await delay();
  const filtered = status === "all" ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter(b => b.status === status);
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  return { data: filtered.slice(start, start + pageSize), pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
}

async function cancelBooking(id) {
  await delay(900);
  const b = MOCK_BOOKINGS.find(x => x.bookingId === id);
  if (!b) throw new Error("NOT_FOUND");
  const pts = Math.floor(b.finalAmount / 10000);
  b.status = "Cancelled";
  b.pointsRefunded = pts;
  return { bookingId: id, status: "Cancelled", pointsRefunded: pts };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtVND(n) { return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n); }
function fmtDT(iso) { return new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
function fmtDTFull(iso) { return new Date(iso).toLocaleString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
function canCancel(b) { return b.status === "Pending" && (new Date(b.scheduledTime) - new Date()) >= 2 * 60 * 60 * 1000; }

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  Pending:   { label: "Chờ xác nhận", bg: "#2D2500", color: "#FFD04A", border: "#5C4A00" },
  Completed: { label: "Hoàn thành",   bg: "#0A2D1A", color: "#4AE082", border: "#0F5C31" },
  Cancelled: { label: "Đã hủy",       bg: "#1C1C1C", color: "#A0A0A0", border: "#3A3A3A" },
  Failed:    { label: "Thất bại",      bg: "#2D0A0A", color: "#FF5C5C", border: "#5C1A1A" },
  "No-show": { label: "Vắng mặt",     bg: "#2D1500", color: "#FF8C42", border: "#5C2E00" },
};
function Badge({ status, sm }) {
  const c = STATUS_CFG[status] || STATUS_CFG.Cancelled;
  return <span style={{ display:"inline-block", fontSize: sm?"11px":"12px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:"0.04em", padding: sm?"2px 8px":"3px 10px", borderRadius:"100px", background:c.bg, color:c.color, border:`1px solid ${c.border}`, whiteSpace:"nowrap" }}>{c.label}</span>;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, visible, hide }) {
  useEffect(() => { if (visible) { const t = setTimeout(hide, 4000); return () => clearTimeout(t); } }, [visible]);
  return (
    <div style={{ position:"fixed", bottom:"28px", left:"50%", transform:`translateX(-50%) translateY(${visible?"0":"80px"})`, opacity:visible?1:0, transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)", background:"linear-gradient(135deg,#0D2A2A,#082020)", border:"1px solid rgba(0,220,220,0.4)", borderRadius:"12px", padding:"14px 22px", display:"flex", alignItems:"center", gap:"12px", boxShadow:"0 8px 32px rgba(0,220,220,0.15)", zIndex:2000, pointerEvents:visible?"auto":"none", maxWidth:"420px" }}>
      <span style={{ fontSize:"20px" }}>✅</span>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"14px", color:"rgba(255,255,255,0.9)", margin:0, lineHeight:1.4 }}>{msg}</p>
    </div>
  );
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ bk, onClose, onCancel }) {
  if (!bk) return null;
  const showCancel = canCancel(bk);
  const IRow = ({ label, amt, disc, final }) => (
    <div style={{ display:"flex", justifyContent:"space-between", padding: final?"10px 0 0":"6px 0", borderTop: final?"1px solid rgba(255,255,255,0.1)":undefined, marginTop: final?"4px":0 }}>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize: final?"14px":"13px", color: final?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.5)", fontWeight: final?600:400 }}>{label}</span>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize: final?"16px":"13px", fontWeight: final?700:500, color: final?"#00DCDC": disc?"#4AE082":"rgba(255,255,255,0.75)" }}>{disc&&amt>0?`−${fmtVND(amt)}`:fmtVND(amt)}</span>
    </div>
  );
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, backdropFilter:"blur(8px)", padding:"16px" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"480px", maxWidth:"100%", maxHeight:"90vh", overflowY:"auto", background:"linear-gradient(160deg,#0C1A1F,#08121A)", border:"1px solid rgba(0,220,220,0.2)", borderRadius:"20px", padding:"28px", boxShadow:"0 0 60px rgba(0,220,220,0.08)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"22px" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"20px", fontWeight:700, color:"#00DCDC", letterSpacing:"0.06em" }}>{bk.vehiclePlate}</span>
              <Badge status={bk.status} />
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"15px", color:"rgba(255,255,255,0.8)", margin:"0 0 4px", fontWeight:500 }}>{bk.serviceName}</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"rgba(255,255,255,0.35)", margin:0 }}>#{bk.bookingId}</p>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", color:"rgba(255,255,255,0.6)", width:"32px", height:"32px", cursor:"pointer", fontSize:"16px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✕</button>
        </div>
        <div style={{ background:"rgba(0,220,220,0.05)", border:"1px solid rgba(0,220,220,0.15)", borderRadius:"10px", padding:"12px 16px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"18px" }}>📅</span>
          <div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", color:"rgba(255,255,255,0.4)", margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.08em" }}>Giờ hẹn</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"14px", color:"#00DCDC", margin:0, fontWeight:500 }}>{fmtDTFull(bk.scheduledTime)}</p>
          </div>
        </div>
        <div style={{ marginBottom:"20px" }}>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"12px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 12px" }}>Chi tiết hóa đơn</p>
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"10px", padding:"14px 16px" }}>
            <IRow label="Giá dịch vụ" amt={bk.baseAmount} />
            {bk.tierDiscount > 0 && <IRow label="Giảm hạng thành viên" amt={bk.tierDiscount} disc />}
            {bk.promotionDiscount > 0 && <IRow label="Mã khuyến mãi" amt={bk.promotionDiscount} disc />}
            {bk.rewardDiscount > 0 && <IRow label="Đổi điểm thưởng" amt={bk.rewardDiscount} disc />}
            <IRow label="Thành tiền" amt={bk.finalAmount} final />
          </div>
        </div>
        <div style={{ background:"rgba(255,208,74,0.05)", border:"1px solid rgba(255,208,74,0.15)", borderRadius:"10px", padding:"12px 16px", marginBottom:"22px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ fontSize:"16px" }}>⭐</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"rgba(255,255,255,0.6)" }}>{bk.status==="Cancelled"?"Điểm được hoàn trả":"Điểm tích lũy"}</span>
          </div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"16px", fontWeight:700, color:"#FFD04A" }}>
            {bk.status==="Cancelled" ? `+${bk.pointsRefunded} pts` : bk.pointsEarned>0 ? `+${bk.pointsEarned} pts` : "—"}
          </span>
        </div>
        {showCancel && (
          <button onClick={() => { onClose(); onCancel(bk); }} style={{ width:"100%", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600, color:"#FF5C5C", background:"rgba(255,92,92,0.08)", border:"1px solid rgba(255,92,92,0.3)", borderRadius:"10px", padding:"13px", cursor:"pointer" }}>
            Hủy lịch hẹn này
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Cancel Dialog ─────────────────────────────────────────────────────────────
function CancelDialog({ bk, onConfirm, onClose, loading }) {
  if (!bk) return null;
  const pts = Math.floor(bk.finalAmount / 10000);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, backdropFilter:"blur(6px)", padding:"16px" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"420px", maxWidth:"100%", background:"linear-gradient(135deg,#0D1A1A,#0A1212)", border:"1px solid rgba(255,92,92,0.35)", borderRadius:"18px", padding:"28px", boxShadow:"0 0 40px rgba(255,92,92,0.12)" }}>
        <div style={{ width:"44px", height:"44px", borderRadius:"50%", background:"rgba(255,92,92,0.12)", border:"1px solid rgba(255,92,92,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", marginBottom:"14px" }}>⚠️</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"18px", fontWeight:700, color:"#fff", margin:"0 0 6px" }}>Xác nhận hủy lịch hẹn</h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"rgba(255,255,255,0.5)", margin:"0 0 20px" }}>Hành động này không thể hoàn tác sau khi xác nhận.</p>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"10px", padding:"14px 16px", marginBottom:"14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"14px", fontWeight:700, color:"#00DCDC", letterSpacing:"0.05em" }}>{bk.vehiclePlate}</span>
            <Badge status="Pending" sm />
          </div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"rgba(255,255,255,0.7)", margin:"0 0 4px" }}>{bk.serviceName}</p>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"rgba(255,255,255,0.4)", margin:0 }}>#{bk.bookingId}</p>
        </div>
        {pts > 0 && (
          <div style={{ background:"rgba(0,220,220,0.06)", border:"1px solid rgba(0,220,220,0.2)", borderRadius:"10px", padding:"12px 16px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ fontSize:"18px" }}>💎</span>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"#00DCDC", margin:0 }}>Khi hủy, bạn sẽ nhận lại khoảng <strong>{pts} điểm</strong> Loyalty.</p>
          </div>
        )}
        <div style={{ display:"flex", gap:"10px" }}>
          <button onClick={onClose} disabled={loading} style={{ flex:1, fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600, color:"rgba(255,255,255,0.6)", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"10px", padding:"12px", cursor:"pointer" }}>Giữ lịch</button>
          <button onClick={() => onConfirm(bk.bookingId)} disabled={loading} style={{ flex:1, fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600, color:"#fff", background: loading?"rgba(255,92,92,0.3)":"rgba(255,92,92,0.85)", border:"1px solid rgba(255,92,92,0.5)", borderRadius:"10px", padding:"12px", cursor: loading?"not-allowed":"pointer" }}>
            {loading ? "Đang hủy..." : "Xác nhận hủy"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Booking Card ──────────────────────────────────────────────────────────────
function Card({ bk, onDetail, onCancel }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={() => onDetail(bk)} style={{ background: hov?"rgba(255,255,255,0.055)":"rgba(255,255,255,0.03)", border:`1px solid ${hov?"rgba(0,220,220,0.35)":"rgba(0,220,220,0.12)"}`, borderRadius:"14px", padding:"18px 22px", cursor:"pointer", transition:"all 0.2s" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"10px" }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"15px", fontWeight:700, color:"#00DCDC", background:"rgba(0,220,220,0.08)", border:"1px solid rgba(0,220,220,0.25)", borderRadius:"6px", padding:"2px 9px", letterSpacing:"0.06em" }}>{bk.vehiclePlate}</span>
            <Badge status={bk.status} />
          </div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"14px", color:"rgba(255,255,255,0.75)", margin:"6px 0 0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{bk.serviceName}</p>
        </div>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"16px", fontWeight:700, color:"#fff", marginLeft:"16px", flexShrink:0 }}>{fmtVND(bk.finalAmount)}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:"16px" }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"rgba(255,255,255,0.45)" }}>🕐 {fmtDT(bk.scheduledTime)}</span>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"rgba(255,255,255,0.3)" }}>#{bk.bookingId}</span>
        </div>
        {canCancel(bk) && (
          <button onClick={e=>{e.stopPropagation();onCancel(bk);}} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", fontWeight:600, color:"#FF5C5C", background:"rgba(255,92,92,0.08)", border:"1px solid rgba(255,92,92,0.3)", borderRadius:"8px", padding:"4px 12px", cursor:"pointer" }}>
            Hủy lịch
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Filter Tabs ───────────────────────────────────────────────────────────────
const TABS = [
  { key:"all", label:"Tất cả" },
  { key:"Pending", label:"Chờ xác nhận" },
  { key:"Completed", label:"Hoàn thành" },
  { key:"Cancelled", label:"Đã hủy" },
  { key:"Failed", label:"Thất bại" },
  { key:"No-show", label:"Vắng mặt" },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function BookingHistoryPage() {
  const [filter, setFilter]       = useState("all");
  const [bookings, setBookings]   = useState([]);
  const [pagi, setPagi]           = useState({ page:1, totalPages:1, total:0 });
  const [loading, setLoading]     = useState(false);
  const [detail, setDetail]       = useState(null);
  const [cancelBk, setCancelBk]   = useState(null);
  const [cancelLoad, setCancelLoad] = useState(false);
  const [toast, setToast]         = useState({ visible:false, msg:"" });

  const fetch_ = useCallback(async (f = filter, p = 1) => {
    setLoading(true);
    try {
      const r = await getMyBookings({ status: f, page: p, pageSize: 5 });
      setBookings(r.data); setPagi(r.pagination);
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetch_(filter, 1); }, [filter]);

  async function doCancel(id) {
    setCancelLoad(true);
    try {
      const r = await cancelBooking(id);
      setCancelBk(null);
      setToast({ visible:true, msg: r.pointsRefunded>0 ? `Hủy thành công. ${r.pointsRefunded} điểm đã được hoàn trả vào tài khoản.` : "Hủy lịch hẹn thành công." });
      fetch_(filter, pagi.page);
    } catch { setCancelBk(null); setToast({ visible:true, msg:"Có lỗi xảy ra. Vui lòng thử lại." }); }
    finally { setCancelLoad(false); }
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#050F14 0%,#030C11 50%,#050F14 100%)", padding:"40px 24px", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap'); @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ position:"fixed", top:"-200px", right:"-200px", width:"600px", height:"600px", background:"radial-gradient(circle,rgba(0,220,220,0.04),transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ maxWidth:"680px", margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Header */}
        <div style={{ marginBottom:"32px" }}>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"28px", fontWeight:800, color:"#fff", margin:"0 0 6px", letterSpacing:"-0.02em" }}>Lịch sử đặt lịch</h1>
          <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.4)", margin:0 }}>{pagi.total} lượt đặt hẹn</p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"24px", padding:"6px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"12px" }}>
          {TABS.map(t => {
            const a = filter === t.key;
            return <button key={t.key} onClick={() => setFilter(t.key)} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight: a?600:400, color: a?"#00DCDC":"rgba(255,255,255,0.5)", background: a?"rgba(0,220,220,0.1)":"transparent", border: a?"1px solid rgba(0,220,220,0.25)":"1px solid transparent", borderRadius:"8px", padding:"6px 14px", cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap" }}>{t.label}</button>;
          })}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ display:"inline-block", width:"28px", height:"28px", border:"2px solid rgba(0,220,220,0.15)", borderTopColor:"#00DCDC", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 24px", color:"rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize:"48px", marginBottom:"16px", opacity:0.4 }}>📋</div>
            <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"16px", fontWeight:600, margin:"0 0 8px" }}>Không có lịch hẹn nào</p>
            <p style={{ fontSize:"13px", margin:0, color:"rgba(255,255,255,0.25)" }}>{filter!=="all"?"Thử chọn bộ lọc khác":"Bạn chưa có lịch hẹn nào"}</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            {bookings.map(bk => <Card key={bk.bookingId} bk={bk} onDetail={setDetail} onCancel={setCancelBk} />)}
          </div>
        )}

        {/* Pagination */}
        {pagi.totalPages > 1 && !loading && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginTop:"28px" }}>
            <button disabled={pagi.page===1} onClick={() => fetch_(filter, pagi.page-1)} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color: pagi.page===1?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.6)", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", padding:"7px 14px", cursor: pagi.page===1?"default":"pointer" }}>← Trước</button>
            <span style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)" }}>{pagi.page} / {pagi.totalPages}</span>
            <button disabled={pagi.page>=pagi.totalPages} onClick={() => fetch_(filter, pagi.page+1)} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color: pagi.page>=pagi.totalPages?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.6)", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", padding:"7px 14px", cursor: pagi.page>=pagi.totalPages?"default":"pointer" }}>Tiếp →</button>
          </div>
        )}
      </div>

      {detail && <DetailModal bk={detail} onClose={() => setDetail(null)} onCancel={bk => { setDetail(null); setCancelBk(bk); }} />}
      {cancelBk && <CancelDialog bk={cancelBk} onConfirm={doCancel} onClose={() => setCancelBk(null)} loading={cancelLoad} />}
      <Toast msg={toast.msg} visible={toast.visible} hide={() => setToast(t => ({...t, visible:false}))} />
    </div>
  );
}
