'use client';

import * as React from 'react';
import AdmitOneTicket from '@/components/ui/admit-one-ticket';

export function HoverBusinessCard() {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateWidth = () => setWidth(Math.round(stage.getBoundingClientRect().width));
    const observer = new ResizeObserver(updateWidth);

    updateWidth();
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={stageRef} className="business-card-stage">
      {width > 0 ? (
        <div role="img" aria-label="Vercim digital business card">
          <AdmitOneTicket
            name="Vercim"
            presenter="Vercim Creative"
            event="Creative developer"
            venue="Teathh / Kinotea"
            dates="Digital works"
            stubText="Profile"
            watermark="2026"
            width={width}
            tilt={{ maxTilt: 9, scale: 1.02, glare: 0.16 }}
          />
        </div>
      ) : (
        <div className="business-card-stage__placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
