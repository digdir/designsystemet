/**
 * Formats a date string according to the provided locale
 * @param dateString - ISO date string to format
 * @param locale - Locale to use for formatting (defaults to 'en' if not provided)
 * @returns Formatted date string in the specified locale
 */
export const formatDate = (dateString: string, lc = 'no'): string => {
  const locale = lc === 'no' ? 'nb-NO' : 'en';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if parsing fails
  }
};
