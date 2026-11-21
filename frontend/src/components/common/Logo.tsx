import logo from '../../assets/images/logo.png';

type LogoSize = 'small' | 'medium' | 'large';

const sizeMap: Record<LogoSize, number> = {
  small: 28,
  medium: 44,
  large: 72,
};

export function Logo({
  size = 'medium',
  showText = false,
  className = '',
}: {
  size?: LogoSize;
  showText?: boolean;
  className?: string;
}) {
  const dimension = sizeMap[size];

  return (
    <div className={`culturehub-logo ${className}`.trim()}>
      <img
        src={logo}
        alt="CultureHub"
        width={dimension}
        height={dimension}
      />
      {showText && <span className="culturehub-logo__text">CultureHub</span>}
    </div>
  );
}

