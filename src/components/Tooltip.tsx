import { cloneElement, ReactElement, useCallback, useId, useState } from 'react';
import { clsx } from 'clsx';

type TooltipProps = {
  content: string;
  children: ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
};

const sideClassMap: Record<Required<TooltipProps>['side'], string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2',
  left: 'right-full top-1/2 -translate-y-1/2 -translate-x-2',
  right: 'left-full top-1/2 -translate-y-1/2 translate-x-2',
};

export const Tooltip = ({ content, children, side = 'top' }: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  const close = useCallback(() => setOpen(false), []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close();
      }
    },
    [close],
  );

  const triggerProps = {
    onMouseEnter: (event: React.MouseEvent) => {
      children.props.onMouseEnter?.(event);
      setOpen(true);
    },
    onMouseLeave: (event: React.MouseEvent) => {
      children.props.onMouseLeave?.(event);
      setOpen(false);
    },
    onFocus: (event: React.FocusEvent) => {
      children.props.onFocus?.(event);
      setOpen(true);
    },
    onBlur: (event: React.FocusEvent) => {
      children.props.onBlur?.(event);
      setOpen(false);
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      children.props.onKeyDown?.(event);
      handleKeyDown(event);
    },
    'aria-describedby': open ? tooltipId : undefined,
  } satisfies Partial<React.HTMLAttributes<HTMLElement>>;

  return (
    <span className="relative inline-flex">
      {cloneElement(children, triggerProps)}
      {open ? (
        <span
          role="tooltip"
          id={tooltipId}
          className={clsx(
            'pointer-events-none absolute z-20 max-w-xs rounded-lg border border-divider/40 bg-[rgba(59,45,31,0.92)] px-3 py-1.5 text-xs font-medium text-surface shadow-lg backdrop-blur',
            sideClassMap[side],
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
};
