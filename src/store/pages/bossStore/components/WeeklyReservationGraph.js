import React, { PureComponent } from 'react';
import axios from 'axios';  // axios 사용
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { API_BASE_URL } from '../../../../config/api.config';

class WeeklyReservationGraph extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      storeNo: 123 // example store number
    };
  }

  // 컴포넌트가 마운트될 때 데이터 가져오기
  componentDidMount() {
    axios.get(`${API_BASE_URL}/boss/mypage/weekly-reservation-count?storeNo=${this.state.storeNo}`)
      .then((response) => {
        console.log('API 응답 데이터:', response.data);  // 확인

        // 데이터를 차트에 맞게 형식화
        const formattedData = [
          { name: '월', 예약수: response.data.mon },
          { name: '화', 예약수: response.data.tue },
          { name: '수', 예약수: response.data.wed },
          { name: '목', 예약수: response.data.thu },
          { name: '금', 예약수: response.data.fri },
          { name: '토', 예약수: response.data.sat },
          { name: '일', 예약수: response.data.sun },
        ];

        this.setState({ data: formattedData });  // formattedData로 state 업데이트
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  render() {
    const { data } = this.state;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="예약수" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="예약수" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}

export default WeeklyReservationGraph;
