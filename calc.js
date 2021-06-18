window.onload = () => {
  loanCalc()
}

function loanCalc() {
  const form = document.querySelector('.loan form');
  const loanTableTr = document.querySelector('.table_area table thead tr');
  const loanTbody = document.querySelector('.table_area table tbody');
  const inputPrice =  document.querySelector('.loan_price')
  const inputPercent =  document.querySelector('.loan_percentage')
  const inputLoanDay =  document.querySelector('.loan_day')
  const inputStayDay =  document.querySelector('.stay_day')
  const tableTitle = [
    '회차',
    '총상환금',
    '납입원금',
    '이자',
    '납입누계',
    '잔금',
  ];

  loanTableTr.innerHTML = tableTitle.map(title => {
    return `<th>${title}</th>`
  }).join('')

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let originMoney = Number(inputPrice.value);
    let copyOrigin = Number(inputPrice.value);
    let loan = Number(inputPercent.value);
    let loanYear = Number(inputLoanDay.value);
    let stayYear = Number(inputStayDay.value);

    let loanParse = (loan / 12) / 100
    let topValue = originMoney * (Number(loanParse) * Math.pow(1 + Number(loanParse), (loanYear - stayYear) * 12));
    let bottomValue = Math.pow(1 + Number(loanParse), (loanYear - stayYear) * 12) - 1;
    let totalMonthPay = Math.round(topValue / bottomValue);
    const list = [];
    /*
      회차
      총상환금
      납입원금
      이자
      납입누계
      잔금
    */
    for (let i = 1; i <= stayYear * 12; i++) {
      const obj = {
        count: i,
        totalSend: comma(Math.round(originMoney * loanParse)),
        originSend: 0,
        loan: comma(Math.round(originMoney * loanParse)),
        sendReduce: 0,
        rest: comma(originMoney)
      }
      list.push(obj)
    }
    for (let i = 1; i <= (loanYear - stayYear) * 12; i++) {
      const obj = {
        count: (stayYear * 12) + i,
        totalSend: comma(totalMonthPay),
        originSend: comma(totalMonthPay - Math.round(originMoney * loanParse)),
        loan: comma(Math.round(originMoney * loanParse)),
        sendReduce: comma(copyOrigin - originMoney),
        rest: originMoney < 0 ? 0 : comma(originMoney)
      }
      list.push(obj)
      originMoney -= totalMonthPay - Math.round(originMoney * loanParse)
    }
    loanTbody.innerHTML = list.map(object => {
      return `
        <tr>
          <td>${object.count}</td>
          <td>${object.totalSend}</td>
          <td>${object.originSend}</td>
          <td>${object.loan}</td>
          <td>${object.sendReduce}</td>
          <td class="negative">${object.rest}</td>
        </tr>
      `
    }).join('');

  })
}




function comma(strParams) {
  let str = strParams;
  if (Number(str) === 0) {
    return '0';
  } if (str === null || str === undefined) {
    return '-';
  }
  str = String(str);
  if (str.length === 0) {
    return '-';
  }
  return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}