

import { Area, Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from "recharts";
// eslint-disable-next-line react/prop-types
const Chart = ({chartData}) => {

// const myData = {
//   date: "3/28/2025",
//   quantity: 4000,
//   price: 2400,
//   orders: 2400,
// }
    return (
        <ComposedChart width={730} height={250} data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend/>
        <CartesianGrid stroke="#f5f5f5" />
        <Area type="monotone" dataKey="orders" fill="#8884d8" stroke="#8884d8" />
        <Bar dataKey="price" barSize={20} fill="#413ea0" />
        <Line type="monotone" dataKey="quantity" stroke="#ff7300" />
      </ComposedChart>
    );
};

// Chart.prototype = {
//   chartData:PropTypes.object,
// }
export default Chart;