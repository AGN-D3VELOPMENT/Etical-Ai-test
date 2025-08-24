const supaClient = supabase.createClient('https://azzbmsyqynttnjpvmgdy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6emJtc3lxeW50dG5qcHZtZ2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTMyMDcsImV4cCI6MjA2OTk4OTIwN30.EiuNdGUV_d8JkDNplfOt_I8sPqO-Ujt-b87agGQQz1s');

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    first_name: document.getElementById('firstName').value,
    surname: document.getElementById('surname').value,
    email: document.getElementById('email').value,
    phone_number: document.getElementById('contact').value,
    occupation: document.getElementById('occupation').value,
    region: document.getElementById('region').value,
    address: document.getElementById('address').value
  };

  const termsCheck = document.getElementById('termsCheck').checked;
  if (!termsCheck) { alert('Please agree to terms and conditions.'); return; }

  const { data, error } = await supaClient.from('form_submissions').insert([formData]);
  if (error) { console.error(error); alert('Error submitting form'); return; }

  // Call backend to send email
  await fetch('http://localhost:3000/send-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: formData.email, name: formData.first_name })
  });

  alert('Form submitted successfully!');
  e.target.reset();
});
