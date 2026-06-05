import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
        
        {/* Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

        <div className="max-w-4xl text-center space-y-8 relative z-10">
          <span className="inline-block text-xs font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">
            Hệ thống quản lý thông minh thế hệ mới
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Chăm Sóc Xế Yêu <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Chưa Bao Giờ Dễ Dàng Đến Thế
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Rửa xe tự động công nghệ cao, tích hợp đặt lịch trực tuyến, theo dõi tiến độ thời gian thực và chương trình tích điểm thành viên hấp dẫn.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/booking"
              className="px-8 py-4 rounded-full bg-cyan-400 text-slate-900 font-bold hover:bg-cyan-300 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:-translate-y-0.5 transition-all duration-200"
            >
              Đặt lịch ngay
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-full border border-white/10 hover:border-cyan-400 hover:text-cyan-400 bg-white/[0.02] transition-all"
            >
              Đăng ký thành viên
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Info Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Tự động & Nhanh chóng', desc: 'Quy trình chuẩn hóa tự động hoàn thành trong 15-20 phút.', icon: '⚡' },
            { title: 'Đặt lịch thông minh', desc: 'Chọn khung giờ trống tiện lợi, không lo chờ đợi xếp hàng.', icon: '📅' },
            { title: 'Tích điểm nâng hạng', desc: 'Nhận ưu đãi giảm giá tự động theo từng hạng thẻ Member.', icon: '👑' },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#111827] border border-white/5 p-8 rounded-2xl hover:border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-300">
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
