import { Button } from "../common/Button"

interface EntryOrderControlsProps {
	index: number
	itemId: string
	itemIds: string[]
	label: string
	onReorder(activeId: string, overId: string): void
}

export function EntryOrderControls({
	index,
	itemId,
	itemIds,
	label,
	onReorder,
}: EntryOrderControlsProps) {
	const previousItemId = itemIds[index - 1]
	const nextItemId = itemIds[index + 1]

	return (
		<div className="entry-order-controls" aria-label={`${label} order controls`}>
			<Button
				type="button"
				variant="secondary"
				aria-label={`Move ${label} up`}
				disabled={!previousItemId}
				onClick={() => previousItemId && onReorder(itemId, previousItemId)}
			>
				Move up
			</Button>
			<Button
				type="button"
				variant="secondary"
				aria-label={`Move ${label} down`}
				disabled={!nextItemId}
				onClick={() => nextItemId && onReorder(itemId, nextItemId)}
			>
				Move down
			</Button>
		</div>
	)
}
