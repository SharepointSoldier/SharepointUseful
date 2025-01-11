// Enable smooth scrolling and active tab highlight
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault(); 
    const target = document.querySelector(this.getAttribute('href')); 
    target.scrollIntoView({ behavior: 'smooth', block: 'start' }); 

    
    document.querySelectorAll('.sidebar-link').forEach(item => item.classList.remove('active'));

    this.classList.add('active');
  });
});



// Highlight the correct tab on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.section');
  let scrollPosition = window.scrollY;

  sections.forEach(section => {
    const id = section.getAttribute('id');
    const offsetTop = section.offsetTop - 100; // Adjust for header
    const offsetHeight = section.offsetHeight;

    const link = document.querySelector(`.sidebar-link[href="#${id}"]`);
    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
      document.querySelectorAll('.sidebar-link').forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    }
  });
});
