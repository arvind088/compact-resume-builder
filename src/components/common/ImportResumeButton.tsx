import { useRef, useState } from "react"
import { parseResumeFile } from "../../storage/resumeFile.service"
import { useResumeStore } from "../../store/resume.store"
import { Button } from "./Button"

export function ImportResumeButton() {
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [importing, setImporting] = useState(false)
	const replaceResume = useResumeStore((state) => state.replaceResume)
	const setLastError = useResumeStore((state) => state.setLastError)

	async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const [file] = Array.from(event.target.files ?? [])
		event.target.value = ""

		if (!file) {
			return
		}

		setImporting(true)

		try {
			const resume = await parseResumeFile(file)
			const confirmed = window.confirm(`Import "${resume.title}" from ${file.name}?`)

			if (confirmed) {
				replaceResume(resume)
			}
		} catch (error) {
			setLastError(error instanceof Error ? error.message : "Selected resume file is invalid.")
		} finally {
			setImporting(false)
		}
	}

	return (
		<>
			<Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
				{importing ? "Importing" : "Import"}
			</Button>
			<input
				ref={inputRef}
				className="visually-hidden"
				type="file"
				accept="application/json,.json"
				aria-label="Import resume JSON"
				onChange={handleFileChange}
			/>
		</>
	)
}
