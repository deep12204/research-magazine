/*const Newsboard=()=>{
  return(
    <div>
<h2 className="text-center">Latest <span className="badge bg-danger">Research</span></h2>
    </div>
  )
}
export default Newsboard;*/
// src/components/NewsBoard.jsx
/*import { useState } from "react";
import NewsItem from "./newsitem.jsx";

// sample data to see the UI first
const sampleArticles = [
  {
    title: "Intro to Transformers",
    summary:
      "A gentle overview of transformer architectures and why attention mechanisms replaced recurrence in modern NLP.",
    link: "https://huggingface.co/transformers/",
    authors: "Vaswani et al. (overview)",
    category: "AI",
  },
  {
    title: "Active Learning in Education",
    summary:
      "Review of techniques that increase retention through retrieval practice, spacing, and interleaving.",
    link: "https://doi.org/10.1037/edu000001",
    authors: "Educational Psych Review",
    category: "Education",
  },
  {
    title: "Wearable Health Monitoring",
    summary:
      "Survey of low-power sensors and on-device learning for continuous vitals tracking.",
    link: "https://arxiv.org/",
    authors: "Various",
    category: "Health",
  },
];

export default function NewsBoard() {
  const [articles] = useState(sampleArticles); // state holds our list

  return (
    <div className="container py-3">
      <h2 className="text-center mb-3">
        Latest <span className="badge bg-danger">Research</span>
      </h2>

      {/* 3-column responsive grid *//*}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {articles.map((a, i) => (
          <NewsItem key={i} {...a} />
        ))}
      </div>
    </div>
  );
}*/
import { useEffect, useState } from "react";
import NewsItem from "./newsitem.jsx";

const sampleArticles = [
  {
    title: "Intro to Transformers",
    summary:
      "A gentle overview of transformer architectures and why attention mechanisms replaced recurrence in modern NLP.",
    link: "https://huggingface.co/transformers/",
    authors: "Vaswani et al. (overview)",
    category: "AI",
  },
];

export default function NewsBoard() {
  const [query, setQuery] = useState("large language model");
  const [articles, setArticles] = useState(sampleArticles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchArxiv(q) {
    try {
      setLoading(true);
      setError("");
      const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
        q
      )}&start=0&max_results=9&sortBy=submittedDate&sortOrder=descending`;

      const res = await fetch(url);
      const xml = await res.text();
      setArticles(parseArxiv(xml));
    } catch (e) {
      console.error(e);
      setError("Could not load from arXiv. Showing sample data.");
      setArticles(sampleArticles);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArxiv(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container py-3">
      <h2 className="text-center mb-3">
        Latest <span className="badge bg-danger">Research</span>
      </h2>

      {/* Search form */}
      <form
        className="row g-2 align-items-center mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          fetchArxiv(query);
        }}
      >
        <div className="col-sm-8 col-md-9">
          <input
            className="form-control"
            placeholder="Search arXiv (e.g., 'computer vision', 'education', 'robotics')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="col-sm-4 col-md-3 d-grid">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Loading…" : "Fetch from arXiv"}
          </button>
        </div>
        {error && <div className="text-danger small mt-1">{error}</div>}
      </form>

      {/* Cards grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {articles.map((a, i) => (
          <NewsItem key={i} {...a} />
        ))}
      </div>
    </div>
  );
}

/* --- Atom XML to JS --- */
function parseArxiv(xmlText) {
  const doc = new window.DOMParser().parseFromString(xmlText, "text/xml");
  const entries = [...doc.getElementsByTagName("entry")].map((e) => {
    const title = text(e, "title");
    const summary = text(e, "summary");
    const link = text(e, "id");
    const authors = [...e.getElementsByTagName("author")]
      .map((a) => text(a, "name"))
      .join(", ");
    const category = e.getElementsByTagName("category")[0]?.getAttribute("term") || "Research";
    return { title, summary, link, authors, category };
  });
  return entries;
}
function text(node, tag) {
  return node.getElementsByTagName(tag)[0]?.textContent?.trim() || "";
}
