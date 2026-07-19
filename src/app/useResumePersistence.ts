import { useEffect, useRef } from "react"
import { clearResume, loadResume, saveResume } from "../storage/localStorage.repository"
import { useResumeStore } from "../store/resume.store"

const SAVE_DELAY_MS = 500

export function useResumePersistence() {
	const loadedRef = useRef(false)
	const resume = useResumeStore((state) => state.resume)
	const saveStatus = useResumeStore((state) => state.saveStatus)
	const hydrateResume = useResumeStore((state) => state.hydrateResume)
	const setSaveStatus = useResumeStore((state) => state.setSaveStatus)
	const setLastError = useResumeStore((state) => state.setLastError)

	useEffect(() => {
		const result = loadResume()

		if (result.resume) {
			hydrateResume(result.resume)
		}

		if (result.error) {
			setLastError(result.error)
		}

		loadedRef.current = true
	}, [hydrateResume, setLastError])

	useEffect(() => {
		if (!loadedRef.current || saveStatus !== "unsaved") {
			return undefined
		}

		const timeoutId = window.setTimeout(() => {
			try {
				setSaveStatus("saving")
				saveResume(resume)
				setSaveStatus("saved")
			} catch {
				setSaveStatus("error")
				setLastError("Resume could not be saved locally.")
			}
		}, SAVE_DELAY_MS)

		return () => window.clearTimeout(timeoutId)
	}, [resume, saveStatus, setLastError, setSaveStatus])
}

export function clearPersistedResume() {
	clearResume()
}
