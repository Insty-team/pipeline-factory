import { OwnerBottomNav } from "@/components/common/OwnerBottomNav";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md min-h-screen pb-24">{children}</div>
      <OwnerBottomNav />
    </div>
  );
}
