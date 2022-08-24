import XLSX from 'xlsx'
import fs from 'file-saver'

const s2ab = s => {
  var buf;
  if (typeof ArrayBuffer !== 'undefined') {
    buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  } else {
    buf = new Array(s.length);
    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
}

/**
 * @param data Array，表体数据
 * @param key Array，字段名
 * @param filename String，文件名
 */
export const exportJsonToExcel = (
  data,
  key,
  filename
) => {
  const wb = XLSX.utils.book_new()

  const ws = XLSX.utils.json_to_sheet(data, {
    header: key,
  })

  XLSX.utils.book_append_sheet(wb, ws, filename)
  const wbout = XLSX.write(wb, { type: 'binary' })
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  fs.saveAs(blob, filename + '.xlsx')
}
export default {
  exportJsonToExcel
}

export function uploader(el, callback) {
  const oRealButton = document.createElement("input");
  oRealButton.setAttribute("type", "file")
  oRealButton.setAttribute("accept", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel")
  oRealButton.style.display = "none"
  oRealButton.addEventListener("change", () => {
    const file = oRealButton.files[0]
    callback && callback(file)
    oRealButton.remove()
  })
  el.parentNode.appendChild(oRealButton)
  el.addEventListener("click", () => {
    oRealButton.click()
  })
}

export function importExcel(file, callback) {
  const reader = new FileReader()
  reader.readAsBinaryString(file)
  reader.onload = function (e) {
    const context = XLSX.read(e.target.result, { type: "binary" });
    const excel = XLSX.utils.sheet_to_json(
      context.Sheets[context.SheetNames[0]]
    )
    callback && callback(excel)
  }
}

