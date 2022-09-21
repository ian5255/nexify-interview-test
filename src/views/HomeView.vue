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
    el-form.body-row(v-for="(data, index) in list" :key="`Key${index}`" :model="data" :rules="rules" ref="ruleForm")
      el-form-item(prop="Name")
        .body-column
          el-input(v-model="data.Name" @input="status.isChange = true")
      el-form-item(prop="DateOfBirth")
        .body-column
          el-date-picker.datepicker-style(v-model="data.DateOfBirth" :editable="false" @change="status.isChange = true")
      el-form-item(prop="Salary")
        .body-column
          el-slider.salary-style(v-model="data.Salary" :min="0" :max="100000" @change="status.isChange = true")
      el-form-item(prop="Address")
        .body-column
          el-input(v-model="data.Address" @input="status.isChange = true")
    .no-data(v-if="list.length === 0") {{"查無資料"}}
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";
import { debounce } from "lodash";

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
      rules: {
        Name: [{ required: true, message: "請輸入名稱", trigger: "change" }],
        DateOfBirth: [
          {
            required: true,
            message: "請輸入生日",
            trigger: "change",
          },
        ],
        Salary: [
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              if (value === 0) callback(new Error("數值需大於0"));
              callback();
            },
          },
        ],
        Address: [{ required: true, message: "請輸入地址", trigger: "change" }],
      },
    };
  },
  methods: {
    // 處理新增
    HandleAdd: debounce(function () {
      this.list.unshift({
        Name: "",
        DateOfBirth: "",
        Salary: 0,
        Address: "",
      });
      this.status.isChange = true;
    }, 200),

    // 處理儲存
    HandleSave: debounce(async function () {
      let validateResult = true;
      // 驗證資料
      for (let i = 0; i < this.$refs.ruleForm.length; i++) {
        await this.$refs.ruleForm[i].validate((valid) => {
          if (!valid) {
            validateResult = false;
          }
        });
      }
      if (!validateResult) return;

      // 轉換日期格式
      for (const data of this.list) {
        data.DateOfBirth = this.$utils.DayToRfc3339(data.DateOfBirth);
      }

      // Api Save list
      const postUrl =
        "http://nexifytw.mynetgear.com:45000/api/Record/SaveRecords";
      await axios
        .post(postUrl, this.list)
        .then((res) => {
          if (!res.data.Success) {
            this.$message.error(`錯誤提示: ${res.data.Msg}`);
            return;
          }
          this.$message({
            message: "資料儲存成功!",
            type: "success",
          });
          this.status.isChange = false;
          this.HandleUpdata(); // re-read
        })
        .catch((err) => {
          this.$message.error(`錯誤提示: ${err.response.data.title}`);
        });
    }, 200),

    // 取得清單資料
    HandleUpdata: debounce(async function () {
      // confirm give up edit
      if (this.status.isChange) {
        const confirmResult = await this.$confirm(
          "資料尚未儲存，確定要放棄修改嗎?",
          "提示",
          {
            confirmButtonText: "放棄修改",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
        if (!confirmResult) return;
      }

      this.status.isChange = false;
      this.list.slice(0, this.list.length - 1); // clear list

      // API Get list
      const postUrl =
        "http://nexifytw.mynetgear.com:45000/api/Record/GetRecords";
      this.$nextTick(async () => {
        await axios
          .get(postUrl)
          .then((res) => {
            if (!res.data.Success) {
              this.$message.error(`錯誤提示: ${res.data.Msg}`);
              return;
            }
            this.list = res.data.Data.map((e) => {
              e.DateOfBirth = this.$utils.Rfc3339ToDay(e.DateOfBirth);
              return e;
            });
          })
          .catch((err) => {
            this.$message.error(`錯誤提示: ${err.response.data.title}`);
          });
      });
    }, 200),
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
    grid-auto-rows: auto;
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
      margin-top: 10px;
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
  ::v-deep .el-button--primary {
    background-color: #0c6efe;
  }
  ::v-deep .el-button--success {
    background-color: #148756;
  }
  ::v-deep .el-button--danger {
    background-color: #de3446;
  }
  ::v-deep .el-slider__button {
    background-color: #0075ff;
  }
  ::v-deep .is-disabled {
    opacity: 0.6;
  }
}
</style>
