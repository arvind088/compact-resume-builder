import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react"

interface FieldProps {
	children: ReactNode
	label: string
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label: string
}

export function Field({ children, label }: FieldProps) {
	return (
		<label className="field">
			<span className="field__label">{label}</span>
			{children}
		</label>
	)
}

export function TextInput({ label, ...props }: TextInputProps) {
	return (
		<Field label={label}>
			<input className="field__control" {...props} />
		</Field>
	)
}

export function TextArea({ label, ...props }: TextAreaProps) {
	return (
		<Field label={label}>
			<textarea className="field__control field__control--textarea" {...props} />
		</Field>
	)
}
