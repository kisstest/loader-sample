import form from './form';
// import result from './result';
import './app.css';

let resultEl, formEl;

document.addEventListener('DOMContentLoaded', async () => {
  formEl = document.createElement('div');
  formEl.innerHTML = form.render();
  document.body.appendChild(formEl);

  import('./result.js').then(module => {
    const result = module.default;
    resultEl = document.createElement('div');
    resultEl.innerHTML = await result.render();
    document.body.appendChild(resultEl);
  });

});

console.log('app.js');

if (module.hot) {
  console.log('핫 모듈 켜짐');

  module.hot.accept('./result', async () => {
    console.log('result 모듈 변경됨');
    resultEl.innerHTML = await result.render();
  });

  module.hot.accept('./form', async () => {
    console.log('form 모듈 변경됨');
    formEl.innerHTML = await form.render();
  });
}