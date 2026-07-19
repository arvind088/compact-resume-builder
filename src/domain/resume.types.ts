export const SECTION_IDS = [
	"summary",
	"experience",
	"education",
	"skills",
	"languages",
	"projects",
	"certifications",
	"additionalInformation",
] as const

export type SectionId = (typeof SECTION_IDS)[number]

export type LayoutColumn = "mainColumn" | "sidebar"

export type LanguageLevel =
	| "Basic"
	| "Intermediate"
	| "Professional"
	| "Fluent"
	| "Native"

export interface ResumeDocument {
	schemaVersion: 1
	id: string
	title: string
	basics: ResumeBasics
	sections: ResumeSections
	layout: ResumeLayout
	theme: ResumeTheme
	createdAt: string
	updatedAt: string
}

export interface ResumeBasics {
	fullName: string
	professionalTitle: string
	email: string
	phone: string
	location: string
	linkedin: string
	github: string
	website: string
}

export interface ResumeLayout {
	templateId: "compact-two-column"
	mainColumn: SectionId[]
	sidebar: SectionId[]
}

export interface ResumeTheme {
	fontFamily: string
	bodyFontSize: number
	headingFontSize: number
	lineHeight: number
	sectionSpacing: number
	mainColumnWidth: number
	pagePadding: number
	accentColor: string
}

export interface BaseSection {
	id: SectionId
	title: string
	visible: boolean
}

export interface SummarySection extends BaseSection {
	id: "summary"
	content: string
}

export interface ExperienceSection extends BaseSection {
	id: "experience"
	items: ExperienceEntry[]
}

export interface ExperienceEntry {
	id: string
	jobTitle: string
	company: string
	location: string
	startDate: string
	endDate: string
	isCurrent: boolean
	highlights: string[]
}

export interface EducationSection extends BaseSection {
	id: "education"
	items: EducationEntry[]
}

export interface EducationEntry {
	id: string
	degree: string
	institution: string
	location: string
	startDate: string
	endDate: string
	description: string
}

export interface SkillsSection extends BaseSection {
	id: "skills"
	items: SkillEntry[]
}

export interface SkillEntry {
	id: string
	name: string
}

export interface LanguagesSection extends BaseSection {
	id: "languages"
	items: LanguageEntry[]
}

export interface LanguageEntry {
	id: string
	name: string
	level: LanguageLevel
}

export interface ProjectsSection extends BaseSection {
	id: "projects"
	items: ProjectEntry[]
}

export interface ProjectEntry {
	id: string
	name: string
	description: string
	technologies: string[]
	url: string
}

export interface CertificationsSection extends BaseSection {
	id: "certifications"
	items: CertificationEntry[]
}

export interface CertificationEntry {
	id: string
	name: string
	issuer: string
	issueDate: string
	url: string
}

export interface AdditionalInformationSection extends BaseSection {
	id: "additionalInformation"
	content: string
}

export interface ResumeSections {
	summary: SummarySection
	experience: ExperienceSection
	education: EducationSection
	skills: SkillsSection
	languages: LanguagesSection
	projects: ProjectsSection
	certifications: CertificationsSection
	additionalInformation: AdditionalInformationSection
}
