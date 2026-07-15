import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const BS_MONTHS = [
  { en: "Baisakh", np: "वैशाख" },
  { en: "Jestha", np: "जेठ" },
  { en: "Ashadh", np: "असार" },
  { en: "Shrawan", np: "साउन" },
  { en: "Bhadra", np: "भदौ" },
  { en: "Ashwin", np: "असोज" },
  { en: "Kartik", np: "कार्तिक" },
  { en: "Mangsir", np: "मंसिर" },
  { en: "Poush", np: "पौष" },
  { en: "Magh", np: "माघ" },
  { en: "Falgun", np: "फागुन" },
  { en: "Chaitra", np: "चैत" },
];

const BS_WEEK_DAYS = ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"];

const MONTH_PATTERN = {
  A: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  B: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  C: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  D: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  E: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  F: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  G: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  H: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  I: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  J: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
};

const YEAR_PATTERN = {
  2070: "E",
  2071: "C",
  2072: "F",
  2073: "B",
  2074: "G",
  2075: "C",
  2076: "H",
  2077: "I",
  2078: "G",
  2079: "C",
  2080: "H",
  2081: "I",
  2082: "C",
  2083: "C",
  2084: "B",
  2085: "J",
  2086: "C",
  2087: "A",
  2088: "B",
  2089: "J",
  2090: "C",
  2091: "A",
  2092: "B",
  2093: "D",
  2094: "C",
  2095: "A",
  2096: "B",
  2097: "E",
  2098: "C",
  2099: "A",
};

const SUPPORTED_BS_YEARS = Object.keys(YEAR_PATTERN)
  .map(Number)
  .sort((a, b) => a - b);

const BS_ANCHOR_YEAR = 2070;
const BS_ANCHOR_AD_DATE = new Date(Date.UTC(2013, 3, 14));

function parseDateOnly(value) {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(
      Date.UTC(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate()
      )
    );
  }

  const clean = String(value || "").trim();
  const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    const [, year, month, day] = match;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  }

  const parsed = new Date(clean);

  if (Number.isNaN(parsed.getTime())) return null;

  return new Date(
    Date.UTC(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate()
    )
  );
}

