import type {
	CertificationEntry,
	EducationEntry,
	ExperienceEntry,
	LanguageEntry,
	ProjectEntry,
	ResumeDocument,
	ResumeLayout,
	ResumeTheme,
	SkillEntry,
} from "./resume.types"

export const defaultLayout: ResumeLayout = {
	templateId: "compact-two-column",
	mainColumn: [
		"summary",
		"experience",
		"education",
		"certifications",
		"additionalInformation",
	],
	sidebar: ["languages", "skills", "projects"],
}

export const defaultTheme: ResumeTheme = {
	fontFamily: "Arial",
	bodyFontSize: 10,
	headingFontSize: 12,
	lineHeight: 1.3,
	sectionSpacing: 10,
	mainColumnWidth: 62,
	pagePadding: 14,
	accentColor: "#2563eb",
}

export function createDefaultResume(): ResumeDocument {
	const now = new Date().toISOString()

	return {
		schemaVersion: 1,
		id: createId(),
		title: "Untitled Resume",
		basics: {
			fullName: "",
			professionalTitle: "",
			email: "",
			phone: "",
			location: "",
			linkedin: "",
			github: "",
			website: "",
		},
		sections: {
			summary: {
				id: "summary",
				title: "Summary",
				visible: true,
				content: "",
			},
			experience: {
				id: "experience",
				title: "Experience",
				visible: true,
				items: [createEmptyExperience()],
			},
			education: {
				id: "education",
				title: "Education",
				visible: true,
				items: [createEmptyEducation()],
			},
			skills: {
				id: "skills",
				title: "Skills",
				visible: true,
				items: [],
			},
			languages: {
				id: "languages",
				title: "Languages",
				visible: true,
				items: [],
			},
			projects: {
				id: "projects",
				title: "Projects",
				visible: true,
				items: [],
			},
			certifications: {
				id: "certifications",
				title: "Certifications",
				visible: true,
				items: [],
			},
			additionalInformation: {
				id: "additionalInformation",
				title: "Additional Information",
				visible: true,
				content: "",
			},
		},
		layout: {
			templateId: defaultLayout.templateId,
			mainColumn: [...defaultLayout.mainColumn],
			sidebar: [...defaultLayout.sidebar],
		},
		theme: { ...defaultTheme },
		createdAt: now,
		updatedAt: now,
	}
}

export function createEmptyExperience(): ExperienceEntry {
	return {
		id: createId(),
		jobTitle: "",
		company: "",
		location: "",
		startDate: "",
		endDate: "",
		isCurrent: false,
		highlights: [""],
	}
}

export function createEmptyEducation(): EducationEntry {
	return {
		id: createId(),
		degree: "",
		institution: "",
		location: "",
		startDate: "",
		endDate: "",
		description: "",
	}
}

export function createEmptySkill(): SkillEntry {
	return {
		id: createId(),
		name: "",
	}
}

export function createEmptyLanguage(): LanguageEntry {
	return {
		id: createId(),
		name: "",
		level: "Professional",
	}
}

export function createEmptyProject(): ProjectEntry {
	return {
		id: createId(),
		name: "",
		description: "",
		technologies: [],
		url: "",
	}
}

export function createEmptyCertification(): CertificationEntry {
	return {
		id: createId(),
		name: "",
		issuer: "",
		issueDate: "",
		url: "",
	}
}

export function createId(): string {
	if (typeof globalThis.crypto?.randomUUID === "function") {
		return globalThis.crypto.randomUUID()
	}

	return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}
