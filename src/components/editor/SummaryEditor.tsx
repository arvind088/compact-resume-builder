import { TextArea } from "../common/Field"
import { useResumeStore } from "../../store/resume.store"

export function SummaryEditor() {
	const content = useResumeStore((state) => state.resume.sections.summary.content)
	const updateSummary = useResumeStore((state) => state.updateSummary)

	return (
		<TextArea
			label="Summary"
			value={content}
			rows={6}
			onChange={(event) => updateSummary(event.target.value)}
		/>
	)
}
