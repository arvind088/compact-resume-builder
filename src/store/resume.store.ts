import { create, type StoreApi } from "zustand"
import {
	createDefaultResume,
	createEmptyCertification,
	createEmptyEducation,
	createEmptyExperience,
	createEmptyLanguage,
	createEmptyProject,
	createEmptySkill,
	defaultTheme,
} from "../domain/resume.defaults"
import { moveSection as moveLayoutSection, reorderItems } from "../domain/resume.layout"
import type {
	CertificationEntry,
	EducationEntry,
	ExperienceEntry,
	LanguageEntry,
	LayoutColumn,
	ProjectEntry,
	ResumeBasics,
	ResumeDocument,
	ResumeTheme,
	SectionId,
	SkillEntry,
} from "../domain/resume.types"

export type SaveStatus = "saved" | "saving" | "unsaved" | "error"

export interface ResumeStore {
	resume: ResumeDocument
	selectedSectionId: SectionId | null
	saveStatus: SaveStatus
	lastError: string | null

	setSelectedSection(sectionId: SectionId | null): void
	setSaveStatus(saveStatus: SaveStatus): void
	setLastError(error: string | null): void

	updateBasicField(field: keyof ResumeBasics, value: string): void
	updateSectionTitle(sectionId: SectionId, title: string): void
	setSectionVisibility(sectionId: SectionId, visible: boolean): void
	updateSummary(content: string): void
	updateAdditionalInformation(content: string): void
	updateTheme(patch: Partial<ResumeTheme>): void
	resetTheme(): void
	resetResume(): void
	replaceResume(resume: ResumeDocument): void
	hydrateResume(resume: ResumeDocument): void

	addExperience(): void
	updateExperience(id: string, patch: Partial<Omit<ExperienceEntry, "id">>): void
	removeExperience(id: string): void
	addExperienceHighlight(id: string): void
	updateExperienceHighlight(id: string, index: number, value: string): void
	removeExperienceHighlight(id: string, index: number): void
	reorderExperience(activeId: string, overId: string): void

	addEducation(): void
	updateEducation(id: string, patch: Partial<Omit<EducationEntry, "id">>): void
	removeEducation(id: string): void
	reorderEducation(activeId: string, overId: string): void

	addProject(): void
	updateProject(id: string, patch: Partial<Omit<ProjectEntry, "id">>): void
	removeProject(id: string): void
	reorderProjects(activeId: string, overId: string): void

	addCertification(): void
	updateCertification(id: string, patch: Partial<Omit<CertificationEntry, "id">>): void
	removeCertification(id: string): void
	reorderCertifications(activeId: string, overId: string): void

	addSkill(): void
	updateSkill(id: string, patch: Partial<Omit<SkillEntry, "id">>): void
	removeSkill(id: string): void
	reorderSkills(activeId: string, overId: string): void

	addLanguage(): void
	updateLanguage(id: string, patch: Partial<Omit<LanguageEntry, "id">>): void
	removeLanguage(id: string): void
	reorderLanguages(activeId: string, overId: string): void

	moveSection(sectionId: SectionId, targetColumn: LayoutColumn, targetIndex: number): void
	moveSectionUp(sectionId: SectionId): void
	moveSectionDown(sectionId: SectionId): void
	moveSectionToMain(sectionId: SectionId): void
	moveSectionToSidebar(sectionId: SectionId): void
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
	resume: createDefaultResume(),
	selectedSectionId: null,
	saveStatus: "saved",
	lastError: null,

	setSelectedSection: (sectionId) => {
		set({ selectedSectionId: sectionId })
	},
	setSaveStatus: (saveStatus) => {
		set({ saveStatus })
	},
	setLastError: (error) => {
		set({ lastError: error })
	},

