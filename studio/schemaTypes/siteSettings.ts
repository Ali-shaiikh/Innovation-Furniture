import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "hero_title", title: "Hero Title", type: "string" }),
    defineField({ name: "hero_subtitle", title: "Hero Subtitle", type: "text", rows: 2 }),
    defineField({
      name: "hero_image", title: "Hero Image", type: "image", options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "hero_stats", title: "Hero Stats", type: "array",
      of: [{ type: "object", fields: [
        { name: "value", title: "Value (e.g. 500+)", type: "string" },
        { name: "label", title: "Label (e.g. Designs)", type: "string" },
      ], preview: { select: { title: "value", subtitle: "label" } } }],
    }),
    defineField({
      name: "why_us_items", title: "Why Choose Us Items", type: "array",
      of: [{ type: "object", fields: [
        { name: "icon", title: "Icon", type: "string", options: { list: ["shield","clock","heart","star","truck","award"] } },
        { name: "title", title: "Title", type: "string" },
        { name: "description", title: "Description", type: "text", rows: 2 },
      ], preview: { select: { title: "title" } } }],
    }),
    defineField({ name: "cta_title", title: "CTA Title", type: "string" }),
    defineField({ name: "cta_subtitle", title: "CTA Subtitle", type: "string" }),
    defineField({ name: "about_mission", title: "About Mission Text", type: "text", rows: 4 }),
    defineField({
      name: "about_stats", title: "About Stats", type: "array",
      of: [{ type: "object", fields: [
        { name: "value", title: "Value (e.g. 2015)", type: "string" },
        { name: "label", title: "Label (e.g. Year Founded)", type: "string" },
      ], preview: { select: { title: "value", subtitle: "label" } } }],
    }),
    defineField({
      name: "about_values", title: "About Values", type: "array",
      of: [{ type: "object", fields: [
        { name: "number", title: "Number (e.g. 01)", type: "string" },
        { name: "title", title: "Title", type: "string" },
        { name: "description", title: "Description", type: "text", rows: 2 },
      ], preview: { select: { title: "title" } } }],
    }),
    defineField({ name: "contact_email", title: "Contact Email", type: "string" }),
    defineField({ name: "contact_phone", title: "Contact Phone", type: "string" }),
    defineField({ name: "contact_address", title: "Showroom Cities", type: "string" }),
    defineField({ name: "social_instagram", title: "Instagram URL", type: "url" }),
    defineField({ name: "social_pinterest", title: "Pinterest URL", type: "url" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
