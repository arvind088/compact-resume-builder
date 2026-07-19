// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import { createDefaultResume } from "../domain/resume.defaults"
import {
	createResumeJsonBlob,
	getResumeJsonFileName,
	parseResumeFile,
	sanitizeFileName,
} from "./resumeFile.service"

describe("resume file service", () => {
	it("sanitizes filenames for exported resumes", () => {
		expect(sanitizeFileName(" Arvind Kumar: Software Engineer! ")).toBe(
			"arvind-kumar-software-engineer",
		)
		expect(sanitizeFileName("***")).toBe("resume")
	})

	it("creates the expected JSON export filename", () => {
		const resume = createDefaultResume()
		resume.title = "Arvind Kumar Resume"

		expect(getResumeJsonFileName(resume)).toBe("arvind-kumar-resume.resume.json")
	})

	it("exports readable formatted JSON", async () => {
		const resume = createDefaultResume()
		resume.basics.fullName = "Arvind Kumar"

		const blob = createResumeJsonBlob(resume)
		const parsedValue = JSON.parse(await blob.text())

		expect(blob.type).toBe("application/json")
		expect(parsedValue.basics.fullName).toBe("Arvind Kumar")
	})

	it("parses a valid resume JSON file", async () => {
		const resume = createDefaultResume()
		resume.title = "Imported Resume"
		const file = new File([JSON.stringify(resume)], "resume.json", {
			type: "application/json",
		})

		await expect(parseResumeFile(file)).resolves.toMatchObject({
			title: "Imported Resume",
		})
	})

	it("rejects invalid JSON without returning a document", async () => {
		const file = new File(["{bad-json"], "resume.json", {
			type: "application/json",
		})

		await expect(parseResumeFile(file)).rejects.toThrow("Selected file is not valid JSON.")
	})

	it("rejects unsupported schema versions", async () => {
		const file = new File([JSON.stringify({ schemaVersion: 2 })], "resume.json", {
			type: "application/json",
		})

		await expect(parseResumeFile(file)).rejects.toThrow("Selected resume file is invalid")
	})
})
