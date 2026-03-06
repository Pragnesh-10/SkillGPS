import { describe, it, expect } from 'vitest';
import { getReadinessAssessment } from '../services/skillsMatcher';

describe('skillsMatcher getReadinessAssessment', () => {
    it('returns advanced level assessment for high match percentage', () => {
        const matchResult = { essentialMatchPercentage: 85, matchPercentage: 90 };
        const result = getReadinessAssessment(matchResult);

        expect(result).toEqual({
            level: 'advanced',
            message: 'You are well-prepared! Consider advanced topics to excel.',
            color: '#10b981', // green
            essentialMatchPercentage: 85,
            overallMatchPercentage: 90
        });
    });

    it('returns intermediate level assessment for moderate match percentage', () => {
        const matchResult = { essentialMatchPercentage: 60, matchPercentage: 75 };
        const result = getReadinessAssessment(matchResult);

        expect(result).toEqual({
            level: 'intermediate',
            message: 'You have a solid foundation. Keep building your expertise.',
            color: '#f59e0b', // yellow
            essentialMatchPercentage: 60,
            overallMatchPercentage: 75
        });
    });

    it('returns beginner-intermediate level assessment for low-moderate match percentage', () => {
        const matchResult = { essentialMatchPercentage: 35, matchPercentage: 50 };
        const result = getReadinessAssessment(matchResult);

        expect(result).toEqual({
            level: 'beginner-intermediate',
            message: 'You have started your journey. Focus on core competencies.',
            color: '#f97316', // orange
            essentialMatchPercentage: 35,
            overallMatchPercentage: 50
        });
    });

    it('returns beginner level assessment for low match percentage', () => {
        const matchResult = { essentialMatchPercentage: 15, matchPercentage: 30 };
        const result = getReadinessAssessment(matchResult);

        expect(result).toEqual({
            level: 'beginner',
            message: 'You are just getting started. Focus on building essential skills.',
            color: '#ef4444', // red
            essentialMatchPercentage: 15,
            overallMatchPercentage: 30
        });
    });

    it('handles exact boundaries: 80% should be advanced', () => {
        const matchResult = { essentialMatchPercentage: 80, matchPercentage: 85 };
        const result = getReadinessAssessment(matchResult);

        expect(result.level).toBe('advanced');
        expect(result.color).toBe('#10b981'); // green
    });

    it('handles exact boundaries: 50% should be intermediate', () => {
        const matchResult = { essentialMatchPercentage: 50, matchPercentage: 55 };
        const result = getReadinessAssessment(matchResult);

        expect(result.level).toBe('intermediate');
        expect(result.color).toBe('#f59e0b'); // yellow
    });

    it('handles exact boundaries: 25% should be beginner-intermediate', () => {
        const matchResult = { essentialMatchPercentage: 25, matchPercentage: 30 };
        const result = getReadinessAssessment(matchResult);

        expect(result.level).toBe('beginner-intermediate');
        expect(result.color).toBe('#f97316'); // orange
    });

    it('handles zero essential match percentage', () => {
        const matchResult = { essentialMatchPercentage: 0, matchPercentage: 0 };
        const result = getReadinessAssessment(matchResult);

        expect(result.level).toBe('beginner');
        expect(result.color).toBe('#ef4444'); // red
    });
});
