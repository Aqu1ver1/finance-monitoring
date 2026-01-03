function CircularProgress({ percentage, color }: { percentage: number; color: string }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  if (percentage > 100) percentage = 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20">
      <svg className="transform -rotate-90 w-20 h-20">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

export default CircularProgress;