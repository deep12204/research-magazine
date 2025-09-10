export default function NewsItem({ title, summary, link, authors, category }) {
  const short = summary?.length > 220 ? summary.slice(0, 200) + "…" : summary;

  return(
    <div className="col">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <h5 className="card-title">{title}</h5>
            {category && <span className="badge text-bg-secondary">{category}</span>}
          </div>
          {authors && <p className="text-muted small mb-2">By {authors}</p>}
          <p className="card-text">{short || "No abstract available."}</p>
        </div>
        <div className="card-footer bg-transparent border-0">
          <a className="btn btn-dark w-100" href={link} target="_blank" rel="noreferrer">
            Read paper
          </a>
        </div>
      </div>
    </div>

  );
}
