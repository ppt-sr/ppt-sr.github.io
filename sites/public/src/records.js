document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      // Cambiar la pestaña activa
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
  
      // Mostrar el contenido correspondiente
      const target = button.dataset.target;
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      document.getElementById(target).classList.add('active');
    });
  });
  