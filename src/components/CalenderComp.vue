<template>
  <div class="demo-app">
    <FullCalendar class="demo-app-calendar" :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <b>
          {{ arg.timeText }}
        </b>
        <i :class="arg.event.classNames">{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
    <DateModal
      :visible="isDateModalVisible"
      :date="selectedDate"
      @data-saved="fetchData"
      @close="isDateModalVisible = false"
    />
    <EventModal
      :visible="isEventModalVisible"
      :event="selectedEvent"
      @event-saved="fetchData"
      @close="isEventModalVisible = false"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import { INITIAL_EVENTS, createEventId } from "./event-utils";
import DateModal from "./components/DateModal.vue";
import EventModal from "./components/EventModal.vue";

const translate = {
  etc: "기타",
  allowance: "용돈",
  salary: "근로소득",
  fIncome: "금융소득",
  shopping: "쇼핑",
  medical: "의료/건강",
  charge: "교통/통신",
  food: "식비",
  fOutcome: "금융",
};

const UserID = "aaa"; // 테스트용 아이디

export default defineComponent({
  components: {
    FullCalendar,
    DateModal,
    EventModal,
  },
  data() {
    return {
      isDateModalVisible: false,
      isEventModalVisible: false,
      selectedDate: "",
      selectedEvent: {},
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        headerToolbar: {
          left: "prev",
          center: "title",
          right: "next",
        },
        events: [], // 거래 내역
        initialView: "dayGridMonth",
        dateClick: (info) => this.handleDateSelect(info),
        eventClick: (info) => this.handleEventClick(info),
      },
      currentEvents: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(`api/${UserID}`);
        const data = response.data;
        const incomeEvents = [];
        const expenseEvents = [];
        data.income.forEach((income) => {
          incomeEvents.push({
            // id: createEventId(),
            title: `+${income.amount}`,
            date: income.date,
            amount: income.amount,
            category: income.category,
            memo: income.memo,
            className: "income-custom",
          });
        });
        data.expense.forEach((expense) => {
          expenseEvents.push({
            // id: createEventId(),
            title: `-${expense.amount}`,
            date: expense.date,
            amount: expense.amount,
            category: expense.category,
            memo: expense.memo,
            className: "expense-custom",
          });
        });
        const allEvents = incomeEvents.concat(expenseEvents);
        this.calendarOptions.events = allEvents;
        this.currentEvents = allEvents;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    handleDateSelect(info) {
      console.log("Date clicked:", info.dateStr);
      this.selectedDate = info.dateStr;
      this.isDateModalVisible = true;
    },
    handleEventClick(info) {
      console.log("Event clicked:", info.event);
      this.selectedEvent = info.event;
      this.isEventModalVisible = true;
    },
    handleEvents(events) {
      this.currentEvents = events;
    },
  },
});
</script>

<style>
.demo-app {
  min-height: 80%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  width: 100%;
  flex-grow: 1;
  padding: 3em;
  justify-content: center;
}

.fc .fc-toolbar.fc-header-toolbar {
  margin: 0;
  padding: 0 40px;
  background-color: #356eff;
  height: 63px;
  font-weight: 600;
  font-size: 12px;
  line-height: 29px;
  color: white;
  border-radius: 20px 20px 0px 0px;
}

.fc .fc-button-primary {
  background-color: transparent;
  border: none;
  span {
    font-weight: 500;
    font-size: 28px;
  }
  :hover {
    background-color: transparent;
  }
}
.fc-theme-standard th {
  height: 32px;
  padding-top: 3.5px;
  background: #e5edff;
  border: 1px solid #dddee0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #7b7b7b;
}

.fc .fc-daygrid-day-frame {
  padding: 10px;
}
.fc-daygrid-day:hover {
  background-color: #e0e0e0; /* 호버 시 배경색 변경 */
  cursor: pointer; /* 마우스 포인터 변경 */
}
.fc-daygrid-day.fc-day-today:hover {
  background-color: #f1e7a1; /* 호버 시 배경색 변경 */
  cursor: pointer; /* 마우스 포인터 변경 */
}

.fc .fc-daygrid-day-top {
  flex-direction: row;
  margin-bottom: 3px;
}
.fc-event {
  cursor: pointer;
  padding: 3px 5px;
  margin-bottom: 3px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fc-event.income-custom:hover,
.fc-event.income-custom:hover i {
  background-color: #b0e0b0;
  border-color: #b0e0b0;
  color: #b0e0b0;
}

.fc-event.expense-custom:hover,
.fc-event.expense-custom:hover i {
  background-color: #e0b0b0;
  border-color: #e0b0b0;
  color: #e0b0b0;
}

.income-custom {
  font-style: normal;
  text-align: center;
  color: green !important;
  background-color: #cef6ce;
  border-color: #cef6ce;
  font-weight: bolder;
}

.expense-custom {
  font-style: normal;
  text-align: center;
  color: red !important;
  background-color: #f6ced8;
  border-color: #f6ced8;
  font-weight: bolder;
}
</style>
