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
  seatCnt = document.getElementById("seat_cnt");

const NONE_CN = "none",
  DEL_CN = "delete",
  DISABLED_CN = "disabled",
  RETRY_CN = "retry",
  CHANGE_CN = "change";

let delStart = false,
  numSetting = false,
  pickStart = false;

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

        // "-" 뒤에 "-"가 또 있을 경우 뽑기 못함
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

// 번호 맞춤 설정을 하지 않았을때의 배열을 만든다
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
    // 버튼 내용 설정
    delStart = false;
    delBtn.innerText = "없는 자리 설정";
    // seatBtns 모든 요소에 none 클래스 추가
    for (let i = 0; i < seatBtns.length; i++) {
      seatBtns[i].classList.add(NONE_CN);
    }
  } else {
    // 버튼 내용 설정
    delStart = true;
    delBtn.innerText = "완료";
    // seatBtns 모든 요소에 none 클래스 제거
    for (let i = 0; i < seatBtns.length; i++) {
      seatBtns[i].classList.remove(NONE_CN);
      seatBtns[i].addEventListener("click", deleteSeat);
    }
    // 없는 자리 설정을 할 때 마다 반응형으로 구성
    responsive();
  }
}

function deleteSeat(event) {
  let btn = event.target;
  let seat = btn.parentNode;
  seat.classList.toggle(DEL_CN);

  // deleteList에 id가 있으면 삭제, 없으면 추가
  let idx = deleteList.indexOf(seat.id);
  if (idx != -1) {
    deleteList.splice(idx, 1);
  } else {
    deleteList.push(seat.id);
  }
  countSeat();
}

function createSeat(colValue, rowValue) {
  // row를 담아둘 배열
  let lineArray = [];

  // col과 row를 이차원으로 저장하기 위한 이중반복문
  for (let r = 1; r <= rowValue; r++) {
    // row 한줄에 해당하는 변수
    let line = document.createElement("ul");
    line.id = `row${r}`;
    line.className = "line";

    for (let c = 1; c <= colValue; c++) {
      // col 하나에 해당하는 변수
      let seat = document.createElement("li");
      seat.id = `${r},${c}`;
      seat.className = "seat";

      // deleteList에 있는 seat는 delete class 추가 => 검정색으로
      for (let i = 0; i < deleteList.length; i++) {
        if (seat.id == deleteList[i]) {
          seat.classList.add(DEL_CN);
        }
      }

      // 각각의 seat 변수의 자식요소
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
  // 기존의 container 자식요소 모두 삭제
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  // container 자식요소 추가
  for (let r = 0; r < lineArray.length; r++) {
    container.appendChild(lineArray[r]);
  }
  // paint를 새로 할 때 마다 반응형으로 구성
  responsive();
}

function countRange(colValue, rowValue) {
  colLabel.innerText = `열 ${colValue}개`;
  rowLabel.innerText = `행 ${rowValue}개`;
  countSeat();
}

function rangeChange(event, retry = false) {
  if (!retry) {
    // range input의 값이 달라지면 삭제한 seat 목록도 초기화
    deleteList.splice(0, deleteList.length);
  }

  // col과 row의 range input 값을 가져와서 createSeat 함수로 전달
  let colValue = col.value;
  let rowValue = row.value;
  createSeat(colValue, rowValue);
  countRange(colValue, rowValue);

  // seat 삭제중일때 range input 값이 달라져도 삭제중 지속을 위한 코드
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
    // 입력값 초기화
    numInput.value = "";
  } else {
    numSetting = true;
    numBtn.innerText = "맞춤 설정 해제";
  }
}

function checkNumInput(input) {
  let isNumber = true;
  // 맞춤 설정 값이 숫자 또는 "-" 또는 "," 인지 확인
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
    let input = numInput.value.replaceAll(" ", "");
    let isNumber = checkNumInput(input);

    if (delStart) {
      alert("없는 자리 설정을 완료해주세요");
    } else {
      // 번호 맞춤 설정을 했을때만 numList를 받는다
      if (numSetting && input != "") {
        numList = CustomizationNumList(input);

        let colValue = col.value;
        let rowValue = row.value;
        let seatCnt = colValue * rowValue - deleteList.length;

        // ","로 공백을 나눌때 생긴 0이 있을 경우 isNumber를 false로 만들어 경고창을 뛰운다
        // numList로 [0]이 들어왔을 경우도 여기서 걸러짐
        for (let i = 0; i < numList.length; i++) {
          if (numList[i] == 0) {
            isNumber = false;
            break;
          }
        }

        if (!isNumber) {
          alert(
            "맞춤 설정 오류 \n(숫자만 입력하였는지 또는 ',' '-' 기호를 제대로 사용했는지 확인!)"
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
  // 인덱스 랜덤 선택
  let randomIdxList = [];
  for (let i = 0; i < numList.length; i++) {
    let randomNum = Math.floor(Math.random() * Math.floor(numList.length));
    if (randomIdxList.indexOf(randomNum) == -1) {
      randomIdxList.push(randomNum);
    } else {
      i -= 1;
    }
  }
  // randomIdxList에 따라 numList의 셔플 버전의 리스트인 randomNumList 생성
  let randomNumList = [];
  for (let i = 0; i < randomIdxList.length; i++) {
    randomNumList.push(numList[randomIdxList[i]]);
  }
  createRandomSeat(randomNumList);
}

// createSeat 함수 재활용
function createRandomSeat(numList) {
  // row를 담아둘 배열
  let lineArray = [];

  let colValue = col.value;
  let rowValue = row.value;

  // col과 row를 이차원으로 저장하기 위한 이중반복문
  for (let r = 1; r <= rowValue; r++) {
    // row 한줄에 해당하는 변수
    let line = document.createElement("ul");
    line.id = `row${r}`;
    line.className = "line";

    for (let c = 1; c <= colValue; c++) {
      // col 하나에 해당하는 변수
      let seat = document.createElement("li");
      seat.id = `${r},${c}`;
      seat.className = "seat";

      // 각각의 seat 변수의 자식요소
      let span = document.createElement("span");
      span.className = "random_num";

      // 삭제된 seat가 아니면 true 랜덤 숫자 작성
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

  // 뽑기 효과
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
        // 다시하기 버튼 이벤트 연결
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
  // 뽑기할 경우 추가 조작 방지
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

function responsive() {
  let colValue = col.value;
  if (delStart) {
    let items = document.getElementsByClassName("seat_btn");
    for (let i = 0; i < items.length; i++) {
      // 반응형을 위한 class 추가
      items[i].classList.add(`btn_col${colValue}`);
    }
  } else if (pickStart) {
    let items = document.getElementsByClassName("random_num");
    for (let i = 0; i < items.length; i++) {
      // 반응형을 위한 class 추가
      items[i].classList.add(`num_col${colValue}`);
    }
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

function init() {
  // 최초 실행
  rangeChange();
  // col 또는 row의 range input의 값이 변경되면 rangeChange 함수 실행
  col.addEventListener("input", rangeChange);
  row.addEventListener("input", rangeChange);

  // 버튼 이벤트 처리
  delBtn.addEventListener("click", chooseDelSeat);
  numBtn.addEventListener("click", handleNumBtn);
  pickBtn.addEventListener("click", handlePickBtn);
}

init();