	updateBasicField: (field, value) => {
		set((state) =>
			markUnsaved({
				resume: touch({
					...state.resume,
					basics: {
						...state.resume.basics,
						[field]: value,
					},
				}),
			}),
		)
	},
	updateSectionTitle: (sectionId, title) => {
		set((state) =>
			markUnsaved({
				resume: touch({
					...state.resume,
					sections: {
						...state.resume.sections,
						[sectionId]: {
							...state.resume.sections[sectionId],
							title,
						},
					},
				}),
			}),
		)
	},
	setSectionVisibility: (sectionId, visible) => {
		set((state) =>
			markUnsaved({
				resume: touch({
					...state.resume,
					sections: {
						...state.resume.sections,
						[sectionId]: {
							...state.resume.sections[sectionId],
							visible,
						},
					},
				}),
			}),
		)
	},
	updateSummary: (content) => {
		set((state) =>
			markUnsaved({
				resume: touch({
					...state.resume,
					sections: {
						...state.resume.sections,
						summary: {
							...state.resume.sections.summary,
							content,
						},
					},
				}),
			}),
		)
	},
	updateAdditionalInformation: (content) => {
		set((state) =>
			markUnsaved({
				resume: touch({
					...state.resume,
					sections: {
						...state.resume.sections,
						additionalInformation: {
							...state.resume.sections.additionalInformation,
							content,
						},
					},
				}),
			}),
		)
	},
	updateTheme: (patch) => {
		set((state) =>
			markUnsaved({
				resume: touch({
					...state.resume,
					theme: {
						...state.resume.theme,
						...patch,
					},
				}),
			}),
		)
	},
	resetTheme: () => {
		set((state) =>
			markUnsaved({
				resume: touch({
					...state.resume,
					theme: { ...defaultTheme },
				}),
			}),
		)
	},
	resetResume: () => {
		set({
			resume: createDefaultResume(),
			selectedSectionId: null,
			saveStatus: "unsaved",
			lastError: null,
		})
	},
	replaceResume: (resume) => {
		set({
			resume,
			selectedSectionId: null,
			saveStatus: "unsaved",
			lastError: null,
		})
	},
	hydrateResume: (resume) => {
		set({
			resume,
			selectedSectionId: null,
			saveStatus: "saved",
			lastError: null,
		})
	},

	addExperience: () => {
		updateItems(set, "experience", (items) => [...items, createEmptyExperience()])
	},
	updateExperience: (id, patch) => {
		updateItems(set, "experience", (items) =>
			items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
		)
	},
	removeExperience: (id) => {
		updateItems(set, "experience", (items) => items.filter((item) => item.id !== id))
	},
	addExperienceHighlight: (id) => {
		updateItems(set, "experience", (items) =>
			items.map((item) =>
				item.id === id ? { ...item, highlights: [...item.highlights, ""] } : item,
			),
		)
	},
	updateExperienceHighlight: (id, index, value) => {
		updateItems(set, "experience", (items) =>
			items.map((item) =>
				item.id === id
					? {
							...item,
							highlights: item.highlights.map((highlight, highlightIndex) =>
								highlightIndex === index ? value : highlight,
							),
						}
					: item,
			),
		)
	},
	removeExperienceHighlight: (id, index) => {
		updateItems(set, "experience", (items) =>
			items.map((item) =>
				item.id === id
					? {
							...item,
							highlights: item.highlights.filter(
								(_highlight, highlightIndex) => highlightIndex !== index,
							),
						}
					: item,
			),
		)
	},
	reorderExperience: (activeId, overId) => {
		updateItems(set, "experience", (items) => reorderItems(items, activeId, overId))
	},

	addEducation: () => {
		updateItems(set, "education", (items) => [...items, createEmptyEducation()])
	},
	updateEducation: (id, patch) => {
		updateItems(set, "education", (items) =>
			items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
		)
	},
	removeEducation: (id) => {
		updateItems(set, "education", (items) => items.filter((item) => item.id !== id))
	},
	reorderEducation: (activeId, overId) => {
		updateItems(set, "education", (items) => reorderItems(items, activeId, overId))
	},

	addProject: () => {
		updateItems(set, "projects", (items) => [...items, createEmptyProject()])
	},
	updateProject: (id, patch) => {
		updateItems(set, "projects", (items) =>
			items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
		)
	},
	removeProject: (id) => {
		updateItems(set, "projects", (items) => items.filter((item) => item.id !== id))
	},
	reorderProjects: (activeId, overId) => {
		updateItems(set, "projects", (items) => reorderItems(items, activeId, overId))
	},

