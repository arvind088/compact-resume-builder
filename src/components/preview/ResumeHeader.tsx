import type { ResumeBasics } from "../../domain/resume.types"

interface ResumeHeaderProps {
	basics: ResumeBasics
}

export function ResumeHeader({ basics }: ResumeHeaderProps) {
	const contacts = [
		createEmailContact(basics.email),
		createPlainContact(basics.phone),
		createPlainContact(basics.location),
		createUrlContact(basics.linkedin),
		createUrlContact(basics.github),
		createUrlContact(basics.website),
	].filter((contact) => contact.label !== "")

	return (
		<div className="resume-header" role="group" aria-label="Resume header">
			<h2>{basics.fullName || "Your Name"}</h2>
			{basics.professionalTitle ? <p>{basics.professionalTitle}</p> : null}
			{contacts.length ? (
				<ul aria-label="Contact details">
					{contacts.map((contact) => (
						<li key={`${contact.label}-${contact.href ?? "plain"}`}>
							{contact.href ? (
								<a href={contact.href} target="_blank" rel="noreferrer">
									{contact.label}
								</a>
							) : (
								contact.label
							)}
						</li>
					))}
				</ul>
			) : null}
		</div>
	)
}

function createPlainContact(value: string): { label: string; href?: string } {
	return { label: value.trim() }
}

function createEmailContact(value: string): { label: string; href?: string } {
	const label = value.trim()

	if (!label) {
		return { label }
	}

	return {
		label,
		href: `mailto:${label}`,
	}
}

function createUrlContact(value: string): { label: string; href?: string } {
	const label = value.trim()

	if (!label) {
		return { label }
	}

	return {
		label,
		href: label.startsWith("http://") || label.startsWith("https://") ? label : `https://${label}`,
	}
}
