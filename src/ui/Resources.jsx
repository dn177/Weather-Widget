import "./Resources.css";
import { generalJSData } from "../lib/resourcesData";

function Resources() {
  return (
    <div className="container-fluid">
      <h1 className="text-center py-5">Resources</h1>
      <h2 className="text-start mb-2">General JavaScript</h2>
      {generalJSData.map((resource) => (
        <details>
          <summary>{resource.headline}</summary>
          <p>
            <a href={resource.link} target="_blank" rel="noreferrer">
              {resource.linkText}
            </a>
          </p>
        </details>
      ))}
      {/* <details>
        <summary>Data Fetching / Preflight Explained</summary>
        <p>
          <a
            href="https://byby.dev/js-fetch-cors-credentials"
            target="_blank"
            rel="noreferrer"
          >
            Best article about this topic i've read.
          </a>
        </p>
      </details> */}
    </div>
  );
}

export default Resources;
