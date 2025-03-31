import { ReactNode } from 'react';
import { Tooltip } from "antd";


interface TooltipWrapperProps {
  children: ReactNode;
  text: string;
  disabled?: boolean;
}

const TooltipWrapper = ({
  children,
  text,
  disabled = false
}: TooltipWrapperProps) => {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Tooltip title={text}>
      <>
      {/* Wrap in a <> to capture events for disabled buttons */}
        {children}
      </>
    </Tooltip>
  );
};

export default TooltipWrapper;