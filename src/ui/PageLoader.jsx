import "./PageLoader.css";

const PageLoader = ({ label = "Loading" }) => {
  return (
    <div className="page-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="page-loader__brand">
        <span className="page-loader__name">Daniel Marass</span>
        <span className="page-loader__divider" aria-hidden="true" />
        <span className="page-loader__tagline">Portfolio</span>
      </div>
      <div className="page-loader__spinner" aria-hidden="true">
        <span className="page-loader__ring" />
        <span className="page-loader__ring page-loader__ring--alt" />
      </div>
      <p className="page-loader__label">
        {label}
        <span className="page-loader__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </p>
      <span className="visually-hidden">{label}, please wait.</span>
    </div>
  );
};

export default PageLoader;
