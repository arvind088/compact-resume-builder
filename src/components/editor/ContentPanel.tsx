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
import { SectionLayoutOrganizer } from "../drag-drop/SectionLayoutOrganizer"
import type { SectionId } from "../../domain/resume.types"
import { useResumeStore } from "../../store/resume.store"

export function ContentPanel() {
	const resume = useResumeStore((state) => state.resume)
	const selectedSectionId = useResumeStore((state) => state.selectedSectionId)
	const activeSectionId = selectedSectionId ?? "summary"

	return (
		<div className="panel-stack">
			<div className="panel-heading">
				<h2>Content</h2>
			</div>

			<BasicsEditor />

			<SectionLayoutOrganizer />

			<div className="section-editor" aria-label={`${resume.sections[activeSectionId].title} editor`}>
				<SectionControls sectionId={activeSectionId} />
				{renderSectionEditor(activeSectionId)}
			</div>
		</div>
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
