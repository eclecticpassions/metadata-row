import { type QuartzComponent, type QuartzComponentConstructor, type QuartzComponentProps } from "@quartz-community/types"
import { formatDate } from "@quartz-community/utils/date"
import { resolveRelative } from "@quartz-community/utils/path"  
import { h } from "preact"
import readingTime from "reading-time"  
  
const MetadataRowImpl: QuartzComponent = (props: QuartzComponentProps) => {  
  const { fileData } = props  
  const frontmatter = (fileData.frontmatter as Record<string, any>) || {}  
  const metaItems: any[] = []  
  
  // Show created date  
  const createdDate = fileData.dates?.created  
  if (createdDate) {  
    const dateStr = formatDate(new Date(createdDate), props.cfg?.locale)  
      
    // Add modified date in parentheses if present and different from created  
    const modifiedDate = fileData.dates?.modified  
    if (modifiedDate && new Date(modifiedDate).getTime() !== new Date(createdDate).getTime()) {  
      const modifiedStr = formatDate(new Date(modifiedDate), props.cfg?.locale)  
      metaItems.push(h("span", { class: "meta-item" }, `${dateStr} (updated: ${modifiedStr})`))  
    } else {  
      metaItems.push(h("span", { class: "meta-item" }, dateStr))  
    }  
  }  
  
  // Calculate word count and show reading time  
  if (fileData.text) {  
    const { minutes } = readingTime(fileData.text)  
    const wordCount = fileData.text.split(/\s+/).filter(Boolean).length  
    metaItems.push(h("span", { class: "meta-item" }, `${wordCount} words (${Math.ceil(minutes)} mins)`))  
  }  

  // Render tags as clickable links with # prefix  
  if (frontmatter.tags) {  
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags]  
    const tagLinks = tags.map((tag: string) => {  
      const tagHref = resolveRelative(fileData.slug!, `tags/${tag}` as any)  
      return h("a", {   
        class: "internal tag-link",  
        href: tagHref  
      }, `${tag}`)  
    })  
    metaItems.push(h("span", { class: "meta-item tags" }, ...tagLinks))  
  }  
  
// Status custom frontmatter property
  if (frontmatter.status) {  
    const statusValue = Array.isArray(frontmatter.status) ? frontmatter.status : String(frontmatter.status)  
    
  metaItems.push(
    h("span", { class: "meta-status" }, [
      h("span", { class: "meta-item status" }, statusValue),
      h("span", { class: "status-tooltip" }, [
        "This is the ",
        h("a", { href: "/about/#note-status" }, "status label")
      ]),
    ])
  )
}
  
  return h("div", { class: "metadata-row" }, ...metaItems)  
}  
  
MetadataRowImpl.css = `  
.metadata-row {  
  user-select: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  justify-content: start;
  font-size: 0.833rem;  
}  

.meta-item {  
  display: inline-flex;  
  align-items: center;  
}  

.meta-item.tags {
gap: 0.3rem;
}

.tag-link {  
  color: var(--secondary);  
  text-decoration: underline;  
}  

.meta-status {
  position: relative;
  display: inline-block;
  cursor: help;
}

.status-tooltip {
  position: absolute;
  left: 0;
  top: 100%;
  box-shadow: 2px 3px 5px #000;
  padding: 0.4rem 0.8rem;
  background: var(--tertiary);
  color: var(--light);
  border-radius: 5px;
  white-space: nowrap;
  pointer-events: auto;
  z-index: 10;
  opacity: 0;
  transform: translateY(-4px);
  visibility: hidden;
  transition: opacity 160ms ease, transform 160ms ease, visibility 0s linear 160ms;
  a {
  color: inherit;
  font-weight: 400;
  }
}

.meta-status:hover .status-tooltip,
.meta-status:focus-within .status-tooltip {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
  transition: opacity 160ms ease, transform 160ms ease, visibility 0s;
}

.meta-status::after {
  content: "";
  width: 120%;
  height: 50%;
  position: absolute;
  top: 100%;
  left: -10%;
}
`  
  
const MetadataRow: QuartzComponentConstructor = (() => MetadataRowImpl)  
  
export { MetadataRow }  
export default MetadataRow