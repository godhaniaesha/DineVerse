export default function DeleteIconButton({ onClick, title = "Delete", className = "" }) {
  const classes = `rooms__icon_btn rooms__icon_btn--danger ${className}`.trim();

  return (
    <button type="button" className={classes} title={title} onClick={onClick}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="m6 6 1 14h10l1-14" />
      </svg>
    </button>
  );
}
