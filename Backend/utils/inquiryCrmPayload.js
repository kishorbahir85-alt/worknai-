export const buildBusinessInquiryCrmPayload = ({
  name,
  email,
  phone = '',
  company = '',
  serviceRequired = '',
  budget = '',
  message = '',
}) => ({
  name,
  email,
  phone,
  source: 'worknai.com',
  formType: 'business_inquiry',
  businessDetails: {
    companyName: company,
    serviceRequired,
    budget,
    message,
  },
});

export const buildProductInquiryCrmPayload = ({ inquiry, productTitle }) => {
  const inquiryType = inquiry.type || 'Product Inquiry';
  const productName = productTitle || 'Product';

  return buildBusinessInquiryCrmPayload({
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone || '',
    company: inquiry.company || '',
    serviceRequired: `${inquiryType} - ${productName}`,
    message: [
      `Product: ${productName}`,
      `Inquiry type: ${inquiryType}`,
      inquiry.message,
    ].filter(Boolean).join('\n'),
  });
};
