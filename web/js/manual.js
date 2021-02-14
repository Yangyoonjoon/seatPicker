const manual_col = document.getElementById("manual_col"),
  manual_row = document.getElementById("manual_row"),
  manual_col_label = document.getElementById("manual_col_label"),
  manual_row_label = document.getElementById("manual_row_label"),
  manual_num_btn = document.getElementById("manual_num_btn"),
  manual_del_btn = document.getElementById("manual_del_btn"),
  manual_pick_btn = document.getElementById("manual_pick_btn"),
  manual_num_form = document.querySelector(".manual_num_form"),
  manual_num_input = document.getElementById("manual_num_input"),
  manual_seat_btn = document.querySelector(".manual_seat_btn"),
  manual_seat = document.querySelector(".manual_seat");

let manual_delStart = false;
let manual_numSetting = false;
let manual_pickStart = false;

function manual_rangeChange() {
  let colValue = manual_col.value;
  let rowValue = manual_row.value;
  manual_col_label.innerText = `열 ${colValue}개`;
  manual_row_label.innerText = `행 ${rowValue}개`;
}

function manual_numBtn() {
  if (manual_numSetting) {
    manual_num_btn.innerText = "번호 맞춤 설정";
    manual_numSetting = false;
    manual_num_form.classList.add(NONE_CN);
  } else {
    manual_num_btn.innerText = "맞춤 설정 해제";
    manual_numSetting = true;
    manual_num_form.classList.remove(NONE_CN);
    manual_num_input.value = "";
  }
}

function manual_delBtn() {
  if (manual_delStart) {
    manual_del_btn.innerText = "없는 자리 설정";
    manual_delStart = false;
  } else {
    manual_del_btn.innerText = "자리 설정 완료";
    manual_delStart = true;
  }
  manual_seat_btn.classList.toggle(NONE_CN);
}

function manual_pickBtn() {
  if (manual_pickStart) {
    manual_pick_btn.innerText = "뽑기!";
    manual_pick_btn.classList.remove(RETRY_CN);
    manual_pickStart = false;
  } else {
    manual_pick_btn.classList.add(RETRY_CN);
    manual_pickStart = true;
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
  manual_seat.classList.toggle(DEL_CN);
}

function manual_init() {
  manual_rangeChange();
  manual_col.addEventListener("input", manual_rangeChange);
  manual_row.addEventListener("input", manual_rangeChange);
  manual_num_btn.addEventListener("click", manual_numBtn);
  manual_del_btn.addEventListener("click", manual_delBtn);
  manual_pick_btn.addEventListener("click", manual_pickBtn);
  manual_seat_btn.addEventListener("click", manual_seatBtn);
}

manual_init();
