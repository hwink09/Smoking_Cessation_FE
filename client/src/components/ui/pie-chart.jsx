import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

export function PieChart({ data, colors }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RechartsPieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff'
                    }}
                />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => (
                        <span style={{ color: '#fff' }}>{value}</span>
                    )}
                />
            </RechartsPieChart>
        </ResponsiveContainer>
    );
}
