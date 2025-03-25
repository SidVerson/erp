import {Pie, PieChart, ResponsiveContainer} from 'recharts'

export function ProcurementChart({ data }: { data: any[] }) {
    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                {/*<BarChart data={data}>*/}
                {/*    <CartesianGrid strokeDasharray="3 3" />*/}
                {/*    <XAxis dataKey="product.name" />*/}
                {/*    <YAxis />*/}
                {/*    <Tooltip />*/}
                {/*    <Bar dataKey="quantity" fill="#8884d8" />*/}
                {/*</BarChart>*/}
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}