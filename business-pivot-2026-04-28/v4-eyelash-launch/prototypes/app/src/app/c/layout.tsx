import { CustomerBottomNav } from "@/components/common/CustomerBottomNav";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-customer">
      <div className="mx-auto max-w-md min-h-screen pb-24">{children}</div>
      <CustomerBottomNav />
    </div>
  );
}
