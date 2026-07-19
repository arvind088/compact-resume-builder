import { describe, expect, it } from "vitest"
import { createDefaultResume } from "../domain/resume.defaults"
import {
	clearResume,
	loadResume,
	RESUME_STORAGE_KEY,
	saveResume,
	type ResumeStorage,
} from "./localStorage.repository"

describe("localStorage repository", () => {
	it("saves and loads a valid resume document", () => {
		const storage = new MemoryStorage()
		const resume = createDefaultResume()
		resume.basics.fullName = "Arvind Kumar"

		saveResume(resume, storage)
		const result = loadResume(storage)

		expect(result.error).toBeNull()
		expect(result.resume?.basics.fullName).toBe("Arvind Kumar")
	})

	it("returns null when no saved resume exists", () => {
		const result = loadResume(new MemoryStorage())

		expect(result.resume).toBeNull()
		expect(result.error).toBeNull()
	})

	it("rejects malformed saved data without throwing", () => {
		const storage = new MemoryStorage()
		storage.setItem(RESUME_STORAGE_KEY, "{not-json")

		const result = loadResume(storage)

		expect(result.resume).toBeNull()
		expect(result.error).toBe("Saved resume data could not be loaded.")
	})

	it("rejects schema-incompatible saved data", () => {
		const storage = new MemoryStorage()
		storage.setItem(RESUME_STORAGE_KEY, JSON.stringify({ schemaVersion: 999 }))

		const result = loadResume(storage)

		expect(result.resume).toBeNull()
		expect(result.error).toBe("Saved resume data is invalid.")
	})

	it("clears saved resume data", () => {
		const storage = new MemoryStorage()
		saveResume(createDefaultResume(), storage)

		clearResume(storage)

		expect(storage.getItem(RESUME_STORAGE_KEY)).toBeNull()
	})
})

class MemoryStorage implements ResumeStorage {
	private readonly values = new Map<string, string>()

	getItem(key: string): string | null {
		return this.values.get(key) ?? null
	}

	setItem(key: string, value: string): void {
		this.values.set(key, value)
	}

	removeItem(key: string): void {
		this.values.delete(key)
	}
}
