if (localStorage.getItem("wifi-connect") == null) {
  localStorage.setItem(
    "wifi-connect",
    JSON.stringify({ colorLogo: false, showUsageCounts: false, durationColor: "#000000", layoutSize: "legal" })
  );
}

const body = document.querySelector("body");
const hotspotGrid = document.querySelector("#hotspot-print-grid");
document.querySelector("style[type='text/css']").remove();
hotspotGrid.classList.add("disabled");
const infoIcon = `
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 8C15 8.55228 14.5523 9 14 9C13.4477 9 13 8.55228 13 8C13 7.44772 13.4477 7 14 7C14.5523 7 15 7.44772 15 8ZM13.25 11.75L13.25 19.25C13.25 19.6642 13.5858 20 14 20C14.4142 20 14.75 19.6642 14.75 19.25L14.75 11.75C14.75 11.3358 14.4142 11 14 11C13.5858 11 13.25 11.3358 13.25 11.75ZM2 14C2 7.37258 7.37258 2 14 2C20.6274 2 26 7.37258 26 14C26 20.6274 20.6274 26 14 26C7.37258 26 2 20.6274 2 14ZM14 3.5C8.20101 3.5 3.5 8.20101 3.5 14C3.5 19.799 8.20101 24.5 14 24.5C19.799 24.5 24.5 19.799 24.5 14C24.5 8.20101 19.799 3.5 14 3.5Z" fill="#000000"/>
  </svg>`;
const clientData = JSON.parse(localStorage.getItem("wifi-connect"));
let vouchersData = [];
let maxItem = 60;

const renderVoucher = () => {
  document.querySelector("#papers-group").innerHTML = "";
  for (let i = 0; i < Math.ceil(vouchersData.length / maxItem); i++) {
    document.querySelector("#papers-group").innerHTML += `<div class="page-layout"></div>`;
  }
  vouchersData.map((voucher, index) => {
    document.querySelectorAll(".page-layout")[Math.ceil((index + 1) / maxItem - 1)].innerHTML += `
    <div class="voucher">
      <div class="logo ${clientData.colorLogo === true ? "" : "black"}"></div>
      <p class="code">${voucher.code}</p>
      <p class="type">${clientData.showUsageCounts === true ? voucher.type : "Voucher Code"}</p>
      <span class="status">${voucher.status}</span>
    </div>`;
  });
};
const loadClientDataForEdit = () => {
  if (clientData.colorLogo === true) {
    document.querySelector("#color-logo").checked = true;
  }
  if (clientData.showUsageCounts === true) {
    document.querySelector("#show-usage-counts").checked = true;
  }
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
      const initialStatusValue = str.slice(10, -1);
      const statusValue = initialStatusValue.split(" ");
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
    const scrapedVoucher = {
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
          <div class="edit-container">
            <input type="checkbox" id="edit-btn" />
            <label for="edit-btn" class="btn dropdown">
              Edit layout<i class="icon chevron-down"></i>
            </label>
            <div class="dialog-backdrop"></div>
            <dialog class="edit-dialog">
              <ul>
                <li>
                  <input type="checkbox" id="color-logo" />
                  <label for="color-logo">
                    <p>Colored Logo</p><i class="icon check"></i>
                  </label>
                </li>
                <li>
                  <input type="checkbox" id="show-usage-counts" />
                  <label for="show-usage-counts">
                    <p>Show Usage Counts</p><i class="icon check"></i>
                  </label>
                </li>
                <li><p>Duration Color</p></li>
                <li><p>Layout Size</p></li>
              </ul>
            </dialog>
          </div>
          <button type="button" id="print-btn" class="btn btn-accent">
            <i class="icon print"></i>
            Print vouchers
          </button>
        </div>
      </header>
      <section id="papers-group" class="voucher-preview-container"></section>
    </main>
    `
  );
  document.querySelector(".dialog-backdrop").onclick = () => {
    document.querySelector("#edit-btn").checked = false;
  };
  document.querySelector("#print-btn").onclick = () => window.print();
  loadClientDataForEdit();
  const setData = () => {
    localStorage.setItem("wifi-connect", JSON.stringify(clientData));
    renderVoucher();
  };
  document.querySelector("#color-logo").onclick = () => {
    if (document.querySelector("#color-logo").checked === true) {
      clientData.colorLogo = true;
      setData();
    } else {
      clientData.colorLogo = false;
      setData();
    }
  };
  document.querySelector("#show-usage-counts").onclick = () => {
    if (document.querySelector("#show-usage-counts").checked === true) {
      clientData.showUsageCounts = true;
      setData();
    } else {
      clientData.showUsageCounts = false;
      setData();
    }
  };
  renderVoucher();
  document.querySelector("#hotspot-print-grid").remove();
}, 1000);
