import axios from 'axios';

// Pushes a lead to the billpay.business CRM. A CRM outage must never fail
// the user's form submission, so all errors are swallowed and logged only.
export const syncLeadToCrm = async (payload) => {
  if (!process.env.CRM_API_URL || !process.env.CRM_API_KEY) return;
  try {
    await axios.post(process.env.CRM_API_URL, payload, {
      headers: { 'x-api-key': process.env.CRM_API_KEY },
      timeout: 5000,
    });
  } catch (err) {
    const detail = err.response
      ? `${err.response.status} ${JSON.stringify(err.response.data)}`
      : err.message;
    console.error('[CRM_SYNC_FAILED]', detail);
  }
};
