<template>
    <div class="card mb-4">
        <div class="card-header">
            <h3 style="text-align: center;">{{ graphTitle }}</h3>

        </div>
        <div class="card-body">
            <canvas id="myDoughnutChart" style="height: 50vh; "></canvas>
        </div>
        <h3 class="card-footer small text-muted">{{ totalText }} : {{ totalAmount }}원</h3>
        <div class="chart-type-selector">
            <label>
                <input type="radio" name="chartType" value="income" v-model="selectedChart" @change="updateChart">
                수입
            </label>
            <label>
                <input type="radio" name="chartType" value="expense" v-model="selectedChart" @change="updateChart">
                지출
            </label>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

export default {
    name: 'DoughnutGraphComp',
    setup() {
        //선택된 차트(라디오 버튼)
        const selectedChart = ref('expense'); // 기본 값으로 expense 설정
        // 현재 접속한 유저 id
        // const currentUser = ref('aaa'); //테스트용 임시 할당
        const currentUser = window.localStorage.getItem('loginID');
        // 현재 접속한 유저 정보
        const currentUserInfo = ref({ income: [], expense: [] }); //월별 값이 들어가야함
        const isUserinfoGot = ref(false); // 현재 접속한 유저의 정보를 가져왔는지 판단하는 flag 변수
        let totalAmount = ref(0); // 그래프 하단 금액 출력  
        let totalText = ref(''); // 그래프 하단 금액 설명
        let graphTitle = ref(''); //그래프 단위 기간
        //차트 객체(라디오 버튼으로 차트 변경하기 위한 객체 별도 선언)
        let myDoughnutChart = null;

        // 현재 접속한 유저의 카테고리별 금액
        const curUserChartVal = ref({
            curUserIncome: [], // 현재 접속한 유저의 수입 카테고리별 금액(map에서 변환된 배열)
            curUserExpense: [], // 현재 접속한 유저의 지출 카테고리별 금액(map에서 변환된 배열)
        });
        // 차트 label 카테고리
        const labelCategory = {
            incomeCategory: ['기타 수입', '용돈', '근로소득', '금융수입'], // 수입 카테고리
            expenseCategory: ['기타 지출', '쇼핑', '의료/건강', '교통/통신', '식비', '금융 지출'], //지출 카테고리
        }

        
        // id에 해당되는 유저 정보 가져오기 및 arrangeInfo() 호출
        const getInfo = async () => {
            try {
                const res = await axios.get(`/api?id=${currentUser}`); //일치하는 id 필터링
                // console.log(res.data);
                if (!res.data) { return console.log("일치하는 id 검색 실패"); }
                isUserinfoGot.value = false;

                //30일 전 날짜 구하기(지출/수입 카테고리)
                const date = new Date();
                date.setDate(date.getDate() - 30);
                const startDate = date.toISOString().split('T')[0];

                // 최근 30일 데이터로 필터링
                // 수입 카테고리 필터링
                await res.data[0].income.forEach((inc) => {
                    if (new Date(inc.date) >= new Date(startDate)) {
                        currentUserInfo.value.income.push(inc);
                    }
                });

                // 지출 카테고리 필터링
                await res.data[0].expense.forEach((exp) => {
                    if (new Date(exp.date) >= new Date(startDate)) {
                        currentUserInfo.value.expense.push(exp);
                    }
                });



                // 가져온 데이터가 있는지 확인
                isUserinfoGot.value = currentUserInfo.value.income.length > 0 && currentUserInfo.value.expense.length > 0;

                arrangeInfo();

            } catch (err) {
                console.log('오류 발생:', err);
            }
        };

        // 카테고리별 수입/지출 금액 종합 및 data()에 할당
        const arrangeInfo = async () => {
            if (!isUserinfoGot.value) { return console.log('데이터 없음'); }
            // 카테고리별 수입 금액 총합
            const incomeMap = new Map([
                ['ietc', 0],
                ['allowance', 0],
                ['salary', 0],
                ['fIncome', 0],
            ]);

            // 카테고리별 지출 금액 총합
            const expenseMap = new Map([
                ['eetc', 0],
                ['shopping', 0],
                ['medical', 0],
                ['charge', 0],
                ['food', 0],
                ['fOutcome', 0],
            ]);

            // 수입 종합
            currentUserInfo.value.income.forEach((curIncome) => {
                if (incomeMap.has(curIncome.category)) {
                    incomeMap.set(curIncome.category, incomeMap.get(curIncome.category) + curIncome.amount);
                }
            });


            //지출 종합
            currentUserInfo.value.expense.forEach((curExpense) => {
                if (expenseMap.has(curExpense.category)) {
                    expenseMap.set(curExpense.category, expenseMap.get(curExpense.category) + curExpense.amount);
                }
            });
            curUserChartVal.curUserIncome = Array.from(incomeMap.values());
            curUserChartVal.curUserExpense = Array.from(expenseMap.values());

            updateChart();

        };

        // 차트 그리기
        const updateChart = () => {
            // expense, income내역 추출
            const expenseData = currentUserInfo.value.expense.map(item => item.amount);
            const incomeData = currentUserInfo.value.income.map(item => item.amount);


            //차트 초기화
            if (myDoughnutChart) { myDoughnutChart.destroy(); }

            const ctx = document.getElementById('myDoughnutChart').getContext('2d');

            if (selectedChart.value === 'income') {
                graphTitle.value = '이번 달의 총 수입';
                totalText.value = '최근 1달 수입 총액';
                totalAmount.value = incomeData.reduce((ac, curVal) => ac + curVal, 0);
            }
            else {
                graphTitle.value = '이번 달의 총 지출';
                totalText.value = '최근 1달 지출 총액';
                totalAmount.value = expenseData.reduce((ac, curVal) => ac + curVal, 0);
            }

            myDoughnutChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: selectedChart.value === 'income' ? labelCategory.incomeCategory : labelCategory.expenseCategory,
                    datasets: [
                        {
                            label: '#금액',
                            data: selectedChart.value === 'income' ? curUserChartVal.curUserIncome : curUserChartVal.curUserExpense,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    // responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: selectedChart.value === 'income' ? '월간 수입 카테고리' : '월간 지출 카테고리',
                        },
                    },
                },
            });

        };

        onMounted(() => {
            getInfo();
        });

        watch(selectedChart, () => {
            updateChart();
        });

        return {
            selectedChart,
            totalAmount,
            totalText,
            graphTitle
        };
    },
};
</script>

<style scoped>
.chart-type-selector{
    display: inline-flex;
    flex-direction: row;
    justify-content: space-around
}
</style>