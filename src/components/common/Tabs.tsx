export type TabId = "content" | "preview" | "design"

interface TabsProps {
	activeTab: TabId
	onChange(tabId: TabId): void
}

const tabs: Array<{ id: TabId; label: string }> = [
	{ id: "content", label: "Content" },
	{ id: "preview", label: "Preview" },
	{ id: "design", label: "Design" },
]

export function Tabs({ activeTab, onChange }: TabsProps) {
	return (
		<nav className="mobile-tabs" aria-label="Workspace views">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					type="button"
					className={tab.id === activeTab ? "mobile-tabs__tab mobile-tabs__tab--active" : "mobile-tabs__tab"}
					aria-current={tab.id === activeTab ? "page" : undefined}
					onClick={() => onChange(tab.id)}
				>
					{tab.label}
				</button>
			))}
		</nav>
	)
}
