// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest"
import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { createDefaultResume } from "../../domain/resume.defaults"
import { useResumeStore } from "../../store/resume.store"
import { ResumePreview } from "./ResumePreview"

describe("ResumePreview", () => {
	beforeEach(() => {
		const resume = createDefaultResume()
		resume.basics.fullName = "Arvind Kumar"
		resume.basics.email = "arvind@example.com"
		resume.basics.linkedin = "linkedin.com/in/arvind"
		resume.sections.summary.content = "Local-first resume builder."
		resume.sections.skills.items = [{ id: "skill-1", name: "React" }]

		useResumeStore.setState({
			resume,
			selectedSectionId: null,
			saveStatus: "saved",
			lastError: null,
		})
	})

	afterEach(() => {
		cleanup()
	})

	it("renders the compact two-column template with semantic sections", () => {
		render(<ResumePreview />)

		expect(screen.getByLabelText("Resume preview")).toHaveClass("compact-template")
		expect(screen.getByRole("heading", { name: "Arvind Kumar" })).toBeInTheDocument()
		expect(screen.getByRole("main", { name: "Main resume sections" })).toBeInTheDocument()
		expect(screen.getByRole("complementary", { name: "Sidebar resume sections" })).toBeInTheDocument()
	})

	it("renders clickable contact links", () => {
		render(<ResumePreview />)

		expect(screen.getByRole("link", { name: "arvind@example.com" })).toHaveAttribute(
			"href",
			"mailto:arvind@example.com",
		)
		expect(screen.getByRole("link", { name: "linkedin.com/in/arvind" })).toHaveAttribute(
			"href",
			"https://linkedin.com/in/arvind",
		)
	})

	it("does not render hidden sections", () => {
		useResumeStore.getState().setSectionVisibility("summary", false)

		render(<ResumePreview />)

		const preview = screen.getByLabelText("Resume preview")
		expect(within(preview).queryByText("Local-first resume builder.")).not.toBeInTheDocument()
	})
})
