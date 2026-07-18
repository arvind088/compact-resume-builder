import { TextArea } from "../common/Field"
import { useResumeStore } from "../../store/resume.store"

export function AdditionalInformationEditor() {
	const content = useResumeStore((state) => state.resume.sections.additionalInformation.content)
	const updateAdditionalInformation = useResumeStore((state) => state.updateAdditionalInformation)

	return (
		<TextArea
			label="Additional information"
			value={content}
			rows={6}
			onChange={(event) => updateAdditionalInformation(event.target.value)}
		/>
	)
}
