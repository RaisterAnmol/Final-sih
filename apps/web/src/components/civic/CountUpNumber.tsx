import React from "react";

export interface CountUpNumberProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  end,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}) => {
  const targetValue = typeof end === "number" && !isNaN(end) ? end : 0;
  const formatted =
    decimals > 0
      ? targetValue.toFixed(decimals)
      : Math.round(targetValue).toLocaleString("en-IN");

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default CountUpNumber;
