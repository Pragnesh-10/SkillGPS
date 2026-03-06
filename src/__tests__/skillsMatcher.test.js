import { describe, it, expect } from 'vitest';
import { analyzeMultipleCareers } from '../services/skillsMatcher';

describe('analyzeMultipleCareers', () => {
    it('should correctly sort careers by match percentage in descending order', () => {
        // We use real matchSkills output.
        // Backend Developer requires JavaScript, Node.js, etc.
        // Data Scientist requires Python, SQL, etc.
        // UI/UX Designer requires Figma, UI Design, etc.

        const resumeSkills = ['JavaScript', 'Node.js', 'React', 'Python', 'SQL', 'Git'];
        const careerList = ['Backend Developer', 'Data Scientist', 'UI/UX Designer'];

        const results = analyzeMultipleCareers(resumeSkills, careerList);

        expect(results).toHaveLength(3);

        // Should be sorted descending by matchPercentage
        for (let i = 0; i < results.length - 1; i++) {
            expect(results[i].matchPercentage).toBeGreaterThanOrEqual(results[i+1].matchPercentage);
        }

        // Specifically check that the careers are in the expected order
        // Based on our resume skills, Backend Developer should be first, then Data Scientist, then UI/UX Designer
        expect(results[0].career).toBe('Backend Developer');
        expect(results[1].career).toBe('Data Scientist');
        expect(results[2].career).toBe('UI/UX Designer');
    });

    it('should handle empty career list', () => {
        const results = analyzeMultipleCareers(['React'], []);
        expect(results).toHaveLength(0);
    });

    it('should handle unknown careers properly', () => {
        const results = analyzeMultipleCareers(['React'], ['Backend Developer', 'Unknown Career']);

        expect(results).toHaveLength(2);

        // The unknown career should be last because its match percentage is 0
        const unknownResult = results[1];
        expect(unknownResult.career).toBe('Unknown Career');
        expect(unknownResult.matchPercentage).toBe(0);
        expect(unknownResult.error).toBe('Career not found');
    });
});
