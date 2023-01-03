// Script for range slider

document.querySelector('#sliderLabel').textContent = '250€';

let sliderValues = [];
for (let i=250;i<20050;i+=50) {
  sliderValues.push(i);
}

var slider = new rSlider({
  target: '#sampleSlider',
  values: sliderValues,
  range: false,
  tooltip: false,
  labels: false
});

setInterval(function() {
  let investment = slider.getValue();
  let profit = 0;

  if (investment === 250) {
    profit = investment * 2;
  }

  if (investment === 250) {
    profit = investment * 2;
  }

  if (investment > 250 && investment < 500) {
    profit = investment * 2.5;
  }

  if (investment >= 500 && investment < 1000) {
    profit = investment * 3.5;
  }

  if (investment >= 1000 && investment < 5000) {
    profit = investment * 5;
  }

  if (investment >= 5000) {
    profit = investment * 5.5;
  }

  document.querySelector('#sliderValue').textContent = profit + '€';
  document.querySelector('.rs-pointer').textContent = investment + '€';
}, 1000);