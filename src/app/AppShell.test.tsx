// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createDefaultResume } from "../domain/resume.defaults"
import { useResumeStore } from "../store/resume.store"
import { AppShell } from "./AppShell"

describe("AppShell", () => {
	beforeEach(() => {
		window.localStorage.clear()
		useResumeStore.setState({
			resume: createDefaultResume(),
			selectedSectionId: null,
			saveStatus: "saved",
			lastError: null,
		})
		vi.spyOn(window, "confirm").mockReturnValue(true)
		vi.stubGlobal("URL", {
			createObjectURL: vi.fn(() => "blob:resume"),
			revokeObjectURL: vi.fn(),
		})
		vi.spyOn(window, "print").mockImplementation(() => undefined)
		vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined)
	})

	afterEach(() => {
		cleanup()
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
		window.localStorage.clear()
	})

	it("renders the main resume builder regions", () => {
		render(<AppShell />)

		expect(screen.getByRole("banner")).toBeInTheDocument()
		expect(screen.getByRole("main", { name: "Resume workspace" })).toBeInTheDocument()
		expect(screen.getByRole("region", { name: "Content" })).toBeInTheDocument()
		expect(screen.getByRole("region", { name: "Preview" })).toBeInTheDocument()
		expect(screen.getByRole("region", { name: "Design" })).toBeInTheDocument()
	})

	it("updates the preview when basics are edited", async () => {
		const user = userEvent.setup()
		render(<AppShell />)

		await user.clear(screen.getByLabelText("Resume title"))
		await user.type(screen.getByLabelText("Resume title"), "Frontend Resume")
		await user.type(screen.getByLabelText("Full name"), "Arvind Kumar")
		await user.type(screen.getByLabelText("Professional title"), "Software Engineer")

		expect(screen.getByRole("heading", { name: "Frontend Resume" })).toBeInTheDocument()
		expect(screen.getByRole("heading", { name: "Arvind Kumar" })).toBeInTheDocument()
		expect(screen.getByText("Software Engineer")).toBeInTheDocument()
	})

	it("switches the active mobile tab", async () => {
		const user = userEvent.setup()
		render(<AppShell />)

		await user.click(screen.getByRole("button", { name: "Design" }))

		expect(screen.getByRole("button", { name: "Design" })).toHaveAttribute("aria-current", "page")
	})

	it("exports the current resume as JSON", async () => {
		const user = userEvent.setup()
		render(<AppShell />)
		const anchor = document.createElement("a")
		vi.spyOn(document, "createElement").mockReturnValue(anchor)

		await user.clear(screen.getByLabelText("Resume title"))
		await user.type(screen.getByLabelText("Resume title"), "Frontend Resume")
		await user.click(screen.getByRole("button", { name: "Export JSON" }))

		expect(URL.createObjectURL).toHaveBeenCalled()
		expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled()
		expect(anchor.download).toBe("frontend-resume.resume.json")
		expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:resume")
	})

	it("opens the preview tab before printing the resume", async () => {
		const user = userEvent.setup()
		render(<AppShell />)

		await user.click(screen.getByRole("button", { name: "Design" }))
		await user.click(screen.getByRole("button", { name: "Print PDF" }))

		expect(screen.getByRole("button", { name: "Preview" })).toHaveAttribute("aria-current", "page")
		await waitFor(() => expect(window.print).toHaveBeenCalled())
	})

	it("imports a valid resume JSON file after confirmation", async () => {
		const user = userEvent.setup()
		const importedResume = createDefaultResume()
		importedResume.title = "Imported Resume"
		importedResume.basics.fullName = "Imported Person"
		const file = new File([JSON.stringify(importedResume)], "imported.resume.json", {
			type: "application/json",
		})

		render(<AppShell />)
		await user.upload(screen.getByLabelText("Import resume JSON"), file)

		expect(screen.getByRole("heading", { name: "Imported Resume" })).toBeInTheDocument()
		expect(screen.getByRole("heading", { name: "Imported Person" })).toBeInTheDocument()
	})

	it("keeps the current resume when imported JSON is invalid", async () => {
		const user = userEvent.setup()
		const invalidFile = new File(["{bad-json"], "invalid.resume.json", {
			type: "application/json",
		})

		render(<AppShell />)
		await user.type(screen.getByLabelText("Full name"), "Current Person")
		await user.upload(screen.getByLabelText("Import resume JSON"), invalidFile)

		expect(screen.getByRole("heading", { name: "Current Person" })).toBeInTheDocument()
		expect(screen.getByText("Selected file is not valid JSON.")).toBeInTheDocument()
	})
})
