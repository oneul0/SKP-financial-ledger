<template>
    <div class="card mb-4">
        <div class="card-header">
            <h3 style="text-align: center;">{{ graphTitle }}</h3>

        </div>
        <div class="card-body">
            <canvas id="myChart" style="height: 50vh; "></canvas>
        </div>
        <h3 class="card-footer small text-muted">{{ totalText }} : {{ totalAmount }}원</h3>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

export default {
    name: 'MixedGraphComp',
    setup() {
        //선택된 차트(라디오 버튼)
        const selectedChart = ref('netIncome'); // 기본 값으로 expense 설정
        // 현재 접속한 유저 id
        // const currentUser = ref('aaa'); //테스트용 임시 할당
        const currentUser = window.localStorage.getItem('loginID'); 
        // 현재 접속한 유저 정보
        const currentUserInfo = ref({ income: [], expense: [], netIncome: [], }); //월별 값이 들어가야함
        // const isUserinfoGot = ref(false); // 현재 접속한 유저의 정보를 가져왔는지 판단하는 flag 변수
        let totalAmount = ref(0); // 그래프 하단 금액 출력  
        let totalText = ref(''); // 그래프 하단 금액 설명
        let graphTitle = ref(''); //그래프 단위 기간
        //차트 객체(라디오 버튼으로 차트 변경하기 위한 객체 별도 선언)
        let myMixedChart = null;

        // 현재 접속한 유저의 카테고리별 금액
        const curUserChartVal = ref({
            curUserIncome: [], // 현재 접속한 유저의 수입 카테고리별 금액(map에서 변환된 배열)
            curUserExpense: [], // 현재 접속한 유저의 지출 카테고리별 금액(map에서 변환된 배열)
        });
        // 차트 label 카테고리
        const labelCategory = {
            netIncomeCategory: [] //총 수익 그래프 레이블
        }


        // id에 해당되는 유저 정보 가져오기 및 arrangeInfo() 호출
        const getInfo = async () => {
            try {
                const res = await axios.get(`/api?id=${currentUser}`); //일치하는 id 필터링
                // console.log(res.data);
                if (!res.data) { return console.log("일치하는 id 검색 실패"); }
                

                //현재 날짜로부터 90일 전 날짜 구하기(총수익 카테고리)
                const netDate = new Date();
                netDate.setDate(netDate.getDate() - 90);
                const startNetDate = netDate.toISOString().split('T')[0];

                const netIncomeMap = new Map(); //최근 90일 이내 데이터로 필터링 위한 map


                //최근 90일 데이터로 필터링
                // 수입
                res.data[0].income.forEach((inc) => {
                    if (new Date(inc.date) >= new Date(startNetDate)) {
                        const monthKey = `${new Date(inc.date).getFullYear()}-${(new Date(inc.date).getMonth() + 1).toString().padStart(2, '0')}`;
                        if (!netIncomeMap.has(monthKey)) {
                            netIncomeMap.set(monthKey, { income: 0, expense: 0 });
                        }
                        const current = netIncomeMap.get(monthKey);
                        netIncomeMap.set(monthKey, { ...current, income: current.income + inc.amount }); //수입 종합
                    }
                });

                // 지출
                res.data[0].expense.forEach((exp) => {
                    if (new Date(exp.date) >= new Date(startNetDate)) {
                        const monthKey = `${new Date(exp.date).getFullYear()}-${(new Date(exp.date).getMonth() + 1).toString().padStart(2, '0')}`;
                        if (!netIncomeMap.has(monthKey)) {
                            netIncomeMap.set(monthKey, { income: 0, expense: 0 });
                        }
                        const current = netIncomeMap.get(monthKey);
                        netIncomeMap.set(monthKey, { ...current, expense: current.expense + exp.amount }); //지출 종합
                    }
                });

                // netIncomeCategory와 netIncome 배열에 값 추가
                labelCategory.netIncomeCategory = Array.from(netIncomeMap.keys());
                currentUserInfo.value.netIncome = Array.from(netIncomeMap.entries()).map(([month, data]) => ({
                    month,
                    ...data,
                    netIncome: data.income - data.expense
                }));

                // 가져온 데이터가 있는지 확인
                // isUserinfoGot.value = currentUserInfo.value.income.length > 0 && currentUserInfo.value.expense.length > 0;

                arrangeInfo();

            } catch (err) {
                console.log('오류 발생:', err);
            }
        };

        // 카테고리별 수입/지출 금액 종합 및 data()에 할당
        const arrangeInfo = async () => {
            // if (!isUserinfoGot.value) { return console.log('데이터 없음'); }
            // 카테고리별 수입 금액 총합
            const incomeMap = new Map([
                ['etc', 0],
                ['allowance', 0],
                ['salary', 0],
                ['fIncome', 0],
            ]);

            // 카테고리별 지출 금액 총합
            const expenseMap = new Map([
                ['etc', 0],
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
            // expense, income, netIncome 내역 추출
            const expenseData = currentUserInfo.value.netIncome.map(item => item.expense);
            const netIncomeData = currentUserInfo.value.netIncome.map(item => item.netIncome);
            // console.log(expenseData);

            //차트 초기화
            if (myMixedChart) { myMixedChart.destroy(); }

            const ctx = document.getElementById('myChart').getContext('2d');

            graphTitle.value = '최근 3달간 순수익';
            totalText.value = '최근 3달 순수익';
            totalAmount.value = netIncomeData.reduce((ac, curVal) => { return ac + curVal }, 0);
            myMixedChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: [{
                        label: '월간 지출',
                        data: expenseData,
                        order: 2,
                    }, {
                        label: '월간 순수익',
                        data: netIncomeData,
                        type: 'line',
                        order: 1
                    }],
                    labels: labelCategory.netIncomeCategory
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: '월별 지출 및 총수익',
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
