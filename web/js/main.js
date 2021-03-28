const col = document.querySelector("#col"),
  row = document.querySelector("#row"),
  container = document.querySelector("#container"),
  colLabel = document.querySelector("#col_label"),
  rowLabel = document.querySelector("#row_label"),
  delBtn = document.querySelector("#del_btn"),
  numBtn = document.querySelector("#num_btn"),
  numForm = document.querySelector(".num_form"),
  numInput = document.querySelector("#num_input"),
  pickBtn = document.querySelector("#pick_btn"),
  seatCnt = document.querySelector("#seat_cnt"),
  manual = document.querySelector("#manual"),
  copyright = document.querySelector(".copyright"),
  closeBtns = document.querySelectorAll(".close_btn"),
  manualBtn = document.querySelector("#manual_btn"),
  manualHint = document.querySelector(".manual_hint"),
  allSeatsViewBtn = document.querySelector("#all_seats_view_btn"),
  allSeatsView = document.querySelector(".all_seats_view"),
  leftScrollBtn = document.querySelector(".left_scroll_btn"),
  rightScrollBtn = document.querySelector(".right_scroll_btn");

const NONE_CN = "none",
  DEL_CN = "delete",
  DISABLED_CN = "disabled",
  RETRY_CN = "retry",
  CHANGE_CN = "change",
  BTN_HOVER_CN = "btn-hover",
  SHOW_SIDEPOPUP_CN = "show_side_popup",
  SIDEPOPUP_TOP_CN = "side_popup_top",
  SIDEPOPUP_BOTTOM_CN = "side_popup_bottom";

let isDelStart = false, // 없는 자리 설정이 시작되었는지
  isNumSettingOn = false, // 번호 맞춤 설정 중인지
  isPickStart = false, // 자리 뽑기를 시작했는지
  isManualHintClosed = false, // 설명서 보기 버튼이 닫혔는지
  isAllSeatsViewClosed = true; // 한눈에 보기 버튼이 닫혔는지

// 삭제된 자리 배열
const deleteList = [];

// 개발자 모드 클릭 횟수
let yyjCnt = 0;
// 개발자 모드, 자리 좌표를 담는 변수
let yyjRow;
let yyjCol;
// 개발자 모드, 번호를 담을 변수
let yyjNum;

// 번호 맞춤 설정
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
          return [-1];
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

// 번호 맞춤 설정을 하지 않은 경우의 배열을 만드는 함수
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
  const seatBtns = document.querySelectorAll(".seat_btn");
  if (isDelStart) {
    isDelStart = false;
    delBtn.innerText = "없는 자리 설정";
    for (let i = 0; i < seatBtns.length; i++) {
      seatBtns[i].classList.add(NONE_CN);
    }
  } else {
    isDelStart = true;
    delBtn.innerText = "자리 설정 완료";
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

      // 개발자 모드, 자리를 선택하는 버튼
      let yyjBtn = document.createElement("button");
      yyjBtn.innerText = "⚡";
      yyjBtn.className = "yyj_btn";
      yyjBtn.classList.add(NONE_CN);
      yyjBtn.classList.add("btn");

      seat.appendChild(delBtn);
      seat.appendChild(yyjBtn);
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

  // col index 생성
  let line = document.createElement("ul");
  line.className = "line";
  for (let i = 0; i <= lineArray[0].childElementCount; i++) {
    let idx = document.createElement("li");
    idx.className = "col_idx";
    if (i !== 0) {
      idx.innerText = i;
    } else {
      idx.classList.add("row_idx");
      // 개발자 모드를 위한 id
      idx.id = "yyj";
    }
    idx.classList.add("seat");
    idx.classList.add("idx");
    line.appendChild(idx);
    container.appendChild(line);

    // 개발자 이니셜 : yyj , 개발자 모드를 위한 dom
    const yyj = document.querySelector("#yyj");
    yyj.addEventListener("click", handleDeveloperMode);
  }

  for (let r = 0; r < lineArray.length; r++) {
    // row index 생성
    let idx = document.createElement("li");
    idx.className = "row_idx";
    idx.classList.add("seat");
    idx.classList.add("idx");
    idx.innerText = r + 1;
    lineArray[r].insertBefore(idx, lineArray[r].firstChild);

    // container 자식요소 추가
    container.appendChild(lineArray[r]);
  }
}

// 열과 행을 세는 함수
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
  if (isDelStart) {
    isDelStart = false;
    chooseDelSeat();
  }
}

