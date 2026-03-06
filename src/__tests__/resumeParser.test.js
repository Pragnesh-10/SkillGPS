import { describe, it, expect } from 'vitest';
import { extractContactInfo } from '../utils/resumeParser';

describe('resumeParser extractContactInfo', () => {
    it('returns empty arrays when no contact info is present', () => {
        const text = 'This is a normal text without any contact information.';
        const result = extractContactInfo(text);
        expect(result).toEqual({
            emails: [],
            phones: [],
            linkedIn: []
        });
    });

    it('extracts emails correctly', () => {
        const text = 'Contact me at test.user@example.com or secondary-email@domain.co.uk';
        const result = extractContactInfo(text);
        expect(result.emails).toEqual(['test.user@example.com', 'secondary-email@domain.co.uk']);
        expect(result.phones).toEqual([]);
        expect(result.linkedIn).toEqual([]);
    });

    it('extracts phone numbers correctly in various formats', () => {
        const text = `
            Home: 123-456-7890
            Mobile: (987) 654-3210
            Work: +1 234 567 8901
            Other: 555.666.7777
        `;
        const result = extractContactInfo(text);
        // We match exactly what the regex extracts
        expect(result.phones).toEqual([
            '123-456-7890',
            '(987) 654-3210',
            '+1 234 567 8901',
            '555.666.7777'
        ]);
        expect(result.emails).toEqual([]);
        expect(result.linkedIn).toEqual([]);
    });

    it('extracts LinkedIn profiles correctly', () => {
        const text = `
            Profile: linkedin.com/in/johndoe
            Or find me here: www.linkedin.com/in/john-doe-123
            Full URL: https://www.linkedin.com/in/jane_smith/
        `;
        const result = extractContactInfo(text);
        expect(result.linkedIn).toEqual([
            'linkedin.com/in/johndoe',
            'linkedin.com/in/john-doe-123',
            'linkedin.com/in/jane_smith'
        ]);
        expect(result.emails).toEqual([]);
        expect(result.phones).toEqual([]);
    });

    it('extracts mixed contact information from a resume-like text', () => {
        const text = `
            John Doe
            Software Engineer
            San Francisco, CA
            Email: john.doe@example.com | Phone: (555) 123-4567
            LinkedIn: https://linkedin.com/in/johndoe99

            Experience:
            - Developed web applications...

            Contact my references at ref1@test.com and 999-888-7777.
        `;
        const result = extractContactInfo(text);
        expect(result.emails).toEqual(['john.doe@example.com', 'ref1@test.com']);
        expect(result.phones).toEqual(['(555) 123-4567', '999-888-7777']);
        expect(result.linkedIn).toEqual(['linkedin.com/in/johndoe99']);
    });
});
