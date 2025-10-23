const form = document.getElementById('leadForm');
const feedback = form.querySelector('.form__feedback');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name').trim();
  const phone = formData.get('phone').trim();

  if (!name || !phone) {
    feedback.textContent = 'Пожалуйста, заполните все поля.';
    feedback.style.color = '#ff3366';
    return;
  }

  const botToken = form.dataset.telegramToken;
  const chatId = form.dataset.telegramChatId;

  if (!botToken || botToken === 'YOUR_BOT_TOKEN' || !chatId || chatId === 'YOUR_CHAT_ID') {
    feedback.textContent = 'Укажите токен и chat_id Telegram в атрибутах формы.';
    feedback.style.color = '#ff3366';
    return;
  }

  const messageText = `Новая заявка с лендинга URSEVEN\nИмя: ${name}\nТелефон: ${phone}`;
  const payload = new URLSearchParams({
    chat_id: chatId,
    text: messageText
  });

  try {
    feedback.textContent = 'Отправляем...';
    feedback.style.color = '#6a00c5';

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: payload
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error('Ошибка при отправке.');
    }

    feedback.textContent = 'Спасибо! Ваша заявка отправлена, мы свяжемся с вами.';
    feedback.style.color = '#0d8f55';
    form.reset();
  } catch (error) {
    feedback.textContent = 'Не удалось отправить заявку. Попробуйте позже или напишите нам напрямую.';
    feedback.style.color = '#ff3366';
  }
});
