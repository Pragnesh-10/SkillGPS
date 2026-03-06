import { describe, it, expect } from 'vitest';
import { getReadinessAssessment } from '../services/skillsMatcher';

describe('skillsMatcher getReadinessAssessment', () => {
    it('returns "advanced" level for essentialMatchPercentage >= 80', () => {
        const matchResult = { essentialMatchPercentage: 85, matchPercentage: 75 };
        const result = getReadinessAssessment(matchResult);

        expect(result).toEqual({
            level: 'advanced',
            message: 'You are well-prepared! Consider advanced topics to excel.',
            color: '#10b981',
            essentialMatchPercentage: 85,
            overallMatchPercentage: 75
        });
    });

    it('returns "intermediate" level for essentialMatchPercentage >= 50 and < 80', () => {
        const matchResult = { essentialMatchPercentage: 60, matchPercentage: 55 };
        const result = getReadinessAssessment(matchResult);

        expect(result).toEqual({
            level: 'intermediate',
            message: 'You have a solid foundation. Keep building your expertise.',
            color: '#f59e0b',
            essentialMatchPercentage: 60,
            overallMatchPercentage: 55
        });
    });

    it('returns "beginner-intermediate" level for essentialMatchPercentage >= 25 and < 50', () => {
        const matchResult = { essentialMatchPercentage: 30, matchPercentage: 40 };
        const result = getReadinessAssessment(matchResult);

        expect(result).toEqual({
            level: 'beginner-intermediate',
            message: 'You have started your journey. Focus on core competencies.',
            color: '#f97316',
            essentialMatchPercentage: 30,
            overallMatchPercentage: 40
        });
    });

    it('returns "beginner" level for essentialMatchPercentage < 25', () => {
        const matchResult = { essentialMatchPercentage: 15, matchPercentage: 20 };
        const result = getReadinessAssessment(matchResult);

        expect(result).toEqual({
            level: 'beginner',
            message: 'You are just getting started. Focus on building essential skills.',
            color: '#ef4444',
            essentialMatchPercentage: 15,
            overallMatchPercentage: 20
        });
    });

    it('handles exact boundary essentialMatchPercentage = 80', () => {
        const matchResult = { essentialMatchPercentage: 80, matchPercentage: 80 };
        const result = getReadinessAssessment(matchResult);

        expect(result.level).toBe('advanced');
    });

    it('handles exact boundary essentialMatchPercentage = 50', () => {
        const matchResult = { essentialMatchPercentage: 50, matchPercentage: 50 };
        const result = getReadinessAssessment(matchResult);

        expect(result.level).toBe('intermediate');
    });

    it('handles exact boundary essentialMatchPercentage = 25', () => {
        const matchResult = { essentialMatchPercentage: 25, matchPercentage: 25 };
        const result = getReadinessAssessment(matchResult);

        expect(result.level).toBe('beginner-intermediate');
    });
});
