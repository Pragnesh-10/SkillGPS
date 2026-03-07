import { describe, it, expect } from 'vitest';
import { parseResume, extractContactInfo } from '../utils/resumeParser';

describe('resumeParser parseResume', () => {
    it('handles empty and invalid inputs gracefully', () => {
        const invalidInputs = [null, undefined, '', 123, {}, []];

        invalidInputs.forEach(input => {
            const result = parseResume(input);
            expect(result).toHaveProperty('skills');
            expect(result.skills).toEqual([]);
            expect(result).toHaveProperty('categorizedSkills');
            expect(result).toHaveProperty('rawText', '');
            expect(result).toHaveProperty('sections');
            expect(result.sections).toEqual({});
        });
    });

    it('extracts basic skills correctly', () => {
        const text = "I am a software engineer with experience in JavaScript, Python, and React.";
        const result = parseResume(text);

        expect(result.skills).toContain('javascript');
        expect(result.skills).toContain('python');
        expect(result.skills).toContain('react');

        expect(result.categorizedSkills.programming).toContain('javascript');
        expect(result.categorizedSkills.programming).toContain('python');
        expect(result.categorizedSkills.frameworks).toContain('react');
    });

    it('is case insensitive when extracting skills', () => {
        const text = "jAvAsCrIpT PyThOn REACT";
        const result = parseResume(text);

        expect(result.skills).toContain('javascript');
        expect(result.skills).toContain('python');
        expect(result.skills).toContain('react');
    });

    it('uses boundary matching to avoid partial word matches', () => {
        const text = "I like javascripting and javabeans.";
        const result = parseResume(text);

        expect(result.skills).not.toContain('java');
        expect(result.skills).not.toContain('javascript');
    });

    it('extracts skills from a realistic resume format', () => {
        const text = `
            John Doe
            Software Engineer

            Skills:
            JavaScript, TypeScript, Node.js, Express, React, MongoDB

            Experience:
            Built a web app using React and Node.js.
        `;
        const result = parseResume(text);

        expect(result.skills).toContain('javascript');
        expect(result.skills).toContain('typescript');
        expect(result.skills).toContain('node.js');
        expect(result.skills).toContain('express');
        expect(result.skills).toContain('react');
        expect(result.skills).toContain('mongodb');
    });

    it('extracts sections from resume text', () => {
        const text = `
            Summary
            I am a software engineer.

            Skills:
            JavaScript, Python

            Experience:
            Software Engineer at Tech Corp.

            Education
            BS in Computer Science
        `;
        const result = parseResume(text);

        expect(result.sections).toHaveProperty('summary');
        expect(result.sections.summary).toContain('I am a software engineer.');

        expect(result.sections).toHaveProperty('skills');
        expect(result.sections.skills).toContain('JavaScript, Python');

        expect(result.sections).toHaveProperty('experience');
        expect(result.sections.experience).toContain('Software Engineer at Tech Corp.');

        expect(result.sections).toHaveProperty('education');
        expect(result.sections.education).toContain('BS in Computer Science');
    });

    it('parses projects from the projects section', () => {
        const text = `
            Projects
            PORTFOLIO WEBSITE
            Built a personal portfolio website using React and Tailwind CSS.

            TASK MANAGER API
            Created a REST api using Node.js, Express, and MongoDB.
        `;
        const result = parseResume(text);

        expect(result.projects).toHaveLength(2);

        const project1 = result.projects.find(p => p.title === 'PORTFOLIO WEBSITE');
        expect(project1).toBeDefined();
        expect(project1.technologies).toContain('react');
        expect(project1.technologies).toContain('css');

        const project2 = result.projects.find(p => p.title === 'TASK MANAGER API');
        expect(project2).toBeDefined();
        expect(project2.technologies).toContain('node.js');
        expect(project2.technologies).toContain('express');
        expect(project2.technologies).toContain('mongodb');
        expect(project2.technologies).toContain('rest api');
    });
});

describe('resumeParser extractContactInfo', () => {
    it('extracts email addresses', () => {
        const text = "Contact me at test@example.com or john.doe_123@company.co.uk";
        const result = extractContactInfo(text);
        expect(result.emails).toEqual(['test@example.com', 'john.doe_123@company.co.uk']);
    });

    it('extracts phone numbers', () => {
        const text = "Call me: 123-456-7890 or (555) 987-6543 or +1 800 555 1234";
        const result = extractContactInfo(text);
        expect(result.phones).toEqual(['123-456-7890', '(555) 987-6543', '+1 800 555 1234']);
    });

    it('extracts LinkedIn URLs', () => {
        const text = "My profile is linkedin.com/in/johndoe or LINKEDIN.COM/IN/JANE-DOE";
        const result = extractContactInfo(text);
        expect(result.linkedIn).toEqual(['linkedin.com/in/johndoe', 'LINKEDIN.COM/IN/JANE-DOE']);
    });

    it('returns empty arrays when no contact info is found', () => {
        const text = "No contact info here.";
        const result = extractContactInfo(text);
        expect(result.emails).toEqual([]);
        expect(result.phones).toEqual([]);
        expect(result.linkedIn).toEqual([]);
    });
});
