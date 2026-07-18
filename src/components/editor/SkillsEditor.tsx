import { Button } from "../common/Button"
import { TextInput } from "../common/Field"
import { useResumeStore } from "../../store/resume.store"

export function SkillsEditor() {
	const items = useResumeStore((state) => state.resume.sections.skills.items)
	const addSkill = useResumeStore((state) => state.addSkill)
	const updateSkill = useResumeStore((state) => state.updateSkill)
	const removeSkill = useResumeStore((state) => state.removeSkill)

	return (
		<div className="entry-stack">
			{items.map((item, index) => (
				<div className="inline-row" key={item.id}>
					<TextInput
						label={`Skill ${index + 1}`}
						value={item.name}
						onChange={(event) => updateSkill(item.id, { name: event.target.value })}
					/>
					<Button type="button" variant="danger" onClick={() => removeSkill(item.id)}>
						Remove
					</Button>
				</div>
			))}
			<Button type="button" variant="secondary" onClick={addSkill}>
				Add skill
			</Button>
		</div>
	)
}
