import SideNavigation from "@/app/_components/SideNavigation";

export default function RootLayout({ children }) {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-full gap-12">
      <SideNavigation />
      <div>{children}</div>
    </div>
  );
}
