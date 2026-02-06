//This script loads articles from the server to then be displayed in the frontend

import fs from "fs";
import path from "path";
import matter from "gray-matter";

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD") // e.g. "ä" → "ä"
    .replace(/[\u0300-\u036f]/g, "") // remove diacritical symbols (e. g.  "̈")
    .replace(/[^a-z0-9]+/g, "-") // remove every non-alphanumeric by a hyphen
    .replace(/^-+|-+$/g, "") // remove leading and trailing hyphens
    .replace(/--+/g, "-"); // avoid double hyphens
}

export default function handler(req, res) {
  const baseDir = path.join(process.cwd(), "content/news");

  try {
    let now = new Date();
    const files = fs
      .readdirSync(baseDir)
      .filter((file) => file.toLowerCase().endsWith(".md"))
      .filter((file) => file != "readme.md")
      .sort((a, b) => a.localeCompare(b));

    //The maximum number of words allowed for the excerpt is defined here:
    const maxWordCountExcerpt = 10;
    //If it's longer, the excerpt is trimmed and ends with "..."

    const result = files
      .map((file) => {
        const filePath = path.join(baseDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        return {
          data,
          content,
        };
      })

      /*
      A post is currently only displayed if it contains a title, an excerpt, an author and an image,
      the publication date is not in the future, and the post is explicitly marked as published.
      In addition, the article must not be older than one year.
      These conditions can be adjusted with the following filters:
      */

      .filter(
        ({ data }) =>
          data.title && //title must be set
          data.excerpt && //excerpt must be set
          data.author && //author must be set
          now >= new Date(data.publishDate) && //publishDate must be today or before today
          new Date(data.publishDate) >= new Date(new Date().setFullYear(new Date().getFullYear() - 1)) && //article must not be older than one year
          data.image && //image must be set
          data.published //the article must be set on "published"
      )
      .map(({ data, content }) => ({
        uuid: data.publishDate + "_" + slugify(data.title),
        title: data.title || "",
        excerpt:
          data.excerpt.split(" ").length < maxWordCountExcerpt
            ? data.excerpt
            : data.excerpt.split(" ").slice(0, maxWordCountExcerpt).join(" ") + "..." || "",
        cta: data.cta || "",
        author: data.author || "",
        publishDate: data.publishDate || "",
        image: data.image || "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        published: true,
        eventinfos: {
          date: data.eventinfos?.date || "",
          time: data.eventinfos?.time || "",
          location: data.eventinfos?.location || "",
          locationlink: data.eventinfos?.locationlink || "",
        },
        content,
      }));

    if (req.query.start && req.query.end) {
      const start = parseInt(req.query.start);
      const end = parseInt(req.query.end);

      res.status(200).json({
        news: result.slice(start, end),
        total: result.length,
      });
    } else if (req.query.uuid) {
      res.status(200).json({
        article: result.find((item) => item.uuid === req.query.uuid),
      });
    } else if (req.query.tag) {
      const filtered = result.filter((item) => item.tags.includes(req.query.tag));
      res.status(200).json(filtered);
    } else if (req.query.author) {
      const filtered = result.filter((item) => item.author === req.query.author);
      res.status(200).json(filtered);
    }
  } catch (error) {
    console.error("Error processing Markdown files:", error);
    res.status(500).json({ error: "Error reading Markdown files." });
  }
}
