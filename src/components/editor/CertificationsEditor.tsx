import { Button } from "../common/Button"
import { TextInput } from "../common/Field"
import { useResumeStore } from "../../store/resume.store"

export function CertificationsEditor() {
	const items = useResumeStore((state) => state.resume.sections.certifications.items)
	const addCertification = useResumeStore((state) => state.addCertification)
	const updateCertification = useResumeStore((state) => state.updateCertification)
	const removeCertification = useResumeStore((state) => state.removeCertification)

	return (
		<div className="entry-stack">
			{items.map((item, index) => (
				<div className="entry-card" key={item.id}>
					<div className="entry-card__header">
						<h3>Certification {index + 1}</h3>
						<Button type="button" variant="danger" onClick={() => removeCertification(item.id)}>
							Remove
						</Button>
					</div>
					<div className="form-grid">
						<TextInput
							label="Certification name"
							value={item.name}
							onChange={(event) => updateCertification(item.id, { name: event.target.value })}
						/>
						<TextInput
							label="Issuer"
							value={item.issuer}
							onChange={(event) => updateCertification(item.id, { issuer: event.target.value })}
						/>
						<TextInput
							label="Issue date"
							value={item.issueDate}
							onChange={(event) => updateCertification(item.id, { issueDate: event.target.value })}
						/>
						<TextInput
							label="Certification URL"
							type="url"
							value={item.url}
							onChange={(event) => updateCertification(item.id, { url: event.target.value })}
						/>
					</div>
				</div>
			))}
			<Button type="button" variant="secondary" onClick={addCertification}>
				Add certification
			</Button>
		</div>
	)
}
