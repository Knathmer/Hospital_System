// client/src/components/users/admin/sections/DateRangePicker.jsx

import React from 'react';

const DateRangePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <>
      <div>
        <label className="block mb-2 font-semibold">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
    </>
  );
};

export default DateRangePicker;
