document.querySelector('button').addEventListener('click', async () => {
  const model = document.getElementById('model').value;
  const prompt = document.getElementById('prompt').value;
  const fileInput = document.getElementById('file');
  const responseBox = document.getElementById('response');

  const formData = new FormData();
  formData.append('model', model);
  formData.append('prompt', prompt);
  if (fileInput.files[0]) {
    formData.append('file', fileInput.files[0]);
  }

  responseBox.innerText = "Thinking... 🤔";

  try {
    const res = await fetch('/api/chat', { method: 'POST', body: formData });
    const data = await res.json();
    responseBox.innerText = data.response;
  } catch (err) {
    responseBox.innerText = '❌ Something went wrong.';
    console.error(err);
  }
});
