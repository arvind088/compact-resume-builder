import { resumeDocumentSchema } from "./resume.schema"
import type { ResumeDocument } from "./resume.types"

export interface ValidationResult {
	valid: boolean
	errors: string[]
}

export function validateResumeDocument(value: unknown): ValidationResult {
	const result = resumeDocumentSchema.safeParse(value)

	if (result.success) {
		return {
			valid: true,
			errors: [],
		}
	}

	return {
		valid: false,
		errors: result.error.issues.map((issue) => issue.message),
	}
}

export function parseResumeDocument(value: unknown): ResumeDocument {
	return resumeDocumentSchema.parse(value) as ResumeDocument
}
