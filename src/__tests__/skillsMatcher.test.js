import { describe, it, expect } from 'vitest';
import { analyzeMultipleCareers } from '../services/skillsMatcher';

describe('skillsMatcher analyzeMultipleCareers', () => {
    it('returns sorted careers by matchPercentage in descending order', () => {
        // We'll use actual careers that are available in careerSkills.js
        // This resume will match perfectly with Data Scientist, partially with Backend Developer
        const resumeSkills = ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Data Analysis', 'Pandas', 'NumPy', 'Jupyter Notebook'];
        const careerList = ['Data Scientist', 'Backend Developer', 'Product Manager'];

        const results = analyzeMultipleCareers(resumeSkills, careerList);

        expect(results).toHaveLength(3);

        // Data Scientist should be first
        expect(results[0].career).toBe('Data Scientist');

        // The results should be sorted descending
        for (let i = 0; i < results.length - 1; i++) {
            expect(results[i].matchPercentage).toBeGreaterThanOrEqual(results[i+1].matchPercentage);
        }
    });

    it('handles empty careerList', () => {
        const resumeSkills = ['JavaScript'];
        const careerList = [];

        const results = analyzeMultipleCareers(resumeSkills, careerList);

        expect(results).toHaveLength(0);
        expect(results).toEqual([]);
    });

    it('handles non-existent careers gracefully', () => {
        const resumeSkills = ['Python'];
        const careerList = ['Unknown Career'];

        const results = analyzeMultipleCareers(resumeSkills, careerList);

        expect(results).toHaveLength(1);
        expect(results[0].career).toBe('Unknown Career');
        expect(results[0].matchPercentage).toBe(0);
        expect(results[0].error).toBe('Career not found');
    });

    it('returns 0 match percentage when resumeSkills is empty', () => {
        const resumeSkills = [];
        const careerList = ['Data Scientist', 'Backend Developer'];

        const results = analyzeMultipleCareers(resumeSkills, careerList);

        expect(results).toHaveLength(2);

        // All should have 0 match percentage
        expect(results[0].matchPercentage).toBe(0);
        expect(results[1].matchPercentage).toBe(0);
    });

    it('correctly includes output properties from matchSkills', () => {
        const resumeSkills = ['Python'];
        const careerList = ['Data Scientist'];

        const results = analyzeMultipleCareers(resumeSkills, careerList);

        expect(results).toHaveLength(1);
        expect(results[0]).toHaveProperty('career', 'Data Scientist');
        expect(results[0]).toHaveProperty('matchPercentage');
        expect(results[0]).toHaveProperty('matchedSkills');
        expect(results[0]).toHaveProperty('missingSkills');
        expect(results[0]).toHaveProperty('essentialMatchPercentage');
        expect(results[0]).toHaveProperty('essentialMatched');
        expect(results[0]).toHaveProperty('essentialMissing');

        // Python is an essential skill for Data Scientist
        expect(results[0].matchedSkills).toContain('python');
    });
});
