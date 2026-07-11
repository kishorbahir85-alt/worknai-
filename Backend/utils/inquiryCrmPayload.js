export const buildBusiness EnquiryCrmPayload = ({
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
  formType: 'business_ Enquiry',
  businessDetails: {
    companyName: company,
    serviceRequired,
    budget,
    message,
  },
});

export const buildProduct EnquiryCrmPayload = ({  Enquiry, productTitle }) => {
  const  EnquiryType =  Enquiry.type || 'Product  Enquiry';
  const productName = productTitle || 'Product';

  return buildBusiness EnquiryCrmPayload({
    name:  Enquiry.name,
    email:  Enquiry.email,
    phone:  Enquiry.phone || '',
    company:  Enquiry.company || '',
    serviceRequired: `${ EnquiryType} - ${productName}`,
    message: [
      `Product: ${productName}`,
      ` Enquiry type: ${ EnquiryType}`,
       Enquiry.message,
    ].filter(Boolean).join('\n'),
  });
};
