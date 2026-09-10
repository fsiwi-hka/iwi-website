document.addEventListener("DOMContentLoaded", function () {
  const openmodal = document.querySelectorAll('.modal-open');
  openmodal.forEach(btn => {
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      toggleModal();
    });
  });

  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', toggleModal);
  }

  const closemodal = document.querySelectorAll('.modal-close');
  closemodal.forEach(btn => {
    btn.addEventListener('click', toggleModal);
  });

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    const isEscape = evt.key === "Escape" || evt.key === "Esc" || evt.keyCode === 27;
    if (isEscape && document.body.classList.contains('modal-active')) {
      toggleModal();
    }
  };

  function toggleModal() {
    const body = document.querySelector('body');
    const modal = document.querySelector('.modal');
    if (modal && body) {
      modal.classList.toggle('opacity-0');
      modal.classList.toggle('pointer-events-none');
      body.classList.toggle('modal-active');
    }
  }
});
