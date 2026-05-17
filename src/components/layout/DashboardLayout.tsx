'use client';

import { DashboardSidebar } from './DashboardSidebar';
import { MobileHeader } from './MobileHeader';
import { useSidebar } from '@/hooks/useSidebar';

interface Props {
  children: React.ReactNode;
  userName?: string | null;
  userEmail?: string | null;
  plan?: string;
  usedToday?: number;
  dailyLimit?: number;
}

export function DashboardLayout({ children, userName, userEmail, plan, usedToday, dailyLimit }: Props) {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-void)', overflow: 'hidden' }}>
      {/* Mobile header — shown only on mobile via CSS */}
      <MobileHeader isOpen={isOpen} onToggle={toggle} userName={userName} userEmail={userEmail} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar overlay on mobile */}
        {isOpen && (
          <div
            className="sidebar-overlay"
            onClick={close}
            style={{ display: 'block' }}
          />
        )}

        <DashboardSidebar
          userName={userName}
          userEmail={userEmail}
          plan={plan}
          usedToday={usedToday}
          dailyLimit={dailyLimit}
          isOpen={isOpen}
        />

        <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
