import { Injectable, Optional, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { parse, format, addDays, addMonths, addYears, getYear, getMonth, getDate, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';

@Injectable()
export class CustomDateFnsAdapter extends DateAdapter<Date> {
  override setLocale(locale: any) {
    super.setLocale(zhTW); // Here we forcefully set locale to zhTW
  }

  override getYear(date: Date): number {
    return getYear(date);
  }

  override getMonth(date: Date): number {
    return getMonth(date);
  }

  override getDate(date: Date): number {
    return getDate(date);
  }

  override getDayOfWeek(date: Date): number {
    return date.getDay();
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const formatStr = style === 'short' ? 'MMM' : 'MMMM';
    return Array.from({ length: 12 }, (_, i) => format(new Date(2000, i, 1), formatStr, { locale: zhTW }));
  }

  override getDateNames(): string[] {
    return Array.from({ length: 31 }, (_, i) => String(i + 1));
  }

  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return ['一', '二', '三', '四', '五', '六', '日'];
  }

  override getYearName(date: Date): string {
    return String(getYear(date));
  }

  override getFirstDayOfWeek(): number {
    return 0; // Sunday
  }

  override getNumDaysInMonth(date: Date): number {
    return new Date(getYear(date), getMonth(date) + 1, 0).getDate();
  }

  override clone(date: Date): Date {
    return new Date(date.getTime());
  }

  override createDate(year: number, month: number, date: number): Date {
    return new Date(year, month, date);
  }

  override today(): Date {
    return new Date();
  }

  override parse(value: any, parseFormat: string): Date | null {
    if (typeof value === 'string' && value.length > 0) {
      return parseISO(value);
    }
    return value ? new Date(value) : null;
  }

  override format(date: Date, displayFormat: string): string {
    return format(date, displayFormat, { locale: zhTW });
  }

  override addCalendarYears(date: Date, years: number): Date {
    return addYears(date, years);
  }

  override addCalendarMonths(date: Date, months: number): Date {
    return addMonths(date, months);
  }

  override addCalendarDays(date: Date, days: number): Date {
    return addDays(date, days);
  }

  override toIso8601(date: Date): string {
    return date.toISOString();
  }

  override deserialize(value: any): Date | null {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value ? new Date(value) : null;
  }

  override isDateInstance(obj: any): boolean {
    return obj instanceof Date;
  }

  override isValid(date: Date): boolean {
    return !isNaN(date.getTime());
  }

  override invalid(): Date {
    return new Date(NaN);
  }
}
