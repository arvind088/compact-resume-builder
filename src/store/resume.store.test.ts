import { beforeEach, describe, expect, it } from "vitest"
import { createDefaultResume } from "../domain/resume.defaults"
import { useResumeStore } from "./resume.store"

describe("useResumeStore", () => {
	beforeEach(() => {
		useResumeStore.setState({
			resume: createDefaultResume(),
			selectedSectionId: null,
			saveStatus: "saved",
			lastError: null,
		})
	})

	it("updates a basic field and marks the resume unsaved", () => {
		const previousResume = useResumeStore.getState().resume

		useResumeStore.getState().updateBasicField("fullName", "Arvind Kumar")

		const state = useResumeStore.getState()
		expect(state.resume.basics.fullName).toBe("Arvind Kumar")
		expect(state.resume).not.toBe(previousResume)
		expect(state.saveStatus).toBe("unsaved")
	})

	it("updates the resume title and marks the resume unsaved", () => {
		useResumeStore.getState().updateResumeTitle("Frontend Resume")

		const state = useResumeStore.getState()
		expect(state.resume.title).toBe("Frontend Resume")
		expect(state.saveStatus).toBe("unsaved")
	})

	it("does not touch resume timestamps when selecting a section", () => {
		const previousUpdatedAt = useResumeStore.getState().resume.updatedAt

		useResumeStore.getState().setSelectedSection("experience")

		const state = useResumeStore.getState()
		expect(state.selectedSectionId).toBe("experience")
		expect(state.resume.updatedAt).toBe(previousUpdatedAt)
	})

	it("updates section title and visibility", () => {
		useResumeStore.getState().updateSectionTitle("summary", "Profile")
		useResumeStore.getState().setSectionVisibility("summary", false)

		const summary = useResumeStore.getState().resume.sections.summary
		expect(summary.title).toBe("Profile")
		expect(summary.visible).toBe(false)
	})

	it("adds and updates an experience entry", () => {
		useResumeStore.getState().addExperience()
		const entry = useResumeStore.getState().resume.sections.experience.items.at(-1)

		expect(entry).toBeDefined()

		useResumeStore.getState().updateExperience(entry?.id ?? "", {
			jobTitle: "Frontend Engineer",
			company: "Example Ltd",
		})

		const updatedEntry = useResumeStore
			.getState()
			.resume.sections.experience.items.find((item) => item.id === entry?.id)

		expect(updatedEntry?.jobTitle).toBe("Frontend Engineer")
		expect(updatedEntry?.company).toBe("Example Ltd")
	})

	it("updates experience highlights", () => {
		const entry = useResumeStore.getState().resume.sections.experience.items[0]

		expect(entry).toBeDefined()

		useResumeStore.getState().updateExperienceHighlight(entry?.id ?? "", 0, "Built a resume builder")
		useResumeStore.getState().addExperienceHighlight(entry?.id ?? "")

		const updatedEntry = useResumeStore
			.getState()
			.resume.sections.experience.items.find((item) => item.id === entry?.id)

		expect(updatedEntry?.highlights).toEqual(["Built a resume builder", ""])
	})

	it("adds, updates, reorders, and removes skills", () => {
		useResumeStore.getState().addSkill()
		useResumeStore.getState().addSkill()

		const [firstSkill, secondSkill] = useResumeStore.getState().resume.sections.skills.items

		expect(firstSkill).toBeDefined()
		expect(secondSkill).toBeDefined()

		useResumeStore.getState().updateSkill(firstSkill?.id ?? "", { name: "React" })
		useResumeStore.getState().updateSkill(secondSkill?.id ?? "", { name: "TypeScript" })
		useResumeStore.getState().reorderSkills(secondSkill?.id ?? "", firstSkill?.id ?? "")

		const reorderedSkills = useResumeStore.getState().resume.sections.skills.items
		expect(reorderedSkills.map((skill) => skill.name)).toEqual(["TypeScript", "React"])

		useResumeStore.getState().removeSkill(secondSkill?.id ?? "")
		expect(useResumeStore.getState().resume.sections.skills.items).toHaveLength(1)
	})

	it("moves sections with accessibility fallback actions", () => {
		useResumeStore.getState().moveSectionToMain("projects")
		useResumeStore.getState().moveSectionUp("projects")

		const layout = useResumeStore.getState().resume.layout
		expect(layout.mainColumn).toContain("projects")
		expect(layout.sidebar).not.toContain("projects")
	})

	it("updates and resets theme independently of content", () => {
		useResumeStore.getState().updateBasicField("fullName", "Arvind Kumar")
		useResumeStore.getState().updateTheme({ accentColor: "#111827", bodyFontSize: 11 })
		useResumeStore.getState().resetTheme()

		const state = useResumeStore.getState()
		expect(state.resume.basics.fullName).toBe("Arvind Kumar")
		expect(state.resume.theme.accentColor).toBe("#2563eb")
		expect(state.resume.theme.bodyFontSize).toBe(10)
	})

	it("replaces the resume document", () => {
		const replacement = createDefaultResume()
		replacement.title = "Imported Resume"
		replacement.basics.fullName = "Imported Person"

		useResumeStore.getState().replaceResume(replacement)

		const state = useResumeStore.getState()
		expect(state.resume.title).toBe("Imported Resume")
		expect(state.resume.basics.fullName).toBe("Imported Person")
		expect(state.selectedSectionId).toBeNull()
		expect(state.saveStatus).toBe("unsaved")
	})
})
