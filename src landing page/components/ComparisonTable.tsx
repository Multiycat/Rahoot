export default function ComparisonTable() {
  const rows = [
    { capability: "Design Language", rahoot: "Modern & Editorial", legacy: "Gamified & Vibrant" },
    { capability: "Participant Limit", rahoot: "Unlimited (High Scale)", legacy: "Tier-Restricted" },
    { capability: "Analytics Deep Dive", rahoot: "AI-Driven Insights", legacy: "Basic CSV Export" },
    { capability: "Custom Branding", rahoot: "White-label Experience", legacy: "Limited Templates" },
  ];

  return (
    <section className="py-32 max-w-5xl mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-black mb-4">A Professional Choice.</h2>
        <p className="text-on-surface-variant">The distinction is clear in every pixel.</p>
      </div>
      <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/15">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high">
              <th className="p-8 font-headline text-xs uppercase tracking-widest opacity-50">Capability</th>
              <th className="p-8 font-headline font-black text-primary">Rahoot</th>
              <th className="p-8 font-headline text-xs uppercase tracking-widest opacity-50">Legacy Tools</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {rows.map((row) => (
              <tr key={row.capability}>
                <td className="p-8 text-sm font-medium">{row.capability}</td>
                <td className="p-8 text-sm">{row.rahoot}</td>
                <td className="p-8 text-sm text-on-surface-variant">{row.legacy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
