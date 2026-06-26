import React from 'react';
import MembershipTiers from '../../components/home/MembershipTiers';

export default function MembershipPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans py-12 px-4 sm:px-6 lg:px-8">
      {/* 💡 Spacer to push content below the navbar */}
      <div className="h-16 w-full block" aria-hidden="true"></div>

      <MembershipTiers />
    </div>
  );
}
