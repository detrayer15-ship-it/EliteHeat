/**
 * Parse Teacher Format response into structured sections
 */
export interface TeacherFormatSections {
    question?: string;
    topic?: string;
    answer?: string;
    example?: string;
    missingData?: string;
    clarification?: string[];
    rawContent: string;
}

/**
 * Extract section content from AI response
 */
function extractSection(content: string, sectionName: string): string | null {
    const regex = new RegExp(`${sectionName}\\s*([^\\n]+(?:\\n(?!(?:Вопрос:|Тема:|Ответ:|Пример:|Не хватает данных:|Уточни:))[^\\n]+)*)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
}

/**
 * Extract clarification points (numbered list)
 */
function extractClarifications(content: string): string[] | null {
    const clarifyMatch = content.match(/Уточни:\s*(.+?)(?=\n\n|$)/is);
    if (!clarifyMatch) return null;

    const clarifyText = clarifyMatch[1];
    const points = clarifyText.match(/\d+\)\s*[^\n]+/g);

    return points ? points.map(p => p.replace(/^\d+\)\s*/, '').trim()) : null;
}

/**
 * Parse Teacher Format response
 */
export function parseTeacherFormat(content: string): TeacherFormatSections {
    const sections: TeacherFormatSections = {
        rawContent: content
    };

    // Extract main sections
    sections.question = extractSection(content, 'Вопрос:');
    sections.topic = extractSection(content, 'Тема:');
    sections.answer = extractSection(content, 'Ответ:');
    sections.example = extractSection(content, 'Пример:');
    sections.missingData = extractSection(content, 'Не хватает данных:');

    // Extract clarifications
    const clarifications = extractClarifications(content);
    if (clarifications) {
        sections.clarification = clarifications;
    }

    return sections;
}

/**
 * Check if content follows Teacher Format
 */
export function isTeacherFormat(content: string): boolean {
    return content.includes('Вопрос:') || content.includes('Не хватает данных:');
}
