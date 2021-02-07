const col = document.getElementById("col"),
  row = document.getElementById("row"),
  container = document.getElementById("container"),
  colLabel = document.getElementById("col_label"),
  rowLabel = document.getElementById("row_label"),
  delBtn = document.getElementById("del_btn"),
  seatBtns = document.getElementsByClassName("seat_btn"),
  numBtn = document.getElementById("num_btn"),
  numForm = document.querySelector(".num_form"),
  numInput = document.getElementById("num_input"),
  pickBtn = document.getElementById("pick_btn"),
  seatCnt = document.getElementById("seat_cnt"),
  manualBtn = document.getElementById("manual_btn"),
  manual = document.getElementById("manual"),
  chatBtn = document.getElementById("chat_btn"),
  chat = document.getElementById("chat");

const NONE_CN = "none",
  DEL_CN = "delete",
  DISABLED_CN = "disabled",
  RETRY_CN = "retry",
  CHANGE_CN = "change";

let delStart = false,
  numSetting = false,
  pickStart = false,
  firstLoading = true;

const deleteList = [];

function CustomizationNumList(data) {
  let numList = [];
  data += ",";
  while (true) {
    let commaIdx = data.indexOf(",");
    if (commaIdx != -1) {
      let sliceData = data.slice(0, commaIdx);
      let slashIdx = sliceData.indexOf("-");
      if (slashIdx != -1) {
        firstNum = sliceData.slice(0, slashIdx);
        lastNum = sliceData.slice(slashIdx + 1, sliceData.length);
        if (lastNum.indexOf("-") != -1 || !lastNum) {
          return [0];
        }
        for (let i = 0; i < lastNum - firstNum + 1; i++) {
          num = Number(firstNum) + i;
          numList.push(num);
        }
      } else {
        numList.push(Number(sliceData));
      }
      data = data.slice(commaIdx + 1, data.length);
    } else {
      return numList;
    }
  }
}

function notCustomizationNumList() {
  let colValue = col.value;
  let rowValue = row.value;
  let numCnt = colValue * rowValue - deleteList.length;
  let numList = [];
  for (let i = 1; i <= numCnt; i++) {
    numList.push(i);
  }
  return numList;
}

function chooseDelSeat() {
  if (delStart) {
    delStart = false;
    delBtn.innerText = "없는 자리 설정";
    for (let i = 0; i < seatBtns.length; i++) {
      seatBtns[i].classList.add(NONE_CN);
    }
  } else {
    delStart = true;
    delBtn.innerText = "완료";
    for (let i = 0; i < seatBtns.length; i++) {
      seatBtns[i].classList.remove(NONE_CN);
      seatBtns[i].addEventListener("click", deleteSeat);
    }
  }
}

function deleteSeat(event) {
  let btn = event.target;
  let seat = btn.parentNode;
  seat.classList.toggle(DEL_CN);
  let idx = deleteList.indexOf(seat.id);
  if (idx != -1) {
    deleteList.splice(idx, 1);
  } else {
    deleteList.push(seat.id);
  }
  countSeat();
}

function createSeat(colValue, rowValue) {
  let lineArray = [];
  for (let r = 1; r <= rowValue; r++) {
    let line = document.createElement("ul");
    line.id = `row${r}`;
    line.className = "line";
    for (let c = 1; c <= colValue; c++) {
      let seat = document.createElement("li");
      seat.id = `${r},${c}`;
      seat.className = "seat";
      for (let i = 0; i < deleteList.length; i++) {
        if (seat.id == deleteList[i]) {
          seat.classList.add(DEL_CN);
        }
      }
      let delBtn = document.createElement("button");
      delBtn.innerText = "❌";
      delBtn.className = "seat_btn";
      delBtn.classList.add(NONE_CN);
      delBtn.classList.add("btn");
      seat.appendChild(delBtn);
      line.appendChild(seat);
    }
    lineArray.push(line);
  }
  paintSeat(lineArray);
}

function paintSeat(lineArray) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  for (let r = 0; r < lineArray.length; r++) {
    container.appendChild(lineArray[r]);
  }
}

function countRange(colValue, rowValue) {
  colLabel.innerText = `열 ${colValue}개`;
  rowLabel.innerText = `행 ${rowValue}개`;
  countSeat();
}

function rangeChange(event, retry = false) {
  if (!retry) {
    deleteList.splice(0, deleteList.length);
  }
  let colValue = col.value;
  let rowValue = row.value;
  createSeat(colValue, rowValue);
  countRange(colValue, rowValue);
  if (delStart) {
    delStart = false;
    chooseDelSeat();
  }
}

function handleNumBtn() {
  numForm.classList.toggle(NONE_CN);
  if (numSetting) {
    numSetting = false;
    numBtn.innerText = "번호 맞춤 설정";
    numInput.value = "";
  } else {
    numSetting = true;
    numBtn.innerText = "맞춤 설정 해제";
  }
}

function checkNumInput(input) {
  let isNumber = true;
  for (let i = 0; i <= input.length - 1; i++) {
    num = input[i];
    if (isNaN(num) && num != "-" && num != ",") {
      isNumber = false;
    }
  }
  return isNumber;
}

