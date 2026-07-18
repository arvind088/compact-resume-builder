import { AdditionalInformationEditor } from "./AdditionalInformationEditor"
import { BasicsEditor } from "./BasicsEditor"
import { CertificationsEditor } from "./CertificationsEditor"
import { EducationEditor } from "./EducationEditor"
import { ExperienceEditor } from "./ExperienceEditor"
import { LanguagesEditor } from "./LanguagesEditor"
import { ProjectsEditor } from "./ProjectsEditor"
import { SectionControls } from "./SectionControls"
import { SkillsEditor } from "./SkillsEditor"
import { SummaryEditor } from "./SummaryEditor"
import { SECTION_IDS, type SectionId } from "../../domain/resume.types"
import { useResumeStore } from "../../store/resume.store"

export function ContentPanel() {
	const resume = useResumeStore((state) => state.resume)
	const selectedSectionId = useResumeStore((state) => state.selectedSectionId)
	const setSelectedSection = useResumeStore((state) => state.setSelectedSection)
	const activeSectionId = selectedSectionId ?? "summary"

	return (
		<div className="panel-stack">
			<div className="panel-heading">
				<h2>Content</h2>
			</div>

			<BasicsEditor />

			<div className="section-list" aria-label="Resume sections">
				{SECTION_IDS.map((sectionId) => (
					<SectionListItem
						key={sectionId}
						sectionId={sectionId}
						selected={activeSectionId === sectionId}
						onSelect={setSelectedSection}
					/>
				))}
			</div>

			<div className="section-editor" aria-label={`${resume.sections[activeSectionId].title} editor`}>
				<SectionControls sectionId={activeSectionId} />
				{renderSectionEditor(activeSectionId)}
			</div>
		</div>
	)
}

interface SectionListItemProps {
	sectionId: SectionId
	selected: boolean
	onSelect(sectionId: SectionId): void
}

function SectionListItem({ sectionId, selected, onSelect }: SectionListItemProps) {
	const section = useResumeStore((state) => state.resume.sections[sectionId])

	return (
		<button
			type="button"
			className={selected ? "section-list__item section-list__item--selected" : "section-list__item"}
			onClick={() => onSelect(sectionId)}
		>
			<span>{section.title}</span>
			<span className={section.visible ? "visibility-pill" : "visibility-pill visibility-pill--hidden"}>
				{section.visible ? "Shown" : "Hidden"}
			</span>
		</button>
	)
}

function renderSectionEditor(sectionId: SectionId) {
	switch (sectionId) {
		case "summary":
			return <SummaryEditor />
		case "experience":
			return <ExperienceEditor />
		case "education":
			return <EducationEditor />
		case "skills":
			return <SkillsEditor />
		case "languages":
			return <LanguagesEditor />
		case "projects":
			return <ProjectsEditor />
		case "certifications":
			return <CertificationsEditor />
		case "additionalInformation":
			return <AdditionalInformationEditor />
	}
}