function handleNumBtn() {
  numForm.classList.toggle(NONE_CN);
  if (isNumSettingOn) {
    isNumSettingOn = false;
    numBtn.innerText = "번호 맞춤 설정";
    numInput.value = "";
  } else {
    isNumSettingOn = true;
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
    // let input = numInput.value.replaceAll(" ", "");
    // replaceAll 이 적용되지 않는 브라우저를 위한 코드
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

    // 없는 자리 설정 중이면 취소
    if (isDelStart) {
      delBtn.click();
    }

    // 번호 맞춤 설정을 했을 경우
    if (isNumSettingOn && input != "") {
      numList = CustomizationNumList(input);
      let colValue = col.value;
      let rowValue = row.value;
      let seatCnt = colValue * rowValue - deleteList.length;

      // ","로 공백을 나눌때 생긴 0이 있을 경우 isNumber를 false로 만들어 경고창을 뛰운다
      // numList로 [-1]이 들어왔을 경우도 여기서 걸러짐
      for (let i = 0; i < numList.length; i++) {
        if (numList[i] == -1) {
          isNumber = false;
          break;
        }
      }

      if (!isNumber) {
        alert(
          "맞춤 설정 오류 \n숫자만 입력하였는지 ',' '-' 기호를 제대로 사용했는지 확인!"
        );
      } else if (numList.length != seatCnt) {
        alert(
          `자리 개수 오류 \n사용자 맞춤 설정(${numList.length}개), 자리 개수(${seatCnt}개)를 맞춰주세요`
        );
      } else {
        disabled();
        pickRandomNum(numList);
      }
    } else {
      // 번호 맞춤 설정을 하지 않았을 경우
      numList = notCustomizationNumList();
      disabled();
      pickRandomNum(numList);
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

  // randomIdxList에 따라 numList의 셔플 버전의 리스트인 randomNumList 생성
  let randomNumList = [];
  for (let i = 0; i < randomIdxList.length; i++) {
    randomNumList.push(numList[randomIdxList[i]]);
  }
  createRandomSeat(randomNumList);
}

// createSeat 함수 재활용
function createRandomSeat(numList) {
  // 개발자 모드, yyjNum이 numList에 있는지 확인하기 위한 변수
  let isYyjNumInList = false;
  for (let n = 0; n < numList.length; n++) {
    if (numList[n] == yyjNum) {
      // yyjNum을 numList의 마지막 요소로 추가
      numList1 = numList.splice(0, n);
      numList2 = numList.splice(1, numList.length);
      numList = numList1.concat(numList2);
      numList.push(yyjNum);
      isYyjNumInList = true;
      break;
    }
  }

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
        // 개발자 모드, row와 col이 지정된 자리와 같다면 지정된 번호(yyjNum)를 입력
        if (r == yyjRow && c == yyjCol && isYyjNumInList) {
          span.innerText = yyjNum;
        } else {
          span.innerText = numList[0];
          numList = numList.slice(1, numList.length);
        }
      } else {
        seat.classList.add(DEL_CN);
      }
      seat.appendChild(span);
      line.appendChild(seat);
    }
    lineArray.push(line);
  }

  // hover 시 효과 해제
  pickBtn.classList.remove(BTN_HOVER_CN);
  pickBtn.removeEventListener("mouseenter", handleEnter);
  pickBtn.removeEventListener("mouseleave", handleLeave);

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

        // container가 scroll bar를 가지고 있고 모바일일 경우만
        if (hasScrollBar(container) && isMoblie(true) && col.value >= 6) {
          // 한눈에 보기 side popup 등장
          if (isManualHintClosed) {
            allSeatsView.classList.add(SIDEPOPUP_BOTTOM_CN);
          } else {
            allSeatsView.classList.add(SIDEPOPUP_TOP_CN);
          }
          isAllSeatsViewClosed = false;
          allSeatsView.classList.add(SHOW_SIDEPOPUP_CN);
        }
      }, 1000);
    }, 1000);
  }, 1000);
}

function handleRetry() {
  disabled();
  pickBtn.classList.remove(RETRY_CN);
  pickBtn.innerText = "뽑기!";
  rangeChange("", true);
  pickBtn.removeEventListener("click", handleRetry);

  // hover 시 효과 적용
  pickBtn.addEventListener("mouseenter", handleEnter);
  pickBtn.addEventListener("mouseleave", handleLeave);

  // console.log(closeBtns)
  closeBtns[0].click();
}

function disabled() {
  if (!isPickStart) {
    isPickStart = true;
    delBtn.setAttribute(DISABLED_CN, "");
    numBtn.setAttribute(DISABLED_CN, "");
    numInput.setAttribute(DISABLED_CN, "");
    col.setAttribute(DISABLED_CN, "");
    row.setAttribute(DISABLED_CN, "");
  } else {
    isPickStart = false;
    delBtn.removeAttribute(DISABLED_CN);
    numBtn.removeAttribute(DISABLED_CN);
    numInput.removeAttribute(DISABLED_CN);
    col.removeAttribute(DISABLED_CN);
    row.removeAttribute(DISABLED_CN);
  }
}

// 자리 개수 세는 함수
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

// manual button을 눌렀을 때
function handleManual() {
  manual.classList.toggle(NONE_CN);
  let location = manual.offsetTop;
  scrollTo({ top: location, behavior: "smooth" });
  // console.log(closeBtns)
  closeBtns[1].click();
}

