'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ReferralPopup } from "./ReferralPopup";

interface AmbassadorData {
  ambassadorName: string;
  discount: number;
  refCode: string;
}

function ReferralWatcher() {
  const searchParams = useSearchParams();
  const [popupData, setPopupData] = useState<AmbassadorData | null>(null);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;

    if (sessionStorage.getItem(`edumind_ref_seen_${ref}`)) return;

    fetch(`/api/referral/validate?code=${encodeURIComponent(ref)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          localStorage.setItem("edumind_ref", data.refCode);
          sessionStorage.setItem(`edumind_ref_seen_${data.refCode}`, "1");
          setPopupData({
            ambassadorName: data.ambassadorName,
            discount: data.discount,
            refCode: data.refCode,
          });
        }
      })
      .catch(() => {});
  }, [searchParams]);

  if (!popupData) return null;

  return (
    <ReferralPopup
      refCode={popupData.refCode}
      ambassadorName={popupData.ambassadorName}
      discount={popupData.discount}
      onClose={() => setPopupData(null)}
    />
  );
}

export function ReferralProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <ReferralWatcher />
      </Suspense>
      {children}
    </>
  );
}
