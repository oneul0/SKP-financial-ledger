<template>
    <div class="col-lg-6">
        <div>
            <label>
                <input type="radio" name="chartType" value="income" v-model="selectedChart" @change="updateChart"> 수입
            </label>
            <label>
                <input type="radio" name="chartType" value="expense" v-model="selectedChart" @change="updateChart"> 지출
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

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
Chart.register(...registerables);

export default {
    name: 'GraphsComp',
    setup() {
        const selectedChart = ref('expense'); // 기본 값으로 expense 설정
        const incomeCategory = ['기타 수입', '용돈', '근로소득', '금융수입'];
        const expenseCategory = ['기타 지출', '쇼핑', '의료/건강', '교통/통신', '식비', '금융 지출'];
        const currentUser = ref('aaa');
        const currentUserInfo = ref([]);
        const isUserinfoGot = ref(false);
        const curUserIncome = ref([]);
        const curUserExpense = ref([]);

        let myPieChart = null;

        const getInfo = async () => {
            try {
                const res = await axios.get('/api/');

                isUserinfoGot.value = false;
                res.data.forEach((us) => {
                    if (us.id === currentUser.value) {
                        currentUser.value = us.id;
                        currentUserInfo.value = us;
                        isUserinfoGot.value = true;
                    }
                });

                if (!isUserinfoGot.value) {
                    console.log('사용자 정보 불러오기 실패');
                } else {
                    arrangeInfo();
                }
            } catch (err) {
                console.log('오류 발생:', err);
            }
        };

        const arrangeInfo = () => {
            if (isUserinfoGot.value) {
                const incomeMap = new Map([
                    ['etc', 0],
                    ['allowance', 0],
                    ['salary', 0],
                    ['fIncome', 0],
                ]);

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

        const updateChart = () => {
            const ctx = document.getElementById('myPieChart').getContext('2d');

            if (myPieChart) {
                myPieChart.destroy();
            }

            myPieChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: selectedChart.value === 'income' ? incomeCategory : expenseCategory,
                    datasets: [
                        {
                            label: '수입/지출',
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
                            text: '수입 및 지출 원형 그래프',
                        },
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10,
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
