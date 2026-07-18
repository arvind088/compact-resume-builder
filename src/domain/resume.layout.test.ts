import { describe, expect, it } from "vitest"
import { defaultLayout } from "./resume.defaults"
import { moveSection, normalizeLayout, reorderItems } from "./resume.layout"
import { SECTION_IDS, type ResumeLayout } from "./resume.types"

describe("moveSection", () => {
	it("moves a section within the same column without losing sections", () => {
		const layout = moveSection(defaultLayout, "education", "mainColumn", 1)

		expect(layout.mainColumn).toEqual([
			"summary",
			"education",
			"experience",
			"certifications",
			"additionalInformation",
		])
		expect(allPlacedSections(layout)).toEqual([...SECTION_IDS].sort())
	})

	it("moves a section between columns without duplication", () => {
		const layout = moveSection(defaultLayout, "projects", "mainColumn", 1)

		expect(layout.mainColumn).toEqual([
			"summary",
			"projects",
			"experience",
			"education",
			"certifications",
			"additionalInformation",
		])
		expect(layout.sidebar).toEqual(["languages", "skills"])
		expect(allPlacedSections(layout)).toEqual([...SECTION_IDS].sort())
	})

	it("clamps target indexes outside the destination range", () => {
		const layout = moveSection(defaultLayout, "summary", "sidebar", 99)

		expect(layout.sidebar).toEqual(["languages", "skills", "projects", "summary"])
		expect(layout.mainColumn).not.toContain("summary")
	})
})

describe("normalizeLayout", () => {
	it("removes duplicates and unknown section ids", () => {
		const invalidLayout = {
			templateId: "compact-two-column",
			mainColumn: ["summary", "summary", "unknown", "experience"],
			sidebar: ["skills", "experience", "languages"],
		} as ResumeLayout

		const layout = normalizeLayout(invalidLayout)

		expect(layout.mainColumn).toEqual([
			"summary",
			"experience",
			"education",
			"projects",
			"certifications",
			"additionalInformation",
		])
		expect(layout.sidebar).toEqual(["skills", "languages"])
		expect(allPlacedSections(layout)).toEqual([...SECTION_IDS].sort())
	})
})

describe("reorderItems", () => {
	it("reorders items while preserving every entry", () => {
		const items = [
			{ id: "first", value: "First" },
			{ id: "second", value: "Second" },
			{ id: "third", value: "Third" },
		]

		const reordered = reorderItems(items, "third", "first")

		expect(reordered.map((item) => item.id)).toEqual(["third", "first", "second"])
		expect(reordered).toHaveLength(items.length)
		expect(items.map((item) => item.id)).toEqual(["first", "second", "third"])
	})
})

function allPlacedSections(layout: ResumeLayout) {
	return [...layout.mainColumn, ...layout.sidebar].sort()
}
