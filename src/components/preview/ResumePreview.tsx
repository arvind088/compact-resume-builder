import type { CSSProperties } from "react"
import type {
	AdditionalInformationSection,
	CertificationsSection,
	EducationSection,
	ExperienceSection,
	LanguagesSection,
	ProjectsSection,
	SectionId,
	SkillsSection,
	SummarySection,
} from "../../domain/resume.types"
import { useResumeStore } from "../../store/resume.store"

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
			<article className="resume-page" style={resumeStyle} aria-label="Resume preview">
				<div className="resume-header" role="group" aria-label="Resume header">
					<h2>{resume.basics.fullName || "Your Name"}</h2>
					{resume.basics.professionalTitle ? <p>{resume.basics.professionalTitle}</p> : null}
					<ul aria-label="Contact details">
						{resume.basics.email ? <li>{resume.basics.email}</li> : null}
						{resume.basics.phone ? <li>{resume.basics.phone}</li> : null}
						{resume.basics.location ? <li>{resume.basics.location}</li> : null}
						{resume.basics.linkedin ? <li>{resume.basics.linkedin}</li> : null}
						{resume.basics.github ? <li>{resume.basics.github}</li> : null}
						{resume.basics.website ? <li>{resume.basics.website}</li> : null}
					</ul>
				</div>

				<div className="resume-columns">
					<div className="resume-column resume-column--main">
						{resume.layout.mainColumn.map((sectionId) => (
							<ResumeSection key={sectionId} sectionId={sectionId} />
						))}
					</div>
					<aside className="resume-column resume-column--sidebar">
						{resume.layout.sidebar.map((sectionId) => (
							<ResumeSection key={sectionId} sectionId={sectionId} />
						))}
					</aside>
				</div>
			</article>
		</div>
	)
}

interface ResumeSectionProps {
	sectionId: SectionId
}

function ResumeSection({ sectionId }: ResumeSectionProps) {
	const section = useResumeStore((state) => state.resume.sections[sectionId])

	if (!section.visible) {
		return null
	}

	return (
		<section className="resume-section">
			<h3>{section.title}</h3>
			{renderSectionContent(section)}
		</section>
	)
}

function renderSectionContent(
	section:
		| SummarySection
		| ExperienceSection
		| EducationSection
		| SkillsSection
		| LanguagesSection
		| ProjectsSection
		| CertificationsSection
		| AdditionalInformationSection,
) {
	switch (section.id) {
		case "summary":
			return <p>{section.content || "Summary"}</p>
		case "experience":
			return section.items.map((item) => (
				<div className="resume-entry" key={item.id}>
					<strong>{item.jobTitle || "Job title"}</strong>
					<span>{[item.company || "Company", item.location].filter(Boolean).join(" | ")}</span>
					<span>
						{[item.startDate, item.isCurrent ? "Present" : item.endDate].filter(Boolean).join(" - ")}
					</span>
					{item.highlights.some(Boolean) ? (
						<ul>
							{item.highlights.filter(Boolean).map((highlight) => (
								<li key={highlight}>{highlight}</li>
							))}
						</ul>
					) : null}
				</div>
			))
		case "education":
			return section.items.map((item) => (
				<div className="resume-entry" key={item.id}>
					<strong>{item.degree || "Degree"}</strong>
					<span>{[item.institution || "Institution", item.location].filter(Boolean).join(" | ")}</span>
					<span>{[item.startDate, item.endDate].filter(Boolean).join(" - ")}</span>
					{item.description ? <p>{item.description}</p> : null}
				</div>
			))
		case "skills":
			return <p>{section.items.map((item) => item.name).filter(Boolean).join(", ") || "Skills"}</p>
		case "languages":
			return (
				<p>
					{section.items
						.map((item) => [item.name, item.level].filter(Boolean).join(" - "))
						.filter(Boolean)
						.join(", ") || "Languages"}
				</p>
			)
		case "projects":
			return section.items.length ? (
				section.items.map((item) => (
					<div className="resume-entry" key={item.id}>
						<strong>{item.name}</strong>
						<span>{item.description}</span>
						{item.technologies.some(Boolean) ? (
							<span>{item.technologies.filter(Boolean).join(", ")}</span>
						) : null}
						{item.url ? <span>{item.url}</span> : null}
					</div>
				))
			) : (
				<p>Projects</p>
			)
		case "certifications":
			return section.items.length ? (
				section.items.map((item) => (
					<div className="resume-entry" key={item.id}>
						<strong>{item.name}</strong>
						<span>{[item.issuer, item.issueDate].filter(Boolean).join(" | ")}</span>
						{item.url ? <span>{item.url}</span> : null}
					</div>
				))
			) : (
				<p>Certifications</p>
			)
		case "additionalInformation":
			return <p>{section.content || "Additional information"}</p>
	}
}