function formatAdDateKey(date) {
  if (!date || Number.isNaN(date.getTime())) return "";

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function addDays(date, days) {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function daysBetween(start, end) {
  const startDate = parseDateOnly(start);
  const endDate = parseDateOnly(end);

  if (!startDate || !endDate) return 0;

  return Math.round((endDate.getTime() - startDate.getTime()) / 86400000);
}

function getYearMonths(year) {
  const patternKey = YEAR_PATTERN[year];
  const months = MONTH_PATTERN[patternKey];

  return Array.isArray(months) ? [...months] : [];
}

function getYearLength(year) {
  return getYearMonths(year).reduce((sum, days) => sum + days, 0);
}

function getBsYearStartDate(year) {
  if (!YEAR_PATTERN[year]) return null;

  let date = new Date(BS_ANCHOR_AD_DATE.getTime());

  for (let currentYear = BS_ANCHOR_YEAR; currentYear < year; currentYear += 1) {
    date = addDays(date, getYearLength(currentYear));
  }

  return date;
}

export const NOTICE_BS_CALENDAR_DATA = SUPPORTED_BS_YEARS.reduce(
  (calendar, year) => {
    calendar[year] = {
      startAd: formatAdDateKey(getBsYearStartDate(year)),
      months: getYearMonths(year),
    };

    return calendar;
  },
  {}
);

export function toNepaliNumber(value) {
  const digits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

  return String(value ?? "").replace(
    /\d/g,
    (digit) => digits[Number(digit)]
  );
}

function getBsMonthLength(year, monthIndex) {
  return NOTICE_BS_CALENDAR_DATA[year]?.months?.[monthIndex] || 30;
}

export function bsNoticeDateToAd(year, monthIndex, day) {
  const yearData = NOTICE_BS_CALENDAR_DATA[year];
  const yearStart = getBsYearStartDate(year);
  const safeDay = Number(day);

  if (!yearData || !yearStart) return null;
  if (monthIndex < 0 || monthIndex > 11) return null;
  if (!Number.isInteger(safeDay)) return null;
  if (safeDay < 1 || safeDay > getBsMonthLength(year, monthIndex)) return null;

  const monthOffset = yearData.months
    .slice(0, monthIndex)
    .reduce((sum, monthDays) => sum + monthDays, 0);

  return addDays(yearStart, monthOffset + safeDay - 1);
}

export function bsNoticeDateToAdKey(year, monthIndex, day) {
  return formatAdDateKey(bsNoticeDateToAd(year, monthIndex, day));
}

export function adNoticeDateToBs(value) {
  const adDate = parseDateOnly(value);

  if (!adDate) return null;

  for (const year of SUPPORTED_BS_YEARS) {
    const start = getBsYearStartDate(year);

    if (!start) continue;

    const end = addDays(start, getYearLength(year) - 1);

    if (adDate < start || adDate > end) continue;

    let remainingDays = daysBetween(start, adDate);
    const months = NOTICE_BS_CALENDAR_DATA[year].months;

    for (let monthIndex = 0; monthIndex < months.length; monthIndex += 1) {
      if (remainingDays < months[monthIndex]) {
        return {
          year,
          monthIndex,
          day: remainingDays + 1,
          adDate,
          adKey: formatAdDateKey(adDate),
        };
      }

      remainingDays -= months[monthIndex];
    }
  }

  return null;
}

export function formatBsNoticeDate(value) {
  if (!value) return "No date";

  const bsDate = adNoticeDateToBs(value);

  if (!bsDate) {
    const cleanValue = String(value || "").trim();
    return cleanValue || "No date";
  }

  const monthName = BS_MONTHS[bsDate.monthIndex]?.np || "";

  return `${monthName} ${toNepaliNumber(bsDate.day)}, ${toNepaliNumber(
    bsDate.year
  )} वि.सं.`;
}

export function getTodayAdDateKey() {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

function getMonthCells(year, monthIndex) {
  const firstAdDate = bsNoticeDateToAd(year, monthIndex, 1);
  const monthLength = getBsMonthLength(year, monthIndex);

  if (!firstAdDate) return [];

  const cells = [];

  for (let index = 0; index < firstAdDate.getUTCDay(); index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= monthLength; day += 1) {
    cells.push({
      year,
      monthIndex,
      day,
      adKey: bsNoticeDateToAdKey(year, monthIndex, day),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function getInitialMonth(value) {
  const selected = adNoticeDateToBs(value);
  const today = adNoticeDateToBs(getTodayAdDateKey());

  if (selected) {
    return {
      year: selected.year,
      monthIndex: selected.monthIndex,
    };
  }

  if (today) {
    return {
      year: today.year,
      monthIndex: today.monthIndex,
    };
  }

  return {
    year: 2083,
    monthIndex: 0,
  };
}

export default function BsNoticeDatePicker({
  label = "Notice Date (BS)",
  value,
  onChange,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => getInitialMonth(value));

  const selectedBsDate = useMemo(
    () => adNoticeDateToBs(value),
    [value]
  );

  const todayAdKey = getTodayAdDateKey();
  const todayBsDate = adNoticeDateToBs(todayAdKey);

  useEffect(() => {
    if (!open) return;

    setMonth(getInitialMonth(value));
  }, [open, value]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const cells = useMemo(
    () => getMonthCells(month.year, month.monthIndex),
    [month]
  );

  const moveMonth = (amount) => {
    setMonth((current) => {
      let nextYear = current.year;
      let nextMonthIndex = current.monthIndex + amount;

      if (nextMonthIndex < 0) {
        nextYear -= 1;
        nextMonthIndex = 11;
      }

      if (nextMonthIndex > 11) {
        nextYear += 1;
        nextMonthIndex = 0;
      }

      if (!NOTICE_BS_CALENDAR_DATA[nextYear]) return current;

      return {
        year: nextYear,
        monthIndex: nextMonthIndex,
      };
    });
  };

  const selectDay = (cell) => {
    if (!cell) return;

    onChange?.(cell.adKey);
    setOpen(false);
  };

  const goToday = () => {
    if (!todayBsDate) return;

    setMonth({
      year: todayBsDate.year,
      monthIndex: todayBsDate.monthIndex,
    });
  };

  const firstSupportedYear = SUPPORTED_BS_YEARS[0];
  const lastSupportedYear = SUPPORTED_BS_YEARS[SUPPORTED_BS_YEARS.length - 1];

  const previousDisabled =
    month.year === firstSupportedYear && month.monthIndex === 0;
  const nextDisabled =
    month.year === lastSupportedYear && month.monthIndex === 11;

  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>

      <button
        type="button"
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm outline-none transition-all disabled:opacity-60"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      >
        <span className={value ? "font-black text-slate-900" : "text-slate-400"}>
          {value ? formatBsNoticeDate(value) : "Select BS notice date"}
        </span>

        <CalendarDays
          className="h-5 w-5 shrink-0"
          style={{ color: colors.purple }}
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[35000] flex items-center justify-center p-3 sm:p-5"
          style={{
            background: "rgba(2,6,23,0.66)",
            backdropFilter: "blur(12px)",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[30px] bg-white"
            style={{
              border: "1px solid rgba(255,255,255,0.76)",
              boxShadow: "0 42px 110px rgba(0,0,0,0.34)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="h-1.5"
              style={{
                background: `linear-gradient(90deg, ${colors.red}, ${colors.gold}, ${colors.green})`,
              }}
            />

            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Bikram Sambat
                </div>
                <h3 className="mt-1 text-xl font-black text-slate-950">
                  Select Notice Date
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.13em] text-slate-400">
                    BS Month
                  </label>
                  <select
                    value={month.monthIndex}
                    onChange={(event) =>
                      setMonth((current) => ({
                        ...current,
                        monthIndex: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-2xl px-3 py-3 text-sm font-black outline-none"
                    style={{
                      background: "rgba(15,23,42,0.045)",
                      border: "1px solid rgba(15,23,42,0.08)",
                      color: colors.dark,
                    }}
                  >
                    {BS_MONTHS.map((monthItem, index) => (
                      <option key={monthItem.en} value={index}>
                        {monthItem.np} ({monthItem.en})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.13em] text-slate-400">
                    BS Year
                  </label>
                  <select
                    value={month.year}
                    onChange={(event) =>
                      setMonth((current) => ({
                        ...current,
                        year: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-2xl px-3 py-3 text-sm font-black outline-none"
                    style={{
                      background: "rgba(15,23,42,0.045)",
                      border: "1px solid rgba(15,23,42,0.08)",
                      color: colors.dark,
                    }}
                  >
                    {SUPPORTED_BS_YEARS.map((year) => (
                      <option key={year} value={year}>
                        {toNepaliNumber(year)} वि.सं. ({year})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => moveMonth(-1)}
                  disabled={previousDisabled}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 disabled:opacity-30"
                  aria-label="Previous BS month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="text-center">
                  <div className="text-2xl font-black text-slate-950">
                    {BS_MONTHS[month.monthIndex]?.np}{" "}
                    {toNepaliNumber(month.year)}
                  </div>
                  <div className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    {BS_MONTHS[month.monthIndex]?.en}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => moveMonth(1)}
                  disabled={nextDisabled}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 disabled:opacity-30"
                  aria-label="Next BS month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center">
                {BS_WEEK_DAYS.map((day, index) => (
                  <div
                    key={day}
                    className="py-1 text-[11px] font-black"
                    style={{
                      color: index === 6 ? colors.red : "#94A3B8",
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-1.5 grid grid-cols-7 gap-1.5">
                {cells.map((cell, index) => {
                  if (!cell) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="h-11 rounded-xl"
                      />
                    );
                  }

                  const selected = cell.adKey === value;
                  const today = cell.adKey === todayAdKey;
                  const isSaturday =
                    bsNoticeDateToAd(
                      cell.year,
                      cell.monthIndex,
                      cell.day
                    )?.getUTCDay() === 6;

                  return (
                    <button
                      key={cell.adKey}
                      type="button"
                      onClick={() => selectDay(cell)}
                      className="relative h-11 rounded-xl text-sm font-black transition-all hover:-translate-y-0.5"
                      style={{
                        background: selected
                          ? colors.dark
                          : isSaturday
                          ? "rgba(215,25,32,0.08)"
                          : "rgba(15,23,42,0.04)",
                        color: selected
                          ? "#FFFFFF"
                          : isSaturday
                          ? colors.red
                          : colors.dark,
                        border: today
                          ? `2px solid ${colors.green}`
                          : selected
                          ? `2px solid ${colors.dark}`
                          : "1px solid rgba(15,23,42,0.05)",
                      }}
                    >
                      {toNepaliNumber(cell.day)}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goToday}
                  className="rounded-2xl px-4 py-2.5 text-xs font-black"
                  style={{
                    background: "rgba(22,138,58,0.08)",
                    color: colors.green,
                    border: "1px solid rgba(22,138,58,0.16)",
                  }}
                >
                  आज
                </button>

                <div className="min-w-0 text-right">
                  <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Selected BS Date
                  </div>
                  <div className="truncate text-sm font-black text-slate-900">
                    {selectedBsDate
                      ? formatBsNoticeDate(value)
                      : "Not selected"}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-center text-xs font-bold text-slate-500">
                उपलब्ध वर्ष: {toNepaliNumber(firstSupportedYear)} देखि{" "}
                {toNepaliNumber(lastSupportedYear)} वि.सं.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}