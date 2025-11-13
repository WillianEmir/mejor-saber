'use client';

import { useEffect, useState } from 'react';

interface ClientDateTimeProps {
  date: Date | string;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
}

export function ClientDateTime({ date, locale, options }: ClientDateTimeProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return (
    <>
      {dateObj.toLocaleString(locale, options)}
    </>
  );
}
