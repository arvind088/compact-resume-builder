import { Button } from "../common/Button"
import { Select, TextInput } from "../common/Field"
import type { LanguageLevel } from "../../domain/resume.types"
import { useResumeStore } from "../../store/resume.store"

const languageLevels: LanguageLevel[] = [
	"Basic",
	"Intermediate",
	"Professional",
	"Fluent",
	"Native",
]

export function LanguagesEditor() {
	const items = useResumeStore((state) => state.resume.sections.languages.items)
	const addLanguage = useResumeStore((state) => state.addLanguage)
	const updateLanguage = useResumeStore((state) => state.updateLanguage)
	const removeLanguage = useResumeStore((state) => state.removeLanguage)

	return (
		<div className="entry-stack">
			{items.map((item, index) => (
				<div className="entry-card" key={item.id}>
					<div className="entry-card__header">
						<h3>Language {index + 1}</h3>
						<Button type="button" variant="danger" onClick={() => removeLanguage(item.id)}>
							Remove
						</Button>
					</div>
					<div className="split-fields">
						<TextInput
							label="Language"
							value={item.name}
							onChange={(event) => updateLanguage(item.id, { name: event.target.value })}
						/>
						<Select
							label="Level"
							value={item.level}
							onChange={(event) =>
								updateLanguage(item.id, { level: event.target.value as LanguageLevel })
							}
						>
							{languageLevels.map((level) => (
								<option key={level} value={level}>
									{level}
								</option>
							))}
						</Select>
					</div>
				</div>
			))}
			<Button type="button" variant="secondary" onClick={addLanguage}>
				Add language
			</Button>
		</div>
	)
}
