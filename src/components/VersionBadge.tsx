export default function VersionBadge() {
  return (
    <div
      className="version-badge"
      title={`Built ${new Date(__BUILD_DATE__).toLocaleString()}`}
    >
      v{__APP_VERSION__} · {__GIT_REVISION__}
    </div>
  );
}
