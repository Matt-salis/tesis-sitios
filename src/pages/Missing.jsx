import { Link } from "react-router-dom";

export function Missing() {
  return (
    <div className="wrap article">
      <p className="kicker">ZigZag</p>
      <h1>Esa página no está</h1>
      <Link className="btn" to="/">
        Volver a la marca
      </Link>
    </div>
  );
}
