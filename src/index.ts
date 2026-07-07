import { type QuartzComponent, type QuartzComponentConstructor, type QuartzComponentProps } from "@quartz-community/types"
import { formatDate } from "@quartz-community/utils/date"
import { h } from "preact"

const MetadataRow: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData } = props
  const frontmatter = fileData.frontmatter as Record<string, any> || {}

  const date = fileData.dates?.created || fileData.dates?.modified

  const metaItems: any[] = []

  // Date
  if (date) {
    metaItems.push(
      h("span", { class: "meta-item" }, formatDate(new Date(date), props.cfg?.locale))
    )
  }

  // Read time
  if (fileData.readingTime) {
    metaItems.push(
      h("span", { class: "meta-item" }, `${fileData.readingTime} min read`)
    )
  }

  // Description
  if (frontmatter.description) {
    metaItems.push(
      h("span", { class: "meta-item" }, frontmatter.description)
    )
  }

  // Tags
  if (frontmatter.tags) {
    const tags = Array.isArray(frontmatter.tags) 
      ? frontmatter.tags.join(" • ") 
      : String(frontmatter.tags)
    metaItems.push(
      h("span", { class: "meta-item" }, tags)
    )
  }

  if (metaItems.length === 0) return null

  return h("div", { class: "metadata-row" }, ...metaItems)
}

MetadataRow.css = `
.metadata-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--darkgray);
  margin: 0.5rem 0 1.5rem 0;
  border-bottom: 1px solid var(--lightgray);
  padding-bottom: 1rem;
}

.meta-item {
  display: inline-flex;
  align-items: center;
}
`

export default (() => MetadataRow) satisfies QuartzComponentConstructor