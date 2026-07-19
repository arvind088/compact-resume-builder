import { Button } from "../common/Button"
import { TextInput } from "../common/Field"
import { useResumeStore } from "../../store/resume.store"
import { EntryOrderControls } from "./EntryOrderControls"

export function SkillsEditor() {
	const items = useResumeStore((state) => state.resume.sections.skills.items)
	const addSkill = useResumeStore((state) => state.addSkill)
	const updateSkill = useResumeStore((state) => state.updateSkill)
	const removeSkill = useResumeStore((state) => state.removeSkill)
	const reorderSkills = useResumeStore((state) => state.reorderSkills)
	const itemIds = items.map((item) => item.id)

	return (
		<div className="entry-stack">
			{items.map((item, index) => (
				<div className="inline-row inline-row--ordered" key={item.id}>
					<TextInput
						label={`Skill ${index + 1}`}
						value={item.name}
						onChange={(event) => updateSkill(item.id, { name: event.target.value })}
					/>
					<div className="entry-card__actions">
						<EntryOrderControls
							index={index}
							itemId={item.id}
							itemIds={itemIds}
							label={`Skill ${index + 1}`}
							onReorder={reorderSkills}
						/>
						<Button type="button" variant="danger" onClick={() => removeSkill(item.id)}>
							Remove
						</Button>
					</div>
				</div>
			))}
			<Button type="button" variant="secondary" onClick={addSkill}>
				Add skill
			</Button>
		</div>
	)
}
