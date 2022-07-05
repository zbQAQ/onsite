(() => {
  const rpdataContainer = document.querySelector("#rpdata-container")
  if(rpdataContainer) {
    let flag = rpdataContainer.style.right !== "-380px"
    if(flag) {
      rpdataContainer.style.right = "-380px"
      flag = false
    } else {
      rpdataContainer.style.right = "0"
      flag = true
    }
  }
})()