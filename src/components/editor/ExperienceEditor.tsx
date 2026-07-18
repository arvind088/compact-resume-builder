import { Button } from "../common/Button"
import { TextInput } from "../common/Field"
import { useResumeStore } from "../../store/resume.store"

export function ExperienceEditor() {
	const items = useResumeStore((state) => state.resume.sections.experience.items)
	const addExperience = useResumeStore((state) => state.addExperience)
	const updateExperience = useResumeStore((state) => state.updateExperience)
	const removeExperience = useResumeStore((state) => state.removeExperience)
	const addExperienceHighlight = useResumeStore((state) => state.addExperienceHighlight)
	const updateExperienceHighlight = useResumeStore((state) => state.updateExperienceHighlight)
	const removeExperienceHighlight = useResumeStore((state) => state.removeExperienceHighlight)

	return (
		<div className="entry-stack">
			{items.map((item, entryIndex) => (
				<div className="entry-card" key={item.id}>
					<div className="entry-card__header">
						<h3>Experience {entryIndex + 1}</h3>
						<Button type="button" variant="danger" onClick={() => removeExperience(item.id)}>
							Remove
						</Button>
					</div>
					<div className="form-grid">
						<TextInput
							label="Job title"
							value={item.jobTitle}
							onChange={(event) => updateExperience(item.id, { jobTitle: event.target.value })}
						/>
						<TextInput
							label="Company"
							value={item.company}
							onChange={(event) => updateExperience(item.id, { company: event.target.value })}
						/>
						<TextInput
							label="Experience location"
							value={item.location}
							onChange={(event) => updateExperience(item.id, { location: event.target.value })}
						/>
						<div className="split-fields">
							<TextInput
								label="Start date"
								value={item.startDate}
								onChange={(event) => updateExperience(item.id, { startDate: event.target.value })}
							/>
							<TextInput
								label="End date"
								value={item.endDate}
								disabled={item.isCurrent}
								onChange={(event) => updateExperience(item.id, { endDate: event.target.value })}
							/>
						</div>
						<label className="checkbox-field">
							<input
								type="checkbox"
								checked={item.isCurrent}
								onChange={(event) => updateExperience(item.id, { isCurrent: event.target.checked })}
							/>
							<span>Current position</span>
						</label>
						<div className="entry-subsection">
							<div className="entry-card__header">
								<h4>Highlights</h4>
								<Button type="button" variant="secondary" onClick={() => addExperienceHighlight(item.id)}>
									Add highlight
								</Button>
							</div>
							{item.highlights.map((highlight, highlightIndex) => (
								<div className="inline-row" key={`${item.id}-${highlightIndex}`}>
									<TextInput
										label={`Highlight ${highlightIndex + 1}`}
										value={highlight}
										onChange={(event) =>
											updateExperienceHighlight(item.id, highlightIndex, event.target.value)
										}
									/>
									<Button
										type="button"
										variant="danger"
										onClick={() => removeExperienceHighlight(item.id, highlightIndex)}
									>
										Remove
									</Button>
								</div>
							))}
						</div>
					</div>
				</div>
			))}
			<Button type="button" variant="secondary" onClick={addExperience}>
				Add experience
			</Button>
		</div>
	)
}
