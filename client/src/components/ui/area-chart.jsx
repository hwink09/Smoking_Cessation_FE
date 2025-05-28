import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export function AreaChart({ data, categories, index, colors, valueFormatter, startEndOnly = false, showXAxis = true, showYAxis = true, yAxisWidth = 40 }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                    {categories.map((category, i) => (
                        <linearGradient key={category} id={`color-${category}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={colors[i]} stopOpacity={0.4} />
                            <stop offset="100%" stopColor={colors[i]} stopOpacity={0} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                {showXAxis && (
                    <XAxis
                        dataKey={index}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                        padding={{ left: 10, right: 10 }}
                        minTickGap={5}
                        tickFormatter={valueFormatter}
                        tick={{ fill: '#fff' }}
                        {...(startEndOnly ? { interval: "preserveStartEnd" } : {})}
                    />
                )}
                {showYAxis && (
                    <YAxis
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                        tickFormatter={valueFormatter}
                        width={yAxisWidth}
                        tickMargin={10}
                        tick={{ fill: '#fff' }}
                    />
                )}
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff'
                    }}
                    formatter={(value, name) => [valueFormatter(value), name]}
                    labelFormatter={(label) => valueFormatter(label)}
                />
                {categories.map((category, i) => (
                    <Area
                        key={category}
                        type="monotone"
                        dataKey={category}
                        stroke={colors[i]}
                        strokeWidth={2}
                        fill={`url(#color-${category})`}
                    />
                ))}
            </RechartsAreaChart>
        </ResponsiveContainer>
    );
} 