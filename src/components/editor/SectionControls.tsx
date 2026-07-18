import { Button } from "../common/Button"
import { TextInput } from "../common/Field"
import type { SectionId } from "../../domain/resume.types"
import { useResumeStore } from "../../store/resume.store"

interface SectionControlsProps {
	sectionId: SectionId
}

export function SectionControls({ sectionId }: SectionControlsProps) {
	const section = useResumeStore((state) => state.resume.sections[sectionId])
	const layout = useResumeStore((state) => state.resume.layout)
	const updateSectionTitle = useResumeStore((state) => state.updateSectionTitle)
	const setSectionVisibility = useResumeStore((state) => state.setSectionVisibility)
	const moveSectionUp = useResumeStore((state) => state.moveSectionUp)
	const moveSectionDown = useResumeStore((state) => state.moveSectionDown)
	const moveSectionToMain = useResumeStore((state) => state.moveSectionToMain)
	const moveSectionToSidebar = useResumeStore((state) => state.moveSectionToSidebar)
	const inMainColumn = layout.mainColumn.includes(sectionId)

	return (
		<div className="section-controls">
			<TextInput
				label="Section title"
				value={section.title}
				onChange={(event) => updateSectionTitle(section.id, event.target.value)}
			/>
			<label className="checkbox-field">
				<input
					type="checkbox"
					checked={section.visible}
					onChange={(event) => setSectionVisibility(section.id, event.target.checked)}
				/>
				<span>Visible</span>
			</label>
			<div className="button-row" aria-label={`${section.title} movement controls`}>
				<Button type="button" variant="secondary" onClick={() => moveSectionUp(sectionId)}>
					Move up
				</Button>
				<Button type="button" variant="secondary" onClick={() => moveSectionDown(sectionId)}>
					Move down
				</Button>
				<Button
					type="button"
					variant="secondary"
					disabled={inMainColumn}
					onClick={() => moveSectionToMain(sectionId)}
				>
					Move to main
				</Button>
				<Button
					type="button"
					variant="secondary"
					disabled={!inMainColumn}
					onClick={() => moveSectionToSidebar(sectionId)}
				>
					Move to sidebar
				</Button>
			</div>
		</div>
	)
}
