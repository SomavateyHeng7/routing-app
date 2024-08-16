import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <div className="error-container">
        <h1>Oops! Something Went Wrong</h1>
        <p>We're sorry, an unexpected error has occurred.</p>
        <p className="error-details">
          <i>{error.statusText || error.message}</i>
        </p>
        <a href="/" className="back-home">
          Back to Home
        </a>
      </div>
    </div>
  );
}
