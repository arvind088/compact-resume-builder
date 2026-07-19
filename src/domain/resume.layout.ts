import { SECTION_IDS, type LayoutColumn, type ResumeLayout, type SectionId } from "./resume.types"

const sectionIdSet = new Set<string>(SECTION_IDS)

export function moveSection(
	layout: ResumeLayout,
	sectionId: SectionId,
	targetColumn: LayoutColumn,
	targetIndex: number,
): ResumeLayout {
	const nextLayout = removeSection(layout, sectionId)
	const targetSections = [...nextLayout[targetColumn]]
	const boundedIndex = clamp(targetIndex, 0, targetSections.length)

	targetSections.splice(boundedIndex, 0, sectionId)

	return normalizeLayout({
		...nextLayout,
		[targetColumn]: targetSections,
	})
}

export function reorderItems<T extends { id: string }>(
	items: T[],
	activeId: string,
	overId: string,
): T[] {
	const activeIndex = items.findIndex((item) => item.id === activeId)
	const overIndex = items.findIndex((item) => item.id === overId)

	if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
		return [...items]
	}

	const reordered = [...items]
	const [activeItem] = reordered.splice(activeIndex, 1)

	if (!activeItem) {
		return [...items]
	}

	reordered.splice(overIndex, 0, activeItem)

	return reordered
}

export function normalizeLayout(layout: ResumeLayout): ResumeLayout {
	const seen = new Set<SectionId>()
	const mainColumn = collectValidUniqueSections(layout.mainColumn, seen)
	const sidebar = collectValidUniqueSections(layout.sidebar, seen)

	for (const sectionId of SECTION_IDS) {
		if (!seen.has(sectionId)) {
			mainColumn.push(sectionId)
			seen.add(sectionId)
		}
	}

	return {
		templateId: "compact-two-column",
		mainColumn,
		sidebar,
	}
}

function removeSection(layout: ResumeLayout, sectionId: SectionId): ResumeLayout {
	return {
		...layout,
		mainColumn: layout.mainColumn.filter((id) => id !== sectionId),
		sidebar: layout.sidebar.filter((id) => id !== sectionId),
	}
}

function collectValidUniqueSections(
	sectionIds: SectionId[],
	seen: Set<SectionId>,
): SectionId[] {
	const validSections: SectionId[] = []

	for (const sectionId of sectionIds) {
		if (isSectionId(sectionId) && !seen.has(sectionId)) {
			validSections.push(sectionId)
			seen.add(sectionId)
		}
	}

	return validSections
}

function isSectionId(value: string): value is SectionId {
	return sectionIdSet.has(value)
}

function clamp(value: number, min: number, max: number): number {
	if (value < min) {
		return min
	}

	if (value > max) {
		return max
	}

	return value
}
