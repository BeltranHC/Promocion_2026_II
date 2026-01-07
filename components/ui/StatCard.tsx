interface StatCardProps {
    value: string;
    label: string;
    className?: string;
}

export default function StatCard({ value, label, className = '' }: StatCardProps) {
    return (
        <div className={className}>
            <div className="text-4xl font-bold gradient-text mb-2">{value}</div>
            <div className="text-white/60 text-sm">{label}</div>
        </div>
    );
}
