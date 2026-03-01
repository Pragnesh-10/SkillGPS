import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../utils/recommendationEngine';

describe('recommendationEngine getRecommendations', () => {
    it('returns exactly 3 recommendations', () => {
        const data = {
            workStyle: { environment: 'Solo', structure: 'Structured', roleType: 'Desk' },
            interests: { numbers: true, logic: true },
            confidence: { math: 8, coding: 8, communication: 5 },
            intent: { afterEdu: 'job', workplace: 'corporate', nature: 'applied' }
        };
        const results = getRecommendations(data);
        expect(results).toHaveLength(3);

        // Each object should have career, prob, explanation, and metadata
        expect(results[0]).toHaveProperty('career');
        expect(results[0]).toHaveProperty('prob');
        expect(results[0]).toHaveProperty('explanation');
        expect(results[0]).toHaveProperty('metadata');
        expect(typeof results[0].prob).toBe('number');
    });

    it('predicts Data Scientist for math and logic focused profile', () => {
        const data = {
            workStyle: { environment: 'Solo', structure: 'Structured', roleType: 'Desk' },
            interests: { numbers: true, logic: true, explaining: true },
            confidence: { math: 10, coding: 8, communication: 6 },
            intent: { afterEdu: 'job', workplace: 'corporate', nature: 'research' }
        };
        const results = getRecommendations(data);
        const careers = results.map(r => r.career);
        expect(careers).toContain('Data Scientist');
    });

    it('predicts UI/UX Designer for design focused profile', () => {
        const data = {
            workStyle: { environment: 'Team', structure: 'Flexible', roleType: 'Desk' },
            interests: { design: true, explaining: true },
            confidence: { math: 3, coding: 3, communication: 8 },
            intent: { afterEdu: 'job', workplace: 'startup', nature: 'applied' }
        };
        const results = getRecommendations(data);
        const careers = results.map(r => r.career);
        expect(careers).toContain('UI/UX Designer');
    });

    it('predicts Backend Developer for building and coding focused profile', () => {
        const data = {
            workStyle: { environment: 'Solo', structure: 'Structured', roleType: 'Desk' },
            interests: { building: true, logic: true },
            confidence: { math: 5, coding: 10, communication: 3 },
            intent: { afterEdu: 'job', workplace: 'startup', nature: 'applied' }
        };
        const results = getRecommendations(data);
        const careers = results.map(r => r.career);
        expect(careers).toContain('Backend Developer');
    });

    it('handles empty data gracefully', () => {
        const data = {};
        const results = getRecommendations(data);
        expect(results).toHaveLength(3);
        results.forEach(r => {
            expect(typeof r.prob).toBe('number');
            expect(r.prob).toBeGreaterThanOrEqual(0);
            expect(r).toHaveProperty('explanation');
            expect(r).toHaveProperty('metadata');
        });
    });

    // --- New tests for the improved engine ---

    it('includes career metadata with all required fields', () => {
        const data = {
            workStyle: { environment: 'Solo', structure: 'Structured', roleType: 'Desk' },
            interests: { numbers: true, logic: true },
            confidence: { math: 8, coding: 8, communication: 5 },
            intent: { afterEdu: 'job', workplace: 'corporate', nature: 'applied' }
        };
        const results = getRecommendations(data);
        results.forEach(r => {
            expect(r.metadata).toHaveProperty('icon');
            expect(r.metadata).toHaveProperty('description');
            expect(r.metadata).toHaveProperty('salaryRange');
            expect(r.metadata.salaryRange).toHaveProperty('entry');
            expect(r.metadata.salaryRange).toHaveProperty('senior');
            expect(r.metadata).toHaveProperty('growthOutlook');
            expect(r.metadata).toHaveProperty('keyStrengths');
            expect(Array.isArray(r.metadata.keyStrengths)).toBe(true);
        });
    });

    it('generates human-readable match explanations', () => {
        const data = {
            workStyle: { environment: 'Solo', structure: 'Structured', roleType: 'Desk' },
            interests: { numbers: true, logic: true },
            confidence: { math: 9, coding: 9, communication: 5 },
            intent: { afterEdu: 'job', workplace: 'corporate', nature: 'research' }
        };
        const results = getRecommendations(data);
        results.forEach(r => {
            expect(typeof r.explanation).toBe('string');
            expect(r.explanation.length).toBeGreaterThan(10);
        });
    });

    it('intent data influences recommendations — research pushes toward AI/ML', () => {
        const baseData = {
            workStyle: { environment: 'Solo', structure: 'Structured', roleType: 'Desk' },
            interests: { numbers: true, logic: true, building: true },
            confidence: { math: 9, coding: 9, communication: 5 }
        };

        const researchProfile = {
            ...baseData,
            intent: { afterEdu: 'higherStudies', workplace: 'corporate', nature: 'research' }
        };

        const appliedProfile = {
            ...baseData,
            intent: { afterEdu: 'job', workplace: 'startup', nature: 'applied' }
        };

        const researchResults = getRecommendations(researchProfile);
        const appliedResults = getRecommendations(appliedProfile);

        // Research-oriented profile should rank AI/ML Engineer or Data Scientist higher
        const researchCareers = researchResults.map(r => r.career);
        expect(
            researchCareers.includes('AI/ML Engineer') || researchCareers.includes('Data Scientist')
        ).toBe(true);

        // Results should differ between the two profiles
        expect(researchResults[0].career).not.toBe(appliedResults[0].career);
    });

    it('scores are between 0 and 1', () => {
        const data = {
            workStyle: { environment: 'Team', structure: 'Flexible', roleType: 'Dynamic' },
            interests: { explaining: true, design: true },
            confidence: { math: 5, coding: 5, communication: 9 },
            intent: { afterEdu: 'job', workplace: 'startup', nature: 'applied' }
        };
        const results = getRecommendations(data);
        results.forEach(r => {
            expect(r.prob).toBeGreaterThanOrEqual(0);
            expect(r.prob).toBeLessThanOrEqual(1);
        });
    });
});
