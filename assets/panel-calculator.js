class PanelCalculator extends HTMLElement {
  constructor() {
    this.widthSelector = document.querySelector('#Width-selector');
    this.init();
    
    // Make the calculate method globally accessible
    window.calculatePanels = (select) => {
      this.calculatePanels(select);
    };
  }

  init() {
    if (this.widthSelector) {
      this.calculatePanels(this.widthSelector);
      // Add event listener for future changes
      this.widthSelector.addEventListener('change', () => this.calculatePanels(this.widthSelector));
    }
  }

  calculatePanels(select) {
    const selectedWidth = parseFloat(select.value);
    const singlePanelWidth = parseFloat(select.dataset.singlePanelWidth);
    const resultDiv = document.querySelector(`#panels-result_ .panels-count`);
    
    if (isNaN(selectedWidth) || isNaN(singlePanelWidth) || singlePanelWidth <= 0) {
      resultDiv.textContent = '-';
      return;
    }

    const numberOfPanels = Math.ceil(selectedWidth / singlePanelWidth);
    resultDiv.textContent = numberOfPanels;
    
    const variantSelect = document.querySelector('select.select__select[name="options[Fabric Panels]"]');
    if (!variantSelect) {
      console.error('Variant selector not found');
      return;
    }

    // Update variant selection
    this.updateVariantSelection(variantSelect, numberOfPanels);
    
    // Update hidden input for properties
    this.updatePanelProperties(variantSelect, numberOfPanels);
  }

  updateVariantSelection(variantSelect, numberOfPanels) {
    const searchText = `panel ${numberOfPanels}`.toLowerCase();
    const panelOption = Array.from(variantSelect.options).find(option => 
      option.text.toLowerCase().trim().includes(searchText)
    );

    if (panelOption) {
      variantSelect.value = panelOption.value;
      variantSelect.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      console.error('No matching panel option found for:', numberOfPanels);
    }
  }

  updatePanelProperties(form, numberOfPanels) {
    let hiddenInput = form.querySelector('input[name="properties[Number of Panels]"]');
    
    if (!hiddenInput) {
      hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'properties[Number of Panels]';
      form.appendChild(hiddenInput);
    }
    
    hiddenInput.value = numberOfPanels;
  }
}

customElements.define('panel-calculator', PanelCalculator);