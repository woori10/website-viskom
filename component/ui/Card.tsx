export default function Card({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={`
        border border-(--color-ternary)
        bg-secondary
        rounded-2xl
        p-10
        transition-all duration-200
        hover:shadow-md hover:scale-105
        ${className}
      `}
    >
      {children}
    </div>
  );
}
