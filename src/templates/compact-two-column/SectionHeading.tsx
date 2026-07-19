import type { ReactNode } from "react"

interface SectionHeadingProps {
	children: ReactNode
}

export function SectionHeading({ children }: SectionHeadingProps) {
	return <h3 className="section-heading">{children}</h3>
}
