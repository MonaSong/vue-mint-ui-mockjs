let sWidth = screen.width
let sScrollWidth = document.body.scrollWidth
let sDeviceRatio = window.devicePixelRatio
const oHtml = document.getElementsByTagName('html')[0]
if (sWidth > sScrollWidth) {
  if (sWidth / sDeviceRatio / 7.5 < 85.3) {
    oHtml.style.fontSize = sWidth / sDeviceRatio / 7.5 + 'px'
  } else {
    oHtml.style.fontSize = '85.3px'
  }
} else {
  if (screen.width < 640) {
    oHtml.style.fontSize = screen.width / 7.5 + 'px'
  } else {
    oHtml.style.fontSize = '85.3px'
  }
}
