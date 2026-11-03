export default function ScannerReveal() {
  return (
    <div className="scanner-layer" aria-hidden="true">
      <div className="scan-grid" />
      <div className="scanner-beam">
        <span>DECODING / J-001</span>
      </div>
      <div className="scan-reticle">
        <i />
        <i />
        <span>ENTITY LOCK</span>
      </div>
      <div className="scan-coordinate">
        X 035.673 / Y 139.702
        <br />
        DEPTH / UNKNOWN
      </div>
    </div>
  );
}
