import { z } from "zod"
import { SECTION_IDS } from "./resume.types"

const optionalEmailSchema = z.string().refine(
	(value) => value === "" || z.email().safeParse(value).success,
	"Enter a valid email address.",
)

const optionalUrlSchema = z.string().refine(
	(value) => value === "" || z.url().safeParse(value).success,
	"Enter a valid URL.",
)

const sectionIdSchema = z.enum(SECTION_IDS)
const languageLevelSchema = z.enum([
	"Basic",
	"Intermediate",
	"Professional",
	"Fluent",
	"Native",
])

const baseSectionSchema = z.object({
	title: z.string(),
	visible: z.boolean(),
})

export const resumeBasicsSchema = z.object({
	fullName: z.string(),
	professionalTitle: z.string(),
	email: optionalEmailSchema,
	phone: z.string(),
	location: z.string(),
	linkedin: optionalUrlSchema,
	github: optionalUrlSchema,
	website: optionalUrlSchema,
})

export const resumeThemeSchema = z.object({
	fontFamily: z.string().min(1),
	bodyFontSize: z.number().min(8).max(12),
	headingFontSize: z.number().min(9).max(16),
	lineHeight: z.number().min(1.1).max(1.6),
	sectionSpacing: z.number().min(4).max(20),
	mainColumnWidth: z.number().min(55).max(72),
	pagePadding: z.number().min(8).max(20),
	accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Enter a valid hex color."),
})

const summarySectionSchema = baseSectionSchema.extend({
	id: z.literal("summary"),
	content: z.string(),
})

const experienceEntrySchema = z.object({
	id: z.string().min(1),
	jobTitle: z.string(),
	company: z.string(),
	location: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	isCurrent: z.boolean(),
	highlights: z.array(z.string()),
})

const experienceSectionSchema = baseSectionSchema.extend({
	id: z.literal("experience"),
	items: z.array(experienceEntrySchema).superRefine(requireUniqueEntryIds),
})

const educationEntrySchema = z.object({
	id: z.string().min(1),
	degree: z.string(),
	institution: z.string(),
	location: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	description: z.string(),
})

const educationSectionSchema = baseSectionSchema.extend({
	id: z.literal("education"),
	items: z.array(educationEntrySchema).superRefine(requireUniqueEntryIds),
})

const skillEntrySchema = z.object({
	id: z.string().min(1),
	name: z.string(),
})

const skillsSectionSchema = baseSectionSchema.extend({
	id: z.literal("skills"),
	items: z.array(skillEntrySchema).superRefine(requireUniqueEntryIds),
})

const languageEntrySchema = z.object({
	id: z.string().min(1),
	name: z.string(),
	level: languageLevelSchema,
})

const languagesSectionSchema = baseSectionSchema.extend({
	id: z.literal("languages"),
	items: z.array(languageEntrySchema).superRefine(requireUniqueEntryIds),
})

const projectEntrySchema = z.object({
	id: z.string().min(1),
	name: z.string(),
	description: z.string(),
	technologies: z.array(z.string()),
	url: optionalUrlSchema,
})

const projectsSectionSchema = baseSectionSchema.extend({
	id: z.literal("projects"),
	items: z.array(projectEntrySchema).superRefine(requireUniqueEntryIds),
})

const certificationEntrySchema = z.object({
	id: z.string().min(1),
	name: z.string(),
	issuer: z.string(),
	issueDate: z.string(),
	url: optionalUrlSchema,
})

const certificationsSectionSchema = baseSectionSchema.extend({
	id: z.literal("certifications"),
	items: z.array(certificationEntrySchema).superRefine(requireUniqueEntryIds),
})

const additionalInformationSectionSchema = baseSectionSchema.extend({
	id: z.literal("additionalInformation"),
	content: z.string(),
})

export const resumeSectionsSchema = z.object({
	summary: summarySectionSchema,
	experience: experienceSectionSchema,
	education: educationSectionSchema,
	skills: skillsSectionSchema,
	languages: languagesSectionSchema,
	projects: projectsSectionSchema,
	certifications: certificationsSectionSchema,
	additionalInformation: additionalInformationSectionSchema,
})

export const resumeLayoutSchema = z
	.object({
		templateId: z.literal("compact-two-column"),
		mainColumn: z.array(sectionIdSchema),
		sidebar: z.array(sectionIdSchema),
	})
	.superRefine((layout, context) => {
		const placedSections = [...layout.mainColumn, ...layout.sidebar]
		const seen = new Set<string>()

		for (const sectionId of placedSections) {
			if (seen.has(sectionId)) {
				context.addIssue({
					code: "custom",
					message: `Layout contains duplicate section "${sectionId}".`,
					path: ["mainColumn"],
				})
			}

			seen.add(sectionId)
		}

		for (const sectionId of SECTION_IDS) {
			if (!seen.has(sectionId)) {
				context.addIssue({
					code: "custom",
					message: `Layout is missing section "${sectionId}".`,
					path: ["mainColumn"],
				})
			}
		}
	})

export const resumeDocumentSchema = z.object({
	schemaVersion: z.literal(1),
	id: z.string().min(1),
	title: z.string().min(1),
	basics: resumeBasicsSchema,
	sections: resumeSectionsSchema,
	layout: resumeLayoutSchema,
	theme: resumeThemeSchema,
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
})

function requireUniqueEntryIds(
	items: Array<{ id: string }>,
	context: z.RefinementCtx,
): void {
	const seen = new Set<string>()

	for (const item of items) {
		if (seen.has(item.id)) {
			context.addIssue({
				code: "custom",
				message: `Duplicate entry id "${item.id}".`,
			})
		}

		seen.add(item.id)
	}
}
