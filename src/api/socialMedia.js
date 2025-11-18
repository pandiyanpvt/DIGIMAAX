import apiClient from './client';

const normalizeSocialLinks = (
  data = {},
  fallbackMessage = 'Social media links retrieved successfully'
) => {
  const links = Array.isArray(data.socialMediaLinks) ? data.socialMediaLinks : [];
  return {
    message: data?.message || fallbackMessage,
    count: data?.count ?? links.length,
    links,
  };
};

export async function getSocialMediaLinks() {
  const { data } = await apiClient.get('/api/social-media/getAll');
  return normalizeSocialLinks(data);
}

export default getSocialMediaLinks;


