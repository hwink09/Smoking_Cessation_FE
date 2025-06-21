import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export function LineChart({ data, categories, index, colors, valueFormatter, startEndOnly = false, showXAxis = true, showYAxis = true, yAxisWidth = 40 }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                {showXAxis && (
                    <XAxis
                        dataKey={index}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(128, 128, 128, 1)' }}
                        padding={{ left: 10, right: 10 }}
                        minTickGap={5}
                        tickFormatter={valueFormatter}
                        tick={{ fill: '#808080' }}
                        {...(startEndOnly ? { interval: "preserveStartEnd" } : {})}
                    />
                )}
                {showYAxis && (
                    <YAxis
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(128, 128, 128, 1)' }}
                        tickFormatter={valueFormatter}
                        width={yAxisWidth}
                        tickMargin={10}
                        tick={{ fill: '#808080' }}
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
                    <Line
                        key={category}
                        type="monotone"
                        dataKey={category}
                        stroke={colors[i]}
                        strokeWidth={2}
                        dot={{ r: 4, fill: colors[i] }}
                        activeDot={{ r: 6, fill: colors[i] }}
                    />
                ))}
            </RechartsLineChart>
        </ResponsiveContainer>
    );
} 