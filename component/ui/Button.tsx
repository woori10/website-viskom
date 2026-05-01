type ButtonVariant =
  | "primary"
  | "secondary"
  | "inverted"
  | "outline"
  | "outline1";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  active?: boolean;
}

const base =
  "px-4 py-3 font-medium transition-all duration-200 ease-in-out hover:cursor-pointer";

const variants = {
  primary: `
    bg-[var(--color-primary)]
    text-white
    hover:brightness-110 active:scale-95
  `,

  secondary: `
    border border-[var(--color-primary)]
    text-[var(--color-primary)]
  `,

  inverted: `
    bg-white
    text-[var(--color-primary)]
    hover:bg-gray-100
  `,

  outline: `
    border border-[var(--color-ternary)]
    text-[var(--color-text-primary)]
  `,

  outline1: `
    border border-[var(--color-secondary)]
    text-[var(--color-secondary)]
  `,
};

const activeVariants = {
  primary: variants.primary,

  secondary: `
    bg-[var(--color-primary)]
    text-white
    border-[var(--color-primary)]
  `,

  inverted: `
    bg-[var(--color-primary)]
    text-white
  `,

  outline: `
    bg-[var(--color-primary)]
    text-white
    border-[var(--color-primary)]
  `,

  outline1: `
    bg-[var(--color-primary)]
    text-white
    border-[var(--color-primary)]
  `,
};

export default function Button({
  variant = "primary",
  active = false,
  className = "",
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      className={`${base} ${active ? activeVariants[variant] : variants[variant]} ${className}`}
      {...props}
    />
  );
}
