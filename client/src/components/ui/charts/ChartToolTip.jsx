// ChartTooltip.js
import React from 'react';
import { Tooltip } from 'recharts';

export const ChartTooltip = (props) => {
  return <Tooltip {...props} content={<ChartTooltipContent />} />;
};

export default ChartTooltip;