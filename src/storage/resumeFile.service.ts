import { normalizeLayout } from "../domain/resume.layout"
import { resumeDocumentSchema } from "../domain/resume.schema"
import type { ResumeDocument } from "../domain/resume.types"

export function sanitizeFileName(value: string): string {
	const sanitized = value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")

	return sanitized || "resume"
}

export function getResumeJsonFileName(resume: ResumeDocument): string {
	return `${sanitizeFileName(resume.title)}.resume.json`
}

export function createResumeJsonBlob(resume: ResumeDocument): Blob {
	const validResume = resumeDocumentSchema.parse(resume)
	return new Blob([`${JSON.stringify(validResume, null, 2)}\n`], {
		type: "application/json",
	})
}

export function downloadResumeJson(resume: ResumeDocument): void {
	const blob = createResumeJsonBlob(resume)
	const url = URL.createObjectURL(blob)
	const anchor = document.createElement("a")

	anchor.href = url
	anchor.download = getResumeJsonFileName(resume)
	anchor.click()
	URL.revokeObjectURL(url)
}

export async function parseResumeFile(file: File): Promise<ResumeDocument> {
	let parsedValue: unknown

	try {
		parsedValue = JSON.parse(await file.text())
	} catch {
		throw new Error("Selected file is not valid JSON.")
	}

	const parseResult = resumeDocumentSchema.safeParse(parsedValue)

	if (!parseResult.success) {
		throw new Error(formatImportError(parseResult.error.issues.map((issue) => issue.message)))
	}

	return {
		...parseResult.data,
		layout: normalizeLayout(parseResult.data.layout),
	}
}

function formatImportError(errors: string[]): string {
	const [firstError] = errors

	if (!firstError) {
		return "Selected resume file is invalid."
	}

	return `Selected resume file is invalid: ${firstError}`
}
