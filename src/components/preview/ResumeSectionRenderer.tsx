import type {
	AdditionalInformationSection,
	CertificationsSection,
	EducationSection,
	ExperienceSection,
	LanguagesSection,
	ProjectsSection,
	ResumeSections,
	SectionId,
	SkillsSection,
	SummarySection,
} from "../../domain/resume.types"
import { SectionHeading } from "../../templates/compact-two-column/SectionHeading"

interface ResumeSectionRendererProps {
	sectionId: SectionId
	sections: ResumeSections
}

type RenderableSection =
	| SummarySection
	| ExperienceSection
	| EducationSection
	| SkillsSection
	| LanguagesSection
	| ProjectsSection
	| CertificationsSection
	| AdditionalInformationSection

export function ResumeSectionRenderer({ sectionId, sections }: ResumeSectionRendererProps) {
	const section = sections[sectionId]

	if (!section.visible) {
		return null
	}

	return (
		<section className="resume-section">
			<SectionHeading>{section.title}</SectionHeading>
			{renderSectionContent(section)}
		</section>
	)
}

function renderSectionContent(section: RenderableSection) {
	switch (section.id) {
		case "summary":
			return renderParagraph(section.content, "Summary")
		case "experience":
			return section.items.map((item) => (
				<div className="resume-entry" key={item.id}>
					<div className="resume-entry__line">
						<strong>{item.jobTitle || "Job title"}</strong>
						<Metadata values={[item.startDate, item.isCurrent ? "Present" : item.endDate]} />
					</div>
					<Metadata values={[item.company || "Company", item.location]} />
					{item.highlights.some(Boolean) ? (
						<ul className="resume-bullets">
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
					<div className="resume-entry__line">
						<strong>{item.degree || "Degree"}</strong>
						<Metadata values={[item.startDate, item.endDate]} />
					</div>
					<Metadata values={[item.institution || "Institution", item.location]} />
					{item.description ? <p>{item.description}</p> : null}
				</div>
			))
		case "skills":
			return section.items.some((item) => item.name) ? (
				<ul className="resume-tags">
					{section.items
						.filter((item) => item.name)
						.map((item) => (
							<li key={item.id}>{item.name}</li>
						))}
				</ul>
			) : (
				renderPlaceholder("Skills")
			)
		case "languages":
			return section.items.some((item) => item.name) ? (
				<ul className="resume-list">
					{section.items
						.filter((item) => item.name)
						.map((item) => (
							<li key={item.id}>
								<strong>{item.name}</strong>
								<span>{item.level}</span>
							</li>
						))}
				</ul>
			) : (
				renderPlaceholder("Languages")
			)
		case "projects":
			return section.items.length ? (
				section.items.map((item) => (
					<div className="resume-entry" key={item.id}>
						<div className="resume-entry__line">
							<strong>{item.name || "Project name"}</strong>
							{item.url ? <ResumeLink href={item.url}>{item.url}</ResumeLink> : null}
						</div>
						{item.description ? <p>{item.description}</p> : null}
						{item.technologies.some(Boolean) ? (
							<ul className="resume-tags">
								{item.technologies.filter(Boolean).map((technology) => (
									<li key={technology}>{technology}</li>
								))}
							</ul>
						) : null}
					</div>
				))
			) : (
				renderPlaceholder("Projects")
			)
		case "certifications":
			return section.items.length ? (
				section.items.map((item) => (
					<div className="resume-entry" key={item.id}>
						<div className="resume-entry__line">
							<strong>{item.name || "Certification"}</strong>
							<Metadata values={[item.issueDate]} />
						</div>
						<Metadata values={[item.issuer]} />
						{item.url ? <ResumeLink href={item.url}>{item.url}</ResumeLink> : null}
					</div>
				))
			) : (
				renderPlaceholder("Certifications")
			)
		case "additionalInformation":
			return renderParagraph(section.content, "Additional information")
	}
}

function Metadata({ values }: { values: string[] }) {
	const label = values.filter(Boolean).join(" | ")

	if (!label) {
		return null
	}

	return <span className="resume-meta">{label}</span>
}

function ResumeLink({ children, href }: { children: string; href: string }) {
	const resolvedHref = href.startsWith("http://") || href.startsWith("https://") ? href : `https://${href}`

	return (
		<a className="resume-link" href={resolvedHref} target="_blank" rel="noreferrer">
			{children}
		</a>
	)
}

function renderParagraph(value: string, placeholder: string) {
	return value ? <p>{value}</p> : renderPlaceholder(placeholder)
}

function renderPlaceholder(label: string) {
	return <p className="resume-placeholder">{label}</p>
}
