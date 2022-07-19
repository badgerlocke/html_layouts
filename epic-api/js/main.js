document.querySelector('button').addEventListener('click', getFetch)
let picIndex = 0;

function getFetch(){
  // Data not available for every day. Need to fetch available dates and display in order to make date selection work
  // const choice = document.querySelector('input').value
  // const url = `https://epic.gsfc.nasa.gov/api/natural/date/${choice}`
  const url = `https://epic.gsfc.nasa.gov/api/natural`
  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        showPic(data[picIndex])
        document.querySelector('#prev').addEventListener('click',() => shiftIndex(data,-1))
        document.querySelector('#next').addEventListener('click',() => shiftIndex(data,1))
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}


function showPic(data) {
  document.querySelector('img').src = getPicURL(data.image,data.date,'jpg')
  document.querySelector('#caption').innerText = data.caption
}

function getPicURL(name,date,type) {
  let parsedDate = date.substring(0,10).replace(/[-]/g,'/');
  return `https://epic.gsfc.nasa.gov/archive/natural/${parsedDate}/${type}/${name}.${type}`
}

function shiftIndex(data,num) {
  picIndex += num;
  if (picIndex < 0) {picIndex = data.length + picIndex}
  if (picIndex >= data.length) {picIndex = picIndex % data.length}
  showPic(data[picIndex])
}