// 모바일인지 또는 휴대폰인지 확인하는 함수
function isMoblie(isPhone = false) {
  const tempUser = navigator.userAgent;

  // isPhone이 true이면 휴대폰, false이면 휴대폰을 포함한 모바일 기기
  if (isPhone) {
    if (
      (tempUser.indexOf("iPhone") > 0 ||
        tempUser.indexOf("iPot") > 0 ||
        tempUser.indexOf("Android") > 0) &&
      window.innerWidth <= 500 &&
      window.innerHeight <= 900
    ) {
      return true;
    }
    return false;
  } else {
    if (
      tempUser.indexOf("iPhone") > 0 ||
      tempUser.indexOf("iPad") > 0 ||
      tempUser.indexOf("iPot") > 0 ||
      tempUser.indexOf("Android") > 0
    ) {
      return true;
    }
    return false;
  }
}

// button hover 함수
function handleEnter(event) {
  const btn = event.target;
  btn.classList.add(BTN_HOVER_CN);
}
function handleLeave(event) {
  const btn = event.target;
  btn.classList.remove(BTN_HOVER_CN);
}

// side popup 닫기 눌렀을때 실행
function handleClose(event) {
  const sidePopup = event.target.parentNode;
  // console.log(sidePopup.classList)
  if (sidePopup.classList[1] == "manual_hint") {
    isManualHintClosed = true;
    allSeatsView.classList.remove(SIDEPOPUP_TOP_CN);
    // 한눈에 보기 side popup 이 열려있으면 위치변경
    if (!isAllSeatsViewClosed) {
      allSeatsView.classList.add(SIDEPOPUP_BOTTOM_CN);
    }
  } else {
    isAllSeatsViewClosed = true;
  }
  sidePopup.classList.remove(SHOW_SIDEPOPUP_CN);
}

// scroll bar를 가지고 있는지 확인하는 함수
function hasScrollBar(el) {
  const x1 = el.scrollLeft;
  el.scrollLeft += 1;
  const x2 = el.scrollLeft;
  el.scrollLeft -= 1;
  const x3 = el.scrollLeft;
  el.scrollLeft = x1;
  return x1 !== x2 || x2 !== x3;
}

// 한눈에 보기 기능 활성화
function handleAllSeatsView() {
  const seats = document.querySelectorAll(".seat");
  seats.forEach((seat) => {
    seat.classList.add("viewAllSeats");
  });
  // console.log(closeBtns)
  closeBtns[0].click();
}

function handleScrollLeft() {
  container.scrollLeft -= 50;
}

function handleScrollRight() {
  container.scrollLeft += 50;
}

function handleDeveloperMode() {
  if (!isPickStart) {
    yyjCnt += 1;
  }
  if (yyjCnt >= 6) {
    rangeChange();
    disabled();
    if (isDelStart) {
      chooseDelSeat();
    }
    setTimeout(() => {
      alert("개발자 모드를 실행합니다.");
      while (true) {
        yyjNum = prompt("번호를 입력하세요.");
        if (yyjNum && yyjNum >= 0) {
          yyjNum = Number(yyjNum);
          break;
        }
      }
      alert("자리를 선택해주세요.");

      // 자리 선택 버튼 표시
      const yyjBtns = document.querySelectorAll(".yyj_btn");
      for (let i = 0; i < yyjBtns.length; i++) {
        yyjBtns[i].classList.remove(NONE_CN);
        yyjBtns[i].addEventListener("click", (event) => {
          for (let i = 0; i < yyjBtns.length; i++) {
            yyjBtns[i].classList.add(NONE_CN);
          }
          const pos = event.target.parentNode.id;
          yyjRow = Number(pos[0]);
          yyjCol = Number(pos[pos.length - 1]);
          disabled();
        });
      }
    }, 100);
  }
}

function init() {
  rangeChange();

  // 모바일 환경이 아니면 button hover 효과 추가
  if (!isMoblie()) {
    const btns = document.querySelectorAll(".hbtn");
    btns.forEach((btn) => {
      btn.addEventListener("mouseenter", handleEnter);
      btn.addEventListener("mouseleave", handleLeave);
    });
  }

  // Event Listener
  col.addEventListener("input", rangeChange);
  row.addEventListener("input", rangeChange);
  numBtn.addEventListener("click", handleNumBtn);
  delBtn.addEventListener("click", chooseDelSeat);
  pickBtn.addEventListener("click", handlePickBtn);
  manualBtn.addEventListener("click", handleManual);
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", handleClose);
  });
  allSeatsViewBtn.addEventListener("click", handleAllSeatsView);
  leftScrollBtn.addEventListener("click", handleScrollLeft);
  rightScrollBtn.addEventListener("click", handleScrollRight);

  // 설명서 side popup 등장
  setTimeout(() => {
    manualHint.classList.add(SHOW_SIDEPOPUP_CN);
  }, 2000);
}

init();
