export default function Eyebrow({ children, className = '' }) {
  return (
    <span className={`label-eyebrow text-gold-300 ${className}`}>
      {children}
    </span>
  )
}
