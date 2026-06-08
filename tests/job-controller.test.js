import { describe, it, expect } from "vitest";
import {
  calculateStreak,
  getPagination,
} from "../server/controllers/job-controller.js";

// All scenarios are anchored in the 2026-06-08..2026-06-19 window, which sits
// after the last EXCLUDED_DATES entry (2026-06-03), so the manually excluded
// dates don't interfere — except in the test that targets them explicitly.
// Weekday reference: 2026-06-15 = Mon ... 2026-06-19 = Fri, 06-13/14 = Sat/Sun.

describe("getPagination", () => {
  it("defaults to page 1, limit 10 when no query params are given", () => {
    expect(getPagination({ query: {} })).toEqual({ page: 1, limit: 10, skip: 0 });
  });

  it("computes skip from page and limit", () => {
    expect(getPagination({ query: { page: "3", limit: "20" } })).toEqual({
      page: 3,
      limit: 20,
      skip: 40,
    });
  });

  it("clamps the limit to a maximum of 100", () => {
    expect(getPagination({ query: { limit: "5000" } }).limit).toBe(100);
  });

  it("clamps zero/negative numbers to the minimums", () => {
    // "0" page -> 1; "-4" limit parses to -4 then clamps up to the floor of 1
    expect(getPagination({ query: { page: "0", limit: "-4" } })).toEqual({
      page: 1,
      limit: 1,
      skip: 0,
    });
  });

  it("falls back to defaults for non-numeric (garbage) input", () => {
    expect(getPagination({ query: { page: "abc", limit: "xyz" } })).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
    });
  });
});

describe("calculateStreak", () => {
  it("returns 0 when no jobs have been applied", () => {
    expect(calculateStreak([], "2026-06-19")).toBe(0);
  });

  it("counts consecutive applied weekdays", () => {
    const applied = ["2026-06-15", "2026-06-16", "2026-06-17", "2026-06-18", "2026-06-19"];
    expect(calculateStreak(applied, "2026-06-19")).toBe(5);
  });

  it("does not break the streak when today has no application yet", () => {
    // today (Fri 06-19) is empty, but yesterday (Thu 06-18) counts
    expect(calculateStreak(["2026-06-18"], "2026-06-19")).toBe(1);
  });

  it("skips weekends without breaking the streak", () => {
    // Fri 06-12 applied, today Mon 06-15 empty: weekend between is skipped
    expect(calculateStreak(["2026-06-12"], "2026-06-15")).toBe(1);
  });

  it("counts an application made on a weekend", () => {
    expect(calculateStreak(["2026-06-13"], "2026-06-13")).toBe(1); // Sat
  });

  it("forgives a single missed weekday (bridges the streak)", () => {
    // 06-18 (Thu) missed, but 06-19 and 06-17 both applied -> streak of 2
    expect(calculateStreak(["2026-06-19", "2026-06-17"], "2026-06-19")).toBe(2);
  });

  it("breaks on two missed weekdays in a row", () => {
    // 06-18 and 06-17 both missed -> streak stops at 06-19, ignoring 06-16
    expect(calculateStreak(["2026-06-19", "2026-06-16"], "2026-06-19")).toBe(1);
  });

  it("counts each date once even with multiple applications that day", () => {
    expect(calculateStreak(["2026-06-19", "2026-06-19"], "2026-06-19")).toBe(1);
  });

  it("skips manually excluded dates without breaking the streak", () => {
    // Walking back from Thu 06-04: 06-01..06-03 are excluded weekdays, so they
    // are bridged rather than breaking the streak.
    expect(calculateStreak(["2026-06-04"], "2026-06-04")).toBe(1);
  });

  it("ignores empty time components on stored dates", () => {
    expect(calculateStreak(["2026-06-19T00:00:00.000Z"], "2026-06-19")).toBe(1);
  });
});
