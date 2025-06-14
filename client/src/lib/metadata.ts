// Social and SEO metadata constants for NameDrop.cv platform

export const SOCIAL_ALT = "NameDrop.cv is the simplest way to share your story, work, and credentials — all in one link.";

export const META_DESCRIPTIONS = [
  "Create your own verified personal CV page with custom links and domains.",
  "Stand out online with a modern, professional bio link — built for your career."
];

export const SITE_METADATA = {
  title: "NameDrop.cv - Drop Your Name, Stand Out Your Way",
  description: "Create your professional CV website with custom branding, verification badges, and credibility. Your story deserves more than a plain link.",
  url: "https://namedrop.cv",
  siteName: "NameDrop.cv",
  image: "/og-image.png",
  twitterCard: "summary_large_image",
  keywords: "CV website builder, professional portfolio, personal branding, custom domain CV, verification badge, resume builder",
  author: "Wrelik Brands"
};

// Utility function to get a random meta description
export const getRandomMetaDescription = (): string => {
  return META_DESCRIPTIONS[Math.floor(Math.random() * META_DESCRIPTIONS.length)];
};

// Generate page-specific metadata
export const generatePageMetadata = (pageTitle?: string, pageDescription?: string) => {
  const title = pageTitle ? `${pageTitle} | ${SITE_METADATA.siteName}` : SITE_METADATA.title;
  const description = pageDescription || getRandomMetaDescription();
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: SITE_METADATA.url,
      siteName: SITE_METADATA.siteName,
      images: [
        {
          url: SITE_METADATA.image,
          width: 1200,
          height: 630,
          alt: SOCIAL_ALT,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: SITE_METADATA.twitterCard,
      title,
      description,
      images: [SITE_METADATA.image],
    },
  };
};

// Profile-specific metadata generation
export const generateProfileMetadata = (profileData: {
  name?: string;
  title?: string;
  bio?: string;
  slug?: string;
}) => {
  const title = profileData.name 
    ? `${profileData.name}${profileData.title ? ` - ${profileData.title}` : ''}`
    : 'Professional Profile';
  
  const description = profileData.bio 
    ? profileData.bio.substring(0, 155) + (profileData.bio.length > 155 ? '...' : '')
    : `Professional CV and portfolio for ${profileData.name || 'this professional'}`;

  const url = profileData.slug 
    ? `https://${profileData.slug}.namedrop.cv`
    : SITE_METADATA.url;

  return generatePageMetadata(title, description);
};