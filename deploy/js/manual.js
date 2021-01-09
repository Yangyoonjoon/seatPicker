const manual_col = document.getElementById("manual_col"),
  manual_row = document.getElementById("manual_row"),
  manual_col_label = document.getElementById("manual_col_label"),
  manual_row_label = document.getElementById("manual_row_label"),
  manual_num_btn = document.getElementById("manual_num_btn"),
  manual_del_btn = document.getElementById("manual_del_btn"),
  manual_pick_btn = document.getElementById("manual_pick_btn"),
  manual_num_form = document.querySelector(".manual_num_form"),
  manual_seat_btn = document.querySelector(".manual_seat_btn"),
  manual_seat = document.querySelector(".manual_seat");

let manual_isDelStart = false;
let manual_isNumSetting = false;
let manual_isPickStart = false;

function manual_rangeChange() {
  let colValue = manual_col.value;
  let rowValue = manual_row.value;
  manual_col_label.innerText = `열 ${colValue}개`;
  manual_row_label.innerText = `행 ${rowValue}개`;
}

function manual_numBtn() {
  if (manual_isNumSetting) {
    manual_num_btn.innerText = "번호 맞춤 설정";
    manual_isNumSetting = false;
    manual_num_form.classList.add(NONE);
  } else {
    manual_num_btn.innerText = "맞춤 설정 해제";
    manual_isNumSetting = true;
    manual_num_form.classList.remove(NONE);
  }
}

function manual_delBtn() {
  if (manual_isDelStart) {
    manual_del_btn.innerText = "없는 자리 설정";
    manual_isDelStart = false;
  } else {
    manual_del_btn.innerText = "완료";
    manual_isDelStart = true;
  }
  manual_seat_btn.classList.toggle(NONE);
}

function manual_pickBtn() {
  if (manual_isPickStart) {
    manual_pick_btn.innerText = "뽑기!";
    manual_pick_btn.classList.remove(RETRY);
    manual_isPickStart = false;
  } else {
    manual_pick_btn.classList.add(RETRY);
    manual_isPickStart = true;
    manual_pick_btn.removeEventListener("click", manual_pickBtn);
    manual_pick_btn.innerText = "3";
    setTimeout(() => {
      manual_pick_btn.innerText = "2";
      setTimeout(() => {
        manual_pick_btn.innerText = "1";
      }, 1000);
      setTimeout(() => {
        setTimeout(() => {
          manual_pick_btn.innerText = "다시!";
          manual_pick_btn.addEventListener("click", manual_pickBtn);
        }, 1000);
      }, 1000);
    }, 1000);
  }
}

function manual_seatBtn() {
  manual_seat.classList.toggle(DEL);
}

function manual_init() {
  manual_rangeChange();
  manual_col.onchange = manual_rangeChange;
  manual_row.onchange = manual_rangeChange;
  manual_num_btn.addEventListener("click", manual_numBtn);
  manual_del_btn.addEventListener("click", manual_delBtn);
  manual_pick_btn.addEventListener("click", manual_pickBtn);
  manual_seat_btn.addEventListener("click", manual_seatBtn);
}

manual_init();
