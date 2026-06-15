export function forceWrapHtml(html: string) {
  if (!html) return "";

  let out = html;

  // Normalize non-breaking spaces to regular spaces
  out = out.replace(/&nbsp;|\u00A0/g, " ");

  // Remove HTML comments
  out = out.replace(/<!--([\s\S]*?)-->/g, "");

  // Remove inline style attributes
  out = out.replace(/\sstyle=("[^"]*"|'[^']*')/gi, "");

  // Remove inline event handlers like onclick, onerror, etc.
  out = out.replace(/\son[a-z]+=("[^"]*"|'[^']*')/gi, "");

  // Remove empty paragraphs
  out = out.replace(/<p>(\s|&nbsp;)*<\/p>/gi, "");

  // Normalize spacing between tags and trim
  out = out.replace(/>\s+</g, "> <");
  out = out.replace(/\s{2,}/g, " ");
  out = out.trim();

  // Remove zero-width and soft-hyphen characters that may cause odd wrapping
  out = out.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "");

  // Remove explicit <wbr> tags which may force breaks
  out = out.replace(/<wbr\s*\/?>/gi, "");

  // If the HTML contains no common block-level tags, wrap in a paragraph
  if (!/(<p\b|<div\b|<h[1-6]\b|<ul\b|<ol\b|<table\b|<blockquote\b|<section\b|<article\b)/i.test(out)) {
    out = `<p>${out}</p>`;
  }

  return out;
}

export default forceWrapHtml;
