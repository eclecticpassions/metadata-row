import { type QuartzComponent, type QuartzComponentConstructor, type QuartzComponentProps } from "@quartz-community/types"
import { formatDate } from "@quartz-community/utils/date"
import { h } from "preact"
  
const MetadataRowImpl: QuartzComponent = (props: QuartzComponentProps) => {  
  const { fileData } = props  
  const frontmatter = (fileData.frontmatter as Record<string, any>) || {}  
  const date = fileData.dates?.created || fileData.dates?.modified  
  const metaItems: any[] = []  
  
  if (date) {  
    metaItems.push(h("span", { class: "meta-item" }, formatDate(new Date(date), props.cfg?.locale)))  
  }  
  if (fileData.readingTime) {  
    metaItems.push(h("span", { class: "meta-item" }, `${fileData.readingTime} min read`))  
  }  
  if (frontmatter.description) {  
    metaItems.push(h("span", { class: "meta-item" }, frontmatter.description))  
  }  
  if (frontmatter.tags) {  
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.join(" • ") : String(frontmatter.tags)  
    metaItems.push(h("span", { class: "meta-item" }, tags))  
  }  
  
  return h("div", { class: "metadata-row" }, ...metaItems)  
}  
  
MetadataRowImpl.css = `  
.metadata-row {  
  display: flex;  
  gap: 1rem;  
  font-size: 0.875rem;  
  color: var(--darkgray);  
  margin: 0.5rem 0;  
}  
  
.meta-item {  
  display: inline-flex;  
  align-items: center;  
}  
`  
  
// Explicitly type as QuartzComponentConstructor  
const MetadataRow: QuartzComponentConstructor = (() => MetadataRowImpl)  
  
export { MetadataRow }  
export default MetadataRow