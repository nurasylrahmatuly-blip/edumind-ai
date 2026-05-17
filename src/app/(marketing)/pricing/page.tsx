import type { Metadata } from "next";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Тарифы",
  description: "Выберите подходящий план. Бесплатно · Student Pro · Academic+",
};

export default function PricingPage() {
  return <PricingClient />;
}