function handlePickBtn() {
  if (!pickStart) {
    // let input = numInput.value.replaceAll(" ", "");
    let input = numInput.value;
    while (true) {
      newInput = input.replace(" ", "");
      if (newInput === input) {
        break;
      } else {
        input = newInput;
      }
    }
    let isNumber = checkNumInput(input);

    if (delStart) {
      alert("없는 자리 설정을 완료해주세요");
    } else {
      if (numSetting && input != "") {
        numList = CustomizationNumList(input);
        let colValue = col.value;
        let rowValue = row.value;
        let seatCnt = colValue * rowValue - deleteList.length;
        for (let i = 0; i < numList.length; i++) {
          if (numList[i] == 0) {
            isNumber = false;
            break;
          }
        }
        if (!isNumber) {
          alert(
            "맞춤 설정 오류 \n( 0을 제외한 숫자만 입력하였는지 또는 ',' '-' 기호를 제대로 사용했는지 확인! )"
          );
        } else if (numList.length != seatCnt) {
          alert(
            `맞춤 설정(${numList.length}개)과 자리 개수(${seatCnt}개)를 맞춰주세요`
          );
        } else {
          disabled();
          pickRandomNum(numList);
        }
      } else {
        numList = notCustomizationNumList();
        disabled();
        pickRandomNum(numList);
      }
    }
  }
}

function pickRandomNum(numList) {
  let randomIdxList = [];
  for (let i = 0; i < numList.length; i++) {
    let randomNum = Math.floor(Math.random() * Math.floor(numList.length));
    if (randomIdxList.indexOf(randomNum) == -1) {
      randomIdxList.push(randomNum);
    } else {
      i -= 1;
    }
  }
  let randomNumList = [];
  for (let i = 0; i < randomIdxList.length; i++) {
    randomNumList.push(numList[randomIdxList[i]]);
  }
  createRandomSeat(randomNumList);
}

function createRandomSeat(numList) {
  let lineArray = [];
  let colValue = col.value;
  let rowValue = row.value;
  for (let r = 1; r <= rowValue; r++) {
    let line = document.createElement("ul");
    line.id = `row${r}`;
    line.className = "line";
    for (let c = 1; c <= colValue; c++) {
      let seat = document.createElement("li");
      seat.id = `${r},${c}`;
      seat.className = "seat";
      let span = document.createElement("span");
      span.className = "random_num";
      if (deleteList.indexOf(seat.id) == -1) {
        span.innerText = numList[0];
        numList = numList.slice(1, numList.length);
      } else {
        seat.classList.add(DEL_CN);
      }
      seat.appendChild(span);
      line.appendChild(seat);
    }
    lineArray.push(line);
  }
  pickBtn.classList.add(RETRY_CN);
  pickBtn.innerText = "3";
  setTimeout(() => {
    pickBtn.innerText = "2";
    setTimeout(() => {
      pickBtn.innerText = "1";
    }, 1000);
    setTimeout(() => {
      setTimeout(() => {
        paintSeat(lineArray);
        pickBtn.innerText = "다시!";
        pickBtn.addEventListener("click", handleRetry);
      }, 1000);
    }, 1000);
  }, 1000);
}

function handleRetry() {
  disabled();
  pickBtn.classList.remove(RETRY_CN);
  pickBtn.innerText = "뽑기!";
  pickBtn.removeEventListener("click", handleRetry);
  rangeChange("", true);
}

function disabled() {
  if (!pickStart) {
    pickStart = true;
    delBtn.setAttribute(DISABLED_CN, "");
    numBtn.setAttribute(DISABLED_CN, "");
    numInput.setAttribute(DISABLED_CN, "");
    col.setAttribute(DISABLED_CN, "");
    row.setAttribute(DISABLED_CN, "");
  } else {
    pickStart = false;
    delBtn.removeAttribute(DISABLED_CN);
    numBtn.removeAttribute(DISABLED_CN);
    numInput.removeAttribute(DISABLED_CN);
    col.removeAttribute(DISABLED_CN);
    row.removeAttribute(DISABLED_CN);
  }
}

function countSeat() {
  let colValue = col.value;
  let rowValue = row.value;
  let cnt = colValue * rowValue - deleteList.length;
  seatCnt.innerText = cnt;
  seatCnt.classList.remove(CHANGE_CN);
  setTimeout(() => {
    seatCnt.classList.add(CHANGE_CN);
  }, 100);
}

function scrollToManual() {
  let location = manual.offsetTop;
  scrollTo({ top: location, behavior: "smooth" });
}

function scrollToChat() {
  let location = chat.offsetTop;
  scrollTo({ top: location, behavior: "smooth" });
}

function init() {
  rangeChange();
  col.addEventListener("input", rangeChange);
  row.addEventListener("input", rangeChange);
  numBtn.addEventListener("click", handleNumBtn);
  delBtn.addEventListener("click", chooseDelSeat);
  pickBtn.addEventListener("click", handlePickBtn);
  manualBtn.addEventListener("click", scrollToManual);
  chatBtn.addEventListener("click", scrollToChat);
}

init();
