import RifaHeader from "@/components/layout/rifa-header";

export default async function RootLayoutClientFluxo({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <RifaHeader />
      {children}
    </>
  );
}
