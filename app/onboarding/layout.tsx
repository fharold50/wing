export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="orb orb1" />
      <div className="orb orb2" />
      {children}
    </>
  );
}
