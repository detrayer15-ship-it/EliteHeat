import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skill } from '@/types/skill'

export const SkillsPage = () => {
    const [skills, setSkills] = useState<Skill[]>([])

    useEffect(() => {
        fetch('/data/skills.json')
            .then((res) => res.json())
            .then((data) => setSkills(data))
    }, [])

    return (
        <div>
            <h1 className="text-3xl font-bold text-text mb-2">Навыки</h1>
            <p className="text-gray-600 mb-6">Развивайте ключевые компетенции через проекты</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill) => (
                    <Card key={skill.id}>
                        <div className="mb-3">
                            <h3 className="text-lg font-semibold text-text mb-1">{skill.title}</h3>
                            <p className="text-sm text-gray-600">{skill.description}</p>
                        </div>
                        <div className="mb-2">
                            <span className="text-xs text-gray-500">{skill.category}</span>
                        </div>
                        <ProgressBar value={skill.progress} />
                    </Card>
                ))}
            </div>
        </div>
    )
}
