import { Button } from "../common/Button"
import { TextArea, TextInput } from "../common/Field"
import { useResumeStore } from "../../store/resume.store"

export function ProjectsEditor() {
	const items = useResumeStore((state) => state.resume.sections.projects.items)
	const addProject = useResumeStore((state) => state.addProject)
	const updateProject = useResumeStore((state) => state.updateProject)
	const removeProject = useResumeStore((state) => state.removeProject)

	return (
		<div className="entry-stack">
			{items.map((item, index) => (
				<div className="entry-card" key={item.id}>
					<div className="entry-card__header">
						<h3>Project {index + 1}</h3>
						<Button type="button" variant="danger" onClick={() => removeProject(item.id)}>
							Remove
						</Button>
					</div>
					<div className="form-grid">
						<TextInput
							label="Project name"
							value={item.name}
							onChange={(event) => updateProject(item.id, { name: event.target.value })}
						/>
						<TextArea
							label="Project description"
							value={item.description}
							rows={3}
							onChange={(event) => updateProject(item.id, { description: event.target.value })}
						/>
						<TextInput
							label="Technologies"
							value={item.technologies.join(", ")}
							onChange={(event) =>
								updateProject(item.id, {
									technologies: event.target.value
										.split(",")
										.map((technology) => technology.trim()),
								})
							}
						/>
						<TextInput
							label="Project URL"
							type="url"
							value={item.url}
							onChange={(event) => updateProject(item.id, { url: event.target.value })}
						/>
					</div>
				</div>
			))}
			<Button type="button" variant="secondary" onClick={addProject}>
				Add project
			</Button>
		</div>
	)
}
