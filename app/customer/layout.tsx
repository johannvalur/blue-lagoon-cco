import { Nav } from "@/components/Nav";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-6 pt-4">
        {children}
      </main>
    </>
  );
}
