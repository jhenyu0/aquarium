

// 給定區塊變數，方便之後操作
var codes = {
  "1" : "#pending",
  "2" : "#doing",
  "3" : "#done"
};

// // --------------------------------------------------
// // 定義新增的 Task
var generateElement = function(task){

  var parent = $(codes[task.code]); // 新增的 Task 直接放到 Pending

  var wrapper = $("<div />", { // 新增一個 div
    "class" : "todo-task", // div 的 class = "todo-task"
    "id" : task.id, // div 的 id = "task-(唯一的id)"
  }).appendTo(parent);

  $("<div />", { // 新增"標題"的 div
    "class" : "header",
    "text": task.title
  }).appendTo(wrapper);

  $("<div />", { // 新增"日期"的 div
    "class" : "date",
    "text": task.date
  }).appendTo(wrapper);

  $("<div />", { // 新增"內容"的 div
    "class" : "description",
    "text": task.description
  }).appendTo(wrapper);
};


// // --------------------------------------------------
// // 設定 Local Storage

var i = 0; // 每當頁面 Reload 就重新執行

for (i = 0; i < localStorage.length; i++) { // 用迴圈的方式把資料一個一個抓出來

var taskID = "task-" + i;

var data = JSON.parse(localStorage.getItem(taskID)); // 把資料從 Local Storage 抓出來

generateElement(data); // 把資料用 div 包起來

$(".todo-task").draggable({ revert: true, revertDuration:200 }); // 加上拖移效果

}


// // --------------------------------------------------
// // 新增資料

$('#add').click(function () {
  if ($('#title').val() !== "") { // 當”標題“不是空白的時候

    var taskID = "task-" + i;

    // 取得輸入格的值
    var title = $("#title").val(),
        description = $("#description").val(),
        date = $("#date").val(); 
    // 設定傳入 generateElement 的資料
    var data = {
      "id" : taskID,
      "code": "1",
      "title": title,
      "date": date,
      "description": description
    };

    // 呼叫新增 Task 的函式
    generateElement(data);
    // 存入 Local Storage
    localStorage.setItem(taskID, JSON.stringify(data));

    // 產生Task後，清空輸入格
    $("#title").val("");
    $("#date").val("");
    $("#description").val("");

    i++; // 讓 ID 累加上去避免重複
  }

  else if (!title) { // 當”標題”空白的時候
    alert("標題不可以空白！");
    return;
  };

  $(".todo-task").draggable({ revert: true, revertDuration:200 }); // 加上拖移效果
});


// --------------------------------------------------
// 清空輸入的資料
var clearInput = function() {

  $("#title").val("");
  $("#date").val("");
  $("#description").val("");
}

$("#clear").click(function(){
  clearInput();
})




// // --------------------------------------------------
// // 新增刪除功能
$("#delete").droppable({
  drop: function(event, ui) {
    var element = ui.helper, // Task 本身
        taskID = element.attr("id"); // 取得 Task 的 ID

    element.remove(); // 刪除物件的 HTML

    //當 Task 只有一個
    if(taskID[5] == (localStorage.length - 1)){ // taskID = "task-n", taskID[5] = n
      localStorage.removeItem(taskID); // 刪除 Local Stotage 的資料
    }

    //如果有一個以上的 Task，必須更新 Local Storage
    else if(localStorage.length > 1){

      var start = Number(taskID[5]) + 1; // n+1

      for(j = start; j <= localStorage.length; j++){ // 取得大於 n 之後的所有數字 

        var taskID = "task-" + j;

        var data = JSON.parse(localStorage.getItem(taskID)); // 將 "task-(n+1)" 取出來
        localStorage.removeItem(taskID); // 將 "task-(n+1)" 刪除

        taskID = "task-" + (j - 1); // 將 "task-(n+1)" 改回 "task-n"
        data.id = taskID;
        localStorage.setItem(taskID, JSON.stringify(data)); // 將 "task-n" 存回去
      }
    }
  }
});


// // --------------------------------------------------
// // 讓每個區塊都可以被 Drop
$.each(codes, function(index, value) { // code 是一個物件，把每個屬性抓出來
  $(value).droppable({
    drop: function(event, ui) {  //當有東西被放置在區塊內時，就執行函式
      var element = ui.helper,
          taskID = element.attr("id");

      element.remove(); // 刪除原本的物件的 HTML

      var data = JSON.parse(localStorage.getItem(taskID)); // 把 Task 的資料抓出來
      localStorage.removeItem(taskID); // 刪除原本的資料
      data.code = index; // 改變 Task 所屬的區塊
      generateElement(data); // 重新產生 Task
      localStorage.setItem(taskID, JSON.stringify(data)); // 把新產生的 Task 再存一次

      $(".todo-task").draggable({ revert: true, revertDuration:200 }); // 加上拖移效果
    }
  });
});
