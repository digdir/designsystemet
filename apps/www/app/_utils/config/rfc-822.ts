/**
 * MIT License Copyright (c) 2022 Salma Alam-Naylor
 * https://github.com/whitep4nth3r/rfc-822/blob/781aee2019a6a05d2fe91631bce00b41fc17a80e/index.js
 */

const weekdayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
  .format;
const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short' }).format;

// add a leading 0 to a number if it is only one digit
function addLeadingZero(num: string | number): string {
  num = num.toString();
  while (num.length < 2) num = '0' + num;
  return num;
}

export function buildRFC822Date(dateString: string | Date) {
  const date =
    dateString instanceof Date ? dateString : new Date(Date.parse(dateString));
  // Convert to GMT
  date.setTime(date.getTime() + date.getTimezoneOffset() * 60_000);

  const day = weekdayFormat(date);
  const dayNumber = addLeadingZero(date.getDate());
  const month = monthFormat(date);
  const year = date.getFullYear();
  const time = `${addLeadingZero(date.getHours())}:${addLeadingZero(date.getMinutes())}:00`;

  //Wed, 02 Oct 2002 13:00:00 GMT
  return `${day}, ${dayNumber} ${month} ${year} ${time} GMT`;
}
