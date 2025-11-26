import apiClient from './client';

/**
 * Submit contact form details.
 * Endpoint: POST /api/contact/save
 * @param {Object} payload
 * @returns {Promise<{message: string, contact: object}>}
 */
export async function submitContactForm({
	fullName,
	emailAddress,
	phoneNumber,
	serviceInterest,
	subject,
	message,
}) {
	if (!fullName || !emailAddress || !phoneNumber) {
		throw new Error('fullName, emailAddress, and phoneNumber are required');
	}

	const { data } = await apiClient.post('/api/contact/save', {
		fullName,
		emailAddress,
		phoneNumber,
		serviceInterest: serviceInterest || null,
		subject: subject || null,
		message: message || null,
	});

	return {
		message: data?.message || 'Contact details submitted successfully',
		contact: data?.contact || null,
	};
}

export default submitContactForm;

