// Pushes a lead to the billpay.business CRM. A CRM outage must never fail
// the user's form submission, so all errors are swallowed and logged only.
export const sendLeadToCrm = async (lead) => {
  if (!process.env.CRM_API_KEY) return;
  try {
    const res = await fetch('https://billpay.business/api/leads/capture', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CRM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source: 'worknai.com', ...lead }),
    });
    if (!res.ok) console.error(`CRM lead capture failed: ${res.status} ${res.statusText}`);
  } catch (err) {
    console.error('CRM lead capture failed:', err.message);
  }
};
