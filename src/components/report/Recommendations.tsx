interface Props {
  raccomandazioni: string[];
}

export function Recommendations({ raccomandazioni }: Props) {
  if (raccomandazioni.length === 0) return null;

  return (
    <div>
      <h2 className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-4">
        Raccomandazioni
      </h2>
      <div className="space-y-4">
        {raccomandazioni.slice(0, 3).map((racc, i) => (
          <div key={i} className="flex gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFF3E0] text-[#E65100] text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <p className="text-sm text-foreground leading-relaxed">
              <FormattedText text={racc} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
      )}
    </>
  );
}
