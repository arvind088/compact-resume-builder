import { TextArea, TextInput } from "../common/Field"
import { SECTION_IDS, type SectionId } from "../../domain/resume.types"
import { useResumeStore } from "../../store/resume.store"

export function ContentPanel() {
	const resume = useResumeStore((state) => state.resume)
	const selectedSectionId = useResumeStore((state) => state.selectedSectionId)
	const setSelectedSection = useResumeStore((state) => state.setSelectedSection)
	const updateBasicField = useResumeStore((state) => state.updateBasicField)
	const updateSectionTitle = useResumeStore((state) => state.updateSectionTitle)
	const setSectionVisibility = useResumeStore((state) => state.setSectionVisibility)
	const updateSummary = useResumeStore((state) => state.updateSummary)
	const selectedSection = selectedSectionId ? resume.sections[selectedSectionId] : null

	return (
		<div className="panel-stack">
			<div className="panel-heading">
				<h2>Content</h2>
			</div>

			<form className="form-grid">
				<TextInput
					label="Full name"
					value={resume.basics.fullName}
					onChange={(event) => updateBasicField("fullName", event.target.value)}
				/>
				<TextInput
					label="Professional title"
					value={resume.basics.professionalTitle}
					onChange={(event) => updateBasicField("professionalTitle", event.target.value)}
				/>
				<TextInput
					label="Email"
					value={resume.basics.email}
					onChange={(event) => updateBasicField("email", event.target.value)}
				/>
				<TextInput
					label="Location"
					value={resume.basics.location}
					onChange={(event) => updateBasicField("location", event.target.value)}
				/>
			</form>

			<div className="section-list" aria-label="Resume sections">
				{SECTION_IDS.map((sectionId) => (
					<SectionListItem
						key={sectionId}
						sectionId={sectionId}
						selected={selectedSectionId === sectionId}
						onSelect={setSelectedSection}
					/>
				))}
			</div>

			{selectedSection ? (
				<div className="section-editor" aria-label={`${selectedSection.title} editor`}>
					<TextInput
						label="Section title"
						value={selectedSection.title}
						onChange={(event) => updateSectionTitle(selectedSection.id, event.target.value)}
					/>
					<label className="checkbox-field">
						<input
							type="checkbox"
							checked={selectedSection.visible}
							onChange={(event) => setSectionVisibility(selectedSection.id, event.target.checked)}
						/>
						<span>Visible</span>
					</label>
					{selectedSection.id === "summary" ? (
						<TextArea
							label="Summary"
							value={resume.sections.summary.content}
							rows={5}
							onChange={(event) => updateSummary(event.target.value)}
						/>
					) : null}
				</div>
			) : null}
		</div>
	)
}

interface SectionListItemProps {
	sectionId: SectionId
	selected: boolean
	onSelect(sectionId: SectionId): void
}

function SectionListItem({ sectionId, selected, onSelect }: SectionListItemProps) {
	const section = useResumeStore((state) => state.resume.sections[sectionId])

	return (
		<button
			type="button"
			className={selected ? "section-list__item section-list__item--selected" : "section-list__item"}
			onClick={() => onSelect(sectionId)}
		>
			<span>{section.title}</span>
			<span className={section.visible ? "visibility-pill" : "visibility-pill visibility-pill--hidden"}>
				{section.visible ? "Shown" : "Hidden"}
			</span>
		</button>
	)
}
