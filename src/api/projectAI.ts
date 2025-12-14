import { sendTextMessage } from './gemini'

/**
 * Generate roadmap based on project idea using Gemini AI
 */
export async function generateRoadmap(projectIdea: string, projectTitle: string) {
    const prompt = `Act as a Senior Project Manager and Technical Mentor.

Project Title: ${projectTitle}
Project Idea: ${projectIdea}

Task: Create a detailed 7-step roadmap for this project.

Return ONLY a JSON object in this exact format (no markdown, no explanation):
{
  "roadmap": [
    {"id": "1", "title": "Step title", "isCompleted": false, "order": 1},
    ...7 items total
  ],
  "essence": "Brief project essence (2-3 sentences)",
  "goal": "Main project goal",
  "painPoint": "User pain point this solves"
}

Make steps specific and actionable.`

    try {
        const response = await sendTextMessage(prompt)

        // Try to extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }

        throw new Error('Invalid JSON response')
    } catch (error) {
        console.error('Error generating roadmap:', error)
        throw error
    }
}

/**
 * Generate prompts based on tech stack using Gemini AI
 */
export async function generatePrompts(
    techStack: { frontend?: string; backend?: string; db?: string },
    description: string,
    title: string
) {
    const prompt = `Act as a Senior Software Architect.

Project: ${title}
Description: ${description}
Tech Stack:
- Frontend: ${techStack.frontend || 'React'}
- Backend: ${techStack.backend || 'Node.js'}
- Database: ${techStack.db || 'PostgreSQL'}

Task: Create 3 detailed AI prompts for code generation.

Return ONLY a JSON object (no markdown):
{
  "prompts": [
    {
      "id": "1",
      "title": "Database Schema",
      "category": "database",
      "content": "Detailed prompt for database design..."
    },
    {
      "id": "2",
      "title": "Backend API",
      "category": "backend",
      "content": "Detailed prompt for backend development..."
    },
    {
      "id": "3",
      "title": "Frontend Components",
      "category": "frontend",
      "content": "Detailed prompt for frontend development..."
    }
  ]
}

Each prompt should be detailed and include:
- Role (Act as...)
- Context (project details)
- Specific requirements
- Best practices to follow`

    try {
        const response = await sendTextMessage(prompt)
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        throw new Error('Invalid JSON response')
    } catch (error) {
        console.error('Error generating prompts:', error)
        throw error
    }
}

/**
 * Generate presentation slides using Gemini AI
 */
export async function generateSlides(projectData: {
    title: string
    description: string
    problem?: string
    solution?: string
    techStack?: { frontend?: string; backend?: string; db?: string }
}) {
    const prompt = `Act as a Presentation Coach and Public Speaking Expert.

Project: ${projectData.title}
Description: ${projectData.description}
Problem: ${projectData.problem || 'Not specified'}
Solution: ${projectData.solution || 'Not specified'}
Tech Stack: ${projectData.techStack?.frontend || 'React'}, ${projectData.techStack?.backend || 'Node.js'}, ${projectData.techStack?.db || 'PostgreSQL'}

Task: Create a 5-slide presentation structure for project defense.

Return ONLY a JSON object (no markdown):
{
  "slides": [
    {
      "id": "1",
      "order": 1,
      "title": "Slide title",
      "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "speakerNotes": "What to say during this slide..."
    },
    ...5 slides total
  ]
}

Slides should cover:
1. Problem/Pain Point
2. Solution
3. Technologies
4. Demo/Results
5. Future Plans

Speaker notes should be conversational and include:
- Opening hooks
- Key talking points
- Transition phrases
- Potential questions to address`

    try {
        const response = await sendTextMessage(prompt)
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        throw new Error('Invalid JSON response')
    } catch (error) {
        console.error('Error generating slides:', error)
        throw error
    }
}

/**
 * Context-aware AI chat for project assistance
 */
export async function projectAIChat(
    message: string,
    context: 'roadmap' | 'prompts' | 'storyboard',
    projectData: any
) {
    let systemPrompt = ''

    switch (context) {
        case 'roadmap':
            systemPrompt = `You are a Project Management Mentor helping a student plan their project.

Project: ${projectData.title}
Current Progress: ${projectData.progress || 0}%

Help them with:
- Planning next steps
- Breaking down tasks
- Setting priorities
- Tracking progress

Be encouraging and specific.`
            break

        case 'prompts':
            systemPrompt = `You are a Senior Software Architect helping configure AI prompts.

Project: ${projectData.title}
Tech Stack: ${JSON.stringify(projectData.techStack || {})}

Help them with:
- Choosing technologies
- Creating effective prompts
- Optimizing code generation
- Best practices

Be technical but clear.`
            break

        case 'storyboard':
            systemPrompt = `You are a Presentation Coach helping prepare for project defense.

Project: ${projectData.title}

Help them with:
- Improving slide content
- Writing speaker notes
- Answering tough questions
- Building confidence

Be supportive and practical.`
            break
    }

    const fullPrompt = `${systemPrompt}

Student's question: ${message}

Provide a helpful, concise answer in Russian.`

    try {
        return await sendTextMessage(fullPrompt)
    } catch (error) {
        console.error('Error in project AI chat:', error)
        throw error
    }
}
