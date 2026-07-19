import { useState } from "react"
import { ContentPanel } from "../components/editor/ContentPanel"
import { DesignPanel } from "../components/design/DesignPanel"
import { ResumePreview } from "../components/preview/ResumePreview"
import { Button } from "../components/common/Button"
import { Tabs, type TabId } from "../components/common/Tabs"
import { useResumeStore } from "../store/resume.store"
import { clearPersistedResume, useResumePersistence } from "./useResumePersistence"
import "../styles/editor.css"

export function AppShell() {
	useResumePersistence()
	const [activeTab, setActiveTab] = useState<TabId>("content")
	const resumeTitle = useResumeStore((state) => state.resume.title)
	const saveStatus = useResumeStore((state) => state.saveStatus)
	const lastError = useResumeStore((state) => state.lastError)
	const resetResume = useResumeStore((state) => state.resetResume)

	function handleReset() {
		if (window.confirm("Reset this resume?")) {
			clearPersistedResume()
			resetResume()
		}
	}

	return (
		<div className="app-shell">
			<header className="app-header">
				<div className="app-header__identity">
					<p className="app-header__eyebrow">Local Resume Builder</p>
					<h1>{resumeTitle}</h1>
				</div>

				<div className="app-header__actions" aria-label="Resume actions">
					<span className={`save-status save-status--${saveStatus}`}>{saveStatus}</span>
					{lastError ? (
						<span className="save-error" role="status">
							{lastError}
						</span>
					) : null}
					<Button type="button" variant="secondary" disabled>
						Import
					</Button>
					<Button type="button" variant="secondary" disabled>
						Export JSON
					</Button>
					<Button type="button" onClick={() => window.print()}>
						Print PDF
					</Button>
					<Button type="button" variant="danger" onClick={handleReset}>
						Reset
					</Button>
				</div>
			</header>

			<Tabs activeTab={activeTab} onChange={setActiveTab} />

			<main className="workspace" aria-label="Resume workspace">
				<section
					className={`workspace__pane workspace__pane--content ${
						activeTab === "content" ? "workspace__pane--active" : ""
					}`}
					aria-label="Content"
				>
					<ContentPanel />
				</section>

				<section
					className={`workspace__pane workspace__pane--preview ${
						activeTab === "preview" ? "workspace__pane--active" : ""
					}`}
					aria-label="Preview"
				>
					<ResumePreview />
				</section>

				<section
					className={`workspace__pane workspace__pane--design ${
						activeTab === "design" ? "workspace__pane--active" : ""
					}`}
					aria-label="Design"
				>
					<DesignPanel />
				</section>
			</main>
		</div>
	)
}
