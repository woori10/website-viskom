type ButtonVariant =
  | "primary"
  | "secondary"
  | "inverted"
  | "outline"
  | "outline1";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const base =
  "px-4 py-3 rounded-lg font-medium transition-all duration-200 ease-in-out hover:cursor-pointer";

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

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
