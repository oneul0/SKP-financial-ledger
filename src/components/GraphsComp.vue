<template>
    <div class="col-lg-6">
        <div>
            <label>
                <input type="radio" name="chartType" value="income" v-model="selectedChart" @change="updateChart"> 수입
            </label>
            <label>
                <input type="radio" name="chartType" value="expense" v-model="selectedChart" @change="updateChart"> 지출
            </label>
            <label>
                <input type="radio" name="chartType" value="netIncome" v-model="selectedChart" @change="updateChart"> 순수익
            </label>
        </div>
        <div class="card mb-4">
            <div class="card-header">
                <i class="fas fa-chart-pie me-1"></i>
                Pie Chart Example
            </div>
            <div class="card-body">
                <canvas id="myPieChart" width="100%" height="50"></canvas>
            </div>
            <div class="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
        </div>
    </div>
</template>
<!-- 
1. 순수익(수입 - 소비)을 보여주는 막대 그래프
2. 단위 기간 표시(startdate, enddate(오늘로))
-->

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
Chart.register(...registerables);

export default {
    name: 'GraphsComp',
    setup() {
        const selectedChart = ref('expense'); // 기본 값으로 expense 설정

        // 차트 label 카테고리
        const incomeCategory = ['기타 수입', '용돈', '근로소득', '금융수입']; // 수입 카테고리
        const expenseCategory = ['기타 지출', '쇼핑', '의료/건강', '교통/통신', '식비', '금융 지출']; //지출 카테고리

        // 현재 접속한 유저 id
        const currentUser = ref('aaa'); //테스트용 임시 할당
        // 현재 접속한 유저 정보
        const currentUserInfo = ref({
            income: [],
            expense: []
        });
        // 현재 접속한 유저의 정보를 가져왔는지 판단하는 flag 변수
        const isUserinfoGot = ref(false);
        // 현재 접속한 유저의 수입 카테고리별 금액(map에서 변환된 배열)
        const curUserIncome = ref([]);
        // 현재 접속한 유저의 지출 카테고리별 금액(map에서 변환된 배열)
        const curUserExpense = ref([]);

        //차트 객체(라디오 버튼으로 차트 변경하기 위한 객체 별도 선언)
        let myPieChart = null;

        // id에 해당되는 유저 정보 가져오기 및 arrangeInfo() 호출
        const getInfo = async () => {
            try {
                const res = await axios.get(`/api?id=${currentUser.value}`); //일치하는 id 필터링
                // console.log(res.data);
                if (res.data === undefined) {
                    console.log("일치하는 id 검색 실패");
                }
                isUserinfoGot.value = false;
                //30일 전 날짜 구하기
                const date = new Date();
                date.setDate(date.getDate() - 30);
                const startDate = date.toISOString().split('T')[0];

                // 최근 30일 데이터로 필터링
                // 수입 카테고리 필터링
                await res.data[0].income.forEach((inc) => {
                    if (new Date(inc.date) >= new Date(startDate)) {
                        // currentUser.value = us.id;
                        currentUserInfo.value.income.push(inc);
                        // console.log(inc);
                        isUserinfoGot.value = true;
                    }
                });
                // console.log(currentUserInfo.value);

                // 소비 카테고리 필터링
                await res.data[0].expense.forEach((exp) => {
                    if (new Date(exp.date) >= new Date(startDate)) {
                        // currentUser.value = us.id;
                        currentUserInfo.value.expense.push(exp);
                        // console.log(inc);
                        isUserinfoGot.value = true;
                    }
                });

                arrangeInfo();

            } catch (err) {
                console.log('오류 발생:', err);
            }
        };

        // 카테고리별 수입/지출 금액 종합 및 data()에 할당
        const arrangeInfo = () => {
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
                    currentUserInfo.value.expense.forEach((curExpense) => {
                        if (expenseMap.has(curExpense.category)) {
                            expenseMap.set(curExpense.category, expenseMap.get(curExpense.category) + curExpense.amount);
                        }
                    });
                } else {
                    console.log('expense 데이터가 존재하지 않습니다.');
                }

                curUserIncome.value = Array.from(incomeMap.values());
                curUserExpense.value = Array.from(expenseMap.values());

                updateChart();
            } else {
                console.log('데이터 없음');
            }
        };

        // 차트 그리기
        const updateChart = () => {
            const ctx = document.getElementById('myPieChart').getContext('2d');

            //차트 초기화(파괴)
            if (myPieChart) {
                myPieChart.destroy();
            }

            myPieChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: selectedChart.value === 'income' ? incomeCategory : expenseCategory,
                    datasets: [
                        {
                            label: '#금액',
                            data: selectedChart.value === 'income' ? curUserIncome.value : curUserExpense.value,
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
                            text: '수입 및 지출 그래프',
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
            incomeCategory,
            expenseCategory,
            currentUser,
            currentUserInfo,
            isUserinfoGot,
            curUserIncome,
            curUserExpense,
            getInfo,
            arrangeInfo,
            updateChart,
        };
    },
};
</script>
