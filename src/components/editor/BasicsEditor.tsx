import { TextInput } from "../common/Field"
import { useResumeStore } from "../../store/resume.store"

export function BasicsEditor() {
	const basics = useResumeStore((state) => state.resume.basics)
	const updateBasicField = useResumeStore((state) => state.updateBasicField)
	const emailInvalid = basics.email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basics.email)

	return (
		<form className="form-grid" aria-label="Personal information">
			<TextInput
				label="Full name"
				value={basics.fullName}
				onChange={(event) => updateBasicField("fullName", event.target.value)}
			/>
			<TextInput
				label="Professional title"
				value={basics.professionalTitle}
				onChange={(event) => updateBasicField("professionalTitle", event.target.value)}
			/>
			<TextInput
				label="Email"
				type="email"
				value={basics.email}
				aria-invalid={emailInvalid}
				aria-describedby={emailInvalid ? "email-error" : undefined}
				onChange={(event) => updateBasicField("email", event.target.value)}
			/>
			{emailInvalid ? (
				<p className="field-error" id="email-error">
					Enter a valid email address.
				</p>
			) : null}
			<TextInput
				label="Phone"
				value={basics.phone}
				onChange={(event) => updateBasicField("phone", event.target.value)}
			/>
			<TextInput
				label="Location"
				value={basics.location}
				onChange={(event) => updateBasicField("location", event.target.value)}
			/>
			<TextInput
				label="LinkedIn"
				type="url"
				value={basics.linkedin}
				onChange={(event) => updateBasicField("linkedin", event.target.value)}
			/>
			<TextInput
				label="GitHub"
				type="url"
				value={basics.github}
				onChange={(event) => updateBasicField("github", event.target.value)}
			/>
			<TextInput
				label="Website"
				type="url"
				value={basics.website}
				onChange={(event) => updateBasicField("website", event.target.value)}
			/>
		</form>
	)
}
