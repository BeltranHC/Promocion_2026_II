import AnimateOnScroll from '../AnimateOnScroll';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
}

export default function SectionHeader({ title, subtitle, className = '' }: SectionHeaderProps) {
    return (
        <AnimateOnScroll animation="fade-in" className={`text-center mb-16 ${className}`}>
            <h2 className="section-title">
                <span className="gradient-text">{title}</span>
            </h2>
            <div className="line-glow" />
            {subtitle && (
                <p className="section-subtitle">{subtitle}</p>
            )}
        </AnimateOnScroll>
    );
}
