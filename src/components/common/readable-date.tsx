import { Tooltip } from "antd";
import { FunctionComponent } from "react";
import { getFormattedDate, getRelativeTimeString } from "../../utils/date.utils";

interface ReadableDateProps {
  date: Date;
  isDisabled?: boolean;
}

const ReadableDate: FunctionComponent<ReadableDateProps> = ({ date, isDisabled = false }) => {
  const relativeTime = getRelativeTimeString(date);
  const formattedDate = getFormattedDate(date);

  if (isDisabled) {
    return <span>{relativeTime}</span>;
  }

  return (
    <Tooltip title={formattedDate}>
      <span>{relativeTime}</span>
    </Tooltip>
  );
};

export default ReadableDate;