<template>
    <div class="col-lg-6">
        <div class="card mb-4">
            <div class="card-header" v-bind="graphPeriod">
                {{ graphPeriod }}
                <!-- <i class="fas fa-chart-pie me-1"></i> -->
                <!-- <label v-bind="graphPeriod">{{ graphPeriod }}</label> -->
                <!-- 수입 / 지출 / 순수익 그래프 -->

            </div>
            <div class="card-body">
                <canvas id="myChart" width="100%" height="50lm"></canvas>
            </div>
            <div class="card-footer small text-muted" v-bind:text-content="total">{{ total }}</div>
        </div>

        <!-- css 추가하기 -->
        <div>
            <label>
                <input type="radio" name="chartType" value="income" v-model="selectedChart" @change="updateChart"> 수입
            </label>
            <label>
                <input type="radio" name="chartType" value="expense" v-model="selectedChart" @change="updateChart"> 소비
            </label>
            <label>
                <input type="radio" name="chartType" value="netIncome" v-model="selectedChart" @change="updateChart">순수익
            </label>
        </div>
    </div>
</template>
<!-- 
2. 단위 기간 표시(startdate, enddate(오늘로))
3. 총 금액 표시
-->

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
Chart.register(...registerables);

export default {
    name: 'GraphsComp',
    setup() {
        //선택된 차트(라디오 버튼)
        const selectedChart = ref('expense'); // 기본 값으로 expense 설정

        //하단 금액 출력
        let total = ref(0);
        //그래프 단위 기간
        let graphPeriod = ref('');

        // 차트 label 카테고리
        const labelCategory = {
            incomeCategory: ['기타 수입', '용돈', '근로소득', '금융수입'], // 수입 카테고리
            expenseCategory: ['기타 지출', '쇼핑', '의료/건강', '교통/통신', '식비', '금융 지출'], //지출 카테고리
            netIncomeCategory: [] //총 수익 레이블(월별 이름 들어가야함, 1월, 2월 등)
        }

        // 현재 접속한 유저 id
        const currentUser = ref('aaa'); //테스트용 임시 할당
        // 현재 접속한 유저 정보
        const currentUserInfo = ref({
            income: [],
            expense: [],
            netIncome: [], //월별 값이 들어가야함
        });
        // 현재 접속한 유저의 정보를 가져왔는지 판단하는 flag 변수
        const isUserinfoGot = ref(false);
        // 현재 접속한 유저의 카테고리별 금액
        const curUserChartVal = ref({
            curUserIncome: [], // 현재 접속한 유저의 수입 카테고리별 금액(map에서 변환된 배열)
            curUserExpense: [], // 현재 접속한 유저의 지출 카테고리별 금액(map에서 변환된 배열)
        });

        //차트 객체(라디오 버튼으로 차트 변경하기 위한 객체 별도 선언)
        let myDoughnutChart = null;
        let myMixedChart = null;

        // id에 해당되는 유저 정보 가져오기 및 arrangeInfo() 호출
        const getInfo = async () => {
            try {
                const res = await axios.get(`/api?id=${currentUser.value}`); //일치하는 id 필터링
                // console.log(res.data);
                if (res.data === undefined) {
                    console.log("일치하는 id 검색 실패");
                }
                isUserinfoGot.value = false;
                //30일 전 날짜 구하기(소비/수입 카테고리)
                const date = new Date();
                date.setDate(date.getDate() - 30);
                const startDate = date.toISOString().split('T')[0];

                //90일 전 날짜 구하기(총수익 카테고리)
                const netDate = new Date();
                netDate.setDate(date.getDate() - 90);
                const startNetDate = netDate.toISOString().split('T')[0];

                // 최근 30일 데이터로 필터링
                // 수입 카테고리 필터링
                await res.data[0].income.forEach((inc) => {
                    if (new Date(inc.date) >= new Date(startDate)) {
                        // currentUser.value = us.id;
                        currentUserInfo.value.income.push(inc);
                        // console.log(inc);
                    }
                });
                // console.log(currentUserInfo.value);

                // 소비 카테고리 필터링
                await res.data[0].expense.forEach((exp) => {
                    if (new Date(exp.date) >= new Date(startDate)) {
                        // currentUser.value = us.id;
                        currentUserInfo.value.expense.push(exp);
                        // console.log(inc);

                    }
                });

                //최근 90일 데이터로 필터링
                const netIncomeMap = new Map();

                // 수입
                res.data[0].income.forEach((inc) => {
                    if (new Date(inc.date) >= new Date(startNetDate)) {
                        const monthKey = `${new Date(inc.date).getFullYear()}-${(new Date(inc.date).getMonth() + 1).toString().padStart(2, '0')}`;
                        if (!netIncomeMap.has(monthKey)) {
                            netIncomeMap.set(monthKey, { income: 0, expense: 0 });
                        }
                        const current = netIncomeMap.get(monthKey);
                        netIncomeMap.set(monthKey, { ...current, income: current.income + inc.amount });
                    }
                });

                // 소비
                res.data[0].expense.forEach((exp) => {
                    if (new Date(exp.date) >= new Date(startNetDate)) {
                        const monthKey = `${new Date(exp.date).getFullYear()}-${(new Date(exp.date).getMonth() + 1).toString().padStart(2, '0')}`;
                        if (!netIncomeMap.has(monthKey)) {
                            netIncomeMap.set(monthKey, { income: 0, expense: 0 });
                        }
                        const current = netIncomeMap.get(monthKey);
                        netIncomeMap.set(monthKey, { ...current, expense: current.expense + exp.amount });
                    }
                });

                // netIncomeCategory와 netIncome 배열에 값 추가
                labelCategory.netIncomeCategory = Array.from(netIncomeMap.keys());
                currentUserInfo.value.netIncome = Array.from(netIncomeMap.entries()).map(([month, data]) => ({
                    month,
                    ...data,
                    netIncome: data.income - data.expense
                }));

                // console.log(currentUserInfo.value.netIncome[0].income);



                // 가져온 데이터가 있는지 확인
                if (currentUserInfo.value.income.length === 0 || currentUserInfo.value.expense.length === 0) {
                    // console.log(currentUserInfo.value.income.length+'\n');
                    // console.log(currentUserInfo.value.expense.length);
                    console.log("비었습니다.");
                } else {
                    // console.log(currentUserInfo.value.income.length+'\n');
                    // console.log(currentUserInfo.value.expense.length);
                    isUserinfoGot.value = true;
                }

                arrangeInfo();

            } catch (err) {
                console.log('오류 발생:', err);
            }
        };

        // 카테고리별 수입/지출 금액 종합 및 data()에 할당
        const arrangeInfo = async () => {
            if (isUserinfoGot.value) {
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

                // income 배열이 존재하는지 확인
                if (Array.isArray(currentUserInfo.value.income)) {
                    // 수입 종합
                    currentUserInfo.value.income.forEach((curIncome) => {
                        if (incomeMap.has(curIncome.category)) {
                            incomeMap.set(curIncome.category, incomeMap.get(curIncome.category) + curIncome.amount);
                        }
                    });
                } else {
                    console.log('income 데이터가 존재하지 않습니다.');
                }

                // expense 배열이 존재하는지 확인
                if (Array.isArray(currentUserInfo.value.expense)) {
                    // 소비 종합
                    currentUserInfo.value.expense.forEach((curExpense) => {
                        if (expenseMap.has(curExpense.category)) {
                            expenseMap.set(curExpense.category, expenseMap.get(curExpense.category) + curExpense.amount);
                        }
                    });
                } else {
                    console.log('expense 데이터가 존재하지 않습니다.');
                }

                // 배열로 변환
                curUserChartVal.curUserIncome = Array.from(incomeMap.values());
                curUserChartVal.curUserExpense = Array.from(expenseMap.values());

                updateChart();
            } else {
                console.log('데이터 없음');
            }
        };

        // 차트 그리기
        const updateChart = () => {
            // income, netIncome 추출
            const expenseData = currentUserInfo.value.netIncome.map(item => item.expense);
            const incomeData = currentUserInfo.value.netIncome.map(item => item.income);
            const netIncomeData = currentUserInfo.value.netIncome.map(item => item.netIncome);
            console.log(expenseData);
            //차트 초기화(파괴)
            if (myMixedChart) {
                myMixedChart.destroy();
            }
            if (myDoughnutChart) {
                myDoughnutChart.destroy();
            }

            const ctx = document.getElementById('myChart').getContext('2d');

            if (selectedChart.value === 'netIncome') {

                total.value = netIncomeData.reduce((ac, curVal) => { return ac + curVal }, 0);
                myMixedChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        datasets: [{
                            label: '월간 소비',
                            data: expenseData,
                            order: 2,
                        }, {
                            label: '월별 총수익',
                            data: netIncomeData,
                            type: 'line',
                            order: 1
                        }],
                        labels: labelCategory.netIncomeCategory
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: '월별 소비 및 총수익',
                            },
                        },
                    },
                });
            } else {
                if (selectedChart.value === 'income') {
                    total.value = incomeData.reduce((ac, curVal) => { return ac + curVal }, 0);
                }else{
                    total.value = expenseData.reduce((ac, curVal) => { return ac + curVal }, 0);
                }
                
                console.log(total.value);
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
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: selectedChart.value === 'income' ? '월간 수입 카테고리' : '월간 소비 카테고리',
                            },
                        },
                    },
                });
            }



        };

        onMounted(() => {
            getInfo();
        });

        watch(selectedChart, () => {
            updateChart();
        });

        return {
            selectedChart,
            // incomeCategory,
            // expenseCategory,
            // currentUser,
            // currentUserInfo,
            // isUserinfoGot,
            // curUserIncome,
            // curUserExpense,
            // curUserChartVal,
            // getInfo,
            // arrangeInfo,
            // updateChart,
            total,
            graphPeriod
        };
    },
};
</script>
