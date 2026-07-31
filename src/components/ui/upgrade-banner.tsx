'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface UpgradeBannerProps {
  buttonText: string;
  description: string;
  href: string;
  onClose?: () => void;
  className?: string;
}

function SettingsFilled({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      height="16"
      viewBox="0 0 16 16"
      width="16"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 0h-3L6.226 1.46a.498.498 0 0 1-.349.394 6.71 6.71 0 0 0-.722.3.5.5 0 0 1-.525-.033L3.404 1.282 1.282 3.404 2.121 4.63a.5.5 0 0 1 .033.526 6.72 6.72 0 0 0-.3.722.498.498 0 0 1-.394.348L0 6.5v3l1.46.274a.498.498 0 0 1 .394.348c.086.248.186.489.3.722a.5.5 0 0 1-.033.526l-.839 1.226 2.122 2.121 1.226-.839a.5.5 0 0 1 .526-.032c.233.113.474.213.722.299a.498.498 0 0 1 .348.394L6.5 16h3l.274-1.46a.498.498 0 0 1 .348-.394c.248-.086.489-.186.722-.3a.5.5 0 0 1 .526.033l1.226.839 2.121-2.122-.839-1.226a.5.5 0 0 1-.032-.526c.113-.233.213-.474.299-.722a.498.498 0 0 1 .394-.348L16 9.5v-3l-1.46-.274a.498.498 0 0 1-.394-.348 6.71 6.71 0 0 0-.3-.722.5.5 0 0 1 .033-.526l.839-1.226-2.122-2.122-1.226.839a.5.5 0 0 1-.526.033 6.72 6.72 0 0 0-.722-.3.498.498 0 0 1-.348-.394L9.5 0ZM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function UpgradeBanner({
  buttonText,
  description,
  href,
  onClose,
  className,
}: UpgradeBannerProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const iconVariants: Variants = {
    hidden: { x: 0, y: 0, opacity: 0, rotate: 0 },
    visible: (custom: { x: number; y: number }) => ({
      x: custom.x,
      y: custom.y,
      opacity: 1,
      rotate: 360,
      transition: {
        x: { duration: 0.3, ease: 'easeOut' },
        y: { duration: 0.3, ease: 'easeOut' },
        opacity: { duration: 0.3 },
        rotate: { duration: 1, type: 'spring', stiffness: 100, damping: 10 },
      },
    }),
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.4 }}
        >
        <motion.div
          initial="hidden"
          animate={isHovered ? 'visible' : 'hidden'}
          variants={iconVariants}
          custom={{ x: -10, y: -10 }}
          className="pointer-events-none absolute left-1 top-0.5 text-[#006efe]"
        >
          <SettingsFilled />
        </motion.div>
        <motion.div
          initial="hidden"
          animate={isHovered ? 'visible' : 'hidden'}
          variants={iconVariants}
          custom={{ x: 10, y: 10 }}
          className="pointer-events-none absolute bottom-0.5 left-24 text-[#006efe]"
        >
          <SettingsFilled />
        </motion.div>
        <div className="relative flex min-h-9 items-center gap-1 rounded-md border border-[#003674] bg-[#06193a] py-1 pl-2.5 pr-1 text-sm">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="rounded-sm py-1 text-[13px] font-medium text-[#eaf5ff] underline decoration-[#003674] underline-offset-[5px] outline-none hover:text-[#44a7ff] hover:decoration-[#00408a] focus-visible:ring-2 focus-visible:ring-[#008fff]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {buttonText}
          </a>
          <span className="text-[13px] text-[#44a7ff]">{description}</span>
          <button
            type="button"
            onClick={handleClose}
            className="flex size-6 shrink-0 items-center justify-center rounded text-[#47a8ff] outline-none hover:bg-[#012f61] focus-visible:ring-2 focus-visible:ring-[#008fff]"
            aria-label="Dismiss store notice"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
