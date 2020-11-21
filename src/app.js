import form from './form';
import result from './result';

let resultEl;

document.addEventListener('DOMContentLoaded', async () => {
  const formEl = document.createElement('div');
  formEl.innerHTML = form.render();
  document.body.appendChild(formEl);

  resultEl = document.createElement('div');
  resultEl.innerHTML = await result.render();
  document.body.appendChild(resultEl);
});

if (module.hot) {
  console.log('핫 모듈 켜짐');

  module.hot.accept('./result', async () => {
    console.log('result 모듈 변경됨');
    resultEl.innerHTML = await result.render();
    document.body.appendChild(resultEl);
  });
}