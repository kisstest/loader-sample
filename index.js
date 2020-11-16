import axios from 'axios';

document.addEventListener('DOMContentLoaded', async () => {
  const temp = await axios.get('/api/users');

  document.body.innerHTML = temp.data
  .map(user => {
    return `<div>${user.keyword}</div>`;
  })
  .join('\n');
});

console.log(TWO);
console.log(api.domain);