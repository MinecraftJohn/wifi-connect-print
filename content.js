const body = document.querySelector("body");
const hotspotGrid = document.querySelector("#hotspot-print-grid");
document.querySelector("style[type='text/css']").remove();
hotspotGrid.classList.add("disabled");
const infoIcon = `
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 8C15 8.55228 14.5523 9 14 9C13.4477 9 13 8.55228 13 8C13 7.44772 13.4477 7 14 7C14.5523 7 15 7.44772 15 8ZM13.25 11.75L13.25 19.25C13.25 19.6642 13.5858 20 14 20C14.4142 20 14.75 19.6642 14.75 19.25L14.75 11.75C14.75 11.3358 14.4142 11 14 11C13.5858 11 13.25 11.3358 13.25 11.75ZM2 14C2 7.37258 7.37258 2 14 2C20.6274 2 26 7.37258 26 14C26 20.6274 20.6274 26 14 26C7.37258 26 2 20.6274 2 14ZM14 3.5C8.20101 3.5 3.5 8.20101 3.5 14C3.5 19.799 8.20101 24.5 14 24.5C19.799 24.5 24.5 19.799 24.5 14C24.5 8.20101 19.799 3.5 14 3.5Z" fill="#000000"/>
  </svg>`;
const printIcon = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 4.5C15 3.67157 14.3284 3 13.5 3H6.5C5.67157 3 5 3.67157 5 4.5V5H4.5C3.11929 5 2 6.11929 2 7.5V12.5C2 13.3284 2.67157 14 3.5 14H5V15.5C5 16.3284 5.67157 17 6.5 17H13.5C14.3284 17 15 16.3284 15 15.5V14H16.5C17.3284 14 18 13.3284 18 12.5V7.5C18 6.11929 16.8807 5 15.5 5H15V4.5ZM14 5H6V4.5C6 4.22386 6.22386 4 6.5 4H13.5C13.7761 4 14 4.22386 14 4.5V5ZM15 13V11.5C15 10.6716 14.3284 10 13.5 10H6.5C5.67157 10 5 10.6716 5 11.5V13H3.5C3.22386 13 3 12.7761 3 12.5V7.5C3 6.67157 3.67157 6 4.5 6H15.5C16.3284 6 17 6.67157 17 7.5V12.5C17 12.7761 16.7761 13 16.5 13H15ZM13.5 11C13.7761 11 14 11.2239 14 11.5V15.5C14 15.7761 13.7761 16 13.5 16H6.5C6.22386 16 6 15.7761 6 15.5V11.5C6 11.2239 6.22386 11 6.5 11H13.5Z" fill="#ffffff"/>
  </svg>`;
const chevronDownIcon = `
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.14645 4.64645C2.34171 4.45118 2.65829 4.45118 2.85355 4.64645L6 7.79289L9.14645 4.64645C9.34171 4.45118 9.65829 4.45118 9.85355 4.64645C10.0488 4.84171 10.0488 5.15829 9.85355 5.35355L6.35355 8.85355C6.15829 9.04882 5.84171 9.04882 5.64645 8.85355L2.14645 5.35355C1.95118 5.15829 1.95118 4.84171 2.14645 4.64645Z" fill="#242424"/>
  </svg>`;
let vouchersData = [];
let maxItem = 60;
const renderVoucher = () => {
  for (let i = 0; i < Math.ceil(vouchersData.length / maxItem); i++) {
    document.querySelector("#papers-group").innerHTML += `<div class="page-layout"></div>`;
  }
  vouchersData.map((voucher, index) => {
    document.querySelectorAll(".page-layout")[Math.ceil((index + 1) / maxItem - 1)].innerHTML += `
    <div class="voucher">
      <div class="logo"></div>
      <p class="code">${voucher.code}</p>
      <p class="type">${voucher.type}</p>
      <span class="status">${voucher.status}</span>
    </div>`;
  });
  // vouchers.map((code, index) => {
  //   document.querySelectorAll(".page-layout")[Math.ceil((index + 1) / maxItem - 1)].innerHTML += `
  //     <div class="relative voucher-container">
  //       <div class="logo"></div>
  //       <p class="relative">${code}</p>
  //       <span class="absolute">${dataDurationTime.value} ${
  //     Number(dataDurationTime.value) > 1 ? dataDurationType.value + "s" : dataDurationType.value
  //   }</span>
  //     </div>`;
  // });
};
body.innerHTML += `
  <div id="extension-note">
    ${infoIcon}
    <p>Cancel the print dialog to enable the extension.</p>
  </div>`;

setTimeout(() => {
  document.querySelector("#extension-note").remove();
  document.querySelectorAll(".voucher").forEach((voucher) => {
    const parseStatus = (str) => {
      let initialStatusValue = str.slice(10, -1);
      let statusValue = initialStatusValue.split(" ");
      if (statusValue.length == "1") {
        let durationTime = statusValue[0].match(/\d+/)[0];
        let durationType = statusValue[0].match(/[a-z]/gi);
        if (durationType == "h") {
          durationType = "hrs";
        } else if (durationType == "m") {
          durationType = "mins";
        } else if (durationType == "d") {
          durationType = "days";
        }
        if (durationTime == "1") {
          durationType = durationType.slice(0, -1);
        }
        return `${durationTime} ${durationType}`;
      } else {
        return initialStatusValue;
      }
    };
    let scrapedVoucher = {
      code: voucher.childNodes[0].innerText,
      status: parseStatus(voucher.childNodes[1].innerText),
      type: voucher.childNodes[2].innerText,
    };
    vouchersData.push(scrapedVoucher);
  });
  body.insertAdjacentHTML(
    "afterbegin",
    `<header class="navigation">
        <a href="https://github.com/MinecraftJohn/wifi-connect" target="blank" title="Wi-Fi Connect" class="logo"></a>
        <ul>
          <li>
            <a href="https://github.com/MinecraftJohn/voucher-skin" target="blank">About</a>
          </li>
          <li>
            <a href="https://github.com/MinecraftJohn/wifi-connect" target="blank">Custom Portal</a>
          </li>
          <li>
            <a href="https://minecraftjohn.github.io/voucher-generator/" target="blank">Voucher Generator</a>
          </li>
        </ul>
    </header>
    <main>
      <header class="heading-container">
        <div>
          <h1>Print Preview</h1>
          <p class="text">1 pages on 8x11in. paper</p>
        </div>
        <div class="heading-btns">
          <button type="button" class="btn dropdown">Edit layout${chevronDownIcon}</button>
          <button type="button" id="print-btn" class="btn btn-accent">
            ${printIcon}
            Print vouchers
          </button>
        </div>
      </header>
      <section id="papers-group" class="voucher-preview-container"></section>
    </main>
    `
  );
  renderVoucher();
  document.querySelector("#print-btn").onclick = () => window.print();
  document.querySelector("#hotspot-print-grid").remove();
}, 1000);