	addCertification: () => {
		updateItems(set, "certifications", (items) => [...items, createEmptyCertification()])
	},
	updateCertification: (id, patch) => {
		updateItems(set, "certifications", (items) =>
			items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
		)
	},
	removeCertification: (id) => {
		updateItems(set, "certifications", (items) => items.filter((item) => item.id !== id))
	},
	reorderCertifications: (activeId, overId) => {
		updateItems(set, "certifications", (items) => reorderItems(items, activeId, overId))
	},

	addSkill: () => {
		updateItems(set, "skills", (items) => [...items, createEmptySkill()])
	},
	updateSkill: (id, patch) => {
		updateItems(set, "skills", (items) =>
			items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
		)
	},
	removeSkill: (id) => {
		updateItems(set, "skills", (items) => items.filter((item) => item.id !== id))
	},
	reorderSkills: (activeId, overId) => {
		updateItems(set, "skills", (items) => reorderItems(items, activeId, overId))
	},

	addLanguage: () => {
		updateItems(set, "languages", (items) => [...items, createEmptyLanguage()])
	},
	updateLanguage: (id, patch) => {
		updateItems(set, "languages", (items) =>
			items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
		)
	},
	removeLanguage: (id) => {
		updateItems(set, "languages", (items) => items.filter((item) => item.id !== id))
	},
	reorderLanguages: (activeId, overId) => {
		updateItems(set, "languages", (items) => reorderItems(items, activeId, overId))
	},

	moveSection: (sectionId, targetColumn, targetIndex) => {
		set((state) =>
			markUnsaved({
				resume: touch({
					...state.resume,
					layout: moveLayoutSection(state.resume.layout, sectionId, targetColumn, targetIndex),
				}),
			}),
		)
	},
	moveSectionUp: (sectionId) => {
		moveSectionByOffset(get, sectionId, -1)
	},
	moveSectionDown: (sectionId) => {
		moveSectionByOffset(get, sectionId, 1)
	},
	moveSectionToMain: (sectionId) => {
		get().moveSection(sectionId, "mainColumn", get().resume.layout.mainColumn.length)
	},
	moveSectionToSidebar: (sectionId) => {
		get().moveSection(sectionId, "sidebar", get().resume.layout.sidebar.length)
	},
}))

type StoreSet = StoreApi<ResumeStore>["setState"]

type ItemSectionId =
	| "experience"
	| "education"
	| "projects"
	| "certifications"
	| "skills"
	| "languages"

type SectionItems<T extends ItemSectionId> = ResumeDocument["sections"][T]["items"]

function updateItems<T extends ItemSectionId>(
	set: StoreSet,
	sectionId: T,
	updater: (items: SectionItems<T>) => SectionItems<T>,
): void {
	set((state: ResumeStore) =>
		markUnsaved({
			resume: touch({
				...state.resume,
				sections: {
					...state.resume.sections,
					[sectionId]: {
						...state.resume.sections[sectionId],
						items: updater(state.resume.sections[sectionId].items),
					},
				},
			}),
		}),
	)
}

function moveSectionByOffset(
	get: () => ResumeStore,
	sectionId: SectionId,
	offset: -1 | 1,
): void {
	const { layout } = get().resume
	const location = findSectionLocation(layout.mainColumn, layout.sidebar, sectionId)

	if (!location) {
		return
	}

	get().moveSection(sectionId, location.column, location.index + offset)
}

function findSectionLocation(
	mainColumn: SectionId[],
	sidebar: SectionId[],
	sectionId: SectionId,
): { column: LayoutColumn; index: number } | null {
	const mainIndex = mainColumn.indexOf(sectionId)

	if (mainIndex !== -1) {
		return {
			column: "mainColumn",
			index: mainIndex,
		}
	}

	const sidebarIndex = sidebar.indexOf(sectionId)

	if (sidebarIndex !== -1) {
		return {
			column: "sidebar",
			index: sidebarIndex,
		}
	}

	return null
}

function touch(resume: ResumeDocument): ResumeDocument {
	return {
		...resume,
		updatedAt: new Date().toISOString(),
	}
}

function markUnsaved(patch: Pick<ResumeStore, "resume">): Pick<ResumeStore, "resume" | "saveStatus" | "lastError"> {
	return {
		...patch,
		saveStatus: "unsaved",
		lastError: null,
	}
}
