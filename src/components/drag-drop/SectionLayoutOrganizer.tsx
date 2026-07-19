import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	closestCorners,
	type DragEndEvent,
	useSensor,
	useSensors,
} from "@dnd-kit/core"
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useDroppable } from "@dnd-kit/core"
import type { LayoutColumn, ResumeLayout, SectionId } from "../../domain/resume.types"
import { useResumeStore } from "../../store/resume.store"

const columnLabels: Record<LayoutColumn, string> = {
	mainColumn: "Main column",
	sidebar: "Sidebar",
}

export function SectionLayoutOrganizer() {
	const layout = useResumeStore((state) => state.resume.layout)
	const moveSection = useResumeStore((state) => state.moveSection)
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 6,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		if (!over) {
			return
		}

		const activeSectionId = active.id as SectionId
		const target = resolveDropTarget(layout, String(over.id))

		if (!target) {
			return
		}

		const source = findSectionLocation(layout, activeSectionId)
		const targetSections = layout[target.column]
		const targetIndex =
			target.sectionId && source?.column === target.column
				? arrayMove(targetSections, source.index, target.index).indexOf(activeSectionId)
				: target.index

		moveSection(activeSectionId, target.column, targetIndex)
	}

	return (
		<div className="layout-organizer" aria-label="Resume section layout">
			<div className="layout-organizer__heading">
				<h3>Layout</h3>
			</div>
			<DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
				<div className="layout-columns">
					<SectionDropZone column="mainColumn" sectionIds={layout.mainColumn} />
					<SectionDropZone column="sidebar" sectionIds={layout.sidebar} />
				</div>
			</DndContext>
		</div>
	)
}

interface SectionDropZoneProps {
	column: LayoutColumn
	sectionIds: SectionId[]
}

function SectionDropZone({ column, sectionIds }: SectionDropZoneProps) {
	const { setNodeRef, isOver } = useDroppable({ id: column })

	return (
		<section
			ref={setNodeRef}
			className={isOver ? "section-drop-zone section-drop-zone--over" : "section-drop-zone"}
			aria-label={columnLabels[column]}
		>
			<div className="section-drop-zone__header">
				<h4>{columnLabels[column]}</h4>
				<span>{sectionIds.length}</span>
			</div>
			<SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
				<div className="section-list">
					{sectionIds.map((sectionId) => (
						<SortableSectionItem key={sectionId} sectionId={sectionId} />
					))}
				</div>
			</SortableContext>
		</section>
	)
}

interface SortableSectionItemProps {
	sectionId: SectionId
}

function SortableSectionItem({ sectionId }: SortableSectionItemProps) {
	const section = useResumeStore((state) => state.resume.sections[sectionId])
	const selectedSectionId = useResumeStore((state) => state.selectedSectionId)
	const setSelectedSection = useResumeStore((state) => state.setSelectedSection)
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: sectionId,
	})
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div
			ref={setNodeRef}
			className={isDragging ? "section-list__row section-list__row--dragging" : "section-list__row"}
			style={style}
		>
			<button
				type="button"
				aria-label={`Select ${section.title}`}
				className={
					selectedSectionId === sectionId
						? "section-list__item section-list__item--selected"
						: "section-list__item"
				}
				onClick={() => setSelectedSection(sectionId)}
			>
				<span>{section.title}</span>
			</button>
			<button
				type="button"
				className="drag-handle"
				aria-label={`Drag ${section.title}`}
				{...attributes}
				{...listeners}
			>
				<span aria-hidden="true">::</span>
			</button>
		</div>
	)
}

interface DropTarget {
	column: LayoutColumn
	index: number
	sectionId: SectionId | null
}

function resolveDropTarget(layout: ResumeLayout, overId: string): DropTarget | null {
	if (overId === "mainColumn" || overId === "sidebar") {
		return {
			column: overId,
			index: layout[overId].length,
			sectionId: null,
		}
	}

	const location = findSectionLocation(layout, overId as SectionId)

	if (!location) {
		return null
	}

	return {
		...location,
		sectionId: overId as SectionId,
	}
}

function findSectionLocation(
	layout: ResumeLayout,
	sectionId: SectionId,
): { column: LayoutColumn; index: number } | null {
	const mainIndex = layout.mainColumn.indexOf(sectionId)

	if (mainIndex !== -1) {
		return {
			column: "mainColumn",
			index: mainIndex,
		}
	}

	const sidebarIndex = layout.sidebar.indexOf(sectionId)

	if (sidebarIndex !== -1) {
		return {
			column: "sidebar",
			index: sidebarIndex,
		}
	}

	return null
}
