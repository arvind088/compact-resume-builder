import { Field, TextInput } from "../common/Field"
import { Button } from "../common/Button"
import { useResumeStore } from "../../store/resume.store"

const fontFamilies = ["Arial", "Helvetica", "Georgia", "Times New Roman", "system-ui"]

export function DesignPanel() {
	const theme = useResumeStore((state) => state.resume.theme)
	const updateTheme = useResumeStore((state) => state.updateTheme)
	const resetTheme = useResumeStore((state) => state.resetTheme)

	return (
		<div className="panel-stack">
			<div className="panel-heading panel-heading--split">
				<h2>Design</h2>
				<Button type="button" variant="secondary" onClick={resetTheme}>
					Reset theme
				</Button>
			</div>

			<Field label="Font family">
				<select
					className="field__control"
					value={theme.fontFamily}
					onChange={(event) => updateTheme({ fontFamily: event.target.value })}
				>
					{fontFamilies.map((fontFamily) => (
						<option key={fontFamily} value={fontFamily}>
							{fontFamily}
						</option>
					))}
				</select>
			</Field>

			<RangeField
				label="Body font"
				min={8}
				max={12}
				step={0.5}
				value={theme.bodyFontSize}
				unit="pt"
				onChange={(value) => updateTheme({ bodyFontSize: value })}
			/>
			<RangeField
				label="Heading font"
				min={9}
				max={16}
				step={0.5}
				value={theme.headingFontSize}
				unit="pt"
				onChange={(value) => updateTheme({ headingFontSize: value })}
			/>
			<RangeField
				label="Line height"
				min={1.1}
				max={1.6}
				step={0.1}
				value={theme.lineHeight}
				onChange={(value) => updateTheme({ lineHeight: value })}
			/>
			<RangeField
				label="Section spacing"
				min={4}
				max={20}
				step={1}
				value={theme.sectionSpacing}
				unit="px"
				onChange={(value) => updateTheme({ sectionSpacing: value })}
			/>
			<RangeField
				label="Main column"
				min={55}
				max={72}
				step={1}
				value={theme.mainColumnWidth}
				unit="%"
				onChange={(value) => updateTheme({ mainColumnWidth: value })}
			/>
			<RangeField
				label="Page padding"
				min={8}
				max={20}
				step={1}
				value={theme.pagePadding}
				unit="mm"
				onChange={(value) => updateTheme({ pagePadding: value })}
			/>
			<TextInput
				label="Accent color"
				type="color"
				value={theme.accentColor}
				onChange={(event) => updateTheme({ accentColor: event.target.value })}
			/>
		</div>
	)
}

interface RangeFieldProps {
	label: string
	min: number
	max: number
	step: number
	value: number
	unit?: string
	onChange(value: number): void
}

function RangeField({ label, min, max, step, value, unit = "", onChange }: RangeFieldProps) {
	return (
		<Field label={`${label}: ${value}${unit}`}>
			<input
				className="range-control"
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(event) => onChange(Number(event.target.value))}
			/>
		</Field>
	)
}
