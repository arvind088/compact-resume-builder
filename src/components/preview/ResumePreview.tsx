import type { CSSProperties } from "react"
import { CompactTwoColumnTemplate } from "../../templates/compact-two-column/CompactTwoColumnTemplate"
import { useResumeStore } from "../../store/resume.store"
import "../../templates/compact-two-column/compact-two-column.css"

type ResumeStyle = CSSProperties & {
	"--resume-font-family": string
	"--resume-body-size": string
	"--resume-heading-size": string
	"--resume-line-height": number
	"--resume-section-spacing": string
	"--resume-main-column-width": string
	"--resume-sidebar-width": string
	"--resume-page-padding": string
	"--resume-accent-color": string
}

export function ResumePreview() {
	const resume = useResumeStore((state) => state.resume)
	const sidebarWidth = 100 - resume.theme.mainColumnWidth
	const resumeStyle: ResumeStyle = {
		"--resume-font-family": resume.theme.fontFamily,
		"--resume-body-size": `${resume.theme.bodyFontSize}pt`,
		"--resume-heading-size": `${resume.theme.headingFontSize}pt`,
		"--resume-line-height": resume.theme.lineHeight,
		"--resume-section-spacing": `${resume.theme.sectionSpacing}px`,
		"--resume-main-column-width": `${resume.theme.mainColumnWidth}%`,
		"--resume-sidebar-width": `${sidebarWidth}%`,
		"--resume-page-padding": `${resume.theme.pagePadding}mm`,
		"--resume-accent-color": resume.theme.accentColor,
	}

	return (
		<div className="preview-stage">
			<CompactTwoColumnTemplate resume={resume} style={resumeStyle} />
		</div>
	)
}
