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
  pickBtn = document.getElementById("pick_btn");

const NONE = "none";
const DEL = "delete";
const DISABLED = "disabled";

let isDelStart = false;
let isNumSetting = false;
let isPickStart = false;

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
  if (isDelStart) {
    // 버튼 내용 설정
    isDelStart = false;
    delBtn.innerText = "없는 자리 설정";
    // seatBtns 모든 요소에 none 클래스 추가
    for (let i = 0; i < seatBtns.length; i++) {
      seatBtns[i].classList.add(NONE);
    }
  } else {
    // 버튼 내용 설정
    isDelStart = true;
    delBtn.innerText = "완료";
    // seatBtns 모든 요소에 none 클래스 제거
    for (let i = 0; i < seatBtns.length; i++) {
      seatBtns[i].classList.remove(NONE);
      seatBtns[i].addEventListener("click", deleteSeat);
    }
  }
}

function deleteSeat(event) {
  let btn = event.target;
  let seat = btn.parentNode;
  seat.classList.toggle(DEL);

  // deleteList에 id가 있으면 삭제, 없으면 추가
  let idx = deleteList.indexOf(seat.id);
  if (idx != -1) {
    deleteList.splice(idx, 1);
  } else {
    deleteList.push(seat.id);
  }
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

      // 각각의 seat 변수의 자식요소
      let span = document.createElement("span");
      let delBtn = document.createElement("button");
      delBtn.innerText = "❌";
      delBtn.className = "seat_btn";
      delBtn.classList.add(NONE);

      seat.appendChild(span);
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
}

function countRange(colValue, rowValue) {
  colLabel.innerText = `열 ${colValue}개`;
  rowLabel.innerText = `행 ${rowValue}개`;
}

function rangeChange() {
  // range input의 값이 달라지면 삭제한 seat 목록도 초기화
  deleteList.splice(0, deleteList.length);

  // col과 row의 range input 값을 가져와서 createSeat 함수로 전달
  let colValue = col.value;
  let rowValue = row.value;
  createSeat(colValue, rowValue);
  countRange(colValue, rowValue);

  // seat 삭제중일때 range input 값이 달라져도 삭제중 지속을 위한 코드
  if (isDelStart) {
    isDelStart = false;
    chooseDelSeat();
  }
}

function handleNumBtn() {
  numForm.classList.toggle(NONE);
  if (isNumSetting) {
    isNumSetting = false;
    numBtn.innerText = "번호 맞춤 설정";
    // 입력값 초기화
    numInput.value = "";
  } else {
    isNumSetting = true;
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
  if (!isPickStart) {
    let input = numInput.value.replaceAll(" ", "");
    let isNumber = checkNumInput(input);

    if (!isNumber) {
      alert("맞춤 설정 오류");
    } else {
      if (isDelStart) {
        alert("없는 자리 설정을 완료해주세요");
      } else {
        // 번호 맞춤 설정을 했을때만 numList를 받는다
        if (isNumSetting && input != "") {
          numList = CustomizationNumList(input);

          let colValue = col.value;
          let rowValue = row.value;
          let seatCnt = colValue * rowValue - deleteList.length;
          if (numList.length != seatCnt) {
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
}

function disabled() {
  // 뽑기할 경우 추가 조작 방지
  if (!isPickStart) {
    isPickStart = true;
    delBtn.setAttribute(DISABLED, "");
    numBtn.setAttribute(DISABLED, "");
    numInput.setAttribute(DISABLED, "");
    col.setAttribute(DISABLED, "");
    row.setAttribute(DISABLED, "");
  }
}

function init() {
  // 최초 실행
  rangeChange();
  // col 또는 row의 range input의 값이 변경되면 rangeChange 함수 실행
  col.onchange = rangeChange;
  row.onchange = rangeChange;

  // 버튼 이벤트 처리
  delBtn.addEventListener("click", chooseDelSeat);
  numBtn.addEventListener("click", handleNumBtn);
  pickBtn.addEventListener("click", handlePickBtn);
}

init();

// 1-5, 8,10, 13-15   , 20, 22 - 2 4
