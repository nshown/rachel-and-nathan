import { describe, expect, it } from 'vitest'
import {
    daysUntilAnniversary,
    modeOverrideFromLocation,
    ordinal,
    resolveMode,
    WINDOW_DAYS,
    yearsMarried,
} from './mode'

// Local date at noon avoids any DST/timezone edge affecting whole-day math.
function at(year: number, month1: number, day: number): Date {
    return new Date(year, month1 - 1, day, 12, 0, 0)
}

describe('resolveMode', () => {
    it('is anniversary exactly on Sept 7', () => {
        expect(resolveMode(at(2026, 9, 7))).toBe('anniversary')
    })

    it('is pre within the window before Sept 7', () => {
        expect(resolveMode(at(2026, 8, 28))).toBe('pre')
        expect(resolveMode(at(2026, 9, 6))).toBe('pre')
    })

    it('is post within the window after Sept 7', () => {
        expect(resolveMode(at(2026, 9, 8))).toBe('post')
        expect(resolveMode(at(2026, 9, 21))).toBe('post')
    })

    it('is regular well outside the windows', () => {
        expect(resolveMode(at(2026, 1, 1))).toBe('regular')
        expect(resolveMode(at(2026, 12, 25))).toBe('regular')
    })

    it('treats the window edges (14 days) as pre/post, not regular', () => {
        expect(resolveMode(at(2026, 9, 7 - WINDOW_DAYS))).toBe('pre')
        expect(resolveMode(at(2026, 9, 7 + WINDOW_DAYS))).toBe('post')
    })

    it('treats one day past the window as regular', () => {
        expect(resolveMode(at(2026, 9, 7 - WINDOW_DAYS - 1))).toBe('regular')
        expect(resolveMode(at(2026, 9, 7 + WINDOW_DAYS + 1))).toBe('regular')
    })
})

describe('daysUntilAnniversary', () => {
    it('counts forward to Sept 7', () => {
        expect(daysUntilAnniversary(at(2026, 8, 28))).toBe(10)
    })

    it('is zero on the day', () => {
        expect(daysUntilAnniversary(at(2026, 9, 7))).toBe(0)
    })

    it('is negative after the day', () => {
        expect(daysUntilAnniversary(at(2026, 9, 10))).toBe(-3)
    })
})

describe('yearsMarried', () => {
    it('returns years since the 2024 wedding', () => {
        expect(yearsMarried(at(2026, 9, 7))).toBe(2)
        expect(yearsMarried(at(2030, 1, 1))).toBe(6)
    })
})

describe('modeOverrideFromLocation', () => {
    it('reads a valid mode from the query string', () => {
        expect(modeOverrideFromLocation('?mode=anniversary')).toBe('anniversary')
    })

    it('accepts hyphenated aliases', () => {
        expect(modeOverrideFromLocation('?mode=pre-anniversary')).toBe('pre')
        expect(modeOverrideFromLocation('?mode=post-anniversary')).toBe('post')
    })

    it('is case-insensitive', () => {
        expect(modeOverrideFromLocation('?mode=Regular')).toBe('regular')
    })

    it('returns null when absent or unknown', () => {
        expect(modeOverrideFromLocation('')).toBeNull()
        expect(modeOverrideFromLocation('?foo=bar')).toBeNull()
        expect(modeOverrideFromLocation('?mode=birthday')).toBeNull()
    })
})

describe('ordinal', () => {
    it('handles the common cases', () => {
        expect(ordinal(1)).toBe('1st')
        expect(ordinal(2)).toBe('2nd')
        expect(ordinal(3)).toBe('3rd')
        expect(ordinal(4)).toBe('4th')
    })

    it('handles the 11-13 teens exception', () => {
        expect(ordinal(11)).toBe('11th')
        expect(ordinal(12)).toBe('12th')
        expect(ordinal(13)).toBe('13th')
    })

    it('handles higher numbers by last digit', () => {
        expect(ordinal(21)).toBe('21st')
        expect(ordinal(22)).toBe('22nd')
        expect(ordinal(113)).toBe('113th')
    })
})
