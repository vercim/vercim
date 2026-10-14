'use client';

import * as React from 'react';
import AdmitOneTicket from '@/components/ui/admit-one-ticket';

// Today's date as DD.MM in the visitor's local time
function formatTicketDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
}

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
        <div
          className="business-card-stage__ticket"
          role="img"
          aria-label="Vercim digital business card"
        >
          <AdmitOneTicket
            name="Vercim"
            presenter="696e646570656e64656e74"
            event="Designing Things"
            venue="Pass"
            dates={formatTicketDate(new Date())}
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
