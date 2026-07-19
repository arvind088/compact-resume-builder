import { normalizeLayout } from "../domain/resume.layout"
import { resumeDocumentSchema } from "../domain/resume.schema"
import type { ResumeDocument } from "../domain/resume.types"

export const RESUME_STORAGE_KEY = "local-resume-builder:v1"

export interface LoadResumeResult {
	resume: ResumeDocument | null
	error: string | null
}

export type ResumeStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">

export function loadResume(storage: ResumeStorage = window.localStorage): LoadResumeResult {
	try {
		const rawValue = storage.getItem(RESUME_STORAGE_KEY)

		if (!rawValue) {
			return {
				resume: null,
				error: null,
			}
		}

		const parsedValue: unknown = JSON.parse(rawValue)
		const parseResult = resumeDocumentSchema.safeParse(parsedValue)

		if (!parseResult.success) {
			return {
				resume: null,
				error: "Saved resume data is invalid.",
			}
		}

		return {
			resume: {
				...parseResult.data,
				layout: normalizeLayout(parseResult.data.layout),
			},
			error: null,
		}
	} catch {
		return {
			resume: null,
			error: "Saved resume data could not be loaded.",
		}
	}
}

export function saveResume(
	resume: ResumeDocument,
	storage: ResumeStorage = window.localStorage,
): void {
	const validResume = resumeDocumentSchema.parse(resume)
	storage.setItem(RESUME_STORAGE_KEY, JSON.stringify(validResume))
}

export function clearResume(storage: ResumeStorage = window.localStorage): void {
	storage.removeItem(RESUME_STORAGE_KEY)
}
