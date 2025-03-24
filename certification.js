
document.addEventListener('DOMContentLoaded', () => {
    const tierFilters = document.querySelectorAll('input[name="tier"]');
    const serviceFilters = document.querySelectorAll('input[name="service"]');
    const cards = document.querySelectorAll('.progress-card');
  
    function filterCards() {
      const selectedTier = document.querySelector('input[name="tier"]:checked')?.value;
      const selectedService = document.querySelector('input[name="service"]:checked')?.value;
  
      cards.forEach(card => {
        const cardTier = card.dataset.tier;
        const cardService = card.dataset.service;
  
        const tierMatch = selectedTier === 'all' || selectedTier === cardTier;
        const serviceMatch = selectedService === 'all' || selectedService === cardService;
  
        if (tierMatch && serviceMatch) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }
  
    tierFilters.forEach(input => input.addEventListener('change', filterCards));
    serviceFilters.forEach(input => input.addEventListener('change', filterCards));
  });
  