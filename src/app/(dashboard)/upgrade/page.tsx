import type { Metadata } from "next";
import { UpgradeClient } from "./UpgradeClient";

export const metadata: Metadata = { title: "Оплата — EduMind AI" };

export default function UpgradePage() {
  return <UpgradeClient />;
}
