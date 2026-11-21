export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 style={{ margin: 0, fontSize: '1.6rem' }}>{title}</h2>
      {subtitle && <p className="meta">{subtitle}</p>}
    </div>
  );
}

