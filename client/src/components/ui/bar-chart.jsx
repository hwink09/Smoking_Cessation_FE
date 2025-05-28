import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function BarChart({ data, categories, index, colors, valueFormatter, startEndOnly = false, showXAxis = true, showYAxis = true, yAxisWidth = 40 }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RechartsBarChart data={data}>
                {showXAxis && (
                    <XAxis
                        dataKey={index}
                        tickLine={false}
                        axisLine={false}
                        padding={{ left: 10, right: 10 }}
                        minTickGap={5}
                        tickFormatter={valueFormatter}
                        {...(startEndOnly ? { interval: "preserveStartEnd" } : {})}
                    />
                )}
                {showYAxis && (
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={valueFormatter}
                        width={yAxisWidth}
                        tickMargin={10}
                    />
                )}
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                {index}
                                            </span>
                                            <span className="font-bold text-muted-foreground">
                                                {valueFormatter(label)}
                                            </span>
                                        </div>
                                        {categories.map((category, i) => {
                                            const value = payload.find((p) => p.dataKey === category)?.value;
                                            return (
                                                <div key={category} className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        {category}
                                                    </span>
                                                    <span className="font-bold" style={{ color: colors[i] }}>
                                                        {valueFormatter(value)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                {categories.map((category, i) => (
                    <Bar
                        key={category}
                        dataKey={category}
                        fill={colors[i]}
                        radius={[4, 4, 0, 0]}
                    />
                ))}
            </RechartsBarChart>
        </ResponsiveContainer>
    );
} 