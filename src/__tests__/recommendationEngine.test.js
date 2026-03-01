import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../utils/recommendationEngine';

describe('recommendationEngine getRecommendations', () => {
    it('returns exactly 3 recommendations', () => {
        const data = {
            workStyle: { environment: 'Solo', structure: 'Structured', roleType: 'Desk' },
            interests: { numbers: true, logic: true },
            confidence: { math: 8, coding: 8, communication: 5 }
        };
        const results = getRecommendations(data);
        expect(results).toHaveLength(3);

        // Each object should have career and prob
        expect(results[0]).toHaveProperty('career');
        expect(results[0]).toHaveProperty('prob');
        expect(typeof results[0].prob).toBe('number');
    });

    it('predicts Data Scientist for math and logic focused profile', () => {
        const data = {
            workStyle: { environment: 'Solo', structure: 'Structured', roleType: 'Desk' },
            interests: { numbers: true, logic: true, explaining: true },
            confidence: { math: 10, coding: 8, communication: 6 }
        };
        const results = getRecommendations(data);
        // Data Scientist should be top or at least in top 3
        const careers = results.map(r => r.career);
        expect(careers).toContain('Data Scientist');
    });

    it('predicts UI/UX Designer for design focused profile', () => {
        const data = {
            workStyle: { environment: 'Team', structure: 'Flexible', roleType: 'Desk' },
            interests: { design: true, explaining: true },
            confidence: { math: 3, coding: 3, communication: 8 }
        };
        const results = getRecommendations(data);
        const careers = results.map(r => r.career);
        expect(careers).toContain('UI/UX Designer');
    });

    it('predicts Backend Developer for building and coding focused profile', () => {
        const data = {
            workStyle: { environment: 'Solo', structure: 'Structured', roleType: 'Desk' },
            interests: { building: true, logic: true },
            confidence: { math: 5, coding: 10, communication: 3 }
        };
        const results = getRecommendations(data);
        const careers = results.map(r => r.career);
        expect(careers).toContain('Backend Developer');
    });

    it('handles empty data gracefully', () => {
        const data = {};
        const results = getRecommendations(data);
        expect(results).toHaveLength(3); // Returns top 3 using default properties
        results.forEach(r => {
            expect(typeof r.prob).toBe('number');
            expect(r.prob).toBeGreaterThanOrEqual(0);
        });
    });
});
