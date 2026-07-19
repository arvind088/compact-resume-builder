// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createDefaultResume } from "../domain/resume.defaults"
import { RESUME_STORAGE_KEY } from "../storage/localStorage.repository"
import { useResumeStore } from "../store/resume.store"
import { AppShell } from "./AppShell"

describe("useResumePersistence", () => {
	beforeEach(() => {
		window.localStorage.clear()
		useResumeStore.setState({
			resume: createDefaultResume(),
			selectedSectionId: null,
			saveStatus: "saved",
			lastError: null,
		})
		vi.spyOn(window, "confirm").mockReturnValue(true)
	})

	afterEach(() => {
		cleanup()
		vi.restoreAllMocks()
		window.localStorage.clear()
	})

	it("loads an existing saved resume when the app starts", () => {
		const savedResume = createDefaultResume()
		savedResume.basics.fullName = "Saved Person"
		window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(savedResume))

		render(<AppShell />)

		expect(screen.getByRole("heading", { name: "Saved Person" })).toBeInTheDocument()
		expect(screen.getByText("saved")).toBeInTheDocument()
	})

	it("autosaves edits after a debounce", async () => {
		const user = userEvent.setup()
		render(<AppShell />)

		await user.type(screen.getByLabelText("Full name"), "Arvind Kumar")

		await waitFor(
			() => {
				const rawValue = window.localStorage.getItem(RESUME_STORAGE_KEY)
				expect(rawValue).not.toBeNull()
				expect(JSON.parse(rawValue ?? "{}").basics.fullName).toBe("Arvind Kumar")
			},
			{ timeout: 1500 },
		)
		expect(screen.getByText("saved")).toBeInTheDocument()
	})

	it("does not replace default state when stored data is invalid", () => {
		window.localStorage.setItem(RESUME_STORAGE_KEY, "{bad-json")

		render(<AppShell />)

		expect(screen.getByRole("heading", { name: "Your Name" })).toBeInTheDocument()
		expect(screen.getByText("Saved resume data could not be loaded.")).toBeInTheDocument()
	})

	it("clears persisted data when resetting the resume", async () => {
		const user = userEvent.setup()
		const savedResume = createDefaultResume()
		window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(savedResume))

		render(<AppShell />)
		await user.click(screen.getByRole("button", { name: "Reset" }))

		expect(window.localStorage.getItem(RESUME_STORAGE_KEY)).toBeNull()
	})
})
