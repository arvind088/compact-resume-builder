// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createDefaultResume } from "../domain/resume.defaults"
import { useResumeStore } from "../store/resume.store"
import { AppShell } from "./AppShell"

describe("AppShell", () => {
	beforeEach(() => {
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

		await user.type(screen.getByLabelText("Full name"), "Arvind Kumar")
		await user.type(screen.getByLabelText("Professional title"), "Software Engineer")

		expect(screen.getByRole("heading", { name: "Arvind Kumar" })).toBeInTheDocument()
		expect(screen.getByText("Software Engineer")).toBeInTheDocument()
	})

	it("switches the active mobile tab", async () => {
		const user = userEvent.setup()
		render(<AppShell />)

		await user.click(screen.getByRole("button", { name: "Design" }))

		expect(screen.getByRole("button", { name: "Design" })).toHaveAttribute("aria-current", "page")
	})
})
