import { Button } from "../common/Button"
import { TextArea, TextInput } from "../common/Field"
import { useResumeStore } from "../../store/resume.store"
import { EntryOrderControls } from "./EntryOrderControls"

export function EducationEditor() {
	const items = useResumeStore((state) => state.resume.sections.education.items)
	const addEducation = useResumeStore((state) => state.addEducation)
	const updateEducation = useResumeStore((state) => state.updateEducation)
	const removeEducation = useResumeStore((state) => state.removeEducation)
	const reorderEducation = useResumeStore((state) => state.reorderEducation)
	const itemIds = items.map((item) => item.id)

	return (
		<div className="entry-stack">
			{items.map((item, entryIndex) => (
				<div className="entry-card" key={item.id}>
					<div className="entry-card__header">
						<h3>Education {entryIndex + 1}</h3>
						<div className="entry-card__actions">
							<EntryOrderControls
								index={entryIndex}
								itemId={item.id}
								itemIds={itemIds}
								label={`Education ${entryIndex + 1}`}
								onReorder={reorderEducation}
							/>
							<Button type="button" variant="danger" onClick={() => removeEducation(item.id)}>
								Remove
							</Button>
						</div>
					</div>
					<div className="form-grid">
						<TextInput
							label="Degree"
							value={item.degree}
							onChange={(event) => updateEducation(item.id, { degree: event.target.value })}
						/>
						<TextInput
							label="Institution"
							value={item.institution}
							onChange={(event) => updateEducation(item.id, { institution: event.target.value })}
						/>
						<TextInput
							label="Education location"
							value={item.location}
							onChange={(event) => updateEducation(item.id, { location: event.target.value })}
						/>
						<div className="split-fields">
							<TextInput
								label="Education start"
								value={item.startDate}
								onChange={(event) => updateEducation(item.id, { startDate: event.target.value })}
							/>
							<TextInput
								label="Education end"
								value={item.endDate}
								onChange={(event) => updateEducation(item.id, { endDate: event.target.value })}
							/>
						</div>
						<TextArea
							label="Education description"
							value={item.description}
							rows={3}
							onChange={(event) => updateEducation(item.id, { description: event.target.value })}
						/>
					</div>
				</div>
			))}
			<Button type="button" variant="secondary" onClick={addEducation}>
				Add education
			</Button>
		</div>
	)
}
