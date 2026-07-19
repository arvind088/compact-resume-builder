import type { CSSProperties } from "react"
import { ResumeHeader } from "../../components/preview/ResumeHeader"
import { ResumeSectionRenderer } from "../../components/preview/ResumeSectionRenderer"
import type { ResumeDocument } from "../../domain/resume.types"

interface CompactTwoColumnTemplateProps {
	resume: ResumeDocument
	style: CSSProperties
}

export function CompactTwoColumnTemplate({ resume, style }: CompactTwoColumnTemplateProps) {
	return (
		<article className="resume-page compact-template" style={style} aria-label="Resume preview">
			<ResumeHeader basics={resume.basics} />

			<div className="resume-columns">
				<main className="resume-column resume-column--main" aria-label="Main resume sections">
					{resume.layout.mainColumn.map((sectionId) => (
						<ResumeSectionRenderer key={sectionId} sectionId={sectionId} sections={resume.sections} />
					))}
				</main>
				<aside className="resume-column resume-column--sidebar" aria-label="Sidebar resume sections">
					{resume.layout.sidebar.map((sectionId) => (
						<ResumeSectionRenderer key={sectionId} sectionId={sectionId} sections={resume.sections} />
					))}
				</aside>
			</div>
		</article>
	)
}
