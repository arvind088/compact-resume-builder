import { describe, expect, it } from "vitest"
import { createDefaultResume } from "./resume.defaults"
import { resumeDocumentSchema } from "./resume.schema"

describe("createDefaultResume", () => {
	it("creates a schema-valid resume document", () => {
		const resume = createDefaultResume()

		expect(resumeDocumentSchema.safeParse(resume).success).toBe(true)
	})

	it("creates stable ids for repeatable default entries", () => {
		const resume = createDefaultResume()

		expect(resume.id).not.toBe("")
		expect(resume.sections.experience.items[0]?.id).not.toBe("")
		expect(resume.sections.education.items[0]?.id).not.toBe("")
	})
})
