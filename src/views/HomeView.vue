<template lang="pug">
#HomeView
  .btn-area
    .left
      el-button.btn-style(type="primary" @click="HandleAdd") {{"Add"}}
    .middle
      el-button.btn-style(type="success" :disabled="!status.isChange" @click="HandleSave") {{"Save"}}
    .right
      el-button.btn-style(type="danger" @click="HandleUpdata") {{"Update"}}
  
  .table-area
    .t-header
      .header-column {{"Name"}}
      .header-column {{"Birthday"}}
      .header-column {{"Salary"}}
      .header-column {{"Address"}}
    .body-row(v-for="(data, index) in list" :key="`${data.Name}${index}`")
      .body-column
        el-input(v-model="data.Name" @input="status.isChange = true")
      .body-column
        el-date-picker.datepicker-style(v-model="data.DateOfBirth" @change="status.isChange = true")
      .body-column
        el-slider.salary-style(v-model="data.Salary" :min="0" :max="100000" @change="status.isChange = true")
      .body-column
        el-input(v-model="data.Address" @input="status.isChange = true")
    .no-data(v-if="list.length === 0") {{"查無資料"}}
    //- pre {{list}}
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
  data() {
    return {
      status: {
        isChange: false,
      },
      list: [
        {
          Name: "",
          DateOfBirth: "",
          Salary: 0,
          Address: "",
        },
      ],
    };
  },
  // computed: {
  //   canU
  // },
  methods: {
    HandleAdd() {
      this.list.unshift({
        Name: "",
        DateOfBirth: "",
        Salary: 0,
        Address: "",
      });
      this.status.isChange = true;
    },
    async HandleSave() {
      const postUrl =
        "http://nexifytw.mynetgear.com:45000/api/Record/SaveRecords";
      const result = await axios.post(postUrl, this.list);
      if (!result.data.Success) {
        // error notice
        return;
      }
      // success notice
      console.log("result", result);
    },
    HandleUpdata() {
      this.status.isChange = false;
      this.list.slice(0, this.list.length - 1);
      const postUrl =
        "http://nexifytw.mynetgear.com:45000/api/Record/GetRecords";
      this.$nextTick(async () => {
        const result = await axios.get(postUrl);
        if (!result.data.Success) {
          // error notice
          return;
        }
        console.log(result);
        this.list = result.data.Data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// 排版
#HomeView {
  padding: 20px;
  display: grid;
  grid-template-rows: 50px 1fr;
  row-gap: 15px;
  .btn-area {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    .left {
      text-align: left;
    }
    .middle {
      text-align: center;
    }
    .right {
      text-align: right;
    }
  }
  .table-area {
    display: grid;
    grid-auto-rows: 60px;
    .t-header,
    .body-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      column-gap: 30px;
      box-shadow: 0 1px 0 #ccc;
      padding: 0 10px;
    }
    .header-column,
    .body-column {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .header-column {
      font-size: 20px;
    }
  }
}

// 樣式
#HomeView {
  .btn-style {
    width: 80px;
  }
  .no-data {
    text-align: center;
    padding: 10px 0;
    font-size: 18px;
  }
  .salary-style,
  .datepicker-style {
    width: 100%;
  }
}
</style>
