export const metadata = {
  title: "Kietle",
  description: "kiet lt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en">
    //   <body>{children}</body>
    // </html>
    <div>
    {/* Optionally include Header and Footer for login layout */}
    {/* <Header /> */}
    <main>{children}</main>
    {/* <Footer /> */}
  </div>
  );
}
