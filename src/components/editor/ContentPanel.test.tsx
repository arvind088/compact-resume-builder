// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest"
import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { AppShell } from "../../app/AppShell"
import { createDefaultResume } from "../../domain/resume.defaults"
import { useResumeStore } from "../../store/resume.store"

describe("content editors", () => {
	beforeEach(() => {
		useResumeStore.setState({
			resume: createDefaultResume(),
			selectedSectionId: null,
			saveStatus: "saved",
			lastError: null,
		})
	})

	afterEach(() => {
		cleanup()
	})

	it("edits summary content and hides the section without losing data", async () => {
		const user = userEvent.setup()
		render(<AppShell />)

		await user.type(screen.getByLabelText("Summary"), "Frontend engineer with product focus.")
		const preview = screen.getByLabelText("Resume preview")
		expect(within(preview).getByText("Frontend engineer with product focus.")).toBeInTheDocument()

		await user.click(screen.getByLabelText("Visible"))
		expect(within(preview).queryByText("Frontend engineer with product focus.")).not.toBeInTheDocument()

		await user.click(screen.getByLabelText("Visible"))
		expect(within(preview).getByText("Frontend engineer with product focus.")).toBeInTheDocument()
	})

	it("edits experience fields and highlights", async () => {
		const user = userEvent.setup()
		render(<AppShell />)

		await user.click(screen.getByRole("button", { name: /Experience/ }))
		await user.type(screen.getByLabelText("Job title"), "Frontend Engineer")
		await user.type(screen.getByLabelText("Company"), "Acme Labs")
		await user.type(screen.getByLabelText("Highlight 1"), "Built reusable resume components")

		expect(screen.getByText("Frontend Engineer")).toBeInTheDocument()
		expect(screen.getByText("Acme Labs")).toBeInTheDocument()
		expect(screen.getByText("Built reusable resume components")).toBeInTheDocument()
	})

	it("adds skills and languages", async () => {
		const user = userEvent.setup()
		render(<AppShell />)

		await user.click(screen.getByRole("button", { name: /Skills/ }))
		await user.click(screen.getByRole("button", { name: "Add skill" }))
		await user.type(screen.getByLabelText("Skill 1"), "React")

		await user.click(screen.getByRole("button", { name: /Languages/ }))
		await user.click(screen.getByRole("button", { name: "Add language" }))
		await user.type(screen.getByLabelText("Language"), "English")
		await user.selectOptions(screen.getByLabelText("Level"), "Fluent")

		expect(screen.getByText("React")).toBeInTheDocument()
		expect(screen.getByText("English - Fluent")).toBeInTheDocument()
	})

	it("adds projects and certifications", async () => {
		const user = userEvent.setup()
		render(<AppShell />)

		await user.click(screen.getByRole("button", { name: /Projects/ }))
		await user.click(screen.getByRole("button", { name: "Add project" }))
		await user.type(screen.getByLabelText("Project name"), "Compact Resume Builder")
		await user.type(screen.getByLabelText("Project description"), "Local-first resume editor")
		await user.type(screen.getByLabelText("Technologies"), "React, TypeScript")

		await user.click(screen.getByRole("button", { name: /Certifications/ }))
		await user.click(screen.getByRole("button", { name: "Add certification" }))
		await user.type(screen.getByLabelText("Certification name"), "Frontend Certificate")
		await user.type(screen.getByLabelText("Issuer"), "Example Academy")

		const preview = screen.getByLabelText("Resume preview")
		expect(within(preview).getByText("Compact Resume Builder")).toBeInTheDocument()
		expect(within(preview).getByText("React, TypeScript")).toBeInTheDocument()
		expect(within(preview).getByText("Frontend Certificate")).toBeInTheDocument()
		expect(within(preview).getByText("Example Academy")).toBeInTheDocument()
	})
})
