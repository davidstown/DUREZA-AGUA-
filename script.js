document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('waterForm');
  const messageDiv = document.getElementById('message');
  const recordsList = document.getElementById('recordsList');
  const hotelSelect = document.getElementById('hotel');
  const passwordGroup = document.getElementById('passwordGroup');
  const passwordInput = document.getElementById('password');
  const verifyButton = document.getElementById('verifyPassword');
  const dataForm = document.getElementById('dataForm');
  const addReadingButton = document.getElementById('addReading');
  const readingsContainer = document.querySelector('.readings-container');
  
  // Object with hotel passwords
  const hotelPasswords = {
    'BJXCR': '1514',
    'CJSAT': '7623',
    'CUNPL': '5141',
    'CUUCY': '5045',
    'CUUDE': '4970',
    'CUUMI': '4615',
    'CUUMX': '5745',
    'CUUWY': '2031',
    'GDLAN': '7335',
    'GDLAR': '8313',
    'GDLVI': '8048',
    'HMORS': '8888',
    'JUAMI': '3589',
    'JUAZO': '4174',
    'MTYCP': '7390',
    'MTYGA': '5112',
    'MTYJW': '2509',
    'MTYVR': '2339',
    'MTYWI': '7763',
    'MTYZO': '6673',
    'PBCMC': '8060',
    'QROHT': '8452',
    'REXHA': '8726',
    'REXVF': '4509',
    'SLWCS': '5111',
    'SLWHA': '4769',
    'SLWZO': '6589',
    'TAMAL': '8520',
    'TLUMI': '5100',
    'TLUZO': '5357'
  };

  // Load saved records
  loadRecords();

  // Add initial reading entry
  addReadingEntry();

  addReadingButton.addEventListener('click', () => {
    if (document.querySelectorAll('.reading-entry').length < 7) {
      addReadingEntry();
    } else {
      showMessage('Máximo 7 fechas permitidas por semana', 'error');
    }
  });

  function addReadingEntry() {
    const entry = document.createElement('div');
    entry.className = 'reading-entry';
    entry.innerHTML = `
      <input type="date" class="reading-date" required>
      <div class="reading-hardness-wrapper">
        <input type="text" 
          class="reading-hardness" 
          pattern="[0-9]*"
          placeholder="Dureza" 
          title="Ingrese un valor entre 50 y 450 ppm"
          required>
      </div>
      <button type="button" class="remove-reading" title="Eliminar fecha">×</button>
    `;
    readingsContainer.appendChild(entry);

    const hardnessInput = entry.querySelector('.reading-hardness');
    
    hardnessInput.addEventListener('input', function() {
      // Remove any non-numeric characters
      this.value = this.value.replace(/[^\d]/g, '');
      
      let value = parseInt(this.value);
      if (value > 450) {
        this.value = '450';
      }
    });

    hardnessInput.addEventListener('blur', function() {
      let value = parseInt(this.value);
      if (value < 50) {
        this.value = '50';
      }
    });

    entry.querySelector('.remove-reading').addEventListener('click', () => {
      if (document.querySelectorAll('.reading-entry').length > 1) {
        entry.remove();
      } else {
        showMessage('Debe haber al menos una lectura', 'error');
      }
    });
  }

  hotelSelect.addEventListener('change', () => {
    const selectedHotel = hotelSelect.value;
    if (selectedHotel) {
      passwordGroup.style.display = 'block';
      dataForm.style.display = 'none';
      passwordInput.value = '';
    } else {
      passwordGroup.style.display = 'none';
      dataForm.style.display = 'none';
    }
  });

  verifyButton.addEventListener('click', () => {
    const selectedHotel = hotelSelect.value;
    const enteredPassword = passwordInput.value;

    if (hotelPasswords[selectedHotel] === enteredPassword) {
      showMessage('Contraseña correcta. Puede ingresar los datos.', 'success');
      dataForm.style.display = 'block';
    } else {
      showMessage('Contraseña incorrecta. Por favor, intente nuevamente.', 'error');
      dataForm.style.display = 'none';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const hotel = hotelSelect.value;
    const currentTime = new Date().toLocaleTimeString();
    const entries = document.querySelectorAll('.reading-entry');
    let hasError = false;

    entries.forEach(entry => {
      const date = entry.querySelector('.reading-date').value;
      const hardness = parseInt(entry.querySelector('.reading-hardness').value);

      if (hardness > 450) {
        showMessage('¡Error! La dureza del agua no puede ser mayor a 450 ppm', 'error');
        hasError = true;
        return;
      }

      if (hardness > 200) {
        showMessage('¡Advertencia! La dureza del agua está por encima del límite recomendado (200 ppm)', 'error');
      }

      if (hardness < 50) {
        showMessage('La dureza del agua debe ser al menos 50 ppm', 'error');
        hasError = true;
        return;
      }

      if (!hasError) {
        // Save the record
        saveRecord({hotel, date, time: currentTime, hardness});
      }
    });

    if (!hasError) {
      // Show success message
      showMessage('Registros guardados exitosamente', 'success');
      
      // Clear form and reset state
      form.reset();
      passwordGroup.style.display = 'none';
      dataForm.style.display = 'none';
      readingsContainer.innerHTML = '';
      addReadingEntry();
      
      // Update records list
      loadRecords();
    }
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 3000);
  }

  function saveRecord(record) {
    const records = JSON.parse(localStorage.getItem('waterRecords') || '[]');
    records.push(record);
    localStorage.setItem('waterRecords', JSON.stringify(records));
  }

  function loadRecords() {
    const records = JSON.parse(localStorage.getItem('waterRecords') || '[]');
    recordsList.innerHTML = '';
    
    records.forEach(record => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${record.hotel}</td>
        <td>${formatDate(record.date)}</td>
        <td>${record.time}</td>
        <td>${record.hardness}</td>
      `;
      recordsList.appendChild(row);
    });
  }

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
});