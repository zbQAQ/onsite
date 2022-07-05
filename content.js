const RPDATA = []
let firstId = null
let lastId = null

function returnHtml(data, type) {
  const { id, title, src, price } = data
  if(type === 'F') {
    firstId = id
  } else {
    lastId = id
  }
  return `
    <h2>价格最${type === 'F' ? '高' : '低'}的商品</h2>
    <div style="display: flex;margin-bottom: 20px;padding-bottom: 20px;border-bottom: 1px solid;">
      <img width="100" style="margin-right: 12px;" src="${src}">
      <div>
        <h3>${title}</h3>
        <p>price: ${price}</p>
      </div>
    </div>
  `
}

window.onload = function() {
  const targetNode = document.getElementsByClassName('collection-list')[0];
  const config = { attributes: true, childList: true, subtree: true };
  const callback = function() {
      const list = document.querySelectorAll('.collection-list__page .collection-list__product-tile .product-tile') 
      for(let i = 0; i < list.length; i++) {
        const data = list[i].getAttribute("data-pdp-json")
        if(data) {
          const { id, title, price, images } = JSON.parse(data).products[0]
          if(RPDATA.findIndex(v => v.id === id) < 0) {
            RPDATA.push({
              id, price, title, src: images[0].src
            })
          }
        }
      }

      const total =  document.querySelectorAll('.collection-list__page .collection-list__product-tile').length
      document.querySelector("#rpdata-total-value").textContent = total

      const sortData = (RPDATA || []).sort((a, b) => b.price - a.price)

      if(sortData.length > 0) {
        const first = sortData[0]
        const last = sortData[sortData.length - 1]

        if(firstId !== first.id) {
          const firstHtml = returnHtml(first, 'F')
          document.querySelector("#rpdata-first-box").innerHTML = firstHtml
          document.querySelector("#rpdata-first-value").textContent = first.price
        }

        if(lastId !== last.id) {
          const lastHtml = returnHtml(last, 'L')
          document.querySelector("#rpdata-last-box").innerHTML = lastHtml
          document.querySelector("#rpdata-last-value").textContent = last.price
        }

      }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);

  const margin = "16px 0"

  const container = document.createElement('div');
  container.id = "rpdata-container"
  container.setAttribute("style", `
    position: fixed;
    padding: 8px;
    top: 0px;
    right: -380px;
    width: 360px;
    height: 100vh;
    background: #f5f5f5;
    z-index: 99;
    box-shadow: 5px 10px 15px #000;
    transition: right .45s;
  `)

  const domList = [
    {
      id: "rpdata-total",
      margin,
      innerHTML: "产品总数: <span id='rpdata-total-value'>0</span>"
    },
    {
      id: "rpdata-first",
      margin,
      innerHTML: "最高价格: <span id='rpdata-first-value'>0</span>"
    },
    {
      id: "rpdata-last",
      margin,
      innerHTML: "最低价格: <span id='rpdata-last-value'>0</span>"
    },
    {
      id: "rpdata-first-box",
      margin,
    },
    {
      id: "rpdata-last-box",
      margin,
    },
  ]

  const doms = domList.map(({ margin, id, innerHTML = '' }) => {
    const div = document.createElement('div');
    div.id = id;
    div.style.margin = margin;
    div.innerHTML = innerHTML;
    return div
  })

  for(let i = 0; i < doms.length; i++) {
	  container.appendChild(doms[i]);
  }

	document.body.appendChild(container);
}