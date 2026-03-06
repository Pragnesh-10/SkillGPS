import { describe, it, expect } from 'vitest';
import { getProjectRecommendations } from '../services/skillsMatcher';

describe('getProjectRecommendations', () => {
    it('returns empty categorized recommendations for an unknown career name', () => {
        const matchResult = { essentialMatchPercentage: 50, essentialMissing: [] };
        const userSkills = ['React'];
        const careerName = 'Unknown Career';

        const result = getProjectRecommendations(matchResult, userSkills, careerName);

        expect(result).toEqual({ beginner: [], intermediate: [], advanced: [] });
    });

    it('recommends only beginner projects when essentialMatchPercentage < 30', () => {
        const matchResult = { essentialMatchPercentage: 20, essentialMissing: ['Python'] };
        const userSkills = ['HTML'];
        const careerName = 'Data Scientist';

        const result = getProjectRecommendations(matchResult, userSkills, careerName);

        expect(result.beginner.length).toBeGreaterThan(0);
        expect(result.intermediate).toEqual([]);
        expect(result.advanced).toEqual([]);
    });

    it('recommends beginner and intermediate projects when essentialMatchPercentage is between 30 and 59', () => {
        const matchResult = { essentialMatchPercentage: 45, essentialMissing: ['React'] };
        const userSkills = ['HTML', 'CSS'];
        const careerName = 'Frontend Developer';

        const result = getProjectRecommendations(matchResult, userSkills, careerName);

        expect(result.beginner.length).toBeGreaterThan(0);
        expect(result.intermediate.length).toBeGreaterThan(0);
        expect(result.advanced).toEqual([]);
    });

    it('recommends intermediate and advanced projects when essentialMatchPercentage is between 60 and 84', () => {
        const matchResult = { essentialMatchPercentage: 70, essentialMissing: ['Kubernetes'] };
        const userSkills = ['AWS EC2', 'Linux'];
        const careerName = 'Cloud Engineer';

        const result = getProjectRecommendations(matchResult, userSkills, careerName);

        expect(result.beginner).toEqual([]);
        expect(result.intermediate.length).toBeGreaterThan(0);
        expect(result.advanced.length).toBeGreaterThan(0);
    });

    it('recommends intermediate and advanced projects when essentialMatchPercentage >= 85', () => {
        const matchResult = { essentialMatchPercentage: 90, essentialMissing: ['GraphQL'] };
        const userSkills = ['Node.js', 'Express', 'MongoDB'];
        const careerName = 'Backend Developer';

        const result = getProjectRecommendations(matchResult, userSkills, careerName);

        expect(result.beginner).toEqual([]);
        expect(result.intermediate.length).toBeGreaterThan(0);
        expect(result.advanced.length).toBeGreaterThan(0);
    });

    it('prioritizes projects that help with essential missing skills', () => {
        const matchResult = { essentialMatchPercentage: 10, essentialMissing: ['Pandas'] }; // Below 30, beginner
        const userSkills = ['Python'];
        const careerName = 'Data Scientist';

        const result = getProjectRecommendations(matchResult, userSkills, careerName);

        // "Customer Churn Prediction" and "Exploratory Data Analysis on E-commerce Dataset" have Pandas.
        // There are other beginner projects. It should be first if it helps with missing essential skills.
        expect(result.beginner[0].helpsWithEssentialSkills).toBe(true);
    });

    it('calculates the correct properties for a recommended project', () => {
        const matchResult = { essentialMatchPercentage: 20, essentialMissing: ['React'] };
        const userSkills = ['JavaScript', 'HTML'];
        const careerName = 'Frontend Developer';

        const result = getProjectRecommendations(matchResult, userSkills, careerName);

        const firstBeginnerProject = result.beginner[0];

        expect(firstBeginnerProject).toHaveProperty('matchScore');
        expect(firstBeginnerProject).toHaveProperty('skillsToLearn');
        expect(firstBeginnerProject).toHaveProperty('helpsWithEssentialSkills');
        expect(firstBeginnerProject).toHaveProperty('readyToStart');
    });
});
