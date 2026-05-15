import { Nav } from "@/components/Nav";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-6">{children}</main>
    </>
  );
}
