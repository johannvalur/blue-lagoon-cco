"use client";

export interface SagaPreviewProps {
  reason: string;
  destination: string;
  iata?: string;
  depart: string;
  return_: string;
  fareEUR: number;
  fareClass?: string;
}

export function SagaPreview({ reason, destination, iata, depart, return_, fareEUR, fareClass = "Saga" }: SagaPreviewProps) {
  return (
    <div className="surface-card rounded-2xl p-6 border-l-4 border-l-bluelagoon-lilac">
      <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-lilac">Saga Club · personalised</p>
      <h3 className="mt-2 font-loft text-2xl font-bold text-bluelagoon-midnight">{destination}</h3>
      {iata && <div className="text-xs text-bluelagoon-muted">{iata} · companion fare for {fareClass}</div>}
      <div className="mt-4 font-loft text-3xl font-extrabold text-bluelagoon-midnight">from €{fareEUR.toLocaleString()}</div>
      <div className="text-xs text-bluelagoon-muted">{depart} → {return_}</div>
      <p className="mt-4 italic text-sm text-bluelagoon-ink/85">{reason}</p>
      <button type="button" className="btn-primary mt-5 rounded-xl px-4 py-2 text-sm font-semibold">Hold this</button>
    </div>
  );
}
